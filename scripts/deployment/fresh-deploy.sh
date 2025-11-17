#!/bin/bash

############################################################
# fresh-deploy.sh
#
# Complete fresh deployment from scratch:
# 1. Clean all build artifacts and node_modules
# 2. Fresh install of all dependencies
# 3. Build workspace packages
# 4. Deploy to Vercel with proper configuration
# 5. Automated with error handling
#
# Usage:
#   ./scripts/deployment/fresh-deploy.sh [--prod]
#   VERCEL_TOKEN="<token>" ./scripts/deployment/fresh-deploy.sh --prod
############################################################

set -euo pipefail

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
WEB_DIR="$PROJECT_ROOT/apps/web"
STUDIO_DIR="$PROJECT_ROOT/apps/studio"

# Check for production flag
PROD_FLAG=""
ENVIRONMENT="preview"
if [[ "${1:-}" == "--prod" ]] || [[ "${1:-}" == "-p" ]]; then
    PROD_FLAG="--prod"
    ENVIRONMENT="production"
fi

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║        🚀 FRESH DEPLOYMENT AUTOMATION                ║"
echo "║        Environment: $(echo $ENVIRONMENT | tr '[:lower:]' '[:upper:]')                     ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

cd "$PROJECT_ROOT"

############################################################
# Step 1: Clean everything
############################################################

echo -e "${BLUE}🧹 Step 1/7: Cleaning build artifacts and dependencies...${NC}"
echo ""

# Clean turbo cache
echo "  → Cleaning Turbo cache..."
rm -rf .turbo

# Clean node_modules
echo "  → Removing node_modules..."
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

# Clean build directories
echo "  → Removing build artifacts..."
rm -rf apps/web/.next
rm -rf apps/web/out
rm -rf apps/studio/dist
rm -rf packages/*/dist

# Clean logs
echo "  → Removing log files..."
find . -name "*.log" -type f -delete 2>/dev/null || true

echo -e "${GREEN}✅ Cleanup complete${NC}\n"

############################################################
# Step 2: Verify environment files
############################################################

echo -e "${BLUE}🔍 Step 2/7: Verifying environment configuration...${NC}"
echo ""

# Check .env files exist
ENV_MISSING=0

if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${YELLOW}⚠️  Warning: Root .env not found${NC}"
    ENV_MISSING=1
fi

if [ ! -f "$WEB_DIR/.env.local" ] && [ ! -f "$WEB_DIR/.env.production" ]; then
    echo -e "${YELLOW}⚠️  Warning: Web .env files not found${NC}"
    ENV_MISSING=1
fi

if [ ! -f "$STUDIO_DIR/.env.local" ] && [ ! -f "$STUDIO_DIR/.env.production" ]; then
    echo -e "${YELLOW}⚠️  Warning: Studio .env files not found${NC}"
    ENV_MISSING=1
fi

if [ $ENV_MISSING -eq 1 ]; then
    echo -e "${RED}❌ Missing environment files. Deployment may fail.${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Environment files verified${NC}\n"
fi

############################################################
# Step 3: Fresh install dependencies
############################################################

echo -e "${BLUE}📦 Step 3/7: Installing dependencies (fresh)...${NC}"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo "Install with: npm install -g pnpm@9.15.0"
    exit 1
fi

echo "  → Installing with frozen lockfile..."
pnpm -w install --frozen-lockfile --prefer-offline

echo "  → Installing web app dependencies..."
cd "$WEB_DIR" && pnpm install --frozen-lockfile --prefer-offline
cd "$PROJECT_ROOT"

echo -e "${GREEN}✅ Dependencies installed${NC}\n"

############################################################
# Step 4: Build workspace packages
############################################################

echo -e "${BLUE}🔨 Step 4/7: Building workspace packages...${NC}"
echo ""

echo "  → Building web app..."
cd "$WEB_DIR" && pnpm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Web build failed${NC}"
    exit 1
fi

cd "$PROJECT_ROOT"

echo -e "${GREEN}✅ Build successful${NC}\n"

############################################################
# Step 5: Verify Vercel configuration
############################################################

echo -e "${BLUE}⚙️  Step 5/7: Verifying Vercel configuration...${NC}"
echo ""

# Check if vercel.json exists
if [ ! -f "$PROJECT_ROOT/vercel.json" ]; then
    echo -e "${RED}❌ Root vercel.json not found${NC}"
    exit 1
fi

if [ ! -f "$WEB_DIR/vercel.json" ]; then
    echo -e "${RED}❌ Web vercel.json not found${NC}"
    exit 1
fi

echo "  → Root vercel.json: ✓"
echo "  → Web vercel.json: ✓"

echo -e "${GREEN}✅ Vercel config verified${NC}\n"

############################################################
# Step 6: Check Vercel CLI
############################################################

echo -e "${BLUE}🔧 Step 6/7: Checking Vercel CLI...${NC}"
echo ""

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found, installing...${NC}"
    npm install -g vercel@latest
fi

# Check if we're logged in or have a token
if [ -z "${VERCEL_TOKEN:-}" ]; then
    echo "  → Checking Vercel authentication..."
    if ! vercel whoami &> /dev/null; then
        echo -e "${YELLOW}⚠️  Not logged in to Vercel${NC}"
        echo "  → Logging in..."
        vercel login
    fi
fi

echo -e "${GREEN}✅ Vercel CLI ready${NC}\n"

############################################################
# Step 7: Deploy to Vercel
############################################################

echo -e "${BLUE}🚀 Step 7/7: Deploying to Vercel...${NC}"
echo ""

cd "$PROJECT_ROOT"

# Build deployment command
DEPLOY_CMD="vercel"

if [ -n "$PROD_FLAG" ]; then
    DEPLOY_CMD="$DEPLOY_CMD --prod"
fi

# Add token if provided
if [ -n "${VERCEL_TOKEN:-}" ]; then
    DEPLOY_CMD="$DEPLOY_CMD --token $VERCEL_TOKEN"
fi

# Add scope if needed
DEPLOY_CMD="$DEPLOY_CMD --scope emanuels-projects-1dd59b95 --yes"

echo "  → Running: $DEPLOY_CMD"
echo ""

# Execute deployment
eval $DEPLOY_CMD

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║            ✅ DEPLOYMENT SUCCESSFUL!                  ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${CYAN}📊 Useful Links:${NC}"
    echo "  → Dashboard: https://vercel.com/emanuels-projects-1dd59b95"
    echo "  → Live Site: https://digiprintplus.vercel.app"
    echo ""
else
    echo -e "${RED}"
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║            ❌ DEPLOYMENT FAILED                       ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    exit 1
fi
