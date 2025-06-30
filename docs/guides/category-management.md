# Product Categories Setup Instructions

## Overview

This document provides instructions for setting up the required product categories in Sanity Studio.

## Missing Categories to Create

The following 13 categories need to be created manually in Sanity Studio:

### 1. Postcards

- **Title**: `Postcards`
- **Slug**: `postcards`
- **Description**: `Custom postcards for direct mail marketing, announcements, and promotional campaigns.`

### 2. Announcement Cards

- **Title**: `Announcement Cards`
- **Slug**: `announcement-cards`
- **Description**: `Elegant announcement cards for special events, business updates, and personal milestones.`

### 3. Booklets

- **Title**: `Booklets`
- **Slug**: `booklets`
- **Description**: `Professional booklets and catalogs for product showcases, manuals, and informational materials.`

### 4. Catalogs

- **Title**: `Catalogs`
- **Slug**: `catalogs`
- **Description**: `Comprehensive product catalogs and lookbooks to showcase your offerings professionally.`

### 5. Bookmarks

- **Title**: `Bookmarks`
- **Slug**: `bookmarks`
- **Description**: `Custom bookmarks for libraries, bookstores, educational institutions, and promotional use.`

### 6. Calendars

- **Title**: `Calendars`
- **Slug**: `calendars`
- **Description**: `Custom calendars including wall calendars, desk calendars, and promotional calendar designs.`

### 7. Door Hangers

- **Title**: `Door Hangers`
- **Slug**: `door-hangers`
- **Description**: `Effective door hanger marketing materials for local businesses and service providers.`

### 8. Envelopes

- **Title**: `Envelopes`
- **Slug**: `envelopes`
- **Description**: `Custom printed envelopes in various sizes and styles for business and personal use.`

### 9. Letterhead

- **Title**: `Letterhead`
- **Slug**: `letterhead`
- **Description**: `Professional letterhead designs to enhance your business correspondence and branding.`

### 10. NCR Forms

- **Title**: `NCR Forms`
- **Slug**: `ncr-forms`
- **Description**: `No Carbon Required forms for invoices, receipts, work orders, and multi-part documents.`

### 11. Notepads

- **Title**: `Notepads`
- **Slug**: `notepads`
- **Description**: `Custom notepads and memo pads for offices, promotional giveaways, and personal use.`

### 12. Table Tents

- **Title**: `Table Tents`
- **Slug**: `table-tents`
- **Description**: `Table tent cards perfect for restaurants, events, and promotional displays.`

### 13. Counter Display Cards

- **Title**: `Counter Display Cards`
- **Slug**: `counter-display-cards`
- **Description**: `Point-of-sale display cards and counter cards for retail and promotional use.`

## How to Create Categories in Sanity Studio

### Method 1: Using Sanity Studio Interface (Recommended)

1. **Open Sanity Studio**

   ```bash
   cd /Applications/MAMP/htdocs/FredCMs/apps/studio
   npm run dev
   ```

2. **Navigate to Product Categories**
   - Open your browser to the Sanity Studio URL
   - Look for "Product Category" in the content types
   - Click on "Product Category"

3. **Create New Category**
   - Click "Create new Product Category"
   - Fill in the fields:
     - **Title**: Use the title from the list above
     - **Slug**: Click "Generate" next to the slug field, or manually enter the slug
     - **Description**: Copy the description from the list above
     - **Featured**: Leave unchecked for now
     - **SEO**: Optionally fill in meta title and description

4. **Repeat for All Categories**
   - Create all 13 missing categories using the information above

### Method 2: Using the Seeding Script (Requires API Token)

If you have a Sanity API token with write permissions:

1. **Set up Environment Variables**

   ```bash
   # In apps/studio/.env.local
   SANITY_API_TOKEN=your_write_token_here
   ```

2. **Run the Seeding Script**
   ```bash
   cd /Applications/MAMP/htdocs/FredCMs/apps/studio
   node seed-product-categories.js
   ```

### Method 3: Import via Sanity CLI

1. **Create a JSON file with categories**
2. **Use Sanity CLI import command**
   ```bash
   sanity dataset import categories.ndjson development
   ```

## Verification

After creating the categories, you can verify they were created correctly by running:

```bash
cd /Applications/MAMP/htdocs/FredCMs/apps/studio
node check-categories.js
```

This will show you all existing categories and confirm which ones are still missing.

## Next Steps

1. **Create the categories** using one of the methods above
2. **Assign products to categories** by editing existing product documents
3. **Test the frontend** by visiting `/products` and category pages like `/products/category/postcards`
4. **Update category descriptions** and SEO information as needed

## Frontend Features

Once categories are created, the frontend will automatically:

- Display category navigation on all product pages
- Filter products by category on `/products/category/[slug]` pages
- Show product counts in navigation
- Generate SEO-friendly category pages
- Provide "View Details" and "Get Quote" buttons on all product cards

## URL Structure

The category pages will be available at:

- `/products/category/postcards`
- `/products/category/announcement-cards`
- `/products/category/booklets`
- `/products/category/catalogs`
- `/products/category/bookmarks`
- `/products/category/calendars`
- `/products/category/door-hangers`
- `/products/category/envelopes`
- `/products/category/letterhead`
- `/products/category/ncr-forms`
- `/products/category/notepads`
- `/products/category/table-tents`
- `/products/category/counter-display-cards`

## Notes

- All category pages will automatically include breadcrumb navigation
- The category navigation component is responsive (mobile dropdown, desktop horizontal)
- Product cards include pricing, ratings, specifications, and action buttons
- Categories without products will show a "coming soon" message
- The main `/products` page shows all products with category filtering available
