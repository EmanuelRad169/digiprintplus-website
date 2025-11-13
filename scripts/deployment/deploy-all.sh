#!/bin/bash

##############################################
# 🚀 Deploy Everything to Vercel
# Usage: ./scripts/deployment/deploy-all.sh [--prod]
##############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${PURPLE}╔════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║  🚀 Full Deployment: Web + Studio     ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in production mode
PROD_FLAG=""
if [[ "$1" == "--prod" ]] || [[ "$1" == "-p" ]]; then
    PROD_FLAG="--prod"
    echo -e "${GREEN}✅ Production deployment mode${NC}"
    echo -e "${YELLOW}⚠️  This will deploy to PRODUCTION!${NC}"
    echo ""
    read -p "$(echo -e ${RED}Are you sure? [y/N]: ${NC})" -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Deployment cancelled${NC}"
        exit 0
    fi
else
    echo -e "${YELLOW}⚠️  Preview deployment mode${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 1/3: Deploy Sanity Studio${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

"$SCRIPT_DIR/deploy-studio.sh" $PROD_FLAG

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Studio deployment failed. Aborting.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 2/3: Deploy Web App${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

"$SCRIPT_DIR/deploy-web.sh" $PROD_FLAG

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Web deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 3/3: Git Commit & Push${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

cd "$SCRIPT_DIR/../.."

# Check if there are changes to commit
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}📝 Uncommitted changes detected${NC}"
    read -p "$(echo -e ${BLUE}Commit and push changes? [Y/n]: ${NC})" -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        echo -e "${BLUE}📝 Committing changes...${NC}"
        git add -A
        read -p "Commit message: " commit_msg
        git commit -m "$commit_msg"
        
        echo -e "${BLUE}⬆️  Pushing to GitHub...${NC}"
        git push origin main
        
        echo -e "${GREEN}✅ Changes pushed to GitHub${NC}"
    fi
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi

echo ""
echo -e "${PURPLE}╔════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║  ✅ All Deployments Complete!          ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📊 Your Deployments:${NC}"
echo -e "${BLUE}   Web App:${NC}    https://digiprintplus.vercel.app"
echo -e "${BLUE}   Studio:${NC}     Check Vercel dashboard for URL"
echo -e "${BLUE}   GitHub:${NC}     https://github.com/EmanuelRad169/Digiprintplus"
echo ""
echo -e "${GREEN}🎉 All systems deployed!${NC}"
