// Generated Sanity schema types
// Based on the schemas in apps/studio/schemas

export interface SanityAsset {
  _type: 'image' | 'file'
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions?: {
        width: number
        height: number
      }
      lqip?: string
    }
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

export interface ProductCategory extends SanityDocument {
  _type: 'productCategory'
  title: string
  slug: {
    current: string
  }
  description?: string
  image?: SanityAsset
  order?: number
}

export interface Product extends SanityDocument {
  _type: 'product'
  title: string
  slug: {
    current: string
  }
  description?: any[] // PortableText
  image?: SanityAsset
  gallery?: SanityAsset[]
  category?: {
    _ref: string
    _type: 'reference'
  }
  price?: number
  features?: string[]
  specifications?: {
    name: string
    value: string
  }[]
  seo?: {
    title?: string
    description?: string
    ogImage?: SanityAsset
  }
}

export interface Page extends SanityDocument {
  _type: 'page'
  title: string
  slug: {
    current: string
  }
  content?: any[] // PortableText
  heroImage?: SanityAsset
  seo?: {
    title?: string
    description?: string
    ogImage?: SanityAsset
  }
}

export interface HeroSlide extends SanityDocument {
  _type: 'heroSlide'
  title: string
  subtitle?: string
  description?: string
  image?: SanityAsset
  ctaText?: string
  ctaLink?: string
  order?: number
}

export interface Template extends SanityDocument {
  _type: 'template'
  title: string
  slug: {
    current: string
  }
  description?: string
  previewImage?: SanityAsset
  downloadFile?: SanityAsset
  category?: {
    _ref: string
    _type: 'reference'
  }
  isPremium?: boolean
  downloadCount?: number
}

export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings'
  title: string
  description?: string
  logo?: SanityAsset
  favicon?: SanityAsset
  seo?: {
    title?: string
    description?: string
    ogImage?: SanityAsset
  }
}

export interface NavigationMenu extends SanityDocument {
  _type: 'navigationMenu'
  title: string
  items?: NavigationItem[]
}

export interface NavigationItem {
  _type: 'navigationItem'
  title: string
  url?: string
  children?: NavigationItem[]
}

export interface IntegrationSettings extends SanityDocument {
  _type: 'integrationSettings'
  stripe?: {
    publishableKey?: string
    secretKey?: string
    webhookSecret?: string
  }
  sendgrid?: {
    apiKey?: string
    fromEmail?: string
    fromName?: string
  }
  analytics?: {
    googleAnalyticsId?: string
    gtmId?: string
    facebookPixelId?: string
  }
  crm?: {
    salesforceApiKey?: string
    hubspotApiKey?: string
    zendeskApiKey?: string
  }
  storage?: {
    awsAccessKey?: string
    awsSecretKey?: string
    awsBucket?: string
    awsRegion?: string
  }
  social?: {
    facebookUrl?: string
    twitterUrl?: string
    linkedinUrl?: string
    instagramUrl?: string
  }
}

// Union type of all document types
export type SanityDocumentType = 
  | ProductCategory
  | Product
  | Page
  | HeroSlide
  | Template
  | SiteSettings
  | NavigationMenu
  | IntegrationSettings
