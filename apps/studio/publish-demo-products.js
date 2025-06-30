#!/usr/bin/env node

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'ski57HbdFyLtWwXmQVSv8yHYAaualTGelXvLaupzfVsBpWY6KTmKVNamVUOhb517Z16fD39I9aFBtW3pL',
})

async function publishDemoProducts() {
  try {
    console.log('🚀 Publishing demo products...')
    
    // Find draft demo products
    const draftDemoProducts = await client.fetch(`*[_id match "drafts.demo-*" && _type == "product"]`)
    
    console.log(`📄 Found ${draftDemoProducts.length} draft demo products to publish.`)
    
    if (draftDemoProducts.length === 0) {
      console.log('✅ No draft demo products found to publish.')
      return
    }
    
    let successCount = 0
    let errorCount = 0
    
    for (const draftDoc of draftDemoProducts) {
      try {
        const draftId = draftDoc._id
        const publishedId = draftId.replace('drafts.', '')
        
        console.log(`🚀 Publishing: ${publishedId}`)
        
        // Create the published version
        const publishedDoc = {
          ...draftDoc,
          _id: publishedId,
        }
        
        // Remove draft-specific fields
        delete publishedDoc._rev
        
        // Use transaction to safely publish
        await client
          .transaction()
          .delete(publishedId) // Delete existing if it exists
          .createIfNotExists(publishedDoc) // Create published version
          .delete(draftId) // Delete the draft
          .commit()
        
        console.log(`✅ Published: ${publishedDoc.title}`)
        successCount++
        
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error) {
        console.error(`❌ Failed to publish ${draftDoc.title}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Demo product publishing completed!`)
    console.log(`✅ Successfully published: ${successCount} products`)
    console.log(`❌ Failed to publish: ${errorCount} products`)
    
  } catch (error) {
    console.error('❌ Error during publishing process:', error.message)
  }
}

// Run the publishing
publishDemoProducts()
