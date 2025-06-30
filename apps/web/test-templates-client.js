// Test script to verify template fetching works client-side
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

// Simulate client-side environment (no token)
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: undefined, // No token like in browser
  useCdn: true,
  apiVersion: '2023-05-03',
  perspective: 'published'
})

async function testTemplates() {
  console.log('🧪 Testing template fetching without token (client-side simulation)...')
  
  try {
    // Test categories
    const categoriesQuery = `*[_type == "templateCategory" && status == "published"] | order(order asc, title asc) {
      _id,
      title,
      slug,
      description,
      order
    }`
    
    const categories = await client.fetch(categoriesQuery)
    console.log('📁 Template Categories Found:', categories.length)
    categories.forEach(cat => console.log(`  - ${cat.title} (${cat.slug.current})`))
    
    // Test templates
    const templatesQuery = `*[_type == "template" && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      status,
      publishedAt,
      category->{
        _id,
        title,
        slug
      }
    }`
    
    const templates = await client.fetch(templatesQuery)
    console.log('📄 Templates Found:', templates.length)
    templates.forEach(template => console.log(`  - ${template.title} (${template.status}) - Cat: ${template.category?.title || 'No category'}`))
    
    console.log('✅ Client-side template fetching works!')
    
  } catch (error) {
    console.error('❌ Error fetching templates:', error.message)
    console.error('Full error:', error)
  }
}

testTemplates()
