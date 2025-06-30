# 🎯 MANUAL MEGA MENU SETUP GUIDE

## How to Restore Your Product Mega Menu in Sanity Studio

### Step 1: Open Sanity Studio

1. Make sure Sanity Studio is running at http://localhost:3334
2. Navigate to **Navigation Menu** in the studio

### Step 2: Edit the Main Navigation

1. Find and open the "Main Navigation" document
2. Click on the **"Products"** navigation item
3. Scroll down to find the **"Mega Menu"** section

### Step 3: Add Mega Menu Sections

Add these 3 sections with their respective links:

#### 📦 **Section 1: Popular Categories**

- **Section Title:** "Popular Categories"
- **Section Description:** "Our most requested printing services"
- **Links:**
  1. **All Products** → `/products` (Browse our full catalog)
  2. **Business Cards** → `/products/category/business-cards`
  3. **Announcement Cards** → `/products/category/announcement-cards`
  4. **Booklets** → `/products/category/booklets`
  5. **Bookmarks** → `/products/category/bookmarks`
  6. **Calendars** → `/products/category/calendars`

#### 🏢 **Section 2: Business Essentials**

- **Section Title:** "Business Essentials"
- **Section Description:** "Essential materials for your business"
- **Links:**
  1. **Counter Display Cards** → `/products/category/counter-display-cards`
  2. **Door Hangers** → `/products/category/door-hangers`
  3. **Envelopes** → `/products/category/envelopes`
  4. **Flyers & Brochures** → `/products/category/flyers-and-brochures`

#### ⭐ **Section 3: Specialty Items**

- **Section Title:** "Specialty Items"
- **Section Description:** "Unique printing solutions"
- **Links:**
  1. **NCR Forms** → `/products/category/ncr-forms`
  2. **Notepads** → `/products/category/notepads`
  3. **Postcards** → `/products/category/postcards`
  4. **Table Tents** → `/products/category/table-tents`
  5. **Catalogs** → `/products/category/catalogs`

### Step 4: Save Changes

1. Click **"Publish"** to save your changes
2. The mega menu will now appear on your website automatically!

### 🔍 **Your Existing Categories Found:**

Based on your Sanity data, you have these 14 product categories:

- business-cards, announcement-cards, booklets, bookmarks, calendars
- counter-display-cards, door-hangers, envelopes, flyers-and-brochures
- ncr-forms, notepads, postcards, table-tents, catalogs

All of these should be included in your mega menu structure above.

---

## ✅ **After Setup:**

Your website navigation will automatically display:

- 🖱️ **Desktop:** Hover over "Products" to see the 3-column mega menu
- 📱 **Mobile:** Tap "Products" to see an accordion with all categories
- 🎯 **Dynamic:** All links point to your existing product category pages

## 🚨 **Important:**

Make sure each category link uses the exact slug format: `/products/category/[slug]`
This ensures proper routing to your existing product category pages.
