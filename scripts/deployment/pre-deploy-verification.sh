#!/bin/bash

###############################################################################
# 🚀 PRE-DEPLOYMENT VERIFICATION SCRIPT
# Verifies all Sanity CMS and Next.js configurations before deploying
###############################################################################

set -e # Exit on any error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 STARTING PRE-DEPLOYMENT VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
pass() {
  echo -e "${GREEN}✅ PASS:${NC} $1"
  ((PASSED++))
}

fail() {
  echo -e "${RED}❌ FAIL:${NC} $1"
  ((FAILED++))
}

warn() {
  echo -e "${YELLOW}⚠️  WARN:${NC} $1"
  ((WARNINGS++))
}

info() {
  echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

section() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

###############################################################################
# 1. ENVIRONMENT VARIABLES
###############################################################################
section "1. CHECKING ENVIRONMENT VARIABLES"

cd apps/web

if [ -f .env.local ]; then
  pass ".env.local file exists"
  
  # Check required Sanity variables
  if grep -q "NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt" .env.local; then
    pass "NEXT_PUBLIC_SANITY_PROJECT_ID is set correctly"
  else
    fail "NEXT_PUBLIC_SANITY_PROJECT_ID missing or incorrect"
  fi
  
  if grep -q "NEXT_PUBLIC_SANITY_DATASET=production" .env.local; then
    pass "NEXT_PUBLIC_SANITY_DATASET is set to 'production'"
  else
    warn "NEXT_PUBLIC_SANITY_DATASET is not set to 'production'"
    info "Current dataset: $(grep NEXT_PUBLIC_SANITY_DATASET .env.local | cut -d= -f2)"
  fi
  
  if grep -q "NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01" .env.local; then
    pass "NEXT_PUBLIC_SANITY_API_VERSION is set"
  else
    fail "NEXT_PUBLIC_SANITY_API_VERSION missing"
  fi
  
  if grep -q "SANITY_API_TOKEN=" .env.local && [ -n "$(grep SANITY_API_TOKEN .env.local | cut -d= -f2)" ]; then
    pass "SANITY_API_TOKEN is configured"
  else
    warn "SANITY_API_TOKEN missing (needed for write operations)"
  fi
  
else
  fail ".env.local file not found in apps/web/"
fi

cd ../..

###############################################################################
# 2. NEXT.JS CONFIGURATION
###############################################################################
section "2. CHECKING NEXT.JS CONFIGURATION"

cd apps/web

if [ -f next.config.js ]; then
  pass "next.config.js exists"
  
  if grep -q "output.*export\|output.*standalone" next.config.js; then
    pass "Output mode configured (export/standalone)"
    info "Mode: $(grep -o 'output.*' next.config.js | head -1)"
  else
    warn "Output mode not explicitly set"
  fi
  
  if grep -q "cdn.sanity.io" next.config.js; then
    pass "Sanity CDN domain configured in images.domains"
  else
    fail "cdn.sanity.io not in images.domains configuration"
  fi
  
else
  fail "next.config.js not found"
fi

cd ../..

###############################################################################
# 3. SANITY STUDIO CONFIGURATION
###############################################################################
section "3. CHECKING SANITY STUDIO"

cd apps/studio

if [ -f sanity.config.ts ]; then
  pass "Sanity Studio config exists"
  
  if grep -q "projectId.*as5tildt" sanity.config.ts; then
    pass "Project ID matches in Sanity config"
  else
    fail "Project ID mismatch in sanity.config.ts"
  fi
  
else
  fail "sanity.config.ts not found"
fi

# Check available datasets
info "Available Sanity datasets:"
npx sanity dataset list 2>/dev/null | while read dataset; do
  info "  - $dataset"
done

cd ../..

###############################################################################
# 4. CRITICAL FILES CHECK
###############################################################################
section "4. CHECKING CRITICAL FILES"

# Templates page
if [ -f apps/web/src/app/templates/page.tsx ]; then
  pass "Templates page exists"
  
  if grep -q "draftMode" apps/web/src/app/templates/page.tsx; then
    pass "Templates page has draft mode support"
  else
    warn "Templates page missing draft mode (live preview won't work)"
  fi
  
  if grep -q "getAllTemplates\|getAllTemplateCategories" apps/web/src/app/templates/page.tsx; then
    pass "Templates fetched from Sanity (not hardcoded)"
  else
    fail "Templates page not using Sanity fetchers"
  fi
else
  fail "Templates page not found"
fi

# Sanity fetchers
if [ -f apps/web/src/lib/sanity/fetchers.ts ]; then
  pass "Sanity fetchers file exists"
  
  if grep -q "getAllTemplates\|getAllTemplateCategories" apps/web/src/lib/sanity/fetchers.ts; then
    pass "Template fetcher functions exist"
  else
    fail "Template fetcher functions missing"
  fi
else
  fail "Sanity fetchers file not found"
fi

###############################################################################
# 5. BUILD TEST
###############################################################################
section "5. RUNNING BUILD TEST"

cd apps/web

info "Starting Next.js build (this may take 2-3 minutes)..."
if npm run build > /tmp/build-output.log 2>&1; then
  pass "Build completed successfully"
  
  # Check for static pages
  if grep -q "Static pages" /tmp/build-output.log; then
    STATIC_COUNT=$(grep -o "Static pages.*" /tmp/build-output.log | grep -o "[0-9]* /" | grep -o "[0-9]*" || echo "0")
    pass "Static pages generated: $STATIC_COUNT"
  fi
  
  # Check for templates route
  if grep -q "/templates" /tmp/build-output.log; then
    pass "Templates route built successfully"
  fi
  
else
  fail "Build failed - check /tmp/build-output.log for details"
  echo ""
  echo "Build errors (last 20 lines):"
  tail -20 /tmp/build-output.log
fi

cd ../..

###############################################################################
# 6. SANITY DATA VERIFICATION
###############################################################################
section "6. VERIFYING SANITY DATA"

info "Checking Sanity data availability..."

# Use Node.js to query Sanity directly
node - <<'EOF'
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function check() {
  try {
    // Check templates
    const templates = await client.fetch('*[_type == "template" && !(_id in path("drafts.**"))]');
    console.log(`✅ Found ${templates.length} templates in Sanity`);
    
    // Check categories
    const categories = await client.fetch('*[_type == "templateCategory" && !(_id in path("drafts.**"))]');
    console.log(`✅ Found ${categories.length} template categories in Sanity`);
    
    // Check CTA
    const cta = await client.fetch('*[_type == "ctaSection" && sectionId == "homepage-cta"][0]');
    if (cta) {
      console.log(`✅ Homepage CTA document exists and is ${cta.isActive ? 'active' : 'inactive'}`);
    } else {
      console.log(`❌ Homepage CTA document not found`);
    }
    
  } catch (error) {
    console.log(`❌ Sanity query failed: ${error.message}`);
  }
}

check();
EOF

###############################################################################
# 7. DEPLOYMENT READINESS
###############################################################################
section "7. DEPLOYMENT ENVIRONMENT VARIABLES"

echo ""
info "Required environment variables for Netlify:"
echo ""
echo "  NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt"
echo "  NEXT_PUBLIC_SANITY_DATASET=production"
echo "  NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01"
echo "  NEXT_PUBLIC_SANITY_STUDIO_URL=https://dppadmin.sanity.studio"
echo "  SANITY_API_TOKEN=<your-token-here>"
echo ""

###############################################################################
# SUMMARY
###############################################################################
section "VERIFICATION SUMMARY"

echo ""
echo "Results:"
echo "  ${GREEN}✅ Passed:${NC}   $PASSED"
echo "  ${YELLOW}⚠️  Warnings:${NC} $WARNINGS"
echo "  ${RED}❌ Failed:${NC}   $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}🎉 ALL CRITICAL CHECKS PASSED - READY FOR DEPLOYMENT!${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  
  if [ $WARNINGS -gt 0 ]; then
    echo ""
    warn "There are $WARNINGS warning(s) - review them before deploying"
  fi
  
  exit 0
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}⚠️  $FAILED CRITICAL ISSUE(S) FOUND - FIX BEFORE DEPLOYING!${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 1
fi
