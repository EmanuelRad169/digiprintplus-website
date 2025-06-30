// Debug script to test template fetching
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
})

async function debugTemplates() {
  console.log('🔍 Debugging template data...')
  
  try {
    // Check all template documents
    const allTemplates = await client.fetch('*[_type == "template"]')
    console.log('\n📄 All template documents:')
    console.log(`Found ${allTemplates.length} template documents`)
    allTemplates.forEach(template => {
      console.log(`- ${template.title} (Status: ${template.status || 'no status'})`)
    })
    
    // Check published templates
    const publishedTemplates = await client.fetch('*[_type == "template" && status == "published"]')
    console.log('\n✅ Published templates:')
    console.log(`Found ${publishedTemplates.length} published templates`)
    publishedTemplates.forEach(template => {
      console.log(`- ${template.title}`)
    })
    
    // Check template categories
    const categories = await client.fetch('*[_type == "templateCategory"]')
    console.log('\n📁 Template categories:')
    console.log(`Found ${categories.length} categories`)
    categories.forEach(cat => {
      console.log(`- ${cat.title} (Status: ${cat.status || 'no status'})`)
    })
    
    // Check published categories
    const publishedCategories = await client.fetch('*[_type == "templateCategory" && status == "published"]')
    console.log('\n✅ Published categories:')
    console.log(`Found ${publishedCategories.length} published categories`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

debugTemplates()
