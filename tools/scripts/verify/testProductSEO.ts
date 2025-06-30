// Test the updated Product type with extended SEO fields
import type { Product, SanitySlug, SanityReference } from './types'

// Test the extended SEO interface
const testProduct: Product = {
  _type: 'product',
  title: 'Test Product with Extended SEO',
  slug: {
    _type: 'slug',
    current: 'test-product-seo'
  } as SanitySlug,
  category: {
    _type: 'reference',
    _ref: 'category-test'
  } as SanityReference,
  featured: true,
  popular: false,
  seo: {
    // Original fields
    title: 'SEO Title',
    description: 'SEO Description',
    keywords: ['test', 'product', 'seo'],
    
    // New extended fields
    metaTitle: 'Extended Meta Title for Search Engines',
    metaDescription: 'Extended meta description with more detailed information for search results'
  }
}

console.log('✅ Product type with extended SEO fields compiles successfully!')
console.log('📋 Test product SEO fields:')
console.log('  - Title:', testProduct.seo?.title)
console.log('  - Description:', testProduct.seo?.description)
console.log('  - Meta Title:', testProduct.seo?.metaTitle)
console.log('  - Meta Description:', testProduct.seo?.metaDescription)
console.log('  - Keywords:', testProduct.seo?.keywords?.join(', '))

export { testProduct }
