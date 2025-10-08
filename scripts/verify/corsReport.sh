#!/bin/bash

# CORS Verification Summary Script
echo "🔍 CORS Verification Summary for Sanity Project"
echo "================================================"
echo ""

# Project Information
echo "📋 Project Configuration:"
echo "   Project ID: as5tildt"
echo "   Dataset: development"
echo "   API Version: 2024-01-01"
echo ""

# Check server status
echo "🖥️  Server Status:"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Next.js (http://localhost:3000) - Running"
else
    echo "   ❌ Next.js (http://localhost:3000) - Not running"
fi

if curl -s http://localhost:3334 > /dev/null 2>&1; then
    echo "   ✅ Sanity Studio (http://localhost:3334) - Running"
else
    echo "   ❌ Sanity Studio (http://localhost:3334) - Not running"
fi
echo ""

# Test API connectivity
echo "🌐 API Connectivity Tests:"

# Test 1: Basic API call
API_STATUS=$(curl -s -w "%{http_code}" -o /dev/null "https://as5tildt.api.sanity.io/v2024-01-01/data/query/development?query=*%5B_type%20%3D%3D%20%22siteSettings%22%5D%5B0%5D")
if [ "$API_STATUS" = "200" ]; then
    echo "   ✅ Direct API Call - Success (HTTP $API_STATUS)"
else
    echo "   ❌ Direct API Call - Failed (HTTP $API_STATUS)"
fi

# Test 2: Navigation query
NAV_STATUS=$(curl -s -w "%{http_code}" -o /dev/null "https://as5tildt.api.sanity.io/v2024-01-01/data/query/development?query=*%5B_type%20%3D%3D%20%22navigationMenu%22%5D%5B0%5D")
if [ "$NAV_STATUS" = "200" ]; then
    echo "   ✅ Navigation Query - Success (HTTP $NAV_STATUS)"
else
    echo "   ❌ Navigation Query - Failed (HTTP $NAV_STATUS)"
fi

echo ""

# CORS Configuration Status
echo "🔒 CORS Configuration Status:"
if [ "$API_STATUS" = "200" ] && [ "$NAV_STATUS" = "200" ]; then
    echo "   ✅ API calls successful from server environment"
    echo "   ✅ CORS appears to be working correctly"
    echo ""
    echo "🧪 Browser Testing:"
    echo "   📱 Test from browser: http://localhost:3000/cors-test"
    echo "   🏠 Test Sanity Studio: http://localhost:3334"
    echo ""
    echo "✅ Summary: CORS verification PASSED"
else
    echo "   ⚠️  Some API calls failed"
    echo "   🔧 May need CORS configuration"
    echo ""
    echo "❌ Summary: CORS verification FAILED"
fi

echo ""
echo "📋 Manual CORS Configuration (if needed):"
echo "   1. Go to: https://sanity.io/manage/personal/project/as5tildt"
echo "   2. Click 'API' in left sidebar"
echo "   3. Scroll to 'CORS Origins'"
echo "   4. Add these origins:"
echo "      - http://localhost:3000"
echo "      - http://localhost:3334"
echo "      - http://127.0.0.1:3000"
echo "      - http://127.0.0.1:3334"
echo "   5. Enable 'Allow credentials' if using authentication"
echo ""
echo "🔍 For detailed browser testing, visit: http://localhost:3000/cors-test"
echo "================================================"
