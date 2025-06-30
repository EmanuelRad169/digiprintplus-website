/**
 * Migration script to populate the `additionalCategories` field
 * with the existing `category` field data.
 */

import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'your-project-id',
  dataset: 'your-dataset',
  token: 'your-token', // Replace with a token that has write access
  useCdn: false
})

async function migrateCategories() {
  try {
    // Fetch all products with the `category` field
    const products = await client.fetch('*[_type == "product"]{ _id, _rev, category }')

    for (const product of products) {
      if (product.category) {
        // Add the existing `category` to `additionalCategories`
        await client
          .patch(product._id)
          .setIfMissing({ additionalCategories: [] })
          .append('additionalCategories', [{ _type: 'reference', _ref: product.category._ref }])
          .commit()

        console.log(`Migrated product: ${product._id}`)
      }
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrateCategories()
