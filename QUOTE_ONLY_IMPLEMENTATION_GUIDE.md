# Quote-Only Print Shop - Sanity Implementation Guide

This guide documents the implementation of a quote-only print shop using Sanity CMS, Next.js, and Tailwind CSS. This system allows all print products to be managed in Sanity without pricing, replacing price information with quote request functionality.

## 📋 Required Categories

All 15 required product categories are implemented and available in the system:

1. Business Cards (`/products/category/business-cards`)
2. Flyers & Brochures (`/products/category/flyers-brochures`)
3. Postcards (`/products/category/postcards`)
4. Announcement Cards (`/products/category/announcement-cards`)
5. Booklets (`/products/category/booklets`)
6. Catalogs (`/products/category/catalogs`)
7. Bookmarks (`/products/category/bookmarks`)
8. Calendars (`/products/category/calendars`)
9. Door Hangers (`/products/category/door-hangers`)
10. Envelopes (`/products/category/envelopes`)
11. Letterhead (`/products/category/letterhead`)
12. NCR Forms (`/products/category/ncr-forms`)
13. Notepads (`/products/category/notepads`)
14. Table Tents (`/products/category/table-tents`)
15. Counter Display Cards (`/products/category/counter-display-cards`)

## 🔄 Setup Scripts

The following scripts are provided to set up and manage your quote-only print shop:

### 1. Create Categories

Run this script to create all 15 required product categories in Sanity:

```bash
cd apps/studio
node seed-product-categories.js
```

### 2. Check Categories

Verify that all required categories exist:

```bash
cd apps/studio
node check-categories.js
```

### 3. Setup Navigation

Create a CMS-driven navigation structure that includes all product categories:

```bash
cd apps/studio
node setup-navigation.js
```

### 4. Seed Quote-Only Products

Create sample quote-only products for demonstration:

```bash
cd apps/studio
node seed-quote-products.js
```

## 🏗️ Schema Structure

### Product Schema Changes

The product schema has been modified to support quote-only functionality:

1. **Removed pricing fields**:
   - `basePrice`
   - `priceRange`
   - `currency`

2. **Added quote-specific fields**:
   - `specs`: Detailed product specifications (array of name/value pairs)
   - `quoteOptions`: Available options for quote customization
   - `formLink`: Direct link to quote request form
   - `quoteRequestFormId`: ID for embedding quote forms

3. **Changed group structure**:
   - Replaced "Pricing & Availability" group with "Quote Options" group

### Navigation Schema

The navigation uses the existing `navigationMenu` schema, with the mega menu structure organized into three sections:

1. **Popular Categories**: Business Cards, Flyers & Brochures, Postcards, Booklets, Catalogs
2. **Business Essentials**: Announcement Cards, Letterhead, Envelopes, NCR Forms, Notepads
3. **Specialty Items**: Bookmarks, Calendars, Door Hangers, Table Tents, Counter Display Cards

## 🖥️ Frontend Implementation

### Product Category Pages

- Path: `/products/category/[slug]`
- Displays all products in a specific category
- Each product card shows:
  - "Quote Only" label
  - "Get Quote" call-to-action button
  - Product image, title, and description
  - Optional ratings and specifications

### Product Detail Pages

- Path: `/products/[slug]`
- Detailed product information with:
  - "Quote Only" section replacing price display
  - "Request a Quote" primary button
  - Specifications displayed in a tabbed interface
  - Quote options in collapsible accordions
  - Trust indicators and social proof

### Navigation

- Dynamic mega menu populated from Sanity
- Mobile-responsive dropdown for smaller screens
- Fallback to auto-generated category structure if no manual navigation is defined

## 🚀 Getting Started

1. First, ensure all categories are created:

   ```
   cd apps/studio
   node seed-product-categories.js
   ```

2. Set up the navigation:

   ```
   node setup-navigation.js
   ```

3. Add sample quote-only products:

   ```
   node seed-quote-products.js
   ```

4. Start the development server:

   ```
   cd ../web
   npm run dev
   ```

5. Visit http://localhost:3000 to see your quote-only print shop in action!

## 📊 Customization

### Adding New Products

1. In Sanity Studio, create a new Product document
2. Fill in the basic information (title, slug, description)
3. Select the appropriate category
4. Add quote-specific fields (specs, quoteOptions)
5. Set an image and any additional content
6. Publish the product

### Managing Quote Options

1. Navigate to a product in Sanity Studio
2. Go to the "Quote Options" tab
3. Add or edit available options that customers can choose
4. Mark any required options
5. Add detailed descriptions for each option

## 🔒 Deployment

The system supports draft/preview mode for easy content management:

1. Make changes in Sanity Studio
2. Preview changes before publishing
3. When ready, publish to make the changes live

All dynamic content (categories, products, navigation) is statically generated at build time, with incremental static regeneration (ISR) for updated content.
