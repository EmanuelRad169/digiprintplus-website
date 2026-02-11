#!/bin/bash

# 🚀 DigiPrint+ Complete Deployment Preparation Script
# This script runs all necessary steps to prepare for deployment

set -e  # Exit on error

echo "🚀 DigiPrint+ Deployment Preparation"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Auto-fix common issues
echo -e "${BLUE}📋 Step 1: Running auto-fix script...${NC}"
echo ""
npm run fix:deploy
echo ""

# Step 2: Run comprehensive audit
echo -e "${BLUE}📊 Step 2: Running comprehensive audit...${NC}"
echo ""
npm run audit:deploy
AUDIT_STATUS=$?
echo ""

# Step 3: Check Jest tests (optional but recommended)
echo -e "${BLUE}🧪 Step 3: Running Jest tests...${NC}"
echo ""
cd apps/web && npm test && cd ../..
echo ""

# Step 4: Summary
echo ""
echo "========================================"
echo -e "${GREEN}✅ Preparation Complete!${NC}"
echo "========================================"
echo ""

if [ $AUDIT_STATUS -eq 0 ]; then
    echo -e "${GREEN}Audit Status: PASSED ✅${NC}"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Review generated files:"
    echo "      - NETLIFY_ENV_VARS.txt"
    echo "      - DEPLOYMENT_CHECKLIST.md"
    echo "      - DEPLOYMENT_GUIDE_COMPLETE.md"
    echo ""
    echo "   2. Set environment variables in Netlify:"
    echo "      Copy values from NETLIFY_ENV_VARS.txt"
    echo ""
    echo "   3. Configure Netlify build settings:"
    echo "      Build command: npm run build:netlify"
    echo "      Publish directory: out"
    echo ""
    echo "   4. Test local build (optional):"
    echo "      cd apps/web && npm run build && npx serve@latest out"
    echo ""
    echo "   5. Deploy to Netlify:"
    echo "      git add . && git commit -m 'chore: ready for deployment' && git push"
    echo ""
    echo "   6. After deployment, verify:"
    echo "      npm run verify:deployment https://your-site.netlify.app"
    echo ""
    echo -e "${GREEN}🎉 Ready for deployment!${NC}"
    exit 0
else
    echo -e "${RED}Audit Status: FAILED ❌${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Please fix critical issues before deploying${NC}"
    echo "   Run 'npm run audit:deploy' to see details"
    echo ""
    exit 1
fi
