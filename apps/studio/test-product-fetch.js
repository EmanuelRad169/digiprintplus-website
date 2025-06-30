#!/usr/bin/env node

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'ski57HbdFyLtWwXmQVSv8yHYAaualTGelXvLaupzfVsBpWY6KTmKVNamVUOhb517Z16fD39I9aFBtW3pL',
})

async function testProductFetch() {
  try {
    console.log('🔍 Testing product fetch...')
    
    const query = `*[_type == "product" && status == "active"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      basePrice,
      priceRange,
      currency,
      inStock,
      leadTime,
      rating,
      reviewCount,
      features[0..2] {
        feature,
        highlight
      },
      tags
    }`
    
    const products = await client.fetch(query)
    
    console.log(`📄 Found ${products.length} active products:`)
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.title}`)
      console.log(`   ID: ${product._id}`)
      console.log(`   Slug: ${product.slug?.current || 'No slug'}`)
      console.log(`   Price: $${product.basePrice || 'N/A'}`)
      console.log(`   Currency: ${product.currency || 'Not set'}`)
      console.log(`   In Stock: ${product.inStock ? 'Yes' : 'No'}`)
      console.log(`   Features: ${product.features?.length || 0}`)
    })
    
  } catch (error) {
    console.error('❌ Error fetching products:', error.message)
  }
}

testProductFetch()
