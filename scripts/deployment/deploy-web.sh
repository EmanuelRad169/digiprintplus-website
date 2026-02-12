#!/bin/bash

##############################################
# 🚀 Deploy Web App to Netlify
# Usage: ./scripts/deployment/deploy-web.sh [--prod]
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
WEB_DIR="$PROJECT_ROOT/apps/web"

echo -e "${BLUE}🚀 Deploying Web App to Netlify...${NC}"
echo ""

# Check if we're in production mode
PROD_FLAG=""
if [[ "$1" == "--prod" ]] || [[ "$1" == "-p" ]]; then
    PROD_FLAG="--prod"
    echo -e "${GREEN}✅ Production deployment mode${NC}"
else
    echo -e "${YELLOW}⚠️  Preview deployment mode (use --prod for production)${NC}"
fi

# Navigate to web directory for env checks
cd "$WEB_DIR"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: .env.production not found in $WEB_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies with pnpm workspace...${NC}"
cd "$PROJECT_ROOT"
pnpm -w install --frozen-lockfile

echo -e "${BLUE}🔨 Building locally to catch errors...${NC}"
pnpm -w -F digiprintplus-web run build:netlify

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Local build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Local build successful${NC}"
echo ""

# Read environment variables from .env.production
echo -e "${BLUE}🔐 Loading environment variables...${NC}"

# Ensure Netlify CLI is available
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}❌ Netlify CLI not found${NC}"
    echo -e "${YELLOW}Install it with: npm install -g netlify-cli${NC}"
    exit 1
fi

# Return to web directory for Netlify CLI deploy
cd "$WEB_DIR"

echo -e "${BLUE}🚀 Deploying to Netlify...${NC}"
echo ""

if [ -z "$PROD_FLAG" ]; then
    # Preview deployment
    netlify deploy --dir=out
else
    # Production deployment
    netlify deploy --prod --dir=out
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo -e "${BLUE}📊 View deployment:${NC}"
    echo -e "   Dashboard: https://app.netlify.com"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
