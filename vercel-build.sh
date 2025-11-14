#!/bin/bash
# Vercel build script for pnpm monorepo

set -e

echo "🔧 Vercel Build Script for pnpm Workspace"
echo "=========================================="

# Detect which app to build based on VERCEL_PROJECT_NAME or default to web
APP_NAME=${VERCEL_PROJECT_NAME:-web}

echo "📦 Installing dependencies with pnpm..."
pnpm -w install --frozen-lockfile

echo "🏗️  Building app: $APP_NAME"
case $APP_NAME in
  web)
    pnpm -w -F digiprintplus-web run build
    ;;
  studio)
    pnpm -w -F digiprintplus-studio run build
    ;;
  *)
    echo "❌ Unknown app: $APP_NAME"
    exit 1
    ;;
esac

echo "✅ Build completed successfully!"
