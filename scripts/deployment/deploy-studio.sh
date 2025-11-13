#!/bin/bash

##############################################
# 🎨 Deploy Sanity Studio to Vercel
# Usage: ./scripts/deployment/deploy-studio.sh [--prod]
##############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
STUDIO_DIR="$PROJECT_ROOT/apps/studio"

echo -e "${BLUE}🎨 Deploying Sanity Studio to Vercel...${NC}"
echo ""

# Check if we're in production mode
PROD_FLAG=""
if [[ "$1" == "--prod" ]] || [[ "$1" == "-p" ]]; then
    PROD_FLAG="--prod"
    echo -e "${GREEN}✅ Production deployment mode${NC}"
else
    echo -e "${YELLOW}⚠️  Preview deployment mode (use --prod for production)${NC}"
fi

# Navigate to studio directory
cd "$STUDIO_DIR"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: .env.production not found in $STUDIO_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo -e "${BLUE}🔨 Building locally to catch errors...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Local build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Local build successful${NC}"
echo ""

# Deploy with Vercel CLI
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
echo ""

if [ -z "$PROD_FLAG" ]; then
    # Preview deployment
    vercel --yes
else
    # Production deployment
    vercel --prod --yes
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo -e "${BLUE}📊 View deployment:${NC}"
    echo -e "   Dashboard: https://vercel.com/dashboard"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Optional: Deploy to Sanity hosting
echo ""
read -p "$(echo -e ${YELLOW}❓ Also deploy to Sanity hosting? [y/N]: ${NC})" -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🎨 Deploying to Sanity...${NC}"
    npm run deploy
    echo -e "${GREEN}✅ Sanity deployment complete${NC}"
fi
