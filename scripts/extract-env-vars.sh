#!/bin/bash

# 🚀 Extract Environment Variables for Vercel Deployment
# This script extracts environment variables from .env.local files
# and prepares them for Vercel deployment

set -e

echo "🔍 Extracting environment variables from .env.local files..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to extract env vars from file
extract_env_vars() {
    local file=$1
    local output_file=$2
    local project_name=$3
    
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✅ Found $file${NC}"
        
        # Create temp file for Vercel env format
        echo "# Environment variables for $project_name" > "$output_file"
        echo "# Generated on $(date)" >> "$output_file"
        echo "" >> "$output_file"
        
        # Read each line and format for Vercel
        while IFS= read -r line; do
            # Skip comments and empty lines
            if [[ ! "$line" =~ ^#.*$ ]] && [[ -n "$line" ]]; then
                # Extract key=value
                if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
                    key="${BASH_REMATCH[1]}"
                    value="${BASH_REMATCH[2]}"
                    echo "$key=$value" >> "$output_file"
                fi
            fi
        done < "$file"
        
        echo -e "${BLUE}📄 Created $output_file${NC}"
    else
        echo -e "${YELLOW}⚠️  $file not found${NC}"
    fi
}

# Create output directory
mkdir -p .vercel-env

# Extract from web app
extract_env_vars "apps/web/.env.local" ".vercel-env/web.env" "Next.js Frontend"

# Extract from studio
extract_env_vars "apps/studio/.env.local" ".vercel-env/studio.env" "Sanity Studio"

echo ""
echo -e "${GREEN}🎉 Environment variables extracted!${NC}"
echo ""
echo -e "${BLUE}📁 Files created:${NC}"
echo "  .vercel-env/web.env"
echo "  .vercel-env/studio.env"
echo ""
echo -e "${YELLOW}⚠️  Next steps:${NC}"
echo "1. Review the extracted variables in .vercel-env/"
echo "2. Run ./scripts/deploy-to-vercel.sh to deploy"
echo "3. Or manually upload via Vercel CLI or dashboard"