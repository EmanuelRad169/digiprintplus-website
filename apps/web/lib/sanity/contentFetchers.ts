import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: '2023-05-03'
})

// Export the client for use by other modules
export { client }

// Hero Slides
export interface HeroSlide {
  _id: string
  title: string
  subtitle: string
  description: string
  image?: {
    asset: {
      url: string
      metadata?: {
        dimensions: {
          width: number
          height: number
        }
      }
    }
    alt?: string
  }
  ctaText: string
  ctaLink: string
  stats: {
    number: string
    text: string
  }
  features: string[]
  order: number
  isActive: boolean
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const query = `
    *[_type == "heroSlide" && isActive == true] | order(order asc) {
      _id,
      title,
      subtitle,
      description,
      image {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt
      },
      ctaText,
      ctaLink,
      stats,
      features,
      order,
      isActive
    }
  `
  return await client.fetch(query)
}

// Services
export interface Service {
  _id: string
  title: string
  slug: { current: string }
  description: string
  content: any[]
  icon: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  features: string[]
  category: string
  isFeatured: boolean
  order: number
  isActive: boolean
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export async function getServices(): Promise<Service[]> {
  const query = `
    *[_type == "service" && isActive == true] | order(order asc) {
      _id,
      title,
      slug,
      description,
      content,
      icon,
      image {
        asset-> {
          url
        },
        alt
      },
      features,
      category,
      isFeatured,
      order,
      isActive,
      seo
    }
  `
  return await client.fetch(query)
}

export async function getFeaturedServices(): Promise<Service[]> {
  const query = `
    *[_type == "service" && isActive == true && isFeatured == true] | order(order asc) {
      _id,
      title,
      slug,
      description,
      content,
      icon,
      image {
        asset-> {
          url
        },
        alt
      },
      features,
      category,
      isFeatured,
      order,
      isActive,
      seo
    }
  `
  return await client.fetch(query)
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const query = `
    *[_type == "service" && slug.current == $slug && isActive == true][0] {
      _id,
      title,
      slug,
      description,
      content,
      icon,
      image {
        asset-> {
          url
        },
        alt
      },
      features,
      category,
      isFeatured,
      order,
      isActive,
      seo
    }
  `
  return await client.fetch(query, { slug })
}

// About Sections
export interface AboutSection {
  _id: string
  sectionType: string
  title: string
  subtitle?: string
  content: any[]
  statistics?: Array<{
    number: string
    label: string
    icon: string
  }>
  features?: Array<{
    title: string
    description: string
    highlight: string
    icon: string
  }>
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  order: number
  isActive: boolean
}

export async function getAboutSections(): Promise<AboutSection[]> {
  const query = `
    *[_type == "aboutSection" && isActive == true] | order(order asc) {
      _id,
      sectionType,
      title,
      subtitle,
      content,
      statistics,
      features,
      image {
        asset-> {
          url
        },
        alt
      },
      order,
      isActive
    }
  `
  return await client.fetch(query)
}

export async function getAboutSectionByType(sectionType: string): Promise<AboutSection | null> {
  const query = `
    *[_type == "aboutSection" && sectionType == $sectionType && isActive == true][0] {
      _id,
      sectionType,
      title,
      subtitle,
      content,
      statistics,
      features,
      image {
        asset-> {
          url
        },
        alt
      },
      order,
      isActive
    }
  `
  return await client.fetch(query, { sectionType })
}

// Contact Information
export interface ContactInfo {
  _id: string
  type: string
  title: string
  value: string
  displayText?: string
  description?: string
  icon: string
  link?: string
  isMainContact: boolean
  order: number
  isActive: boolean
}

export async function getContactInfo(): Promise<ContactInfo[]> {
  const query = `
    *[_type == "contactInfo" && isActive == true] | order(order asc) {
      _id,
      type,
      title,
      value,
      displayText,
      description,
      icon,
      link,
      isMainContact,
      order,
      isActive
    }
  `
  return await client.fetch(query)
}

export async function getMainContactInfo(): Promise<ContactInfo[]> {
  const query = `
    *[_type == "contactInfo" && isActive == true && isMainContact == true] | order(order asc) {
      _id,
      type,
      title,
      value,
      displayText,
      description,
      icon,
      link,
      isMainContact,
      order,
      isActive
    }
  `
  return await client.fetch(query)
}

// FAQ Items
export interface FAQItem {
  _id: string
  question: string
  answer: any[]
  category: string
  relatedProducts?: Array<{
    _id: string
    title: string
    slug: { current: string }
  }>
  isPopular: boolean
  order: number
  isActive: boolean
}

export async function getFAQItems(): Promise<FAQItem[]> {
  const query = `
    *[_type == "faqItem" && isActive == true] | order(order asc) {
      _id,
      question,
      answer,
      category,
      relatedProducts[]-> {
        _id,
        title,
        slug
      },
      isPopular,
      order,
      isActive
    }
  `
  return await client.fetch(query)
}

export async function getPopularFAQs(): Promise<FAQItem[]> {
  const query = `
    *[_type == "faqItem" && isActive == true && isPopular == true] | order(order asc) {
      _id,
      question,
      answer,
      category,
      relatedProducts[]-> {
        _id,
        title,
        slug
      },
      isPopular,
      order,
      isActive
    }
  `
  return await client.fetch(query)
}

export async function getFAQsByCategory(category: string): Promise<FAQItem[]> {
  const query = `
    *[_type == "faqItem" && category == $category && isActive == true] | order(order asc) {
      _id,
      question,
      answer,
      category,
      relatedProducts[]-> {
        _id,
        title,
        slug
      },
      isPopular,
      order,
      isActive
    }
  `
  return await client.fetch(query, { category })
}

// CTA Sections
export interface CTASection {
  _id: string
  title: string
  description: string
  primaryButton: {
    text: string
    link: string
  }
  secondaryButton?: {
    text: string
    link: string
    type: 'phone' | 'link'
  }
  highlights: string[]
  backgroundColor: 'magenta' | 'blue' | 'gray' | 'black'
  sectionId: string
  isActive: boolean
}

export async function getCTASections(): Promise<CTASection[]> {
  const query = `
    *[_type == "ctaSection" && isActive == true] | order(sectionId asc) {
      _id,
      title,
      description,
      primaryButton,
      secondaryButton,
      highlights,
      backgroundColor,
      sectionId,
      isActive
    }
  `
  return await client.fetch(query)
}

export async function getCTASectionById(sectionId: string): Promise<CTASection | null> {
  const query = `
    *[_type == "ctaSection" && sectionId == $sectionId && isActive == true][0] {
      _id,
      title,
      description,
      primaryButton,
      secondaryButton,
      highlights,
      backgroundColor,
      sectionId,
      isActive
    }
  `
  return await client.fetch(query, { sectionId })
}

// Quote Settings Interface and Fetcher
export interface QuoteSettings {
  _id: string
  formTitle: string
  jobSpecsStep: {
    title: string
    description: string
    productTypes: string[]
    quantities: string[]
    paperTypes: string[]
    finishes: string[]
    turnaroundTimes: string[]
  }
  contactStep: {
    title: string
    description: string
  }
  reviewStep: {
    title: string
    description: string
    terms: string
  }
  labels: {
    productType: string
    quantity: string
    paperType: string
    finish: string
    turnaround: string
    specialInstructions: string
    fileUpload: string
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
  }
  buttonText: {
    next: string
    previous: string
    submit: string
  }
}

export async function getQuoteSettings(): Promise<QuoteSettings | null> {
  const query = `
    *[_type == "quoteSettings"][0] {
      _id,
      formTitle,
      jobSpecsStep,
      contactStep,
      reviewStep,
      labels,
      buttonText
    }
  `
  return await client.fetch(query)
}

// Page Settings Interface and Fetcher
export interface PageSettings {
  _id: string
  pageId: string
  title: string
  sections: {
    contactInfo: string
    businessHours: string
    servicesList: string
    aboutUs: string
  }
}

export async function getPageSettings(pageId: string): Promise<PageSettings | null> {
  const query = `
    *[_type == "pageSettings" && pageId == $pageId][0] {
      _id,
      pageId,
      title,
      sections
    }
  `
  return await client.fetch(query, { pageId })
}

// Enhanced About Page Interface and Fetcher
export interface AboutPageData {
  _id: string
  title: string
  subtitle?: string
  heroImage?: any
  content?: any[]
  achievements?: Array<{
    text: string
    icon: string
  }>
  teamImage?: any
  values?: Array<{
    title: string
    description: string
    icon: string
    color: string
  }>
  badge?: {
    title: string
    subtitle: string
    icon: string
  }
  seo?: {
    metaTitle: string
    metaDescription: string
  }
  isActive: boolean
}

export async function getAboutPageData(): Promise<AboutPageData | null> {
  const query = `
    *[_type == "aboutPage" && isActive == true][0] {
      _id,
      title,
      subtitle,
      heroImage,
      content,
      achievements,
      teamImage,
      values,
      badge,
      seo,
      isActive
    }
  `
  return await client.fetch(query)
}
