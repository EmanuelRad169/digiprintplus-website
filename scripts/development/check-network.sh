#!/bin/bash

echo "🌐 Testing API Network Calls"
echo "============================"

# Function to make detailed API calls
test_api_call() {
    local url=$1
    local description=$2
    
    echo "Testing: $description"
    echo "URL: $url"
    echo "----------------------------------------"
    
    # Make request with verbose output
    response=$(curl -s -v "$url" 2>&1)
    
    # Extract HTTP status
    http_status=$(echo "$response" | grep "< HTTP" | tail -1)
    echo "Status: $http_status"
    
    # Extract important headers
    echo "Important Headers:"
    echo "$response" | grep -i "< set-cookie" | head -5
    echo "$response" | grep -i "< access-control" | head -5
    echo "$response" | grep -i "< content-type" | head -1
    echo "$response" | grep -i "< location" | head -1
    
    # Show response body if it's JSON
    if echo "$response" | grep -q "application/json"; then
        echo "Response Body:"
        echo "$response" | tail -1 | jq . 2>/dev/null || echo "$response" | tail -1
    fi
    
    echo
    echo "========================================"
    echo
}

echo "1. Regular Draft Mode Activation"
test_api_call "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024" "Regular Draft Mode"

echo "2. Visual Editing Mode Activation"
test_api_call "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024&sanity-preview-perspective=drafts" "Visual Editing Mode"

echo "3. Draft Mode with Slug Parameter"
test_api_call "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024&slug=products/business-cards" "Draft Mode with Slug"

echo "4. Visual Editing with Overlay Parameter"
test_api_call "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024&sanity-overlay=true" "Visual Editing with Overlay"

echo "5. Testing CORS Preflight (OPTIONS)"
echo "Testing CORS preflight request..."
curl -s -v -X OPTIONS \
    -H "Origin: http://localhost:3335" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type" \
    "http://localhost:3001/api/draft-mode/enable" 2>&1 | grep -E "(< HTTP|< access-control)"

echo
echo "🔍 Manual Browser Network Check:"
echo "1. Open browser dev tools (F12)"
echo "2. Go to Network tab"
echo "3. Clear existing requests"
echo "4. Navigate from Studio to preview"
echo "5. Look for request to '/api/draft-mode/enable'"
echo "6. Check request headers, response headers, and status"
echo "7. Verify CORS headers are present"
