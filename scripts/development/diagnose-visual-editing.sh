#!/bin/bash

echo "🔍 Comprehensive Visual Editing Diagnostics"
echo "==========================================="

# Function to check package versions
check_packages() {
    echo "📦 Package Version Check:"
    echo "------------------------"
    
    cd /Applications/MAMP/htdocs/FredCMs
    
    echo "Root workspace:"
    npm list @sanity/visual-editing 2>/dev/null | grep visual-editing || echo "❌ Not found"
    
    echo
    echo "Studio packages:"
    cd apps/studio
    npm list @sanity/visual-editing sanity @sanity/client 2>/dev/null | grep -E "(visual-editing|sanity@|client@)"
    
    echo
    echo "Web app packages:"
    cd ../web
    npm list @sanity/visual-editing @sanity/client 2>/dev/null | grep -E "(visual-editing|client@)"
    
    echo
}

# Function to check API version compatibility
check_api_versions() {
    echo "🔌 API Version Check:"
    echo "--------------------"
    
    cd /Applications/MAMP/htdocs/FredCMs/apps/studio
    echo "Studio API version: $(grep -o "apiVersion.*" sanity.config.ts | head -1)"
    
    cd ../web
    echo "Web API version: $(grep -o "SANITY_API_VERSION.*" .env.local | head -1)"
    echo "Web client API version: $(grep -o "apiVersion.*" lib/sanity.ts | head -1)"
    
    echo
}

# Function to check CORS origins
check_cors() {
    echo "🌐 CORS Configuration Check:"
    echo "----------------------------"
    
    cd /Applications/MAMP/htdocs/FredCMs/apps/studio
    echo "Studio CORS origins:"
    grep -A 10 "cors:" sanity.config.ts | grep -E "(origin|localhost)"
    
    echo
}

# Function to check ports and datasets
check_ports_datasets() {
    echo "🔗 Ports and Datasets Check:"
    echo "----------------------------"
    
    echo "Checking if services are running:"
    if curl -s http://localhost:3335 > /dev/null 2>&1; then
        echo "✅ Studio running on port 3335"
    else
        echo "❌ Studio NOT running on port 3335"
    fi
    
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ Web app running on port 3001"
    else
        echo "❌ Web app NOT running on port 3001"
    fi
    
    echo
    echo "Dataset configuration:"
    cd /Applications/MAMP/htdocs/FredCMs/apps/studio
    echo "Studio dataset: $(grep DATASET .env.local | head -1)"
    
    cd ../web
    echo "Web dataset: $(grep DATASET .env.local | head -1)"
    
    echo
}

# Function to check WebSocket configuration
check_websocket() {
    echo "🔌 WebSocket Configuration Check:"
    echo "---------------------------------"
    
    cd /Applications/MAMP/htdocs/FredCMs/apps/studio
    echo "Studio client config:"
    grep -A 10 "client:" sanity.config.ts
    
    echo
    echo "WebSocket fallback plugin check:"
    if [ -f "plugins/webSocketFallback.ts" ]; then
        echo "✅ WebSocket fallback plugin exists"
        echo "Plugin configuration:"
        grep -A 5 -B 5 "visual editing" plugins/webSocketFallback.ts
    else
        echo "❌ WebSocket fallback plugin missing"
    fi
    
    echo
}

# Function to test preview hook
test_preview_hook() {
    echo "🎣 Frontend Preview Hook Test:"
    echo "------------------------------"
    
    cd /Applications/MAMP/htdocs/FredCMs/apps/web
    echo "Visual editing component check:"
    if [ -f "components/visual-editing.tsx" ]; then
        echo "✅ VisualEditing component exists"
        echo "Component configuration:"
        grep -A 5 -B 5 "SanityVisualEditing" components/visual-editing.tsx
    else
        echo "❌ VisualEditing component missing"
    fi
    
    echo
    echo "Layout integration check:"
    if grep -q "VisualEditing" app/layout.tsx; then
        echo "✅ VisualEditing component included in layout"
    else
        echo "❌ VisualEditing component NOT included in layout"
    fi
    
    echo
}

# Function to test the full flow
test_full_flow() {
    echo "🧪 Full Visual Editing Flow Test:"
    echo "---------------------------------"
    
    echo "1. Testing draft mode API..."
    response=$(curl -s -w "%{http_code}" "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024")
    http_code="${response: -3}"
    if [ "$http_code" = "307" ]; then
        echo "✅ Draft mode API working"
    else
        echo "❌ Draft mode API failed (HTTP $http_code)"
    fi
    
    echo "2. Testing visual editing API..."
    response=$(curl -s -w "%{http_code}" "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024&sanity-preview-perspective=drafts")
    http_code="${response: -3}"
    if [ "$http_code" = "200" ]; then
        echo "✅ Visual editing API working"
    else
        echo "❌ Visual editing API failed (HTTP $http_code)"
    fi
    
    echo "3. Testing CORS headers..."
    cors_headers=$(curl -s -I "http://localhost:3001/api/draft-mode/enable?secret=preview-secret-key-2024&sanity-preview-perspective=drafts" | grep -i "access-control")
    if [ ! -z "$cors_headers" ]; then
        echo "✅ CORS headers present"
        echo "$cors_headers"
    else
        echo "❌ CORS headers missing"
    fi
    
    echo
}

# Function to add enhanced logging
add_enhanced_logging() {
    echo "📝 Adding Enhanced Logging:"
    echo "--------------------------"
    
    cd /Applications/MAMP/htdocs/FredCMs/apps/web
    
    # Check if enhanced logging is already present
    if grep -q "🎯 Visual editing setup conditions" components/visual-editing.tsx; then
        echo "✅ Enhanced logging already present in VisualEditing component"
    else
        echo "⚠️ Enhanced logging missing in VisualEditing component"
    fi
    
    # Check Sanity client logging
    if grep -q "Creating Sanity client" lib/sanity.ts; then
        echo "✅ Sanity client logging present"
    else
        echo "⚠️ Sanity client logging missing"
    fi
    
    echo
}

# Run all checks
check_packages
check_api_versions
check_cors
check_ports_datasets
check_websocket
test_preview_hook
add_enhanced_logging
test_full_flow

echo "💡 Next Steps:"
echo "-------------"
echo "1. Open Studio: http://localhost:3335"
echo "2. Navigate to a product document"
echo "3. Click 'Preview' tab"
echo "4. Check browser console for detailed logs"
echo "5. Look for visual editing overlays in the preview"
echo
echo "🔍 What to look for in browser console:"
echo "- '🎯 Visual editing setup conditions:' (from web app)"
echo "- '✅ Visual editing component activated' (from web app)"
echo "- WebSocket connection attempts (from studio)"
echo "- Any CORS errors between studio and web app"
echo "==========================================="
