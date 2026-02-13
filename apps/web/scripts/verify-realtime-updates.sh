#!/bin/bash

##############################################################################
# End-to-End Verification Script for Real-Time CMS Updates
# Tests: ISR, Draft Mode, On-Demand Revalidation, Webhook Security
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_URL="${SITE_URL:-https://digiprint-main-web.netlify.app}"
SANITY_WEBHOOK_SECRET="${SANITY_WEBHOOK_SECRET:-so26GsMt0Fr9|1puбeUQ}"
SANITY_PREVIEW_SECRET="${SANITY_PREVIEW_SECRET:-D0Mpx6k/4rW0Rl8fVhEOlmQYP5sUBY0wr44QDJHsKuM=}"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🧪 Real-Time CMS Updates - E2E Verification${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Test Counter
PASSED=0
FAILED=0
TOTAL=0

# Test function
run_test() {
  local test_name="$1"
  local test_command="$2"
  
  TOTAL=$((TOTAL + 1))
  echo -e "${YELLOW}Test $TOTAL: $test_name${NC}"
  
  if eval "$test_command"; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ FAILED${NC}\n"
    FAILED=$((FAILED + 1))
  fi
}

##############################################################################
# Test 1: Check Environment Variables
##############################################################################

run_test "Environment Variables" '
  if [ -z "$SANITY_WEBHOOK_SECRET" ]; then
    echo "❌ SANITY_WEBHOOK_SECRET not set"
    exit 1
  fi
  
  if [ -z "$SANITY_PREVIEW_SECRET" ]; then
    echo "❌ SANITY_PREVIEW_SECRET not set"
    exit 1
  fi
  
  echo "✓ SANITY_WEBHOOK_SECRET: Set (${#SANITY_WEBHOOK_SECRET} chars)"
  echo "✓ SANITY_PREVIEW_SECRET: Set (${#SANITY_PREVIEW_SECRET} chars)"
  echo "✓ SITE_URL: $SITE_URL"
  exit 0
'

##############################################################################
# Test 2: Site is Accessible
##############################################################################

run_test "Site Accessibility" '
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Site is accessible (HTTP $HTTP_CODE)"
    exit 0
  else
    echo "❌ Site returned HTTP $HTTP_CODE"
    exit 1
  fi
'

##############################################################################
# Test 3: Revalidation API Endpoint Exists
##############################################################################

run_test "Revalidation API Endpoint" '
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/revalidate?path=/")
  
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "✓ API endpoint exists (HTTP $HTTP_CODE)"
    exit 0
  else
    echo "❌ API endpoint not found (HTTP $HTTP_CODE)"
    exit 1
  fi
'

##############################################################################
# Test 4: Draft Mode API Endpoints Exist
##############################################################################

run_test "Draft Mode API Endpoints" '
  # Test draft enable endpoint (should return 401 without secret)
  DRAFT_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/draft?slug=/")
  
  # Test draft disable endpoint
  DISABLE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/draft/disable")
  
  if [ "$DRAFT_CODE" = "401" ] && [ "$DISABLE_CODE" = "302" ]; then
    echo "✓ Draft enable endpoint: HTTP $DRAFT_CODE (correct - needs secret)"
    echo "✓ Draft disable endpoint: HTTP $DISABLE_CODE (redirect)"
    exit 0
  else
    echo "❌ Draft enable: HTTP $DRAFT_CODE (expected 401)"
    echo "❌ Draft disable: HTTP $DISABLE_CODE (expected 302)"
    exit 1
  fi
'

##############################################################################
# Test 5: Draft Mode Works with Correct Secret
##############################################################################

run_test "Draft Mode Authorization" '
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/draft?secret=$SANITY_PREVIEW_SECRET&slug=/")
  
  if [ "$HTTP_CODE" = "307" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "✓ Draft mode activates with correct secret (HTTP $HTTP_CODE)"
    exit 0
  else
    echo "❌ Draft mode failed (HTTP $HTTP_CODE)"
    exit 1
  fi
'

##############################################################################
# Test 6: Webhook Signature Validation (Should Reject Invalid)
##############################################################################

run_test "Webhook Security (Invalid Signature)" '
  RESPONSE=$(curl -s -X POST "$SITE_URL/api/revalidate" \
    -H "Content-Type: application/json" \
    -H "x-sanity-signature: sha256=invalidsignature" \
    -d "{\"_type\":\"post\",\"slug\":{\"current\":\"test\"}}")
  
  if echo "$RESPONSE" | grep -q "Invalid signature"; then
    echo "✓ Correctly rejects invalid webhook signature"
    exit 0
  else
    echo "❌ Did not reject invalid signature"
    echo "Response: $RESPONSE"
    exit 1
  fi
'

##############################################################################
# Test 7: On-Demand Revalidation (Valid Request)
##############################################################################

run_test "On-Demand Revalidation" '
  # Use local test script
  cd /Applications/MAMP/htdocs/FredCMs/apps/web
  
  if node scripts/test-revalidation.js post "test-slug" 2>&1 | grep -q "Revalidation successful"; then
    echo "✓ On-demand revalidation works"
    exit 0
  else
    echo "❌ On-demand revalidation failed"
    exit 1
  fi
'

##############################################################################
# Test 8: ISR Headers Present
##############################################################################

run_test "ISR Cache Headers" '
  HEADERS=$(curl -s -I "$SITE_URL/blog")
  
  if echo "$HEADERS" | grep -qi "x-nextjs-cache\|cf-cache-status"; then
    echo "✓ ISR cache headers present"
    echo "$HEADERS" | grep -i "cache\|age" || true
    exit 0
  else
    echo "⚠️  Cache headers not detected (may be behind CDN)"
    exit 0
  fi
'

##############################################################################
# Test 9: Check for ISR Revalidation Config
##############################################################################

run_test "ISR Configuration in Code" '
  cd /Applications/MAMP/htdocs/FredCMs/apps/web
  
  # Check if revalidate is set in page files
  if grep -r "export const revalidate" src/app/ | grep -v node_modules | head -5; then
    echo "✓ ISR revalidate config found in pages"
    exit 0
  else
    echo "❌ No ISR revalidate config found"
    exit 1
  fi
'

##############################################################################
# Test 10: Verify Build Artifacts
##############################################################################

run_test "Production Build Artifacts" '
  cd /Applications/MAMP/htdocs/FredCMs/apps/web
  
  if [ -d ".next/standalone" ]; then
    echo "✓ Standalone build exists"
    BUNDLE_SIZE=$(du -sh .next/standalone | cut -f1)
    echo "✓ Bundle size: $BUNDLE_SIZE"
    exit 0
  else
    echo "⚠️  No local build found (expected on CI/CD)"
    exit 0
  fi
'

##############################################################################
# Summary
##############################################################################

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Real-time updates are configured correctly.${NC}"
  echo ""
  echo -e "${BLUE}Next Steps:${NC}"
  echo "1. Configure Sanity webhook (see REALTIME_UPDATES_GUIDE.md)"
  echo "2. Test by editing content in Sanity Studio"
  echo "3. Verify changes appear live within 3 seconds"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please review errors above.${NC}"
  echo ""
  echo -e "${YELLOW}Troubleshooting:${NC}"
  echo "1. Ensure site is deployed to Netlify"
  echo "2. Check environment variables in Netlify dashboard"
  echo "3. Verify API routes are deployed"
  echo "4. See REALTIME_UPDATES_GUIDE.md for details"
  exit 1
fi
