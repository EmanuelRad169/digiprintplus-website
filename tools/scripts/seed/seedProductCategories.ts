import { sanityClient } from '../../sanityClient'
import type { CategoryData, SeedResult } from './types'

export async function seedProductCategories(): Promise<SeedResult> {
  const productCategoriesData: CategoryData[] = [
    {
      _id: 'category-business-cards',
      _type: 'productCategory',
      title: 'Business Cards',
      slug: { _type: 'slug', current: 'business-cards' },
      metaTitle: 'Business Cards - Professional Printing Services',
      metaDescription: 'High-quality business cards for your professional needs'
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

  try {
    // Create/update each category
    for (const category of productCategoriesData) {
      await sanityClient.createOrReplace(category)
    }

    return {
      success: true,
      message: 'Product categories seeded successfully',
      documentsCreated: productCategoriesData.length,
      data: productCategoriesData
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to seed product categories',
      errors: [error instanceof Error ? error.message : String(error)]
    }
  }
}
