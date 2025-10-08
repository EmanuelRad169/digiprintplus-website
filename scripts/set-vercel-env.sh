#!/bin/bash

# 🔧 Set Environment Variables in Vercel
# This script helps you set environment variables in Vercel projects

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🔧 Setting Environment Variables in Vercel"
echo "=========================================="

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Please install it first:${NC}"
    echo "npm i -g vercel"
    exit 1
fi

# Check if we're in a project directory
if [[ ! -f ".vercel/project.json" ]]; then
    echo -e "${RED}❌ Not in a Vercel project directory. Please run 'vercel' first to link your project.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Setting environment variables for production environment...${NC}"

# Read environment variables from .vercel-env/web.env
if [[ -f ".vercel-env/web.env" ]]; then
    echo -e "${YELLOW}📄 Reading variables from .vercel-env/web.env...${NC}"
    
    while IFS='=' read -r key value || [[ -n "$key" ]]; do
        # Skip comments and empty lines
        if [[ "$key" =~ ^#.*$ ]] || [[ -z "$key" ]]; then
            continue
        fi
        
        # Remove any quotes from the value
        value=$(echo "$value" | sed 's/^"//;s/"$//')
        
        # Set the environment variable
        echo -e "${YELLOW}Setting ${key}...${NC}"
        echo "$value" | vercel env add "$key" production --force
        
    done < .vercel-env/web.env
    
    echo -e "${GREEN}✅ Environment variables set successfully!${NC}"
else
    echo -e "${RED}❌ .vercel-env/web.env not found. Please run the extract-env-vars.sh script first.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔗 Next steps:${NC}"
echo "1. Run 'vercel --prod' to deploy to production"
echo "2. Or use 'vercel' for preview deployment"
echo ""
echo -e "${GREEN}✨ Environment setup complete!${NC}"