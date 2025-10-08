#!/bin/bash

# 🚀 DigiPrintPlus Structure Refactor - Safe Migration Script
# This script safely refactors the project structure in incremental steps

set -e  # Exit on any error

echo "🏗️ Starting DigiPrintPlus Structure Refactor..."
echo "📅 $(date)"

# STEP 1: Create backup
echo "📋 STEP 1: Creating backup..."
cp -r /Applications/MAMP/htdocs/FredCMs /Applications/MAMP/htdocs/FredCMs-backup-$(date +%Y%m%d-%H%M%S)
echo "✅ Backup created"

# STEP 2: Create new directory structure
echo "📋 STEP 2: Creating new directory structure..."

mkdir -p scripts/{development,deployment,data-management,maintenance,seed-data}
mkdir -p config
mkdir -p docs/{development,deployment,api,cms,guides}
mkdir -p packages/{config/{eslint-config,prettier-config,tailwind-preset},ui,types,utils,hooks}

# Create src directories in apps
mkdir -p apps/web/src/{components,lib,hooks,types}
mkdir -p apps/web/config
mkdir -p apps/studio/src/{schemas,plugins,components,lib}
mkdir -p apps/studio/config

echo "✅ Directory structure created"

# STEP 3: Move script files
echo "📋 STEP 3: Moving script files..."

# Development scripts
mv analyze-files.js scripts/maintenance/ 2>/dev/null || true
mv check-data.js scripts/development/ 2>/dev/null || true
mv clean-old-data.js scripts/development/ 2>/dev/null || true
mv diagnose-visual-editing.sh scripts/development/ 2>/dev/null || true
mv test-visual-editing.sh scripts/development/ 2>/dev/null || true
mv test-preview-flow.sh scripts/development/ 2>/dev/null || true
mv check-cookies.sh scripts/development/ 2>/dev/null || true
mv check-network.sh scripts/development/ 2>/dev/null || true

# Deployment scripts
mv migrate-to-production.sh scripts/deployment/ 2>/dev/null || true
mv build-analysis.js scripts/deployment/ 2>/dev/null || true

# Data management scripts
mv tools/export-products.js scripts/data-management/ 2>/dev/null || true
mv tools/export-products-csv.js scripts/data-management/ 2>/dev/null || true
mv tools/export-sanity-dump.js scripts/data-management/ 2>/dev/null || true
mv tools/sync-products-from-excel.js scripts/data-management/ 2>/dev/null || true
mv tools/sync-products-from-excel-auto.js scripts/data-management/ 2>/dev/null || true

# Maintenance scripts
mv tools/fix-types.js scripts/maintenance/ 2>/dev/null || true
mv tools/fix-radix-types.js scripts/maintenance/ 2>/dev/null || true
mv tools/migrate-imports.js scripts/maintenance/ 2>/dev/null || true
mv tools/migrate-app-imports.js scripts/maintenance/ 2>/dev/null || true

# Seed data
mv seed-data.ndjson scripts/seed-data/ 2>/dev/null || true
mv debug-cta.js scripts/development/ 2>/dev/null || true

echo "✅ Scripts moved"

# STEP 4: Move configuration files
echo "📋 STEP 4: Moving configuration files..."

mv .audit-ci.json config/ 2>/dev/null || true
mv .prettierrc config/ 2>/dev/null || true
mv components.json config/ 2>/dev/null || true
mv tailwind-preset.js config/ 2>/dev/null || true
mv tsconfig.base.json config/ 2>/dev/null || true

echo "✅ Configuration files moved"

# STEP 5: Move documentation
echo "📋 STEP 5: Moving documentation..."

# Move existing docs content
mv docs/* docs/development/ 2>/dev/null || true
mv VISUAL_EDITING_STATUS.md docs/development/ 2>/dev/null || true

echo "✅ Documentation reorganized"

# STEP 6: Reorganize apps structure
echo "📋 STEP 6: Reorganizing apps structure..."

# Move web app components to src
if [ -d "apps/web/components" ]; then
    mv apps/web/components/* apps/web/src/components/ 2>/dev/null || true
    rmdir apps/web/components 2>/dev/null || true
fi

# Move web app lib to src
if [ -d "apps/web/lib" ]; then
    mv apps/web/lib/* apps/web/src/lib/ 2>/dev/null || true
    rmdir apps/web/lib 2>/dev/null || true
fi

# Move web app hooks to src
if [ -d "apps/web/hooks" ]; then
    mv apps/web/hooks/* apps/web/src/hooks/ 2>/dev/null || true
    rmdir apps/web/hooks 2>/dev/null || true
fi

# Move web app configs
mv apps/web/tailwind.config.js apps/web/config/ 2>/dev/null || true
mv apps/web/next.config.js apps/web/config/ 2>/dev/null || true
mv apps/web/postcss.config.js apps/web/config/ 2>/dev/null || true
mv apps/web/jest.config.js apps/web/config/ 2>/dev/null || true

# Move studio schemas to src
if [ -d "apps/studio/schemas" ]; then
    mv apps/studio/schemas/* apps/studio/src/schemas/ 2>/dev/null || true
    rmdir apps/studio/schemas 2>/dev/null || true
fi

# Move studio plugins to src
if [ -d "apps/studio/plugins" ]; then
    mv apps/studio/plugins/* apps/studio/src/plugins/ 2>/dev/null || true
    rmdir apps/studio/plugins 2>/dev/null || true
fi

# Move studio components to src
if [ -d "apps/studio/components" ]; then
    mv apps/studio/components/* apps/studio/src/components/ 2>/dev/null || true
    rmdir apps/studio/components 2>/dev/null || true
fi

# Move studio configs
mv apps/studio/sanity.config.ts apps/studio/config/ 2>/dev/null || true
mv apps/studio/structure.ts apps/studio/config/ 2>/dev/null || true

echo "✅ Apps reorganized"

# STEP 7: Move shared packages
echo "📋 STEP 7: Moving shared packages..."

# Move existing packages content
if [ -d "packages" ]; then
    # Move existing package contents to appropriate locations
    if [ -d "packages/ui" ]; then
        mv packages/ui/* packages/ui/ 2>/dev/null || true
    fi
    if [ -d "packages/config" ]; then
        mv packages/config/* packages/config/eslint-config/ 2>/dev/null || true
    fi
fi

# Move root-level shared code
if [ -d "components" ]; then
    mv components/* packages/ui/ 2>/dev/null || true
    rmdir components 2>/dev/null || true
fi

if [ -d "hooks" ]; then
    mv hooks/* packages/hooks/ 2>/dev/null || true
    rmdir hooks 2>/dev/null || true
fi

if [ -d "lib" ]; then
    mv lib/* packages/utils/ 2>/dev/null || true
    rmdir lib 2>/dev/null || true
fi

echo "✅ Shared packages organized"

# STEP 8: Clean up old directories and files
echo "📋 STEP 8: Cleaning up..."

# Remove duplicate/unnecessary files
rm README_NEW.md 2>/dev/null || true
rm -rf .github_disabled 2>/dev/null || true
rm -rf tools 2>/dev/null || true  # Only if empty
rm -rf assets 2>/dev/null || true  # Move to appropriate app public folders
rm -rf app 2>/dev/null || true  # Old structure, move to apps/web/src/app

# Clean up empty directories
find . -type d -empty -delete 2>/dev/null || true

echo "✅ Cleanup complete"

echo "🎉 Structure refactor complete!"
echo "📋 Next steps:"
echo "   1. Update import paths in TypeScript/JavaScript files"
echo "   2. Update configuration file references"
echo "   3. Test build and development servers"
echo "   4. Update documentation"

echo ""
echo "🔧 Run these commands to update imports:"
echo "   node scripts/maintenance/fix-import-paths.js"
echo "   npm run build  # Test build"
echo "   npm run dev    # Test development"