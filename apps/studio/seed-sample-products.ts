// seed-sample-products.ts
// Usage: npx ts-node seed-sample-products.ts
// This script creates one sample product per print category in Sanity.
// IMPORTANT: After running, replace each category _ref with the real category document ID.

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  token: 'skgCo2tAqnOLe8PrRMrls005fTInU36pTmPG2CRHB0k05FhLP2as61ogjo9N3pCaw5ZQqe6utTe6lP9UcEha7jrNKFQSfOI1pJnH4SC3l0e0j76qGWoc9NEVzqI57SnKEhdAxfmNp99CSPCJuaQDN0NHgZnZVIodpPdNHZvfTJpwmNeDnOcO',
  apiVersion: '2023-01-01',
  useCdn: false,
})

const categories = [
  { name: 'Business Cards', ref: 'category-business-cards' },
  { name: 'Flyers & Brochures', ref: 'category-flyers-brochures' },
  { name: 'Postcards', ref: 'category-postcards' },
  { name: 'Announcement Cards', ref: 'category-announcement-cards' },
  { name: 'Booklets', ref: 'category-booklets' },
  { name: 'Catalogs', ref: 'category-catalogs' },
  { name: 'Bookmarks', ref: 'category-bookmarks' },
  { name: 'Calendars', ref: 'category-calendars' },
  { name: 'Door Hangers', ref: 'category-door-hangers' },
  { name: 'Envelopes', ref: 'category-envelopes' },
  { name: 'Letterhead', ref: 'category-letterhead' },
  { name: 'NCR Forms', ref: 'category-ncr-forms' },
  { name: 'Notepads', ref: 'category-notepads' },
  { name: 'Table Tents', ref: 'category-table-tents' },
  { name: 'Counter Display Cards', ref: 'category-counter-display-cards' },
]

const marketingDescriptions: Record<string, string> = {
  'Business Cards': 'Make a lasting impression with premium business cards.',
  'Flyers & Brochures': 'Promote your brand with vibrant flyers and brochures.',
  'Postcards': 'Send your message in style with custom postcards.',
  'Announcement Cards': 'Share big news with elegant announcement cards.',
  'Booklets': 'Showcase your content in professionally bound booklets.',
  'Catalogs': 'Display your products in stunning full-color catalogs.',
  'Bookmarks': 'Keep your brand top of mind with custom bookmarks.',
  'Calendars': 'Stay organized all year with personalized calendars.',
  'Door Hangers': 'Reach customers directly with eye-catching door hangers.',
  'Envelopes': 'Complete your stationery with branded envelopes.',
  'Letterhead': 'Enhance your correspondence with custom letterhead.',
  'NCR Forms': 'Streamline paperwork with multi-part NCR forms.',
  'Notepads': 'Jot down ideas on branded notepads.',
  'Table Tents': 'Promote specials with custom table tents.',
  'Counter Display Cards': 'Grab attention at the point of sale with display cards.',
}

async function seedProducts() {
  for (const cat of categories) {
    const title = `Sample ${cat.name}`
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const product = {
      _type: 'product',
      title,
      slug: { current: slug },
      description: marketingDescriptions[cat.name],
      category: { _type: 'reference', _ref: cat.ref }, // Replace _ref with real category _id after creation
      price: 29.99,
      isAvailable: true,
    }
    try {
      const res = await client.create(product)
      console.log(`Created product: ${res.title}`)
    } catch (err) {
      console.error(`Failed to create product for ${cat.name}:`, err)
    }
  }
}

seedProducts()
