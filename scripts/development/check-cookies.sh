#!/bin/bash

echo "🍪 Checking Draft Mode Cookie Status"
echo "===================================="

# Function to check cookies via curl
check_cookies() {
    local url=$1
    echo "Testing URL: $url"
    
    # Make request and capture cookies
    response=$(curl -s -c /tmp/cookies.txt -b /tmp/cookies.txt -w "%{http_code}" "$url")
    http_code="${response: -3}"
    
    echo "HTTP Status: $http_code"
    
    if [ -f /tmp/cookies.txt ]; then
        echo "Cookies received:"
        cat /tmp/cookies.txt | grep -v "^#" | while read line; do
            if [ ! -z "$line" ]; then
                echo "  $line"
            fi
        done
        
        # Check specifically for draft mode cookie
        if grep -q "__prerender_bypass" /tmp/cookies.txt; then
            echo "✅ Draft mode cookie (__prerender_bypass) is SET"
        else
            echo "❌ Draft mode cookie (__prerender_bypass) is NOT set"
        fi
        
        rm /tmp/cookies.txt
    else
        echo "❌ No cookies file created"
    fi
    echo
}

echo "1. Testing draft mode activation..."
check_cookies "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024"

echo "2. Testing visual editing mode..."
check_cookies "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024&sanity-preview-perspective=drafts"

echo "3. Testing homepage with draft mode..."
# First enable draft mode, then check homepage
curl -s -c /tmp/cookies.txt "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024" > /dev/null
response=$(curl -s -b /tmp/cookies.txt -w "%{http_code}" "http://localhost:3001/")
http_code="${response: -3}"
echo "Homepage with draft cookie - HTTP: $http_code"

if [ -f /tmp/cookies.txt ]; then
    if grep -q "__prerender_bypass" /tmp/cookies.txt; then
        echo "✅ Draft mode cookie persists on homepage"
    else
        echo "❌ Draft mode cookie lost on homepage"
    fi
    rm /tmp/cookies.txt
fi

echo
echo "🔍 Manual Browser Check:"
echo "1. Open browser dev tools (F12)"
echo "2. Go to Application/Storage tab"
echo "3. Check Cookies for localhost:3001"
echo "4. Look for '__prerender_bypass' cookie"
echo "5. Value should be a long hash like: 5d6702f9ee2e1d04add6ed59d44d8074"
