#!/bin/bash

# 🧹 DigiPrintPlus Code Cleanup Script
# Removes unnecessary files and optimizes the codebase for production

echo "🧹 Starting DigiPrintPlus cleanup process..."

# Navigate to project root
cd "$(dirname "$0")"

echo "📁 Cleaning build artifacts..."
# Remove build artifacts
rm -rf apps/web/.next/
rm -rf apps/studio/dist/
rm -rf apps/studio/.sanity/

echo "🗑️ Removing test and development files..."
# Remove test files
rm -f apps/studio/test*.json
rm -f apps/studio/minimal-test.json
rm -f apps/studio/test2.json
rm -f apps/studio/test3.json

echo "🔧 Removing migration scripts (keep one for reference)..."
# Keep only essential migration scripts
rm -f apps/studio/fix-invalid-features.js
rm -f apps/studio/fix-keys.js
rm -f apps/studio/fix-missing-keys.js
rm -f apps/studio/check-categories.js
rm -f apps/studio/check-keys.js
rm -f apps/studio/check-missing-keys.js

echo "📝 Removing redundant config files..."
# Remove redundant configuration files
rm -f apps/web/.babelrc
rm -f apps/web/.eslintrc.js

echo "📦 Cleaning node_modules cache..."
# Clean npm cache
cd apps/web && npm cache clean --force
cd ../studio && npm cache clean --force
cd ../..

echo "🔍 Checking for unused dependencies..."
# This would require manual review, but we can create a list
echo "Manual review needed for these potentially unused dependencies:"
echo "- @react-pdf/renderer (check if PDF generation is used)"
echo "- react-ga4 (check if GA4 is implemented)"
echo "- react-hotjar (check if Hotjar is implemented)"

echo "📄 Creating .gitignore updates..."
# Update .gitignore to exclude development files
cat >> .gitignore << EOL

# Development cleanup
apps/studio/test*.json
apps/studio/minimal-test.json
apps/studio/.sanity/
apps/web/.next/
apps/studio/dist/

# IDE and editor files
.vscode/settings.json
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
EOL

echo "📊 Generating project statistics..."
echo "=== Project Statistics ==="
echo "TypeScript files: $(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l)"
echo "React components: $(find . -name "*.tsx" | grep -v node_modules | wc -l)"
echo "Sanity schemas: $(find apps/studio/schemas -name "*.ts" | wc -l)"
echo "Pages/Routes: $(find apps/web/app -name "page.tsx" | wc -l)"

echo "✅ Cleanup completed!"
echo ""
echo "🔍 Next steps for optimization:"
echo "1. Run 'npm audit' in both apps/web and apps/studio"
echo "2. Review and remove unused dependencies"
echo "3. Run bundle analyzer: npm run build && npm run analyze"
echo "4. Test all functionality after cleanup"
echo ""
echo "🚀 Ready for production deployment!"
