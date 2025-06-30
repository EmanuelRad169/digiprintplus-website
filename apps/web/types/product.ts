// Product types for Sanity CMS
import { Template } from '@/lib/sanity/fetchers'

export interface ProductImage {
  asset: {
    url: string
  }
  alt?: string
  caption?: string
}

export interface ProductSpecification {
  name: string
  value: string
  unit?: string
}

export interface QuoteOption {
  name: string
  description?: string
  required?: boolean
}

export interface ProductSlug {
  current: string
}

export interface ProductTestimonial {
  quote: string
  author: string
  company?: string
  rating?: number
}

export interface ProductFeature {
  feature?: string
}

export interface ProductPriceRange {
  min: number
  max: number
}

export interface ProductSEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

// New types for tabbed content
export interface ProductTemplate {
  hasTemplate?: boolean
  description?: string
  htmlEmbed?: string
  downloadFile?: {
    asset: {
      url: string
      originalFilename?: string
    }
  }
  previewImage?: ProductImage
}

export interface ProductFAQItem {
  question: string
  answer: string
}

export interface Product {
  _id: string
  title: string
  slug?: ProductSlug
  description?: string
  longDescription?: any[] // Portable text content
  image?: ProductImage
  gallery?: ProductImage[]
  videoUrl?: string
  status?: 'active' | 'coming-soon' | 'discontinued' | 'draft'
  category?: {
    _id: string
    title: string
    slug?: ProductSlug
  }
  tags?: string[]
  features?: (string | ProductFeature)[]
  useCases?: string[]
  specifications?: ProductSpecification[]
  quoteOptions?: QuoteOption[]
  formLink?: string
  quoteRequestFormId?: string
  testimonials?: ProductTestimonial[]
  certifications?: string[]
  inStock?: boolean
  leadTime?: string
  rating?: number
  reviewCount?: number
  qualityGuarantee?: boolean
  fastDelivery?: boolean
  awardWinning?: boolean
  popular?: boolean
  featured?: boolean
  newProduct?: boolean
  seo?: ProductSEO
  // New tabbed content fields
  template?: ProductTemplate
  detailedSpecs?: any[] // Portable text content for detailed specifications
  productDetails?: any[] // Portable text content for product details
  faq?: ProductFAQItem[]
  // Related templates
  templates?: Template[]
}

export interface ProductCategory {
  _id: string
  title: string
  slug?: ProductSlug
  description?: string
  products?: Product[]
}
