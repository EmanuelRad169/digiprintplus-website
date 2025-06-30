import { createClient } from '@sanity/client'

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN, // Need a token with write access
  useCdn: false,
  apiVersion: '2023-05-03'
})

async function migrateCategories() {
  try {
    // Fetch all products with the category field
    const products = await client.fetch(`*[_type == "product"]{
      _id,
      _rev,
      title,
      category,
      "existingAdditionalCategories": additionalCategories
    }`)

    console.log(`Found ${products.length} products to check`)

    for (const product of products) {
      // Skip if the product has no category
      if (!product.category) {
        console.log(`Skipping product ${product.title || product._id} - no category`)
        continue
      }

      // Skip if additionalCategories already exists and has the category
      if (product.existingAdditionalCategories?.some(
        (cat: any) => cat._ref === product.category._ref
      )) {
        console.log(`Skipping product ${product.title || product._id} - category already in additionalCategories`)
        continue
      }

      // Create or update additionalCategories array
      const patch = client
        .patch(product._id)
        .setIfMissing({ additionalCategories: [] })
        
      // Only add the category if it's not already in additionalCategories
      if (!product.existingAdditionalCategories?.length) {
        patch.append('additionalCategories', [
          { _type: 'reference', _ref: product.category._ref }
        ])
      }

      await patch.commit()
      console.log(`Updated product ${product.title || product._id}`)
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run the migration
migrateCategories()
