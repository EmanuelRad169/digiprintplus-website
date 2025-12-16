#!/bin/bash
# Quick Start: Project Cleanup
# Safe, automated cleanup of debug and test files

echo "🧹 DigiPrintPlus Project Cleanup"
echo "================================"
echo ""
echo "This script will safely remove debug and test files."
echo "A backup will be created before any deletions."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Cleanup cancelled."
    exit 1
fi

echo ""
echo "📊 Running analysis..."
node scripts/cleanup-analysis.js

echo ""
echo "📖 Full cleanup guide available at: CLEANUP_GUIDE.md"
echo ""
echo "🎯 Quick Actions:"
echo "   1. Review cleanup-report.json"
echo "   2. Run: ./scripts/cleanup-phase1.sh (safe deletions)"
echo "   3. Test your application"
echo "   4. Follow CLEANUP_GUIDE.md for Phase 2+"
echo ""
echo "✅ Ready to proceed with Phase 1?"
read -p "Run safe cleanup now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    ./scripts/cleanup-phase1.sh
else
    echo "Cleanup paused. Run ./scripts/cleanup-phase1.sh when ready."
fi
