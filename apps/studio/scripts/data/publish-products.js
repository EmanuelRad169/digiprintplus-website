#!/usr/bin/env node

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  token: 'ski57HbdFyLtWwXmQVSv8yHYAaualTGelXvLaupzfVsBpWY6KTmKVNamVUOhb517Z16fD39I9aFBtW3pL',
  useCdn: false,
  apiVersion: '2023-05-03',
})

async function publishAllProducts() {
  try {
    console.log('🔍 Finding draft products to publish...')
    
    // Find all draft products
    const draftProducts = await client.fetch(`*[_type == "product" && _id match "drafts.*"]`)
    
    console.log(`📄 Found ${draftProducts.length} draft products to publish.`)
    
    if (draftProducts.length === 0) {
      console.log('✅ No draft products found to publish.')
      return
    }
    
    let successCount = 0
    let errorCount = 0
    
    for (const draftDoc of draftProducts) {
      try {
        const draftId = draftDoc._id
        const publishedId = draftId.replace('drafts.', '')
        
        console.log(`🚀 Publishing: ${publishedId}`)
        
        // Create the published version (without the drafts. prefix)
        const publishedDoc = {
          ...draftDoc,
          _id: publishedId,
        }
        
        // Remove draft-specific fields
        delete publishedDoc._rev
        
        // Use transaction to safely publish
        await client
          .transaction()
          .delete(publishedId) // Delete existing published version if it exists
          .createIfNotExists(publishedDoc) // Create the published version
          .delete(draftId) // Delete the draft
          .commit()
        
        console.log(`✅ Published: ${publishedId}`)
        successCount++
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error) {
        console.error(`❌ Failed to publish ${draftDoc._id}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Publishing completed!`)
    console.log(`✅ Successfully published: ${successCount} products`)
    console.log(`❌ Failed to publish: ${errorCount} products`)
    
    if (successCount > 0) {
      console.log(`\n🔄 Please refresh your Sanity Studio to see the published products.`)
    }
    
  } catch (error) {
    console.error('❌ Error during publishing process:', error.message)
  }
}

// Run the publishing
publishAllProducts()
