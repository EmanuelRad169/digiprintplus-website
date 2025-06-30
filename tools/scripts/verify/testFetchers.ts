import { getAboutPage, getPageBySlug, getProductBySlug, getProductCategories, getProductsByCategory, getFeaturedProducts } from '../apps/web/lib/sanity/fetchers'
import type { Category, Product } from './types'

interface FetchedCategory {
  _id?: string
  _type: 'productCategory'
  title: string
  slug?: {
    current: string
  }
}

interface FetchedProduct {
  _id?: string
  _type: 'product'
  title: string
  category?: {
    title: string
  }
  specifications?: any[]
  features?: any[]
}

async function testFetchers(): Promise<void> {
  console.log('Testing all fetchers...\n')
  
  // Test about page fetcher
  const aboutData = await getAboutPage('about')
  console.log('✅ About page data:', aboutData ? 'Found' : 'Not found')
  
  // Test generic page fetcher
  const contactData = await getPageBySlug('contact')
  console.log('✅ Contact page data:', contactData ? 'Found' : 'Not found')
  
  // Test product categories
  const categories: FetchedCategory[] = await getProductCategories()
  console.log(`✅ Product categories: ${categories.length} found`)
  categories.forEach((cat: FetchedCategory) => console.log(`   - ${cat.title} (${cat.slug?.current})`))
  
  // Test product by slug
  const product: FetchedProduct | null = await getProductBySlug('standard-business-cards')
  console.log('\n✅ Product by slug:', product ? `Found: ${product.title}` : 'Not found')
  if (product) {
    console.log(`   - Category: ${product.category?.title}`)
    console.log(`   - Specs: ${product.specifications?.length || 0} specifications`)
    console.log(`   - Features: ${product.features?.length || 0} features`)
  }
  
  // Test products by category
  const businessCards: FetchedProduct[] = await getProductsByCategory('business-cards')
  console.log(`\n✅ Business cards: ${businessCards.length} found`)
  businessCards.forEach((prod: FetchedProduct) => console.log(`   - ${prod.title}`))
  
  // Test featured products
  const featured: FetchedProduct[] = await getFeaturedProducts()
  console.log(`\n✅ Featured products: ${featured.length} found`)
  featured.forEach((prod: FetchedProduct) => console.log(`   - ${prod.title} (${prod.category?.title})`))
}

testFetchers().catch(console.error)
