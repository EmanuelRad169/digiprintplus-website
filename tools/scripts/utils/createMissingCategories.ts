import { sanityClient } from '../apps/web/lib/sanity'

// First, let's create the missing categories
const missingCategories = [
  {
    _id: 'category-postcards',
    _type: 'productCategory',
    title: 'Postcards',
    slug: {
      _type: 'slug',
      current: 'postcards'
    },
    description: 'Direct mail postcards for marketing campaigns',
    icon: 'mail',
    order: 3
  },
  {
    _id: 'category-booklets',
    _type: 'productCategory',
    title: 'Booklets',
    slug: {
      _type: 'slug',
      current: 'booklets'
    },
    description: 'Multi-page booklets for detailed information',
    icon: 'book-open',
    order: 4
  },
  {
    _id: 'category-catalogs',
    _type: 'productCategory',
    title: 'Catalogs',
    slug: {
      _type: 'slug',
      current: 'catalogs'
    },
    description: 'Professional product catalogs and lookbooks',
    icon: 'library',
    order: 5
  },
  {
    _id: 'category-stationery',
    _type: 'productCategory',
    title: 'Stationery',
    slug: {
      _type: 'slug',
      current: 'stationery'
    },
    description: 'Professional letterheads, envelopes, and office materials',
    icon: 'file-type',
    order: 7
  }
]

export async function createMissingCategories() {
  try {
    console.log('🌱 Creating missing product categories...')
    
    for (const categoryData of missingCategories) {
      // Check if category already exists
      const existingCategory = await sanityClient.fetch(
        `*[_id == $id][0]`,
        { id: categoryData._id }
      )
      
      if (existingCategory) {
        console.log(`📁 Updating category: ${categoryData.title}`)
        const { _id, ...updateData } = categoryData
        await sanityClient.patch(existingCategory._id).set(updateData).commit()
      } else {
        console.log(`📁 Creating category: ${categoryData.title}`)
        await sanityClient.create(categoryData)
      }
    }
    
    console.log('✅ Missing categories created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating missing categories:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  createMissingCategories()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
