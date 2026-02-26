#!/bin/bash

##############################################
# 🚀 Quick Deploy to Production (No Local Build)
# Pushes code to Netlify - build happens on Netlify servers
##############################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Quick Deploy to Production${NC}"
echo -e "${YELLOW}⚠️  This will deploy to PRODUCTION!${NC}"
echo ""
read -p "$(echo -e ${RED}Are you sure? [y/N]: ${NC})" -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🚀 Deploying to Netlify (build on server)...${NC}"

# Netlify will handle the build on their servers
netlify deploy --build --prod --filter digiprintplus-web

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${BLUE}📊 View: https://app.netlify.com/sites/digiprint-main-web${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
