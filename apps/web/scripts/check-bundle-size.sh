#!/bin/bash
# Bundle Size CI Check

set -e

MAX_SIZE_MB=250
BUILD_DIR="/Applications/MAMP/htdocs/FredCMs/apps/web/.next/standalone"

echo "🔍 Checking bundle size..."

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Build directory not found. Run 'npm run build' first."
  exit 1
fi

BUNDLE_SIZE_MB=$(du -sm "$BUILD_DIR" 2>/dev/null | cut -f1)
BUNDLE_SIZE_HUMAN=$(du -sh "$BUILD_DIR" 2>/dev/null | cut -f1)

echo "📦 Standalone bundle size: $BUNDLE_SIZE_HUMAN ($BUNDLE_SIZE_MB MB)"
echo "🎯 Maximum allowed: $MAX_SIZE_MB MB"

PERCENT=$((BUNDLE_SIZE_MB * 100 / MAX_SIZE_MB))

if [ $BUNDLE_SIZE_MB -gt $MAX_SIZE_MB ]; then
  OVER=$((BUNDLE_SIZE_MB - MAX_SIZE_MB))
  echo ""
  echo "❌ Bundle size EXCEEDS limit by ${OVER}MB!"
  echo "   Current: ${BUNDLE_SIZE_MB}MB"
  echo "   Limit:   ${MAX_SIZE_MB}MB"
  echo "   Usage:   ${PERCENT}%"
  echo ""
  echo "💡 Run './scripts/analyze-bundle.sh' for optimization suggestions"
  exit 1
else
  REMAINING=$((MAX_SIZE_MB - BUNDLE_SIZE_MB))
  echo ""
  echo "✅ Bundle size OK!"
  echo "   Current:   ${BUNDLE_SIZE_MB}MB"
  echo "   Limit:     ${MAX_SIZE_MB}MB"
  echo "   Usage:     ${PERCENT}%"
  echo "   Remaining: ${REMAINING}MB"
  echo ""
fi
