#!/bin/bash

###############################################################################
# 📦 SANITY DATASET MIGRATION SCRIPT
# Merges development dataset content into production dataset
###############################################################################

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 SANITY DATASET MIGRATION: development → production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd apps/studio

# Check if user is logged in to Sanity
echo "🔐 Checking Sanity authentication..."
if ! npx sanity projects list &>/dev/null; then
  echo -e "${RED}❌ Not logged in to Sanity CLI${NC}"
  echo "Please run: cd apps/studio && npx sanity login"
  exit 1
fi

echo -e "${GREEN}✅ Authenticated${NC}"
echo ""

# List current datasets
echo "📋 Current datasets:"
npx sanity dataset list
echo ""

# Confirm before proceeding
echo -e "${YELLOW}⚠️  WARNING: This will REPLACE all data in the 'production' dataset${NC}"
echo ""
read -p "Do you want to proceed? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
  echo "❌ Migration cancelled"
  exit 0
fi

# Create backup directory
BACKUP_DIR="../../backups/sanity-datasets"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 Step 1: Backing up production dataset (safety precaution)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PROD_BACKUP="$BACKUP_DIR/production-backup-$TIMESTAMP.tar.gz"
npx sanity dataset export production "$PROD_BACKUP"
echo -e "${GREEN}✅ Production backup saved to: $PROD_BACKUP${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 Step 2: Exporting development dataset"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

DEV_EXPORT="$BACKUP_DIR/development-export-$TIMESTAMP.tar.gz"
npx sanity dataset export development "$DEV_EXPORT"
echo -e "${GREEN}✅ Development dataset exported to: $DEV_EXPORT${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📥 Step 3: Importing to production dataset"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx sanity dataset import "$DEV_EXPORT" production --replace
echo -e "${GREEN}✅ Import completed successfully${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Verification: Checking production dataset content"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Quick verification query
node - <<'EOF'
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function verify() {
  try {
    const counts = await Promise.all([
      client.fetch('count(*[_type == "template"])'),
      client.fetch('count(*[_type == "templateCategory"])'),
      client.fetch('count(*[_type == "productCategory"])'),
      client.fetch('count(*[_type == "ctaSection"])'),
    ]);
    
    console.log('\nDocument counts in production dataset:');
    console.log(`  Templates: ${counts[0]}`);
    console.log(`  Template Categories: ${counts[1]}`);
    console.log(`  Product Categories: ${counts[2]}`);
    console.log(`  CTA Sections: ${counts[3]}`);
    console.log('');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

verify();
EOF

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ MIGRATION COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📋 Next Steps:"
echo "  1. Update apps/web/.env.local: NEXT_PUBLIC_SANITY_DATASET=production"
echo "  2. Update deployment environment variables (Netlify/Vercel)"
echo "  3. Rebuild your Next.js app: cd apps/web && npm run build"
echo "  4. Test locally before deploying"
echo ""
echo "💾 Backups saved in: $BACKUP_DIR"
echo ""
