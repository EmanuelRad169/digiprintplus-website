# Sanity CMS Scripts Documentation

This document describes all the automation scripts available for the FredCMS project, including seeding, querying, verification, and maintenance operations.

## Available Scripts

All scripts can be run from the project root using `npm run <script-name>`.

### Development Scripts

```bash
# Start development servers for both web and studio
npm run dev

# Start web app development server only
npm run dev:web

# Start studio development server only
npm run dev:studio

# Build both web and studio for production
npm run build

# Start the web app in production mode
npm run start

# Run linting on the web app
npm run lint

# Fix dependency issues across the monorepo
npm run fix-deps

# Build web app with bundle analyzer
npm run analyze

# Generate TypeScript types from Sanity schemas
npm run generate:types

# Format all code files with Prettier
npm run prettier

# Check if all files are formatted correctly
npm run prettier:check
```

### Seeding Scripts

#### `pnpm run seed:sanity`
**File:** `scripts/seedSanity.ts`
**Purpose:** Complete Sanity CMS seeding with all base content
**Creates:**
- Site Settings (company info, contact details)
- Navigation Menu (main navigation structure)
- Home Page (with hero, about, and CTA sections)
- Product Categories (Business Cards)
- Sample Products (Standard Business Cards)
- Sample Quote Requests
- User Profiles (admin user)

#### `pnpm run seed:additional`
**File:** `scripts/seedAdditionalContent.ts`
**Purpose:** Additional content to expand the CMS
**Creates:**
- Additional Product Categories (Brochures, Banners, Flyers, Stickers)
- Additional Products (Tri-Fold Brochures, Vinyl Banners, Promotional Flyers)
- Additional Pages (About Us, Contact Us)
- Additional Quote Requests

#### `pnpm run seed:nav`
**File:** `scripts/seedNavigation.ts`
**Purpose:** Create/update navigation menu only
**Creates:**
- Main navigation menu with Home, Products, About, Contact links

#### `pnpm run seed:images`
**File:** `scripts/seedImages.ts`
**Purpose:** Upload and link image assets
**Features:**
- Creates assets directory if needed
- Uploads images from `/assets` folder
- Links images to appropriate documents
- Provides guidance on required images

### Verification Scripts

#### `pnpm run verify:all`
**File:** `scripts/verifyAllData.ts`
**Purpose:** Comprehensive verification of all CMS data
**Checks:**
- Site Settings
- Navigation Menu
- Product Categories and Products
- Pages and Content
- Quote Requests
- User Profiles
- Image Assets
- Provides detailed summary and counts

#### `pnpm run verify:nav`
**File:** `scripts/verifyNavigation.ts`
**Purpose:** Verify navigation menu structure only

### Query Script

#### `pnpm query "<GROQ_QUERY>"`
**File:** `scripts/query.ts`
**Purpose:** Run arbitrary GROQ queries against Sanity
**Usage Examples:**
```bash
pnpm query '*[_type == "product"]'
pnpm query '*[_type == "product"]{ title, category->{ name } }'
pnpm query '*[_type == "siteSettings"][0]{ title, description }'
```

### Maintenance Scripts

#### `pnpm cleanup`
**File:** `scripts/cleanupData.ts`
**Purpose:** Clean up duplicate or broken documents
**Features:**
- Fixes broken category references
- Removes duplicate products
- Removes broken category documents
- Safe cleanup order (references first, then documents)

## Usage Workflow

### Initial Setup
1. **Complete seeding:** `pnpm run seed:sanity`
2. **Add additional content:** `pnpm run seed:additional`
3. **Verify all data:** `pnpm run verify:all`

### Adding Images
1. Create `/assets` directory in project root
2. Add image files:
   - `logo.png` (Company logo)
   - `hero-bg.jpg` (Hero background)
   - `business-cards-sample.jpg` (Product images)
   - `admin-avatar.jpg` (User avatars)
3. **Run image seeding:** `pnpm run seed:images`

### Maintenance
- **Check data integrity:** `pnpm run verify:all`
- **Clean up issues:** `pnpm cleanup`
- **Query specific data:** `pnpm query "<your-query>"`

## Script Features

### Error Handling
- All scripts include comprehensive error handling
- Graceful failures with descriptive error messages
- Process exits with appropriate codes

### TypeScript Safety
- All scripts are TypeScript-compatible
- Type-safe Sanity client operations
- Schema-aware document creation

### Logging
- Detailed progress logging with emojis
- Success/failure indicators
- Summary statistics
- Color-coded output

### Data Consistency
- Proper document relationships
- Reference integrity
- Unique IDs and slugs
- Schema compliance

## Environment Requirements

### Required Environment Variables
All scripts require the following environment variables in `/apps/web/.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=development
SANITY_API_TOKEN=your_write_token
```

### Dependencies
- **tsx:** For TypeScript execution
- **@sanity/client:** For Sanity API operations
- **fs/promises:** For file system operations (images)

## Schema Compatibility

### Supported Document Types
- `siteSettings` - Global site configuration
- `navigationMenu` - Navigation structure
- `page` - Content pages with block content
- `product` - Products with specifications and features
- `productCategory` - Product categorization
- `quoteRequest` - Customer quote requests
- `userProfile` - User accounts and profiles

### Block Content Support
Pages use proper Sanity block content structure:
```typescript
{
  _type: 'block',
  children: [{ _type: 'span', text: 'Content text' }],
  markDefs: [],
  style: 'normal' | 'h1' | 'h2' | etc.
}
```

### Reference Integrity
All document references use proper Sanity reference format:
```typescript
{
  _type: 'reference',
  _ref: 'document-id'
}
```

## Troubleshooting

### Common Issues
1. **Missing environment variables:** Ensure `.env.local` is configured
2. **Permission errors:** Verify SANITY_API_TOKEN has write access
3. **Duplicate documents:** Run `npm run cleanup` to resolve
4. **TypeScript errors:** Check schema compatibility
5. **Network issues:** Verify Sanity project access

## Utility Scripts

### fix-dependencies.sh

This script resolves dependency issues across the monorepo:

```bash
./fix-dependencies.sh
# or
npm run fix-deps
```

It performs the following actions:
1. Installs root dependencies with `--legacy-peer-deps`
2. Syncs Tailwind CSS versions across the project
3. Installs web and studio dependencies with `--legacy-peer-deps`
4. Creates an npm-shrinkwrap.json to lock all dependencies

### generate-types.sh

This script generates TypeScript types from your Sanity schemas:

```bash
./scripts/generate-types.sh
# or
npm run generate:types
```

**Note**: Before using this script, you need to install the `sanity-codegen` package:

```bash
npm install --save-dev sanity-codegen
```

And create a `sanity-codegen.config.ts` file at the root of your project:

```typescript
export default {
  schemaPath: 'apps/studio/schemas',
  outputPath: 'apps/web/types/sanity/schema.ts',
  prettier: true,
};
```

### Debug Commands
```bash
# Check environment
pnpm query '*[_type == "siteSettings"][0]'

# Verify connections
pnpm run verify:nav

# Full data check
pnpm run verify:all

# Clean up issues
pnpm cleanup
```

### Manual Verification
Access Sanity Studio at `http://localhost:3333` (when running `pnpm dev:studio`) to manually verify and edit content.

## Development Notes

### Adding New Scripts
1. Create script in `/scripts/` directory
2. Add to `package.json` scripts section
3. Follow existing patterns for error handling and logging
4. Update this documentation

### Extending Functionality
- Scripts can be extended with additional document types
- New verification checks can be added to `verifyAllData.ts`
- Image seeding can be expanded for more asset types

### Best Practices
- Always run verification after seeding
- Use cleanup script before major re-seeding
- Test scripts with development dataset first
- Keep environment variables secure
