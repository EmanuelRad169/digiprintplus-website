#!/usr/bin/env node

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'ski57HbdFyLtWwXmQVSv8yHYAaualTGelXvLaupzfVsBpWY6KTmKVNamVUOhb517Z16fD39I9aFBtW3pL',
})

// Demo product data
const demoProducts = [
  {
    _id: 'demo-premium-business-cards',
    _type: 'product',
    title: 'Premium Business Cards',
    slug: { current: 'premium-business-cards' },
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
    basePrice: 89,
    priceRange: {
      min: 89,
      max: 199
    },
    currency: 'USD',
    inStock: true,
    leadTime: '3-5 business days',
    status: 'active',
    rating: 4.8,
    reviewCount: 47,
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
    _id: 'demo-promotional-flyers',
    _type: 'product',
    title: 'Promotional Flyers',
    slug: { current: 'promotional-flyers' },
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
    basePrice: 45,
    priceRange: {
      min: 45,
      max: 150
    },
    currency: 'USD',
    inStock: true,
    leadTime: '1-3 business days',
    status: 'active',
    rating: 4.6,
    reviewCount: 32,
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
    _id: 'demo-tri-fold-brochures',
    _type: 'product',
    title: 'Tri-Fold Brochures',
    slug: { current: 'tri-fold-brochures' },
    description: 'Professional tri-fold brochures ideal for product catalogs, service overviews, and comprehensive marketing materials.',
    longDescription: [
      {
        _type: 'block',
        _key: 'desc3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span3',
            text: 'Showcase your products and services with professionally designed tri-fold brochures. Perfect for detailed information presentation and marketing campaigns.',
            marks: []
          }
        ]
      }
    ],
    basePrice: 125,
    priceRange: {
      min: 125,
      max: 250
    },
    currency: 'USD',
    inStock: true,
    leadTime: '3-5 business days',
    status: 'active',
    rating: 4.7,
    reviewCount: 28,
    features: [
      { _key: 'f9', feature: 'Professional folding', highlight: true },
      { _key: 'f10', feature: 'Premium paper options', highlight: false },
      { _key: 'f11', feature: 'Full-color printing', highlight: true },
      { _key: 'f12', feature: 'Multiple sizes available', highlight: false }
    ],
    tags: ['brochures', 'marketing', 'catalogs'],
    useCases: ['Product catalogs', 'Service overviews', 'Company information', 'Trade show materials']
  },
  {
    _id: 'demo-vinyl-banners',
    _type: 'product',
    title: 'Vinyl Banners',
    slug: { current: 'vinyl-banners' },
    description: 'Durable outdoor vinyl banners perfect for events, grand openings, and long-term outdoor advertising with weather-resistant materials.',
    longDescription: [
      {
        _type: 'block',
        _key: 'desc4',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span4',
            text: 'Make a big impact with our weather-resistant vinyl banners. Perfect for outdoor advertising, events, and promotional displays that need to withstand the elements.',
            marks: []
          }
        ]
      }
    ],
    basePrice: 75,
    priceRange: {
      min: 75,
      max: 300
    },
    currency: 'USD',
    inStock: true,
    leadTime: '2-4 business days',
    status: 'active',
    rating: 4.5,
    reviewCount: 19,
    features: [
      { _key: 'f13', feature: '13oz vinyl material', highlight: true },
      { _key: 'f14', feature: 'Weather-resistant', highlight: true },
      { _key: 'f15', feature: 'Grommets included', highlight: false },
      { _key: 'f16', feature: 'Custom sizes available', highlight: false }
    ],
    tags: ['banners', 'outdoor', 'events'],
    useCases: ['Grand openings', 'Outdoor events', 'Store signage', 'Construction sites']
  },
  {
    _id: 'demo-standard-postcards',
    _type: 'product',
    title: 'Standard Postcards',
    slug: { current: 'standard-postcards' },
    description: 'High-quality standard postcards perfect for direct mail campaigns, invitations, and promotional mailings with USPS-ready sizing.',
    longDescription: [
      {
        _type: 'block',
        _key: 'desc5',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span5',
            text: 'Reach your customers directly with professional postcards. Our standard postcards are USPS-ready and perfect for direct mail marketing campaigns.',
            marks: []
          }
        ]
      }
    ],
    basePrice: 35,
    priceRange: {
      min: 35,
      max: 120
    },
    currency: 'USD',
    inStock: true,
    leadTime: '1-3 business days',
    status: 'active',
    rating: 4.4,
    reviewCount: 41,
    features: [
      { _key: 'f17', feature: 'USPS mailing ready', highlight: true },
      { _key: 'f18', feature: 'UV coating protection', highlight: false },
      { _key: 'f19', feature: 'Bulk pricing available', highlight: true },
      { _key: 'f20', feature: 'Multiple size options', highlight: false }
    ],
    tags: ['postcards', 'direct-mail', 'marketing'],
    useCases: ['Direct mail campaigns', 'Event invitations', 'Promotional offers', 'Customer retention']
  },
  {
    _id: 'demo-perfect-bound-catalogs',
    _type: 'product',
    title: 'Perfect Bound Catalogs',
    slug: { current: 'perfect-bound-catalogs' },
    description: 'Professional perfect bound catalogs with square spine for comprehensive product showcases and detailed company publications.',
    longDescription: [
      {
        _type: 'block',
        _key: 'desc6',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span6',
            text: 'Showcase your entire product line with professional perfect bound catalogs. Features a square spine for professional appearance and high page count capacity.',
            marks: []
          }
        ]
      }
    ],
    basePrice: 185,
    priceRange: {
      min: 185,
      max: 450
    },
    currency: 'USD',
    inStock: true,
    leadTime: '5-7 business days',
    status: 'active',
    rating: 4.9,
    reviewCount: 15,
    features: [
      { _key: 'f21', feature: 'Professional square spine', highlight: true },
      { _key: 'f22', feature: 'High page count capacity', highlight: true },
      { _key: 'f23', feature: 'Premium binding quality', highlight: false },
      { _key: 'f24', feature: 'Full-color throughout', highlight: false }
    ],
    tags: ['catalogs', 'perfect-bound', 'professional'],
    useCases: ['Product catalogs', 'Annual reports', 'Lookbooks', 'Company portfolios']
  }
]

async function seedDemoProducts() {
  try {
    console.log('🌱 Seeding demo product data...')
    
    // Check if demo products already exist
    const existingProducts = await client.fetch('*[_id in $ids]._id', {
      ids: demoProducts.map(p => p._id)
    })
    
    if (existingProducts.length > 0) {
      console.log(`⚠️  Found ${existingProducts.length} existing demo products. Skipping seed to avoid duplicates.`)
      console.log('   To reseed, delete existing demo products first or use different IDs.')
      return
    }
    
    console.log(`📦 Creating ${demoProducts.length} demo products...`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const product of demoProducts) {
      try {
        await client.create(product)
        console.log(`✅ Created: ${product.title}`)
        successCount++
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error) {
        console.error(`❌ Failed to create ${product.title}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Demo product seeding completed!`)
    console.log(`✅ Successfully created: ${successCount} products`)
    console.log(`❌ Failed to create: ${errorCount} products`)
    
    if (successCount > 0) {
      console.log(`\n🔄 Products created as drafts. Remember to publish them in Sanity Studio!`)
      console.log(`📝 Demo product IDs for reference:`)
      demoProducts.forEach(p => console.log(`   - ${p._id}: ${p.title}`))
    }
    
  } catch (error) {
    console.error('❌ Error during seeding process:', error.message)
  }
}

// Run the seeding
seedDemoProducts()
