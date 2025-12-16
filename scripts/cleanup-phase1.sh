#!/bin/bash
# Safe Cleanup Script - Phase 1: Debug and Test Files
# Run this after manual review of cleanup-report.json

echo "🧹 Starting Safe Cleanup - Phase 1"
echo "=================================="
echo ""

# Create backup directory
BACKUP_DIR=".cleanup-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Backup directory created: $BACKUP_DIR"
echo ""

# Files safe to remove (confirmed not in use)
echo "🗑️  Phase 1: Debug & Test Files"
echo "--------------------------------"

# Debug API routes (superseded by production routes)
if [ -f "apps/web/src/app/api/debug-templates/route.ts" ]; then
  echo "  ✓ Removing debug-templates API route"
  mv "apps/web/src/app/api/debug-templates/route.ts" "$BACKUP_DIR/"
fi

if [ -f "apps/web/src/app/api/test-templates/route.ts" ]; then
  echo "  ✓ Removing test-templates API route"
  mv "apps/web/src/app/api/test-templates/route.ts" "$BACKUP_DIR/"
fi

# Studio test/debug files
if [ -f "apps/studio/websocket-test.js" ]; then
  echo "  ✓ Removing websocket-test.js"
  mv "apps/studio/websocket-test.js" "$BACKUP_DIR/"
fi

if [ -f "apps/studio/test-ai-assist.sh" ]; then
  echo "  ✓ Removing test-ai-assist.sh"
  mv "apps/studio/test-ai-assist.sh" "$BACKUP_DIR/"
fi

if [ -f "apps/studio/sanity.test.config.ts" ]; then
  echo "  ✓ Removing sanity.test.config.ts"
  mv "apps/studio/sanity.test.config.ts" "$BACKUP_DIR/"
fi

# Development/debug scripts
if [ -f "scripts/development/debug-cta.js" ]; then
  echo "  ✓ Removing debug-cta.js"
  mv "scripts/development/debug-cta.js" "$BACKUP_DIR/"
fi

if [ -f "scripts/development/test-production-connection.js" ]; then
  echo "  ✓ Removing test-production-connection.js"
  mv "scripts/development/test-production-connection.js" "$BACKUP_DIR/"
fi

if [ -f "scripts/verify/testBrowserCORS.ts" ]; then
  echo "  ✓ Removing testBrowserCORS.ts"
  mv "scripts/verify/testBrowserCORS.ts" "$BACKUP_DIR/"
fi

if [ -f "scripts/verify/testCORS.ts" ]; then
  echo "  ✓ Removing testCORS.ts"
  mv "scripts/verify/testCORS.ts" "$BACKUP_DIR/"
fi

if [ -f "scripts/verify/test-site-settings.js" ]; then
  echo "  ✓ Removing test-site-settings.js"
  mv "scripts/verify/test-site-settings.js" "$BACKUP_DIR/"
fi

echo ""
echo "✅ Phase 1 Complete!"
echo "Backup location: $BACKUP_DIR"
echo ""
echo "⚠️  Next Steps:"
echo "1. Test your application thoroughly"
echo "2. If everything works, you can safely delete: $BACKUP_DIR"
echo "3. If issues occur, restore files from backup"
echo ""
