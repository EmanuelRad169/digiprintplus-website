#!/bin/bash

echo "🎯 Testing Full Visual Editing Preview Flow"
echo "==========================================="

# Test 1: Verify services are running
echo "1. Service Status Check:"
echo "------------------------"
if curl -s http://localhost:3335 > /dev/null 2>&1; then
    echo "✅ Sanity Studio running on port 3335"
else
    echo "❌ Sanity Studio NOT running on port 3335"
    exit 1
fi

if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Next.js web app running on port 3001"
else
    echo "❌ Next.js web app NOT running on port 3001"
    exit 1
fi

# Test 2: Test the preview URL that Studio would call
echo
echo "2. Preview URL Test:"
echo "-------------------"
echo "Testing the exact URL Studio would use for preview..."

# This simulates what happens when you click "Open Preview" in Studio
preview_url="http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024&sanity-preview-perspective=drafts"
response=$(curl -s -w "%{http_code}" "$preview_url")
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" = "200" ]; then
    echo "✅ Preview URL responds correctly (HTTP 200)"
    echo "Response: $body"
else
    echo "❌ Preview URL failed (HTTP $http_code)"
    echo "Response: $body"
fi

# Test 3: Test with a specific document slug
echo
echo "3. Document-Specific Preview Test:"
echo "---------------------------------"
doc_url="http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024&slug=products/business-cards&sanity-preview-perspective=drafts"
response=$(curl -s -w "%{http_code}" "$doc_url")
http_code="${response: -3}"

if [ "$http_code" = "200" ]; then
    echo "✅ Document preview URL works (HTTP 200)"
else
    echo "❌ Document preview URL failed (HTTP $http_code)"
fi

# Test 4: Check for CORS headers that Studio needs
echo
echo "4. CORS Headers Test:"
echo "--------------------"
echo "Checking CORS headers for Studio communication..."

cors_response=$(curl -s -I "$preview_url")
if echo "$cors_response" | grep -qi "access-control-allow-origin"; then
    echo "✅ CORS headers present"
    echo "$cors_response" | grep -i "access-control"
else
    echo "❌ CORS headers missing"
fi

# Test 5: Test actual product page with draft mode
echo
echo "5. Product Page Draft Mode Test:"
echo "-------------------------------"
# First enable draft mode
curl -s -c /tmp/cookies.txt "$preview_url" > /dev/null

# Then test accessing a product page with the draft cookie
product_response=$(curl -s -b /tmp/cookies.txt -w "%{http_code}" "http://localhost:3001/products/business-cards")
product_http_code="${product_response: -3}"

if [ "$product_http_code" = "200" ]; then
    echo "✅ Product page accessible in draft mode (HTTP 200)"
else
    echo "❌ Product page failed in draft mode (HTTP $product_http_code)"
fi

# Clean up
rm -f /tmp/cookies.txt

echo
echo "🎯 Manual Testing Instructions:"
echo "==============================="
echo "1. Open Sanity Studio: http://localhost:3335"
echo "2. Navigate to any document (e.g., a product)"
echo "3. Click the 'Preview' tab in the top navigation"
echo "4. The preview should open with visual editing overlays"
echo "5. Try editing the document title - it should update live in the preview"
echo
echo "🔍 Expected Behavior:"
echo "- Preview opens in an iframe or new tab"
echo "- Blue overlay outlines appear around editable content"
echo "- Changes in Studio appear immediately in preview"
echo "- No 'Unable to connect to visual editing' errors in console"
echo "- WebSocket errors are suppressed but visual editing errors show"
echo
echo "🚨 If You See Errors:"
echo "- 'WebSocket is closed before connection' - This is expected and handled"
echo "- 'Unable to connect to visual editing' - Check browser console for details"
echo "- CORS errors - Verify localhost:3001 is in Sanity project CORS settings"
echo "- 401 errors - Check that preview secrets match between Studio and web app"
echo "==========================================="
