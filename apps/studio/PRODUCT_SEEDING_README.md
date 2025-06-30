# Product Demo Data Scripts

This directory contains scripts to seed demo product data into your Sanity CMS and display them on the Next.js frontend.

## Scripts Available

### 1. JavaScript Seeding Script

**File:** `seed-demo-products.js`

Creates 6 demo products with realistic printing service data.

**Usage:**

```bash
cd apps/studio
node seed-demo-products.js
```

### 2. TypeScript Seeding Script

**File:** `seed-demo-products.ts`

Creates additional demo products with TypeScript type safety.

**Usage:**

```bash
cd apps/studio
npx ts-node seed-demo-products.ts
```

### 3. Publishing Script

**File:** `publish-demo-products.js`

Publishes draft demo products to make them available on the frontend.

**Usage:**

```bash
cd apps/studio
node publish-demo-products.js
```

### 4. Test Script

**File:** `test-product-fetch.js`

Tests the product fetching functionality and displays all active products.

**Usage:**

```bash
cd apps/studio
node test-product-fetch.js
```

## Demo Products Created

The seeding scripts create the following demo products:

### JavaScript Seeded Products:

1. **Premium Business Cards** - High-quality business cards with luxury finishes
2. **Promotional Flyers** - Eye-catching marketing flyers
3. **Tri-Fold Brochures** - Professional brochures for product catalogs
4. **Vinyl Banners** - Durable outdoor banners for events
5. **Standard Postcards** - USPS-ready postcards for direct mail
6. **Perfect Bound Catalogs** - Professional catalogs with square spine

### TypeScript Seeded Products:

1. **Premium Business Cards (TypeScript)** - TypeScript version with type safety
2. **Eco-Friendly Flyers (TypeScript)** - Sustainable flyers with recycled materials

## Product Schema Fields

Each demo product includes:

- **Basic Info:** title, slug, description, status, tags
- **Pricing:** basePrice, priceRange, currency, inStock, leadTime
- **Features:** Array of product features with highlight flags
- **Social Proof:** rating, reviewCount
- **Content:** longDescription (rich text), useCases

## Frontend Display

The products are displayed on the Next.js frontend at `/products` using:

- **Server-side rendering** with direct Sanity client calls
- **GROQ query:** `*[_type == "product" && status == "active"]`
- **Tailwind CSS** styling for responsive design
- **Product cards** showing title, description, price, features, and CTA buttons
- **Detail pages** at `/products/[slug]` for individual products

## Environment Setup

Make sure you have:

1. **Sanity Studio** running on port 3334
2. **Next.js frontend** running on port 3001 (or 3000)
3. **Environment variables** configured in `/apps/web/.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=as5tildt
   NEXT_PUBLIC_SANITY_DATASET=development
   SANITY_API_TOKEN=your_token_here
   ```

## Features Implemented

✅ **Demo data seeding** with realistic product information  
✅ **TypeScript support** for type-safe seeding  
✅ **Server-side rendering** for better SEO  
✅ **GROQ queries** for efficient data fetching  
✅ **Responsive design** with Tailwind CSS  
✅ **Product detail pages** with slug-based routing  
✅ **Error handling** for currency formatting and missing data  
✅ **Loading states** and empty states

## Next Steps

- Add product images to enhance visual appeal
- Implement product filtering and search functionality
- Add category-based navigation
- Create quote request forms for specific products
- Add product comparison features
