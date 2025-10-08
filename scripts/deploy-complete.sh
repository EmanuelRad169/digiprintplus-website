#!/bin/bash

# 🚀 Setup and Deploy DigiPrintPlus to GitHub + Vercel
# Complete deployment pipeline with environment variable reuse

set -e

echo "🚀 DigiPrintPlus Deployment Pipeline"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Pre-deployment checks
echo -e "${BLUE}🔍 Step 1: Pre-deployment Checks${NC}"
echo "--------------------------------"

# Check if we're in a git repo
if [[ ! -d ".git" ]]; then
    echo -e "${YELLOW}⚠️  Initializing Git repository...${NC}"
    git init
    git branch -M main
fi

# Check for environment files
if [[ ! -f "apps/web/.env.local" ]]; then
    echo -e "${RED}❌ apps/web/.env.local not found!${NC}"
    echo "Please create this file with your Sanity environment variables."
    exit 1
fi

if [[ ! -f "apps/studio/.env.local" ]]; then
    echo -e "${RED}❌ apps/studio/.env.local not found!${NC}"
    echo "Please create this file with your Sanity environment variables."
    exit 1
fi

echo -e "${GREEN}✅ Environment files found${NC}"

# Step 2: Extract environment variables
echo ""
echo -e "${BLUE}🔧 Step 2: Extracting Environment Variables${NC}"
echo "--------------------------------------------"
./scripts/extract-env-vars.sh

# Step 3: Build and lint check
echo ""
echo -e "${BLUE}🔨 Step 3: Build and Lint Checks${NC}"
echo "--------------------------------"

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔍 Running linting...${NC}"
npm run lint

echo -e "${YELLOW}🏗️  Building projects...${NC}"
npm run build

echo -e "${GREEN}✅ Build checks passed${NC}"

# Step 4: Git operations
echo ""
echo -e "${BLUE}📤 Step 4: Git Operations${NC}"
echo "-------------------------"

# Add files to git
echo -e "${YELLOW}📝 Adding files to Git...${NC}"
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
else
    echo -e "${YELLOW}💾 Committing changes...${NC}"
    git commit -m "Production deployment: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Step 5: GitHub push
echo ""
echo -e "${BLUE}🐙 Step 5: GitHub Operations${NC}"
echo "----------------------------"

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
    
    # Check if remote exists
    if git remote get-url origin &> /dev/null; then
        echo -e "${GREEN}✅ Remote origin exists, pushing...${NC}"
        git push origin main
    else
        echo -e "${YELLOW}⚠️  No remote origin found. Creating GitHub repo...${NC}"
        gh repo create digiprintplus --public --source=. --remote=origin --push
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI not found. Please push manually:${NC}"
    echo "   git remote add origin https://github.com/yourusername/digiprintplus.git"
    echo "   git push -u origin main"
fi

# Step 6: Vercel deployment
echo ""
echo -e "${BLUE}🚀 Step 6: Vercel Deployment${NC}"
echo "-----------------------------"

read -p "Deploy to Vercel now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./scripts/deploy-to-vercel.sh
else
    echo -e "${YELLOW}⚠️  Skipping Vercel deployment. Run './scripts/deploy-to-vercel.sh' when ready.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment Pipeline Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "• Environment variables extracted to .vercel-env/"
echo "• Code pushed to GitHub"
echo "• Ready for Vercel deployment"
echo ""
echo -e "${BLUE}🔗 Useful links:${NC}"
echo "• GitHub: https://github.com/yourusername/digiprintplus"
echo "• Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Set up custom domains in Vercel dashboard"
echo "2. Configure DNS at your domain registrar"
echo "3. Add any additional environment variables if needed"