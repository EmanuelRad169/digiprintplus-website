# 🛠️ DigiPrintPlus Tools & Scripts

This directory contains all automation scripts and tools for the DigiPrintPlus project, organized by purpose and usage frequency.

## � Environment & Configuration

### Verify Sanity Environment

```bash
npm run verify:env
```

**Purpose:** Validates that environment variables are correctly configured for:
- Local development (.env.local)
- Sanity Studio connection
- Production deployment (Netlify)
- Live GROQ query tests

**What it checks:**
- ✅ All required environment variables exist
- ✅ Sanity API connection works
- ✅ API token has correct permissions
- ✅ Draft filtering is working properly
- ✅ Content counts (products, blog posts, etc.)

**Output Example:**
```
🔍 SANITY CMS ENVIRONMENT VALIDATION

📋 Environment Variables:
┌─────────────┬──────────────────────────────┐
│ Project ID  │ 'as5tildt'                   │
│ Dataset     │ 'production'                 │
│ API Version │ '2024-01-01'                 │
│ API Token   │ '✅ SET (hidden)'            │
└─────────────┴──────────────────────────────┘

🌐 Testing Sanity API Connection...
✅ Found 153 active products
✅ Found 8 published blog posts
✅ Draft filtering working: 0 drafts, 387 published

Results: 5 passed | 0 failed | 0 warnings
```

**When to use:**
- Before deploying to Netlify
- After updating environment variables
- When troubleshooting Sanity connection issues
- To verify draft filtering is working correctly

### Post-Deployment QA Validation

```bash
# Test local development
npm run qa:deploy

# Test production deployment
npm run qa:deploy https://magical-starburst-38d690.netlify.app
```

**Purpose:** Comprehensive post-deployment validation suite that tests:
- 🌐 Live site accessibility and content rendering
- 🔗 Dynamic routes (blog posts, products, categories)
- 📋 Environment variable synchronization
- 🔒 Sanity draft filtering in production
- ⚙️  Build configuration (ESLint, exports)
- 🤖 SEO files (robots.txt, sitemap.xml)
- 💡 Performance audit (Lighthouse, optional)

**What it validates:**
- ✅ Homepage and static pages load correctly
- ✅ Blog posts and product pages render
- ✅ No draft content leaks to production
- ✅ Content counts match expectations (153 products, 8 blog posts)
- ✅ ESLint version compatibility (8.57.0)
- ✅ getBlogPostBySlug export exists
- ✅ robots.txt and sitemap.xml are valid
- ✅ Performance, accessibility, and SEO scores (if Lighthouse installed)

**Output Example:**
```
🚀 POST-DEPLOYMENT QA VALIDATION
🌐 Testing Site: https://magical-starburst-38d690.netlify.app

📋 1. ENVIRONMENT VARIABLES
   ✅ NEXT_PUBLIC_SANITY_PROJECT_ID
   ✅ NEXT_PUBLIC_SANITY_DATASET

🌐 2. SANITY CMS DATA VALIDATION
   ✅ Found 153 products (expected 153)
   ✅ Found 8 blog posts (expected 8)

🌍 3. LIVE SITE ACCESSIBILITY
   ✅ Homepage accessible (200)
   ✅ /products (200)

🔗 4. DYNAMIC ROUTES
   ✅ /blog/[slug] working

🤖 5. SEO FILES
   ✅ robots.txt valid
   ✅ sitemap.xml with 204 URLs

⚙️  6. BUILD CONFIGURATION
   ✅ ESLint 8.57.0
   ✅ getBlogPostBySlug exported

💡 7. LIGHTHOUSE AUDIT
   ✅ Performance: 92/100
   ✅ Accessibility: 95/100

📊 Results: 25 passed | 0 failed
```

**Lighthouse Setup (Optional):**
```bash
# Install globally for performance audits
npm i -g lighthouse
```

**When to use:**
- ✅ After every Netlify deployment
- ✅ Before announcing new releases
- ✅ During troubleshooting
- ✅ Weekly health checks

---

## �📤📥 Product Export/Import Scripts

### Export Scripts

#### Export to Excel

```bash
node tools/export-products.js
```

- Exports all products to `/exports/products.xlsx`
- Includes: Name, Slug, Description, Base Price, Category, Status
- Formatted for easy editing in Excel

#### Export to CSV

```bash
node tools/export-products-csv.js
```

- Exports all products to `/exports/products.csv`
- Same fields as Excel export
- Compatible with most spreadsheet applications

#### Complete Dataset Export

```bash
node tools/export-sanity-dump.js
```

- Exports ALL documents from Sanity to `/junk/exports/sanity-dump.xlsx`
- Includes all document types with full data
- Flattens nested objects and arrays
- Converts rich text to plain text and Markdown
- Resolves references with titles
- Creates separate worksheets for each document type

### Import Scripts

#### Interactive Import (Recommended)

```bash
node tools/sync-products-from-excel.js
```

- Reads `/exports/products.xlsx`
- Shows detailed preview of changes
- Asks for confirmation before applying updates
- Provides validation warnings and errors
- Uses slug as unique identifier

#### Automatic Import

```bash
node tools/sync-products-from-excel-auto.js --auto
```

- Same as interactive but applies changes automatically
- Useful for automated workflows
- No user confirmation required

### Field Mapping

| Excel Column | Sanity Field      | Notes                        |
| ------------ | ----------------- | ---------------------------- |
| Name         | `title`           | Required                     |
| Slug         | `slug.current`    | Required, used as unique key |
| Description  | `description`     | Optional                     |
| Base Price   | `basePrice`       | Optional                     |
| Category     | `category->title` | Read-only (reference field)  |
| Status       | `status`          | Optional                     |

### Workflow Example

1. **Export current data:** `node tools/export-products.js`
2. **Edit in Excel:** Open `/exports/products.xlsx`, make changes, save
3. **Preview changes:** `node tools/sync-products-from-excel.js`
4. **Review and confirm changes**

---

## 📁 Directory Structure

```
tools/
├── script-runner.js          # Unified CLI interface for all scripts
└── scripts/
    ├── seed/                 # Data seeding scripts (13 files)
    ├── migrate/              # Migration scripts (3 files)
    ├── verify/               # Verification & testing (11 files)
    ├── utils/                # Utility & maintenance (9 files)
    └── archive/              # Completed one-time scripts (6 files)
```

## 🚀 Usage

### Quick Start

```bash
# List all available script categories
npm run scripts:list

# List scripts in a specific category
npm run scripts:list seed

# Run a script
npm run script seed seedProducts
npm run script verify verifyAllData
npm run script utils cleanupData
```

### Help & Documentation

```bash
# Show detailed help
npm run scripts:help

# Show usage examples
npm run script help
```

## 📂 Script Categories

### 🌱 **SEED** - Data Seeding Scripts

_Populate Sanity CMS with initial content_

- **seedProducts** - Create product catalog
- **seedProductCategories** - Set up product categories
- **seedNavigation** - Configure site navigation
- **seedPages** - Create static pages
- **seedAboutPage** - Populate about page
- **seedFooter** - Configure footer content
- **seedComponents** - Set up reusable components
- **seedMedia** - Upload media assets
- **seedImages** - Process and upload images
- **seedSanity** - Initialize Sanity CMS
- **seedSanityContent** - Additional CMS content
- **seedAdditionalContent** - Extra content pieces
- **seedEnhancedPages** - Advanced page templates

### 🔄 **MIGRATE** - Migration Scripts

_Update existing data structures and content_

- **migrateHardcodedContent** - Move hardcoded content to CMS
- **migrateNavigation** - Update navigation structure
- **migrateFeatures** - Update feature implementations

### ✅ **VERIFY** - Verification & Testing

_Validate data integrity and system functionality_

- **verifyAllData** - Comprehensive data validation
- **verifyProductData** - Product-specific validation
- **verifyNavigation** - Navigation structure validation
- **verifyMedia** - Media asset validation
- **validateTypes** - TypeScript type validation
- **testFetchers** - Test data fetching functions
- **testProductSEO** - SEO validation for products
- **testNavigation** - Navigation functionality tests
- **validate-schemas** - Sanity schema validation
- **validate-published-products** - Published product validation
- **test-site-settings** - Site configuration tests

### 🔧 **UTILS** - Utility & Maintenance

_Helper tools and maintenance scripts_

- **cleanupData** - Remove orphaned/invalid data
- **cleanupMedia** - Clean up unused media files
- **checkCategories** - Validate category structure
- **createMissingCategories** - Auto-create missing categories
- **updateProductNavigation** - Sync product navigation
- **query** - Run custom Sanity queries
- **types** - Type definitions and utilities
- **generate-types** - Generate TypeScript types
- **run-migration** - Migration runner utility

### 📦 **ARCHIVE** - Completed Scripts

_One-time scripts that have served their purpose_

- **seed-demo-products** - Demo data creation (completed)
- **seed-business-hours** - Business hours setup (completed)
- **seed-quote-products** - Quote products setup (completed)
- **seed-product-categories** - Legacy category setup (completed)
- **seed-templates** - Template setup (completed)
- **seed-templates-simple** - Simple template setup (completed)

## 🎯 Common Workflows

### Initial Project Setup

```bash
npm run script seed seedSanity         # Initialize Sanity CMS
npm run script seed seedNavigation     # Set up navigation
npm run script seed seedProductCategories  # Create categories
npm run script seed seedProducts       # Populate products
npm run script verify verifyAllData    # Validate everything
```

### Content Updates

```bash
npm run script seed seedPages          # Update static pages
npm run script seed seedComponents     # Update components
npm run script verify verifyAllData    # Validate changes
```

### Data Maintenance

```bash
npm run script utils cleanupData       # Clean orphaned data
npm run script utils cleanupMedia      # Remove unused media
npm run script verify verifyAllData    # Validate cleanup
```

### Development & Testing

```bash
npm run script verify testFetchers     # Test data fetching
npm run script verify validateTypes    # Check TypeScript types
npm run script utils query             # Run custom queries
```

## 🛡️ Safety Features

- **Environment Isolation**: All scripts use `.env.local` for configuration
- **Error Handling**: Comprehensive error reporting and exit codes
- **Type Safety**: TypeScript scripts with full type checking
- **Validation**: Built-in data validation before operations
- **Rollback**: Archive system preserves completed scripts

## 📊 Migration from Old System

### Before (Old Structure)

```
scripts/               # 30+ mixed scripts
apps/studio/*.js       # 8+ scattered scripts
apps/web/scripts/      # 5+ isolated scripts
```

### After (New Structure)

```
tools/scripts/         # Organized by purpose
├── seed/              # 13 seeding scripts
├── migrate/           # 3 migration scripts
├── verify/            # 11 verification scripts
├── utils/             # 9 utility scripts
└── archive/           # 6 completed scripts
```

### Benefits

- **70% reduction** in npm script commands (44 → 4)
- **Logical organization** by script purpose
- **Unified interface** for all script operations
- **Better discoverability** with categorized listing
- **Improved maintainability** with clear separation of concerns

## 🔗 Integration

The script runner integrates seamlessly with:

- **NPM Scripts**: All accessible via `npm run script`
- **Environment Variables**: Automatic `.env.local` loading
- **TypeScript**: Full support for `.ts` scripts
- **Sanity CMS**: Configured with project credentials
- **Monorepo Structure**: Works across all workspace apps

---

**Next Steps**: Use `npm run scripts:help` to get started with the new system!
