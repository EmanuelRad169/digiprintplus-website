#!/bin/bash

##############################################
# Fix Netlify Site Linking for Monorepo
##############################################

set -e

echo "🔧 Fixing Netlify site link..."
echo ""

# Create .netlify directory structure
mkdir -p .netlify/v1

# Create state.json with correct site ID
cat > .netlify/v1/state.json << 'EOF'
{
  "siteId": "e3e4c5d4-99fa-41da-8608-99820d0a5bd5"
}
EOF

echo "✅ Created .netlify/v1/state.json"
echo ""

# Verify
if [ -f ".netlify/v1/state.json" ]; then
    echo "✅ Site link configured successfully!"
    echo ""
    echo "Site ID: e3e4c5d4-99fa-41da-8608-99820d0a5bd5"
    echo "Site Name: digiprint-main-web"
    echo "URL: http://digiprint-main-web.netlify.app"
    echo ""
    echo "You can now deploy using:"
    echo "  ./scripts/deployment/deploy-web.sh --prod"
else
    echo "❌ Failed to create state.json"
    exit 1
fi
