// Shared type definitions for scripts

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityReference {
  _type: 'reference'
  _ref: string
}

export interface Category {
  _id?: string
  _type: 'productCategory'
  title: string
  slug: SanitySlug
  description?: string
  image?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  parentCategory?: SanityReference
  subCategories?: SanityReference[]
}

export interface Product {
  _id?: string
  _type: 'product'
  title: string
  slug: SanitySlug
  description?: string
  longDescription?: any[] // Portable text blocks
  category?: SanityReference
  price?: {
    basePrice?: number
    currency?: string
  }
  specifications?: {
    name: string
    value: string
  }[]
  images?: {
    asset: {
      _ref: string
    }
    alt?: string
  }[]
  featured?: boolean
  popular?: boolean
  availability?: 'in-stock' | 'out-of-stock' | 'discontinued'
  features?: string[]
  useCases?: string[]
  tags?: string[]
  seo?: {
    title?: string
    description?: string
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

export interface NavigationItem {
  _key: string
  title: string
  url: string
  submenu?: NavigationSubItem[]
  megaMenu?: MegaMenuSection[]
  openInNewTab?: boolean
}

export interface NavigationSubItem {
  _key: string
  title: string
  url: string
}

export interface MegaMenuSection {
  _key: string
  sectionTitle: string
  links: MegaMenuLink[]
}

export interface MegaMenuLink {
  _key: string
  title: string
  href: string
  description?: string
}

export interface NavigationMenu {
  _id: 'mainNav'
  _type: 'navigationMenu'
  title: string
  items: NavigationItem[]
}

export interface Page {
  _id?: string
  _type: 'page'
  title: string
  slug: SanitySlug
  metaTitle?: string
  metaDescription?: string
  content?: any[] // Portable text blocks
  hero?: {
    title?: string
    subtitle?: string
    backgroundImage?: {
      asset: {
        _ref: string
      }
      alt?: string
    }
  }
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
}

export interface SiteSettings {
  _id: 'siteSettings'
  _type: 'siteSettings'
  title: string
  description?: string
  logo?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  contact?: {
    phone?: string
    email?: string
    address?: string
  }
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

export interface ImageAsset {
  _type: 'sanity.imageAsset'
  _id?: string
  url?: string
  originalFilename?: string
  size?: number
  metadata?: {
    dimensions?: {
      width: number
      height: number
    }
  }
}

// Utility types for Sanity operations
export interface SanityDocument {
  _id?: string
  _type: string
  _createdAt?: string
  _updatedAt?: string
  _rev?: string
}

// Script result types
export interface SeedResult {
  success: boolean
  documentsCreated?: number
  errors?: string[]
  message?: string
  data?: any
}

export interface VerificationResult {
  isValid: boolean
  documentCount: number
  missingDocuments?: string[]
  errors?: string[]
}
