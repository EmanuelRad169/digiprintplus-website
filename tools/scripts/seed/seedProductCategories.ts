import { sanityClient } from '../apps/web/lib/sanity'
import type { Category, SeedResult } from './types'

interface CategoryData extends Category {
  icon?: string
  order?: number
}

const productCategoriesData: CategoryData[] = [
  {
    _id: 'category-business-cards',
    _type: 'productCategory',
    title: 'Business Cards',
    slug: {
      _type: 'slug',
      current: 'business-cards'
    },
    description: 'Professional business cards that make a lasting impression',
    icon: 'credit-card',
    order: 1
  },
  {
    _id: 'category-flyers',
    _type: 'productCategory',
    title: 'Flyers & Brochures',
    slug: {
      _type: 'slug',
      current: 'flyers'
    },
    description: 'Eye-catching marketing materials to promote your business',
    icon: 'file-text',
    order: 2
  },
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
    _id: 'category-banners',
    _type: 'productCategory',
    title: 'Banners & Signs',
    slug: {
      _type: 'slug',
      current: 'banners'
    },
    description: 'Large format printing for events and displays',
    icon: 'image',
    order: 6
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

export async function seedProductCategories(): Promise<SeedResult> {
  try {
    console.log('🌱 Seeding product categories...')
    
    for (const categoryData of productCategoriesData) {
      // Check if category already exists
      const existingCategory = await sanityClient.fetch(
        `*[_type == "productCategory" && slug.current == $slug][0]`,
        { slug: categoryData.slug.current }
      )
      
      if (existingCategory) {
        console.log(`📁 Updating category: ${categoryData.title}`)
        // Remove _id from update data since it's immutable
        const { _id, ...updateData } = categoryData
        await sanityClient.patch(existingCategory._id).set(updateData).commit()
      } else {
        console.log(`📁 Creating category: ${categoryData.title}`)
        await sanityClient.create(categoryData)
      }
    }
    
    console.log('✅ Product categories seeded successfully!')
    
    return {
      success: true,
      documentsCreated: productCategoriesData.length
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error seeding product categories:', errorMessage)
    return {
      success: false,
      documentsCreated: 0,
      errors: [errorMessage]
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedProductCategories()
    .then((result) => {
      if (result.success) {
        console.log(`✅ Successfully seeded ${result.documentsCreated} categor(ies)`)
        process.exit(0)
      } else {
        console.error('❌ Seeding failed:', result.errors?.join(', '))
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('❌ Unexpected error:', error)
      process.exit(1)
    })
}
