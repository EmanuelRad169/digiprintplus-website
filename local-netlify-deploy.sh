#!/bin/bash
set -e

echo "🚀 Starting Combined Netlify Deployment (Web + Studio)..."

# 1. Build Web App
echo "📦 Building Web App..."
chmod +x apps/web/netlify-prebuild.sh
cd apps/web
./netlify-prebuild.sh
NETLIFY=true npm run build
cd ../..

# 2. Build Studio
echo "🎨 Building Sanity Studio..."
cd apps/studio
npm run build
cd ../..

# 3. Merge Studio into Web Output
echo "🔗 Merging Studio into Web Output..."
mkdir -p apps/web/out/studio
cp -R apps/studio/dist/* apps/web/out/studio/

echo "✅ Build & Merge Complete!"
echo "📂 Output ready in apps/web/out"
