#!/bin/bash
# Post-build cleanup to reduce deployment size

echo "🧹 Cleaning up build artifacts to reduce bundle size..."

cd /Applications/MAMP/htdocs/FredCMs/apps/web

# Remove cache directory (not needed for deployment)
if [ -d ".next/cache" ]; then
  echo "Removing .next/cache ($(du -sh .next/cache 2>/dev/null | cut -f1))"
  rm -rf .next/cache
fi

# Remove unnecessary Sharp platform binaries (saves ~210MB!)
if [ -d ".next/standalone/node_modules/.pnpm" ]; then
  ./scripts/remove-sharp-binaries.sh
fi

# Remove large source maps
echo "Removing source maps..."
find .next -name "*.map" -type f -delete

# Remove TypeScript declaration files from node_modules in standalone
if [ -d ".next/standalone/node_modules" ]; then
  echo "Removing .d.ts files from standalone node_modules..."
  find .next/standalone/node_modules -name "*.d.ts" -type f -delete
fi

# Remove documentation files from standalone node_modules
if [ -d ".next/standalone/node_modules" ]; then
  echo "Removing docs from standalone node_modules..."
  find .next/standalone/node_modules -type f \( -name "README*" -o -name "CHANGELOG*" -o -name "LICENSE*" -o -name "*.md" \) -delete
fi

# Remove test files from standalone
if [ -d ".next/standalone" ]; then
  echo "Removing test files..."
  find .next/standalone -type d -name "__tests__" -exec rm -rf {} + 2>/dev/null || true
  find .next/standalone -type d -name "test" -exec rm -rf {} + 2>/dev/null || true
  find .next/standalone -type f -name "*.test.js" -delete 2>/dev/null || true
  find .next/standalone -type f -name "*.spec.js" -delete 2>/dev/null || true
fi

# Calculate final size
FINAL_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
STANDALONE_SIZE=$(du -sh .next/standalone 2>/dev/null | cut -f1)

echo "✅ Cleanup complete!"
echo "📦 Total .next size: $FINAL_SIZE"
echo "📦 Standalone bundle size: $STANDALONE_SIZE"
echo ""
echo "Note: Netlify function limit is 250MB"
