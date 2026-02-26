#!/bin/bash
# Netlify Smoke Test Script
# Quick health check for both deployed Netlify sites

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Site URLs
WEB_URL="${NEXT_PUBLIC_SITE_URL:-https://digiprint-main-web.netlify.app}"
STUDIO_URL="${NEXT_PUBLIC_SANITY_STUDIO_URL:-https://digiprint-admin-cms.netlify.app}"

echo ""
echo "================================================================"
echo "🧪 Netlify Smoke Test"
echo "================================================================"
echo "Web:    $WEB_URL"
echo "Studio: $STUDIO_URL"
echo "================================================================"
echo ""

# Function to check URL
check_url() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    echo -n "Checking $name... "
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} ($status_code)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (got $status_code, expected $expected_status)"
        return 1
    fi
}

# Function to check for string in response
check_content() {
    local name="$1"
    local url="$2"
    local search_string="$3"
    
    echo -n "Checking $name content... "
    
    content=$(curl -s "$url" --max-time 10)
    
    if echo "$content" | grep -q "$search_string"; then
        echo -e "${GREEN}✅ PASS${NC} (found '$search_string')"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (missing '$search_string')"
        return 1
    fi
}

# Track failures
FAILURES=0

echo "📄 Static Pages:"
echo "────────────────────────────────────────────────────────────────"

check_url "Homepage" "$WEB_URL/" || ((FAILURES++))
check_url "About" "$WEB_URL/about" || ((FAILURES++))
check_url "Contact" "$WEB_URL/contact" || ((FAILURES++))
check_url "Products" "$WEB_URL/products" || ((FAILURES++))
check_url "Blog" "$WEB_URL/blog" || ((FAILURES++))
check_url "Templates" "$WEB_URL/templates" || ((FAILURES++))
check_url "Quote" "$WEB_URL/quote" || ((FAILURES++))

echo ""
echo "🔍 SEO Files:"
echo "────────────────────────────────────────────────────────────────"

check_url "robots.txt" "$WEB_URL/robots.txt" || ((FAILURES++))
check_url "sitemap.xml" "$WEB_URL/sitemap.xml" || ((FAILURES++))

# Check if URLs in robots.txt use correct domain
echo -n "Verifying robots.txt domain... "
robots_content=$(curl -s "$WEB_URL/robots.txt" --max-time 10)
if echo "$robots_content" | grep -q "$WEB_URL"; then
    echo -e "${GREEN}✅ PASS${NC} (uses $WEB_URL)"
else
    echo -e "${YELLOW}⚠️  WARN${NC} (may not use NEXT_PUBLIC_SITE_URL)"
fi

echo ""
echo "⚡ Netlify Functions:"
echo "────────────────────────────────────────────────────────────────"

check_url "Sanity Webhook" "$WEB_URL/.netlify/functions/sanity-webhook" || ((FAILURES++))

# Check if webhook is configured
echo -n "Verifying webhook configuration... "
webhook_response=$(curl -s "$WEB_URL/.netlify/functions/sanity-webhook" --max-time 10)
if echo "$webhook_response" | grep -q '"configured":true'; then
    echo -e "${GREEN}✅ PASS${NC} (webhook configured)"
else
    echo -e "${YELLOW}⚠️  WARN${NC} (webhook may not be configured)"
fi

echo ""
echo "🎨 Sanity Studio:"
echo "────────────────────────────────────────────────────────────────"

check_url "Studio Homepage" "$STUDIO_URL/" || ((FAILURES++))
check_content "Studio HTML" "$STUDIO_URL/" "sanity" || ((FAILURES++))

echo ""
echo "🔒 Security Headers (Web):"
echo "────────────────────────────────────────────────────────────────"

# Check security headers
headers=$(curl -s -I "$WEB_URL" --max-time 10)

echo -n "X-Frame-Options... "
if echo "$headers" | grep -qi "x-frame-options"; then
    echo -e "${GREEN}✅ SET${NC}"
else
    echo -e "${RED}❌ MISSING${NC}"
    ((FAILURES++))
fi

echo -n "X-Content-Type-Options... "
if echo "$headers" | grep -qi "x-content-type-options"; then
    echo -e "${GREEN}✅ SET${NC}"
else
    echo -e "${RED}❌ MISSING${NC}"
    ((FAILURES++))
fi

echo -n "Strict-Transport-Security... "
if echo "$headers" | grep -qi "strict-transport-security"; then
    echo -e "${GREEN}✅ SET${NC}"
else
    echo -e "${YELLOW}⚠️  MISSING${NC}"
fi

echo ""
echo "================================================================"
echo "📊 SMOKE TEST SUMMARY"
echo "================================================================"

if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ $FAILURES CHECK(S) FAILED${NC}"
    echo ""
    echo "Review the output above for details."
    echo ""
    exit 1
fi
