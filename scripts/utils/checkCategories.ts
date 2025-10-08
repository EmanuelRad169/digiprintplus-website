import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'
import type { Category } from './types'

interface CategoryResult {
  _id: string
  title: string
  slug: string
}

async function checkCategories(): Promise<void> {
  try {
    const categories: CategoryResult[] = await sanityClient.fetch(`*[_type == "productCategory"] {
      _id,
      title,
      "slug": slug.current
    }`)
    
    console.log('Existing categories:')
    categories.forEach((cat: CategoryResult) => {
      console.log(`- ID: ${cat._id}, Title: ${cat.title}, Slug: ${cat.slug}`)
    })
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error:', errorMessage)
  }
}

checkCategories()
