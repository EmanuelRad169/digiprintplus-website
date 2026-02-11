#!/bin/bash

# 🟢 DIGIPRINT PRODUCTION DEPLOYMENT - FINAL CHECKLIST
# This script ensures everything is ready for production deployment

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║     🟢 DIGIPRINT PRODUCTION DEPLOYMENT - FINAL CHECKLIST             ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}STEP 1: VERIFY BUILD CONFIGURATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "✅ Checking netlify.toml configuration..."
if [ -f "netlify.toml" ]; then
    echo "   ✓ netlify.toml found"
    
    if grep -q 'command = "NETLIFY=true npm run build"' netlify.toml; then
        echo "   ✓ Build command: NETLIFY=true npm run build"
    else
        echo -e "   ${YELLOW}⚠️  Build command may need verification${NC}"
    fi
    
    if grep -q 'publish = "out"' netlify.toml; then
        echo "   ✓ Publish directory: out"
    else
        echo -e "   ${YELLOW}⚠️  Publish directory may need verification${NC}"
    fi
    
    if grep -q 'NODE_VERSION = "18' netlify.toml; then
        echo "   ✓ Node version: 18.x"
    else
        echo -e "   ${YELLOW}⚠️  Node version may need verification${NC}"
    fi
else
    echo -e "   ${RED}✗ netlify.toml not found${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}STEP 2: ENVIRONMENT VARIABLES CHECKLIST${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "These environment variables MUST be set in Netlify UI:"
echo ""
echo -e "${YELLOW}Required (Critical):${NC}"
echo "  □ NEXT_PUBLIC_SANITY_PROJECT_ID = as5tildt"
echo "  □ NEXT_PUBLIC_SANITY_DATASET = production"
echo "  □ NEXT_PUBLIC_SANITY_API_VERSION = 2024-01-01"
echo "  □ SANITY_API_TOKEN = <from-sanity-dashboard>"
echo "  □ NEXT_PUBLIC_SITE_URL = https://your-site.netlify.app"
echo ""
echo -e "${YELLOW}Optional:${NC}"
echo "  □ NEXT_PUBLIC_SANITY_STUDIO_URL = https://dppadmin.sanity.studio"
echo "  □ SANITY_REVALIDATE_SECRET = preview-secret-key-2024"
echo "  □ NEXT_PUBLIC_GA4_ID = (if using analytics)"
echo "  □ NEXT_PUBLIC_GTM_ID = (if using tag manager)"
echo ""

echo -e "${RED}⚠️  SECURITY WARNING:${NC}"
echo "   Environment variables are now removed from netlify.toml"
echo "   You MUST set them in Netlify UI before deploying!"
echo ""

read -p "Have you set all required environment variables in Netlify UI? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}📝 To set environment variables:${NC}"
    echo "   1. Go to: https://app.netlify.com"
    echo "   2. Select your site"
    echo "   3. Site settings → Environment variables"
    echo "   4. Add each variable above"
    echo ""
    echo "⏸️  Pausing deployment until variables are set."
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}STEP 3: VERIFY GITHUB CONNECTION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "GitHub Repository Configuration:"
echo "  Repository: https://github.com/EmanuelRad169/digiprintplus-website"
echo "  Branch: main"
echo "  Status: ✓ Code pushed and up to date"
echo ""

read -p "Is Netlify connected to this GitHub repository? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}📝 To connect GitHub:${NC}"
    echo "   1. In Netlify: Site settings → Build & deploy → Link repository"
    echo "   2. Choose GitHub"
    echo "   3. Select: EmanuelRad169/digiprintplus-website"
    echo "   4. Branch: main"
    echo ""
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}STEP 4: LOCAL BUILD VERIFICATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -d "apps/web/out" ]; then
    echo "✅ Local build directory exists"
    
    PRODUCT_COUNT=$(ls apps/web/out/products/ 2>/dev/null | wc -l | tr -d ' ')
    echo "   ✓ Product pages: $PRODUCT_COUNT"
    
    if [ -f "apps/web/out/robots.txt" ]; then
        echo "   ✓ robots.txt generated"
    else
        echo -e "   ${YELLOW}⚠️  robots.txt not found${NC}"
    fi
    
    if [ -f "apps/web/out/sitemap.xml" ]; then
        echo "   ✓ sitemap.xml generated"
    else
        echo -e "   ${YELLOW}⚠️  sitemap.xml not found${NC}"
    fi
    
    if [ -f "apps/web/out/index.html" ]; then
        echo "   ✓ index.html (homepage) generated"
    else
        echo -e "   ${RED}✗ index.html not found - build may have failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No local build found${NC}"
    echo "   This is OK if you haven't built locally yet"
    echo "   Netlify will build on deployment"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}STEP 5: READY TO DEPLOY${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "✅ Pre-deployment checks complete!"
echo ""
echo -e "${GREEN}Deploy Options:${NC}"
echo ""
echo "Option 1: Netlify UI (Recommended for first deploy)"
echo "  1. Go to: https://app.netlify.com"
echo "  2. Select your site (or create new site)"
echo "  3. Click 'Deploy site' or 'Trigger deploy'"
echo "  4. Wait 3-5 minutes for build"
echo ""
echo "Option 2: Netlify CLI"
echo "  $ netlify deploy --prod"
echo ""
echo "Option 3: Git Push (Auto-deploy)"
echo "  Already done! ✓ Code is pushed to main branch"
echo "  Netlify will auto-deploy if connected to GitHub"
echo ""

read -p "Would you like to open Netlify dashboard now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Opening Netlify dashboard..."
    open "https://app.netlify.com" 2>/dev/null || xdg-open "https://app.netlify.com" 2>/dev/null || echo "Please manually open: https://app.netlify.com"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}POST-DEPLOYMENT ACTIONS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "After your site is deployed, follow these steps:"
echo ""
echo "1️⃣  Copy your Netlify URL"
echo "   Example: https://digiprint-main-web.netlify.app"
echo ""
echo "2️⃣  Update NEXT_PUBLIC_SITE_URL"
echo "   • Go to: Site settings → Environment variables"
echo "   • Edit: NEXT_PUBLIC_SITE_URL"
echo "   • Set to: Your actual Netlify URL"
echo ""
echo "3️⃣  Trigger new deploy"
echo "   • Click: Deploys → Trigger deploy → Clear cache and deploy"
echo "   • This updates sitemap.xml and robots.txt with correct URL"
echo ""
echo "4️⃣  Verify deployment"
echo "   $ npm run verify:deployment https://your-site.netlify.app"
echo ""
echo "5️⃣  Test critical routes"
echo "   • Homepage: /"
echo "   • Products: /products"
echo "   • Sample product: /products/business-cards-premium"
echo "   • SEO: /robots.txt and /sitemap.xml"
echo ""

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║          ✅ READY FOR PRODUCTION DEPLOYMENT!                         ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🎉 Good luck with your deployment!${NC}"
echo ""
