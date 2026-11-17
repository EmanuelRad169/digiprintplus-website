#!/usr/bin/env node

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
})

async function validatePublishedProducts() {
  try {
    console.log('🔍 Validating published products...')
    
    // Fetch only published products (no drafts)
    const products = await client.fetch('*[_type == "product" && !(_id match "drafts.*")]')
    
    console.log(`📄 Found ${products.length} published products to validate`)
    
    let validProducts = 0
    let invalidProducts = 0
    
    for (const product of products) {
      console.log(`\n📋 Validating: ${product._id}`)
      
      if (product.features && Array.isArray(product.features)) {
        let isValid = true
        
        for (let i = 0; i < product.features.length; i++) {
          const feature = product.features[i]
          
          if (typeof feature !== 'object' || !feature._key || !feature.feature) {
            console.log(`  ❌ Invalid feature[${i}]:`, feature)
            isValid = false
          } else {
            console.log(`  ✅ Valid feature[${i}]: ${feature.feature}`)
          }
        }
        
        if (isValid) {
          validProducts++
          console.log(`  ✅ Product features are valid`)
        } else {
          invalidProducts++
          console.log(`  ❌ Product has invalid features`)
        }
      } else {
        console.log(`  ℹ️  No features array found`)
        validProducts++
      }
    }
    
    console.log(`\n📊 Final Summary:`)
    console.log(`✅ Products with valid features: ${validProducts}`)
    console.log(`❌ Products with invalid features: ${invalidProducts}`)
    
    if (invalidProducts === 0) {
      console.log(`\n🎉 All published products have properly structured feature arrays!`)
    }
    
  } catch (error) {
    console.error('❌ Error during validation:', error.message)
  }
}

// Run validation
validatePublishedProducts()
