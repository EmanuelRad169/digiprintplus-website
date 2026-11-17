#!/usr/bin/env node

const { createClient } = require('@sanity/client')

// Create client
const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
})

// Key generator
function generateKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Function to validate and fix array items
function validateAndFixArrays(obj, path = '') {
  let hasChanges = false
  
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        // Check if item needs a _key (for array items that aren't references)
        if (!item._key && !item._id && !item._ref && !item._type) {
          item._key = generateKey()
          hasChanges = true
          console.log(`  ✓ Added _key to ${path}[${index}]`)
        }
        
        // Check if item is supposed to be an object with specific structure
        if (item._key && typeof item === 'object') {
          // Validate common object patterns
          if (path.includes('specifications') && (!item.name || !item.value)) {
            console.log(`  ⚠️  Invalid specification at ${path}[${index}] - missing name or value`)
          }
          
          if (path.includes('features') && (!item.feature)) {
            console.log(`  ⚠️  Invalid feature at ${path}[${index}] - missing feature field`)
          }
          
          if (path.includes('testimonials') && (!item.quote || !item.name)) {
            console.log(`  ⚠️  Invalid testimonial at ${path}[${index}] - missing quote or name`)
          }
          
          if (path.includes('socialLinks') && (!item.platform || !item.url)) {
            console.log(`  ⚠️  Invalid social link at ${path}[${index}] - missing platform or url`)
          }
        }
        
        // Recursively check nested objects
        const nestedChanges = validateAndFixArrays(item, `${path}[${index}]`)
        if (nestedChanges) hasChanges = true
      } else if (typeof item !== 'string' && typeof item !== 'number' && item !== null) {
        console.log(`  ⚠️  Invalid item type at ${path}[${index}]: ${typeof item}`)
      }
    })
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      if (key !== '_id' && key !== '_type' && key !== '_rev' && key !== '_createdAt' && key !== '_updatedAt') {
        const nestedChanges = validateAndFixArrays(value, path ? `${path}.${key}` : key)
        if (nestedChanges) hasChanges = true
      }
    })
  }
  
  return hasChanges
}

async function validateDocuments() {
  try {
    console.log('🔍 Fetching all documents for validation...')
    
    // Fetch all documents
    const documents = await client.fetch('*[defined(_id)]')
    
    console.log(`📄 Found ${documents.length} documents to validate`)
    
    const problematicDocs = []
    const fixableDocs = []
    
    for (const doc of documents) {
      console.log(`\n📋 Validating: ${doc._id} (${doc._type})`)
      
      // Create a copy for validation
      const docCopy = JSON.parse(JSON.stringify(doc))
      const hasChanges = validateAndFixArrays(docCopy)
      
      if (hasChanges) {
        fixableDocs.push({ original: doc, fixed: docCopy })
        console.log(`  🔧 Document can be auto-fixed`)
      }
      
      // Check for specific validation issues
      let hasIssues = false
      
      // Check for invalid array items (non-objects where objects are expected)
      function checkArrayValidity(obj, objPath = '') {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            const itemPath = `${objPath}[${index}]`
            
            // Check if all items are consistent types
            if (typeof item === 'string' && objPath.includes('specifications')) {
              console.log(`  ❌ Invalid specification item at ${itemPath}: expected object, got string`)
              hasIssues = true
            }
            
            if (typeof item === 'string' && objPath.includes('features')) {
              console.log(`  ❌ Invalid feature item at ${itemPath}: expected object, got string`)
              hasIssues = true
            }
            
            if (typeof item === 'object' && item !== null) {
              checkArrayValidity(item, itemPath)
            }
          })
        } else if (typeof obj === 'object' && obj !== null) {
          Object.entries(obj).forEach(([key, value]) => {
            if (key !== '_id' && key !== '_type' && key !== '_rev') {
              checkArrayValidity(value, objPath ? `${objPath}.${key}` : key)
            }
          })
        }
      }
      
      checkArrayValidity(doc)
      
      if (hasIssues) {
        problematicDocs.push(doc)
      }
    }
    
    console.log(`\n📊 Validation Summary:`)
    console.log(`✅ Documents that can be auto-fixed: ${fixableDocs.length}`)
    console.log(`❌ Documents with serious issues: ${problematicDocs.length}`)
    
    if (fixableDocs.length > 0) {
      console.log(`\n🔧 Auto-fixing ${fixableDocs.length} documents...`)
      
      for (const { original, fixed } of fixableDocs) {
        try {
          await client.createOrReplace(fixed)
          console.log(`✅ Fixed: ${original._id}`)
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          console.error(`❌ Failed to fix ${original._id}:`, error.message)
        }
      }
    }
    
    if (problematicDocs.length > 0) {
      console.log(`\n⚠️  Documents requiring manual attention:`)
      problematicDocs.forEach(doc => {
        console.log(`- ${doc._id} (${doc._type})`)
      })
      console.log(`\nThese documents may have schema mismatches that need manual correction.`)
    }
    
    console.log(`\n🎉 Validation complete!`)
    
  } catch (error) {
    console.error('❌ Error during validation:', error.message)
  }
}

// Run validation
validateDocuments()
