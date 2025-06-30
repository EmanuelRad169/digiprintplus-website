#!/usr/bin/env node

const { createClient } = require('@sanity/client')

// Sanity client with write access
const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'ski57HbdFyLtWwXmQVSv8yHYAaualTGelXvLaupzfVsBpWY6KTmKVNamVUOhb517Z16fD39I9aFBtW3pL', // Replace with your write token
})

// Demo product data - Quote Only version
const demoProducts = [
  {
    _id: 'demo-business-cards-quote',
    _type: 'product',
    title: 'Premium Business Cards',
    slug: { current: 'premium-business-cards-quote' },
    description: 'High-quality premium business cards with luxury finishes and thick cardstock. Perfect for making a professional first impression.',
    longDescription: [
      {
        _type: 'block',
        _key: 'desc1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'Our premium business cards are crafted with the finest materials and attention to detail. Choose from various luxury finishes including matte, gloss, and textured options.',
            marks: []
          }
        ]
      }
    ],
    inStock: true,
    leadTime: '3-5 business days',
    status: 'active',
    rating: 4.8,
    reviewCount: 47,
    specs: [
      { _key: 's1', name: 'Size', value: '3.5" x 2"' },
      { _key: 's2', name: 'Stock', value: '16pt, 18pt, or 32pt' },
      { _key: 's3', name: 'Printing', value: 'Full-color both sides' },
      { _key: 's4', name: 'Finish Options', value: 'Matte, Gloss, Spot UV, Soft Touch' }
    ],
    quoteOptions: [
      { _key: 'qo1', name: 'Stock Weight', description: 'Choose between standard 16pt, premium 18pt, or luxury 32pt stock', required: true },
      { _key: 'qo2', name: 'Finish', description: 'Matte, Gloss, Spot UV, or Soft Touch Laminate', required: true },
      { _key: 'qo3', name: 'Quantity', description: 'Standard quantities from 250 to 5000', required: true },
      { _key: 'qo4', name: 'Special Finishes', description: 'Optional foil stamping, embossing, or die cutting', required: false }
    ],
    formLink: '/quote?product=premium-business-cards-quote',
    quoteRequestFormId: 'business-cards-form',
    features: [
      { _key: 'f1', feature: '18pt premium cardstock', highlight: true },
      { _key: 'f2', feature: 'Multiple finish options', highlight: false },
      { _key: 'f3', feature: 'Custom design service', highlight: true },
      { _key: 'f4', feature: 'Fast turnaround', highlight: false }
    ],
    tags: ['business-cards', 'premium', 'professional'],
    useCases: ['Networking events', 'Client meetings', 'Trade shows', 'Professional branding']
  },
  {
    _id: 'demo-promotional-flyers-quote',
    _type: 'product',
    title: 'Promotional Flyers',
    slug: { current: 'promotional-flyers-quote' },
    description: 'Eye-catching promotional flyers perfect for marketing campaigns, events, and business promotions with vibrant full-color printing.',
    longDescription: [
      {
        _type: 'block',
        _key: 'desc2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span2',
            text: 'Get your message across with stunning promotional flyers. Available in multiple sizes with professional full-color printing on quality paper stock.',
            marks: []
          }
        ]
      }
    ],
    inStock: true,
    leadTime: '1-3 business days',
    status: 'active',
    rating: 4.6,
    reviewCount: 32,
    specs: [
      { _key: 's1', name: 'Sizes', value: '8.5" x 11", 5.5" x 8.5", 4" x 6"' },
      { _key: 's2', name: 'Stock', value: '80# to 100# Gloss Text or Cover' },
      { _key: 's3', name: 'Printing', value: 'Full-color one or both sides' },
      { _key: 's4', name: 'Finish Options', value: 'Gloss or Matte Aqueous Coating' }
    ],
    quoteOptions: [
      { _key: 'qo1', name: 'Size', description: 'Choose from standard 8.5" x 11", half-sheet 5.5" x 8.5", or postcard size 4" x 6"', required: true },
      { _key: 'qo2', name: 'Paper Stock', description: 'Text weight or heavier cover stock in various finishes', required: true },
      { _key: 'qo3', name: 'Quantity', description: 'Quantities from 100 to 10,000+', required: true },
      { _key: 'qo4', name: 'Print Sides', description: '1-sided or 2-sided printing', required: true },
      { _key: 'qo5', name: 'Folding', description: 'Optional bi-fold, tri-fold, or z-fold', required: false }
    ],
    formLink: '/quote?product=promotional-flyers-quote',
    quoteRequestFormId: 'flyers-form',
    features: [
      { _key: 'f5', feature: 'Full-color printing', highlight: true },
      { _key: 'f6', feature: 'Multiple size options', highlight: false },
      { _key: 'f7', feature: 'Bulk pricing available', highlight: true },
      { _key: 'f8', feature: 'Fast turnaround', highlight: false }
    ],
    tags: ['flyers', 'marketing', 'promotional'],
    useCases: ['Marketing campaigns', 'Event promotion', 'Sales announcements', 'Grand openings']
  },
  {
    _id: 'demo-postcards-quote',
    _type: 'product',
    title: 'Custom Postcards',
    slug: { current: 'custom-postcards-quote' },
    description: 'High-quality postcards perfect for direct mail, announcements, promotions, and invitations.',
    longDescription: [
      {
        _type: 'block',
        _key: 'desc3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span3',
            text: 'Make a lasting impression with our custom postcards. Ideal for direct mail marketing, promotions, event invitations, and announcements. Choose from various sizes and finishes to match your brand.',
            marks: []
          }
        ]
      }
    ],
    inStock: true,
    leadTime: '2-4 business days',
    status: 'active',
    rating: 4.7,
    reviewCount: 28,
    specs: [
      { _key: 's1', name: 'Sizes', value: '4" x 6", 5" x 7", 6" x 9"' },
      { _key: 's2', name: 'Stock', value: '14pt or 16pt Cardstock' },
      { _key: 's3', name: 'Printing', value: 'Full-color both sides' },
      { _key: 's4', name: 'Finish Options', value: 'UV Coating, Matte, or Uncoated' }
    ],
    quoteOptions: [
      { _key: 'qo1', name: 'Size', description: 'Standard 4" x 6", Medium 5" x 7", or Large 6" x 9"', required: true },
      { _key: 'qo2', name: 'Paper Stock', description: '14pt or 16pt premium cardstock', required: true },
      { _key: 'qo3', name: 'Quantity', description: 'Quantities from 100 to 25,000+', required: true },
      { _key: 'qo4', name: 'Coating', description: 'UV High Gloss, Matte, or Uncoated', required: true },
      { _key: 'qo5', name: 'Mailing Services', description: 'Optional addressing and mailing services', required: false }
    ],
    formLink: '/quote?product=custom-postcards-quote',
    quoteRequestFormId: 'postcards-form',
    features: [
      { _key: 'f1', feature: 'Premium cardstock', highlight: true },
      { _key: 'f2', feature: 'Mailing service available', highlight: true },
      { _key: 'f3', feature: 'USPS compliant sizes', highlight: false },
      { _key: 'f4', feature: 'Quick turnaround', highlight: false }
    ],
    tags: ['postcards', 'direct-mail', 'marketing'],
    useCases: ['Direct mail campaigns', 'Event invitations', 'Promotional offers', 'Announcements']
  }
]

async function createDemoProducts() {
  console.log('🌱 Starting to seed demo products (quote-only version)...')

  try {
    // First check if any products already exist
    const existingProducts = await client.fetch('*[_type == "product"]')
    console.log(`Found ${existingProducts.length} existing products`)

    // Create or update each demo product
    for (const product of demoProducts) {
      // Fetch product category by slug
      const categorySlug = getProductCategoryFromTags(product.tags)
      if (categorySlug) {
        const category = await client.fetch(`*[_type == "productCategory" && slug.current == $slug][0]`, {
          slug: categorySlug
        })

        if (category) {
          console.log(`Found category ${category.title} for product ${product.title}`)
          // Add category reference to product
          product.category = {
            _type: 'reference',
            _ref: category._id
          }
        } else {
          console.log(`Could not find category with slug ${categorySlug} for product ${product.title}`)
        }
      }

      // Check if product already exists
      const existingProduct = await client.fetch(`*[_type == "product" && _id == $id][0]`, {
        id: product._id
      })

      if (existingProduct) {
        console.log(`Updating existing product: ${product.title}`)
        await client.patch(product._id)
          .set(product)
          .commit()
      } else {
        console.log(`Creating new product: ${product.title}`)
        await client.create(product)
      }
    }

    console.log('✅ Demo products (quote-only) created successfully!')
  } catch (error) {
    console.error('Error creating demo products:', error.message)
    console.error(error)
  }
}

// Helper function to get category slug from product tags
function getProductCategoryFromTags(tags) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return null
  
  // Map of common tag names to category slugs
  const tagToSlugMap = {
    'business-cards': 'business-cards',
    'flyers': 'flyers-brochures',
    'brochures': 'flyers-brochures',
    'postcards': 'postcards',
    'booklets': 'booklets',
    'letterhead': 'letterhead',
    'envelopes': 'envelopes',
    'door-hangers': 'door-hangers',
    'calendars': 'calendars',
    'bookmarks': 'bookmarks',
    'ncr-forms': 'ncr-forms',
    'notepads': 'notepads',
    'table-tents': 'table-tents',
    'counter-display-cards': 'counter-display-cards',
    'announcement-cards': 'announcement-cards',
    'catalogs': 'catalogs'
  }
  
  // Find the first tag that matches a category
  for (const tag of tags) {
    if (tagToSlugMap[tag]) {
      return tagToSlugMap[tag]
    }
  }
  
  return null
}

// Run the script
createDemoProducts()
