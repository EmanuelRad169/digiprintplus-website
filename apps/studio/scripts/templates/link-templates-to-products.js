const { createClient } = require('@sanity/client')

import { sanityClient } from '../../scripts/utils/sanityClient.js'

async function linkTemplatesToProducts() {
  try {
    console.log('🔗 Linking templates to products...')
    
    // Get templates and products
    const templates = await sanityClient.fetch('*[_type == "template"]{ _id, title, category->{ title, slug } }')
    const products = await sanityClient.fetch('*[_type == "product"]{ _id, title, category->{ title, slug } }')
    
    console.log(`Found ${templates.length} templates and ${products.length} products`)
    
    // Find business card templates
    const businessCardTemplates = templates.filter(t => 
      t.category?.slug?.current === 'business-cards'
    )
    
    // Find flyer/brochure templates
    const flyerTemplates = templates.filter(t => 
      t.category?.slug?.current === 'flyers-brochures'
    )
    
    // Find banner templates
    const bannerTemplates = templates.filter(t => 
      t.category?.slug?.current === 'banners-posters'
    )
    
    // Find stationery templates
    const stationeryTemplates = templates.filter(t => 
      t.category?.slug?.current === 'stationery'
    )
    
    console.log('📊 Template breakdown:')
    console.log(`   - Business Cards: ${businessCardTemplates.length}`)
    console.log(`   - Flyers/Brochures: ${flyerTemplates.length}`)
    console.log(`   - Banners: ${bannerTemplates.length}`)
    console.log(`   - Stationery: ${stationeryTemplates.length}`)
    
    // Link templates to related products
    const updates = []
    
    for (const product of products) {
      let templatesToLink = []
      
      // Business card products get business card templates
      if (product.title?.toLowerCase().includes('business card') || 
          product.category?.title?.toLowerCase().includes('business')) {
        templatesToLink = [...businessCardTemplates]
      }
      
      // Flyer/brochure products
      if (product.title?.toLowerCase().includes('flyer') || 
          product.title?.toLowerCase().includes('brochure') ||
          product.category?.title?.toLowerCase().includes('flyer')) {
        templatesToLink = [...flyerTemplates]
      }
      
      // Banner products
      if (product.title?.toLowerCase().includes('banner') || 
          product.title?.toLowerCase().includes('poster') ||
          product.category?.title?.toLowerCase().includes('banner')) {
        templatesToLink = [...bannerTemplates]
      }
      
      // Stationery products
      if (product.title?.toLowerCase().includes('letterhead') || 
          product.title?.toLowerCase().includes('stationery') ||
          product.category?.title?.toLowerCase().includes('stationery')) {
        templatesToLink = [...stationeryTemplates]
      }
      
      // If no specific match, add some general templates
      if (templatesToLink.length === 0) {
        templatesToLink = [
          ...businessCardTemplates.slice(0, 1),
          ...flyerTemplates.slice(0, 1)
        ]
      }
      
      if (templatesToLink.length > 0) {
        const templateRefs = templatesToLink.map(t => ({
          _type: 'reference',
          _ref: t._id
        }))
        
        updates.push({
          productId: product._id,
          productTitle: product.title,
          templateCount: templatesToLink.length,
          templateRefs
        })
      }
    }
    
    console.log(`\n🎯 Will update ${updates.length} products with template relationships`)
    
    // Execute updates
    for (const update of updates) {
      try {
        await sanityClient
          .patch(update.productId)
          .set({ templates: update.templateRefs })
          .commit()
        
        console.log(`✅ Updated "${update.productTitle}" with ${update.templateCount} templates`)
      } catch (error) {
        console.log(`❌ Failed to update "${update.productTitle}":`, error.message)
      }
    }
    
    console.log('\n🎉 Template-product linking completed!')
    console.log('\n🎯 Test the integration:')
    console.log('   1. Visit http://localhost:3000/products to see product listings')
    console.log('   2. Click on any product to see the "Related Templates" tab')
    console.log('   3. Visit http://localhost:3000/templates to see all templates')
    
  } catch (error) {
    console.error('❌ Error linking templates to products:', error)
  }
}

if (require.main === module) {
  linkTemplatesToProducts()
}

module.exports = linkTemplatesToProducts
