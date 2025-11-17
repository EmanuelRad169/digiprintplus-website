#!/bin/bash

############################################################
# full-deploy.sh
#
# Automates the full deployment workflow:
# 1. Ensures Sanity allows the Vercel production domain via CORS
# 2. Installs pnpm workspace dependencies with a frozen lockfile
# 3. Builds every workspace package (web + studio)
# 4. Commits and pushes changes to trigger a Vercel deployment
#
# Usage:
#   SANITY_AUTH_TOKEN="<token>" ./scripts/deployment/full-deploy.sh
#   ./scripts/deployment/full-deploy.sh --token <token>
############################################################

set -euo pipefail

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CORS_SCRIPT="$PROJECT_ROOT/scripts/maintenance/add-vercel-cors.sh"

TOKEN="${SANITY_AUTH_TOKEN:-}"  # prefer exported token
if [[ "${1:-}" == "--token" ]]; then
  TOKEN="${2:-}"  # allow inline override
fi

if [[ ! -x "$CORS_SCRIPT" ]]; then
  echo -e "${RED}❌ Missing or non-executable: $CORS_SCRIPT${NC}"
  exit 1
fi

cd "$PROJECT_ROOT"

###############################################################################
# 1. Update Sanity CORS settings
###############################################################################

echo -e "${BLUE}🔐 Adding Vercel domain to Sanity CORS...${NC}"
if [[ -n "$TOKEN" ]]; then
  "$CORS_SCRIPT" --token "$TOKEN"
else
  "$CORS_SCRIPT"
fi

echo -e "${GREEN}✅ CORS configuration confirmed${NC}\n"

###############################################################################
# 2. Install dependencies
###############################################################################

echo -e "${BLUE}📦 Installing pnpm workspace dependencies...${NC}"
pnpm -w install --frozen-lockfile

echo -e "${GREEN}✅ Dependencies installed${NC}\n"

###############################################################################
# 3. Build the entire workspace
###############################################################################

echo -e "${BLUE}🔧 Building workspace packages...${NC}"
pnpm -w build

echo -e "${GREEN}✅ Build finished${NC}\n"

###############################################################################
# 4. Commit + push to trigger Vercel deployment
###############################################################################

if git diff --staged --quiet && git diff --quiet; then
  echo -e "${YELLOW}ℹ️  No changes detected; skipping commit/push${NC}"
else
  echo -e "${BLUE}📝 Staging all changes...${NC}"
  git add .

  echo -e "${BLUE}🗒️  Committing changes...${NC}"
  git commit -m "chore: full deploy with CORS + Tailwind fix"

  echo -e "${BLUE}🚀 Pushing to origin/main...${NC}"
  git push origin main
fi

echo -e "${GREEN}✅ Deployment pipeline complete${NC}"
echo "📊 Monitor deployment: https://vercel.com/emanuels-projects-1dd59b95/web/deployments"
