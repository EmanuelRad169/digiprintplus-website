# 🛠️ DigiPrintPlus Tools & Scripts

This directory contains all automation scripts and tools for the DigiPrintPlus project, organized by purpose and usage frequency.

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
