#!/bin/bash

###############################################################################
# Test Deployment Protection Endpoints
# Tests the /api/deploy endpoints with and without secrets
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🧪 Testing Deployment Protection${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Configuration
WEB_URL="${1:-https://digiprintplus.vercel.app}"
STUDIO_URL="${2:-https://studio-1fzynqyra-emanuels-projects-1dd59b95.vercel.app}"
WEB_SECRET="59382ff42c21e5891f75f397bcd02e6f"
STUDIO_SECRET="bc5f8e4f27c99ab2d476d6a7a5d015f9"

echo -e "${YELLOW}📡 Testing URLs:${NC}"
echo -e "  Web:    $WEB_URL"
echo -e "  Studio: $STUDIO_URL"
echo ""

###############################################################################
# Test 1: Web App - No Secret (Should Fail)
###############################################################################
echo -e "${BLUE}Test 1: Web App - No Secret (expecting 403)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEB_URL/api/deploy")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "403" ]; then
    echo -e "${GREEN}✅ PASS - Rejected unauthorized request${NC}"
else
    echo -e "${RED}❌ FAIL - Expected 403, got $HTTP_CODE${NC}"
    echo -e "Response: $BODY"
fi
echo ""

###############################################################################
# Test 2: Web App - Wrong Secret (Should Fail)
###############################################################################
echo -e "${BLUE}Test 2: Web App - Wrong Secret (expecting 403)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEB_URL/api/deploy?secret=wrong-secret")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "403" ]; then
    echo -e "${GREEN}✅ PASS - Rejected invalid secret${NC}"
else
    echo -e "${RED}❌ FAIL - Expected 403, got $HTTP_CODE${NC}"
    echo -e "Response: $BODY"
fi
echo ""

###############################################################################
# Test 3: Web App - Correct Secret (Should Success)
###############################################################################
echo -e "${BLUE}Test 3: Web App - Correct Secret (expecting 200)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEB_URL/api/deploy?secret=$WEB_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"environment":"production","branch":"main"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS - Authorized deployment${NC}"
    echo -e "${YELLOW}Response:${NC} $BODY"
else
    echo -e "${RED}❌ FAIL - Expected 200, got $HTTP_CODE${NC}"
    echo -e "Response: $BODY"
fi
echo ""

###############################################################################
# Test 4: Web App - GET Method (Should Fail)
###############################################################################
echo -e "${BLUE}Test 4: Web App - GET Method (expecting 405)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$WEB_URL/api/deploy?secret=$WEB_SECRET")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "405" ]; then
    echo -e "${GREEN}✅ PASS - Rejected GET method${NC}"
else
    echo -e "${RED}❌ FAIL - Expected 405, got $HTTP_CODE${NC}"
    echo -e "Response: $BODY"
fi
echo ""

###############################################################################
# Test 5: Studio - No Secret (Should Fail)
###############################################################################
echo -e "${BLUE}Test 5: Studio - No Secret (expecting 403)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$STUDIO_URL/api/deploy")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "403" ]; then
    echo -e "${GREEN}✅ PASS - Rejected unauthorized request${NC}"
else
    echo -e "${RED}❌ FAIL - Expected 403, got $HTTP_CODE${NC}"
    echo -e "Response: $BODY"
fi
echo ""

###############################################################################
# Test 6: Studio - Correct Secret (Should Success)
###############################################################################
echo -e "${BLUE}Test 6: Studio - Correct Secret (expecting 200)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$STUDIO_URL/api/deploy?secret=$STUDIO_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"environment":"production"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS - Authorized studio deployment${NC}"
    echo -e "${YELLOW}Response:${NC} $BODY"
else
    echo -e "${RED}❌ FAIL - Expected 200, got $HTTP_CODE${NC}"
    echo -e "Response: $BODY"
fi
echo ""

###############################################################################
# Test 7: Web App - Secret in Header (Should Success)
###############################################################################
echo -e "${BLUE}Test 7: Web App - Secret in Header (expecting 200)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEB_URL/api/deploy" \
  -H "Content-Type: application/json" \
  -H "x-deploy-secret: $WEB_SECRET" \
  -d '{"environment":"production","branch":"main"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS - Authorized with header secret${NC}"
    echo -e "${YELLOW}Response:${NC} $BODY"
else
    echo -e "${RED}❌ FAIL - Expected 200, got $HTTP_CODE${NC}"
    echo -e "Response: $BODY"
fi
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Testing Complete${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}💡 Usage Examples:${NC}"
echo -e "  Web Deploy:    ${BLUE}curl -X POST $WEB_URL/api/deploy?secret=$WEB_SECRET${NC}"
echo -e "  Studio Deploy: ${BLUE}curl -X POST $STUDIO_URL/api/deploy?secret=$STUDIO_SECRET${NC}"
echo ""
