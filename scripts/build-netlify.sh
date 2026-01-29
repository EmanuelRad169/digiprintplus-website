#!/bin/bash

# Netlify build script with fallback environment variables
echo "🏗️  Starting Netlify build process..."

# Set fallback environment variables if not provided
export NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID:-"as5tildt"}
export NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET:-"production"}
export NEXT_PUBLIC_SANITY_API_VERSION=${NEXT_PUBLIC_SANITY_API_VERSION:-"2024-01-01"}
export NEXT_PUBLIC_SANITY_STUDIO_URL=${NEXT_PUBLIC_SANITY_STUDIO_URL:-"https://dppadmin.sanity.studio"}

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔨 Building web application..."
cd apps/web && pnpm run build

echo "✅ Build completed successfully!"