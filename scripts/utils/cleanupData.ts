// Cleanup script to remove duplicate/broken documents
import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'

async function cleanupData() {
  console.log('🧹 Starting data cleanup...\n')

  try {
    // First, update any products that reference the old broken category
    console.log('� Updating product references...')
    const productsWithBrokenCategoryRef = await sanityClient.fetch(`
      *[_type == "product" && category._ref == "cat_businessCards"]
    `)
    for (const product of productsWithBrokenCategoryRef) {
      console.log(`🔄 Updating product: ${product.title || product.name}`)
      await sanityClient.patch(product._id).set({
        category: { _type: 'reference', _ref: 'category-business-cards' }
      }).commit()
    }

    // Remove duplicate/broken products
    console.log('\n📦 Cleaning up products...')
    const brokenProducts = await sanityClient.fetch(`*[_type == "product" && (title == null || name != null)]`)
    for (const product of brokenProducts) {
      console.log(`❌ Removing broken/duplicate product: ${product._id} (${product.title || product.name || 'Unknown'})`)
      await sanityClient.delete(product._id)
    }

    // Remove duplicate/broken categories
    console.log('\n� Cleaning up product categories...')
    const brokenCategories = await sanityClient.fetch(`*[_type == "productCategory" && name == null]`)
    for (const category of brokenCategories) {
      console.log(`❌ Removing broken category: ${category._id}`)
      await sanityClient.delete(category._id)
    }

    console.log('\n✅ Data cleanup completed!')

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  }
}

cleanupData()
