---
title: 'Navigation Setup Guide'
description: 'Configure site navigation, mega menus, and product categories in Sanity Studio'
category: 'guides'
tags: ['navigation', 'sanity', 'menu', 'categories']
last_updated: '2025-06-30'
audience: 'admin'
---

# Navigation & Category Structure Guide

This guide provides instructions for configuring the navigation and product categories in Sanity Studio to match the required mega menu structure.

## Required Navigation Structure

The main navigation should be structured as follows:

### Main Menu Items

1. **Home** (`/`)
2. **Products** (`/products`) with Mega Menu
3. **About Us** (`/about`)
4. **Contact** (`/contact`)
5. **Request a Quote** (`/quote`)

### Products Mega Menu Structure

The Products menu item should have a mega menu with three sections:

#### Section 1: Business Essentials

- Business Cards (`/products/category/business-cards`)
- Flyers & Brochures (`/products/category/flyers-brochures`)
- Postcards (`/products/category/postcards`)
- Announcement Cards (`/products/category/announcement-cards`)

#### Section 2: Books & Stationery

- Booklets (`/products/category/booklets`)
- Catalogs (`/products/category/catalogs`)
- Bookmarks (`/products/category/bookmarks`)
- Calendars (`/products/category/calendars`)

#### Section 3: Marketing Materials

- Door Hangers (`/products/category/door-hangers`)
- Envelopes (`/products/category/envelopes`)
- Letterhead (`/products/category/letterhead`)
- NCR Forms (`/products/category/ncr-forms`)
- Notepads (`/products/category/notepads`)
- Table Tents (`/products/category/table-tents`)
- Counter Display Cards (`/products/category/counter-display-cards`)

## Setting Up in Sanity Studio

### Step 1: Create Required Product Categories

Make sure all of the following product categories exist in Sanity:

1. Business Cards (slug: `business-cards`)
2. Flyers & Brochures (slug: `flyers-brochures`)
3. Postcards (slug: `postcards`)
4. Announcement Cards (slug: `announcement-cards`)
5. Booklets (slug: `booklets`)
6. Catalogs (slug: `catalogs`)
7. Bookmarks (slug: `bookmarks`)
8. Calendars (slug: `calendars`)
9. Door Hangers (slug: `door-hangers`)
10. Envelopes (slug: `envelopes`)
11. Letterhead (slug: `letterhead`)
12. NCR Forms (slug: `ncr-forms`)
13. Notepads (slug: `notepads`)
14. Table Tents (slug: `table-tents`)
15. Counter Display Cards (slug: `counter-display-cards`)

To create a new category:

1. Go to "Product Categories" in Sanity Studio
2. Click "Create new document"
3. Fill in the title, slug (URL-friendly version of the title), and description
4. Save the document

### Step 2: Set Up Navigation Structure

1. Go to "Navigation Menu" in Sanity Studio
2. Edit the existing "Main Navigation" document (or create a new one if it doesn't exist)
3. Configure the navigation items as shown above
4. For the Products menu item, add a mega menu with the three sections as outlined above
5. Ensure all category links use the format `/products/category/[slug]`
6. Save the document

### Important Notes

- All links must follow the format `/products/category/[slug]` for category pages
- Each navigation item and link supports:
  - `isVisible` - to show/hide the item
  - `order` - to control the display order
  - `openInNewTab` - to control link behavior
- The frontend navigation component will automatically use this CMS-driven navigation structure

## Validation

Once the navigation and categories are set up, you can validate the following:

1. The `/products` page should show all categories
2. Each `/products/category/[slug]` page should show products in that category
3. The navigation in the header should reflect the structure defined in Sanity
4. All mega menu links should navigate to the correct category pages

## Frontend Implementation

The frontend navigation component has been updated to:

- Use the CMS-driven navigation structure from Sanity
- Ensure all category links use the correct URL pattern
- Provide a consistent experience across desktop and mobile views
- Support all required link properties (`isVisible`, `order`, `openInNewTab`)

If you need to make changes to the navigation structure, simply update it in Sanity Studio, and the frontend will automatically reflect these changes.
