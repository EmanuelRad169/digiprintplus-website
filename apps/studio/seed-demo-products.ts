#!/usr/bin/env ts-node

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'ski57HbdFyLtWwXmQVSv8yHYAaualTGelXvLaupzfVsBpWY6KTmKVNamVUOhb517Z16fD39I9aFBtW3pL',
})

interface ProductFeature {
  _key: string
  feature: string
  highlight: boolean
}

interface ProductData {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  description: string
  longDescription: Array<{
    _type: string
    _key: string
    style: string
    children: Array<{
      _type: string
      _key: string
      text: string
      marks: string[]
    }>
  }>
  basePrice: number
  priceRange: {
    min: number
    max: number
  }
  currency: string
  inStock: boolean
  leadTime: string
  status: string
  rating: number
  reviewCount: number
  features: ProductFeature[]
  tags: string[]
  useCases: string[]
}

// Demo product data with TypeScript types
const demoProducts: ProductData[] = [
  {
    _id: 'demo-premium-business-cards-ts',
    _type: 'product',
    title: 'Premium Business Cards (TypeScript)',
    slug: { current: 'premium-business-cards-ts' },
    description: 'High-quality premium business cards with luxury finishes and thick cardstock. Perfect for making a professional first impression.',
    longDescription: [
      {
        _type: 'block',
        _key: 'desc1-ts',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1-ts',
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
      { _key: 'f1-ts', feature: '18pt premium cardstock', highlight: true },
      { _key: 'f2-ts', feature: 'Multiple finish options', highlight: false },
      { _key: 'f3-ts', feature: 'Custom design service', highlight: true },
      { _key: 'f4-ts', feature: 'Fast turnaround', highlight: false }
    ],
    tags: ['business-cards', 'premium', 'professional', 'typescript'],
    useCases: ['Networking events', 'Client meetings', 'Trade shows', 'Professional branding']
  },
  {
    _id: 'demo-eco-friendly-flyers-ts',
    _type: 'product',
    title: 'Eco-Friendly Flyers (TypeScript)',
    slug: { current: 'eco-friendly-flyers-ts' },
    description: 'Environmentally responsible promotional flyers made from recycled materials with soy-based inks.',
    longDescription: [
      {
        _type: 'block',
        _key: 'desc2-ts',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span2-ts',
            text: 'Go green with our eco-friendly flyers! Made from 100% recycled paper and printed with environmentally safe soy-based inks.',
            marks: []
          }
        ]
      }
    ],
    basePrice: 55,
    priceRange: {
      min: 55,
      max: 175
    },
    currency: 'USD',
    inStock: true,
    leadTime: '2-4 business days',
    status: 'active',
    rating: 4.7,
    reviewCount: 23,
    features: [
      { _key: 'f5-ts', feature: '100% recycled paper', highlight: true },
      { _key: 'f6-ts', feature: 'Soy-based inks', highlight: true },
      { _key: 'f7-ts', feature: 'FSC certified', highlight: false },
      { _key: 'f8-ts', feature: 'Carbon neutral printing', highlight: false }
    ],
    tags: ['flyers', 'eco-friendly', 'recycled', 'sustainable', 'typescript'],
    useCases: ['Green marketing campaigns', 'Environmental events', 'Sustainable businesses', 'Eco-conscious promotions']
  }
]

async function seedDemoProductsTS(): Promise<void> {
  try {
    console.log('🌱 Seeding TypeScript demo product data...')
    
    // Check if demo products already exist
    const existingProducts = await client.fetch('*[_id in $ids]._id', {
      ids: demoProducts.map(p => p._id)
    })
    
    if (existingProducts.length > 0) {
      console.log(`⚠️  Found ${existingProducts.length} existing TypeScript demo products. Skipping seed to avoid duplicates.`)
      console.log('   To reseed, delete existing demo products first or use different IDs.')
      return
    }
    
    console.log(`📦 Creating ${demoProducts.length} TypeScript demo products...`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const product of demoProducts) {
      try {
        await client.create(product)
        console.log(`✅ Created: ${product.title}`)
        successCount++
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error: any) {
        console.error(`❌ Failed to create ${product.title}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 TypeScript demo product seeding completed!`)
    console.log(`✅ Successfully created: ${successCount} products`)
    console.log(`❌ Failed to create: ${errorCount} products`)
    
    if (successCount > 0) {
      console.log(`\n🔄 Products created. You can now access them via the products page!`)
      console.log(`📝 TypeScript demo product IDs for reference:`)
      demoProducts.forEach(p => console.log(`   - ${p._id}: ${p.title}`))
    }
    
  } catch (error: any) {
    console.error('❌ Error during TypeScript seeding process:', error.message)
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDemoProductsTS()
}
