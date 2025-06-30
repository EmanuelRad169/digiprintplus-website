import type { SanityDocumentStub } from '@sanity/client'

export interface SeedResult {
  success: boolean
  message: string
  documentsCreated?: number
  data?: any
  errors?: string[]
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityReference {
  _type: 'reference'
  _ref: string
}

export interface SEO {
  title?: string
  description?: string
  keywords?: string[]
  metaTitle: string
  metaDescription: string
}

export interface CategoryData extends SanityDocumentStub {
  _id: string
  _type: 'productCategory'
  title: string
  slug: SanitySlug
  metaTitle?: string
  metaDescription?: string
  description?: string
  parent?: SanityReference
  image?: {
    _type: 'image'
    asset: SanityReference
  }
}

export interface Product extends SanityDocumentStub {
  _id: string
  _type: 'product'
  title: string
  slug: SanitySlug
  description?: string
  specifications?: any[]
  featured?: boolean
  popular?: boolean
  category?: SanityReference
  seo?: SEO
}

export interface NavigationMenu extends SanityDocumentStub {
  _type: 'navigationMenu'
  title: string
  items: any[]
}

export interface VerificationResult {
  success: boolean
  message: string
  errors?: string[]
  details?: any
  isValid?: boolean
  documentCount?: number
  missingDocuments?: string[]
}

export type Category = CategoryData

// Test utilities
export const createTestProduct = (partial: Partial<Product> = {}): Product => ({
  _id: 'test-product',
  _type: 'product',
  title: 'Test Product',
  slug: { _type: 'slug', current: 'test-product' },
  seo: {
    title: 'Test Product',
    description: 'Test product description',
    keywords: ['test'],
    metaTitle: 'Test Product',
    metaDescription: 'Test product description'
  },
  ...partial
})

export const createTestCategory = (partial: Partial<CategoryData> = {}): CategoryData => ({
  _id: 'test-category',
  _type: 'productCategory',
  title: 'Test Category',
  slug: { _type: 'slug', current: 'test-category' },
  ...partial
})

export const createSeedResult = (partial: Partial<SeedResult> = {}): SeedResult => ({
  success: true,
  message: 'Operation successful',
  ...partial
})
