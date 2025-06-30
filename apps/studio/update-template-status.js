#!/usr/bin/env node

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN
})

async function updateTemplatesWithStatus() {
  try {
    console.log('Updating templates with status field...')
    
    // Fetch all templates without status
    const templates = await client.fetch(`*[_type == "template" && !defined(status)]`)
    
    console.log(`Found ${templates.length} templates to update`)
    
    for (const template of templates) {
      await client
        .patch(template._id)
        .set({ status: 'published' })
        .commit()
      
      console.log(`Updated template: ${template.title}`)
    }
    
    console.log('Templates updated successfully!')
  } catch (error) {
    console.error('Error updating templates:', error)
  }
}

async function updateCategoriesWithStatus() {
  try {
    console.log('Updating template categories with status field...')
    
    // Fetch all categories without status
    const categories = await client.fetch(`*[_type == "templateCategory" && !defined(status)]`)
    
    console.log(`Found ${categories.length} categories to update`)
    
    for (const category of categories) {
      await client
        .patch(category._id)
        .set({ status: 'published' })
        .commit()
      
      console.log(`Updated category: ${category.title}`)
    }
    
    console.log('Categories updated successfully!')
  } catch (error) {
    console.error('Error updating categories:', error)
  }
}

async function main() {
  await updateCategoriesWithStatus()
  await updateTemplatesWithStatus()
  console.log('All updates completed!')
}

main()
