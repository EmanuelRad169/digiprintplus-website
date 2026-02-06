#!/bin/bash

# Netlify Manual Deploy Script
# Run this after installing netlify-cli: npm install -g netlify-cli

set -e

echo "🚀 Netlify Deployment Script"
echo "=============================="
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not installed"
    echo "Install it with: npm install -g netlify-cli"
    exit 1
fi

# Navigate to web app
cd apps/web

echo "📦 Building static site..."
NETLIFY=true npm run build

if [ ! -d "out" ]; then
    echo "❌ Build failed - out/ directory not found"
    exit 1
fi

echo "✅ Build successful - $(find out -type f | wc -l) files generated"
echo ""

# Count pages
echo "📊 Generated pages:"
echo "   - HTML files: $(find out -name "*.html" | wc -l)"
echo "   - Static pages: $(ls out/*.html 2>/dev/null | wc -l)"
echo "   - Blog posts: $(find out/blog -name "*.html" 2>/dev/null | wc -l)"
echo "   - Products: $(find out/products -name "*.html" 2>/dev/null | wc -l)"
echo ""

# Deploy
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=out

echo ""
echo "✅ Deployment complete!"
echo "Run QA validation: npm run qa:deploy <your-netlify-url>"
