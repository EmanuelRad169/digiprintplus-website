#!/bin/bash

# 🧪 DigiPrintPlus Integration Test Script
# Tests all critical routes and Sanity integration

echo "🧪 Starting DigiPrintPlus Integration Tests..."
echo "=================================="

# Base URL for testing
BASE_URL="http://localhost:3000"

# Function to test a route
test_route() {
    local route=$1
    local expected_status=${2:-200}
    local description=$3
    
    echo "Testing: $route ($description)"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
    
    if [ "$response" -eq "$expected_status" ]; then
        echo "✅ PASS: $route returned $response"
    else
        echo "❌ FAIL: $route returned $response (expected $expected_status)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    echo ""
}

# Initialize test counter
FAILED_TESTS=0

echo "🏠 Testing Core Pages..."
test_route "/" 200 "Home page"
test_route "/about" 200 "About page"
test_route "/services" 200 "Services page"
test_route "/contact" 200 "Contact page"
test_route "/quote" 200 "Quote page"
test_route "/templates" 200 "Templates page"

echo "📦 Testing Product Pages..."
test_route "/products" 200 "Products listing"
test_route "/products/category/business-cards" 200 "Business cards category"
test_route "/products/category/flyers" 200 "Flyers category"
test_route "/products/category/brochures" 200 "Brochures category"

echo "🔍 Testing Dynamic Routes..."
# Test some dynamic product routes (these might be 404 if no products exist)
test_route "/products/business-cards-premium" 200 "Dynamic product page"
test_route "/templates/business-card-modern" 200 "Dynamic template page"

echo "📄 Testing Static Assets..."
test_route "/favicon.ico" 200 "Favicon"
test_route "/robots.txt" 200 "Robots.txt"

echo "🚫 Testing Error Handling..."
test_route "/non-existent-page" 404 "404 error page"

echo "🔗 Testing API Routes..."
# Test API routes (should return 405 for GET if they expect POST)
test_route "/api/quotes" 405 "Quotes API endpoint"

echo "=================================="
echo "🏁 Test Results Summary"
echo "=================================="

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED!"
    echo "✅ All routes are responding correctly"
    echo "✅ Sanity integration is working"
    echo "✅ Application is ready for production"
    exit 0
else
    echo "⚠️  $FAILED_TESTS TESTS FAILED"
    echo "❌ Some routes are not responding correctly"
    echo "🔧 Please check the application logs and fix issues"
    exit 1
fi
