#!/bin/bash

# 🚀 Deploy DigiPrintPlus to Vercel
# This script deploys both frontend and studio to Vercel with environment variables

set -e

echo "🚀 Deploying DigiPrintPlus to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm i -g vercel
fi

# Check if environment variables are extracted
if [[ ! -f ".vercel-env/web.env" ]] || [[ ! -f ".vercel-env/studio.env" ]]; then
    echo -e "${YELLOW}⚠️  Environment variables not found. Extracting...${NC}"
    ./scripts/extract-env-vars.sh
fi

echo ""
echo -e "${BLUE}📦 Step 1: Deploying Next.js Frontend${NC}"
echo "----------------------------------------"

cd apps/web

# Deploy frontend
echo -e "${GREEN}🚀 Deploying frontend to Vercel...${NC}"
vercel --prod

echo ""
echo -e "${BLUE}📦 Step 2: Deploying Sanity Studio${NC}"
echo "----------------------------------------"

cd ../studio

# Deploy studio
echo -e "${GREEN}🚀 Deploying studio to Vercel...${NC}"
vercel --prod

cd ../..

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Visit your Vercel dashboard to:"
echo "   - Set up custom domains"
echo "   - Add environment variables if not done automatically"
echo "   - Configure redirects if needed"
echo ""
echo "2. Set up environment variables manually if needed:"
echo "   - Frontend: Use .vercel-env/web.env"
echo "   - Studio: Use .vercel-env/studio.env"
echo ""
echo "3. Configure domains:"
echo "   - www.yourdomain.com → frontend"
echo "   - studio.yourdomain.com → studio"