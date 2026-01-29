#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Netlify build script with fallback environment variables
echo "🏗️  Starting Netlify build process..."

# Set fallback environment variables if not provided
export NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID:-"as5tildt"}
export NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET:-"production"}
export NEXT_PUBLIC_SANITY_API_VERSION=${NEXT_PUBLIC_SANITY_API_VERSION:-"2024-01-01"}
export NEXT_PUBLIC_SANITY_STUDIO_URL=${NEXT_PUBLIC_SANITY_STUDIO_URL:-"https://dppadmin.sanity.studio"}

echo "� Navigating to web application directory..."
cd apps/web

echo "📦 Installing web app dependencies..."
# Install dependencies directly in the web app directory
npm install --legacy-peer-deps

echo "🔨 Building web application..."
npm run build

# Verify the build output exists
if [ ! -d ".next" ]; then
    echo "❌ Error: .next directory was not created!"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output directory: $(pwd)/.next"
ls -la .next/