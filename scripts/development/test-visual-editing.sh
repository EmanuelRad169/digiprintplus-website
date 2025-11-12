#!/bin/bash

echo "🔍 Testing Sanity Visual Editing End-to-End Preview Flow"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local port=$1
    local service_name=$2
    
    if curl -s "http://localhost:$port" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name is running on port $port${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is NOT running on port $port${NC}"
        return 1
    fi
}

echo "1. Checking Services..."
echo "----------------------"
studio_running=false
web_running=false

if check_service 3335 "Sanity Studio"; then
    studio_running=true
fi

if check_service 3001 "Next.js Web App"; then
    web_running=true
fi

if [ "$studio_running" = false ] || [ "$web_running" = false ]; then
    echo -e "${YELLOW}⚠️  Some services are not running. Please start them first:${NC}"
    echo "   Studio: cd apps/studio && npm run dev"
    echo "   Web:    cd apps/web && npm run dev"
    echo
fi

echo
echo "2. Testing Draft Mode API..."
echo "----------------------------"

# Test regular draft mode
echo "Testing regular draft mode activation..."
response=$(curl -s -w "%{http_code}" "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024")
http_code="${response: -3}"
if [ "$http_code" = "307" ]; then
    echo -e "${GREEN}✅ Regular draft mode API working (HTTP $http_code)${NC}"
else
    echo -e "${RED}❌ Regular draft mode API failed (HTTP $http_code)${NC}"
fi

# Test visual editing mode
echo "Testing visual editing mode activation..."
response=$(curl -s -w "%{http_code}" "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024&sanity-preview-perspective=drafts")
http_code="${response: -3}"
body="${response%???}"
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Visual editing API working (HTTP $http_code)${NC}"
    echo "   Response: $body"
else
    echo -e "${RED}❌ Visual editing API failed (HTTP $http_code)${NC}"
    echo "   Response: $body"
fi

# Test with wrong secret
echo "Testing with wrong secret..."
response=$(curl -s -w "%{http_code}" "http://localhost:3001/api/draft-mode/enable?secret=wrong-secret")
http_code="${response: -3}"
if [ "$http_code" = "401" ]; then
    echo -e "${GREEN}✅ Security working - rejected wrong secret (HTTP $http_code)${NC}"
else
    echo -e "${YELLOW}⚠️  Security concern - wrong secret got HTTP $http_code${NC}"
fi

echo
echo "3. Checking Environment Variables..."
echo "-----------------------------------"

# Check web app env
cd /Applications/MAMP/htdocs/FredCMs/apps/web
if grep -q "SANITY_REVALIDATE_SECRET=preview-secret-key-2024" .env.local; then
    echo -e "${GREEN}✅ Web app secret configured correctly${NC}"
else
    echo -e "${RED}❌ Web app secret missing or incorrect${NC}"
fi

# Check studio env
cd /Applications/MAMP/htdocs/FredCMs/apps/studio
if grep -q "SANITY_STUDIO_PREVIEW_SECRET=preview-secret-key-2024" .env.local; then
    echo -e "${GREEN}✅ Studio secret configured correctly${NC}"
else
    echo -e "${RED}❌ Studio secret missing or incorrect${NC}"
fi

if grep -q "SANITY_STUDIO_PREVIEW_URL=http://localhost:3001" .env.local; then
    echo -e "${GREEN}✅ Studio preview URL configured correctly${NC}"
else
    echo -e "${RED}❌ Studio preview URL missing or incorrect${NC}"
fi

echo
echo "4. Testing Visual Editing Flow..."
echo "--------------------------------"

if [ "$studio_running" = true ] && [ "$web_running" = true ]; then
    echo -e "${GREEN}✅ Both services are running${NC}"
    echo
    echo "🎯 Manual Testing Steps:"
    echo "1. Open Sanity Studio: http://localhost:3335"
    echo "2. Navigate to any document (product, page, etc.)"
    echo "3. Click the 'Preview' tab or 'Open Preview' button"
    echo "4. The preview should open in a new tab/iframe with overlays"
    echo "5. Make changes in the Studio - they should appear live in the preview"
    echo
    echo "🔍 What to look for:"
    echo "- Blue overlay outlines around editable content"
    echo "- Real-time updates when you edit in Studio"
    echo "- No console errors related to visual editing"
    echo "- Draft mode cookie (__prerender_bypass) is set"
else
    echo -e "${YELLOW}⚠️  Cannot test visual editing - services not running${NC}"
fi

echo
echo "5. Debug Information..."
echo "----------------------"
echo "If visual editing isn't working, check browser console for:"
echo "- 'Visual editing setup conditions:' log messages"
echo "- Any CORS errors"
echo "- WebSocket connection errors"
echo "- Authentication failures"
echo
echo "Browser Network tab should show:"
echo "- Successful call to /api/draft-mode/enable"
echo "- Cookie __prerender_bypass being set"
echo "- CORS headers in responses"

echo
echo "======================================================="
echo "🏁 End-to-End Test Complete"
echo "======================================================="
