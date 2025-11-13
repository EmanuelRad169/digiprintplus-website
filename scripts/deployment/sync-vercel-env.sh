#!/bin/bash

###############################################################################
# Sync Environment Variables to Vercel
# This script pushes production environment variables from .env.production
# to your Vercel project for both Production and Preview environments
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔧 Syncing Environment Variables to Vercel${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if .env.production exists
if [ ! -f "apps/web/.env.production" ]; then
    echo -e "${RED}❌ Error: apps/web/.env.production not found${NC}"
    exit 1
fi

# Navigate to web directory
cd apps/web

echo -e "${YELLOW}📋 Reading environment variables from .env.production...${NC}"
echo ""

# Function to add environment variable to Vercel
add_env_var() {
    local key=$1
    local value=$2
    local scope=$3  # production, preview, development
    
    if [ -z "$value" ] || [[ "$value" == your-* ]] || [[ "$value" == *XXXXXXX* ]]; then
        echo -e "${YELLOW}⏭  Skipping $key (placeholder or empty value)${NC}"
        return
    fi
    
    echo -e "${BLUE}📤 Adding $key to $scope...${NC}"
    echo "$value" | vercel env add "$key" "$scope" --force > /dev/null 2>&1 || {
        echo -e "${YELLOW}⚠️  $key already exists or failed to add${NC}"
    }
}

# Read .env.production and extract variables
while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue
    
    # Remove leading/trailing whitespace and quotes
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
    
    # Skip if key or value is empty
    [[ -z "$key" ]] || [[ -z "$value" ]] && continue
    
    # Add to both production and preview environments
    add_env_var "$key" "$value" "production"
    add_env_var "$key" "$value" "preview"
    
done < .env.production

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Environment Variables Synced!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📊 Verifying...${NC}"
vercel env ls

echo ""
echo -e "${YELLOW}⚠️  Important Next Steps:${NC}"
echo -e "1. Review the environment variables listed above"
echo -e "2. Redeploy your app: ${BLUE}vercel --prod${NC}"
echo -e "3. Check Sanity CORS settings at: ${BLUE}https://sanity.io/manage${NC}"
echo -e "   - Add ${BLUE}https://digiprintplus.vercel.app${NC} to allowed origins"
echo ""
