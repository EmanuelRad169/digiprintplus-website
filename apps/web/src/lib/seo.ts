import { Metadata } from 'next'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string | string[]
  image?: string
  imageAlt?: string
  canonical?: string
  noindex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  siteName?: string
}

const defaultSiteName = 'DigiPrintPlus'
const defaultTitle = 'Professional Print Solutions'
const defaultDescription = 'Your trusted partner for high-quality printing services. Get instant quotes for business cards, brochures, banners, and more.'
const defaultImage = '/images/og-image.jpg' // You'll want to add this image
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export function generateSEO({
  title,
  description = defaultDescription,
  keywords,
  image,
  imageAlt,
  canonical,
  noindex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  siteName = defaultSiteName,
}: SEOProps = {}): Metadata {
  // Build the full title
  const fullTitle = title ? `${title} - ${siteName}` : `${siteName} - ${defaultTitle}`
  
  // Build canonical URL
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined
  
  // Build image URL
  const imageUrl = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}${defaultImage}`
  
  // Convert keywords array to string if needed
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywordsString,
    authors: author ? [{ name: author }] : undefined,
    robots: noindex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title || `${siteName} - ${defaultTitle}`,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt || title || defaultTitle,
        },
      ],
      type,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: title || `${siteName} - ${defaultTitle}`,
      description,
      images: [imageUrl],
      creator: '@digiprintplus', // Update with your Twitter handle
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }

  return metadata
}

// Utility for product SEO
export function generateProductSEO({
  product,
  category,
}: {
  product: {
    title: string
    description?: string
    image?: { asset: { url: string }; alt?: string }
    tags?: string[]
    seo?: {
      metaTitle?: string
      metaDescription?: string
      keywords?: string[]
    }
    slug?: { current: string }
    _updatedAt?: string
  }
  category?: string
}) {
  const title = product.seo?.metaTitle || product.title
  const description = product.seo?.metaDescription || product.description || `Professional ${product.title.toLowerCase()} printing services. Get a custom quote today.`
  const keywords = product.seo?.keywords || product.tags || [product.title, 'printing', 'custom printing', category].filter(Boolean) as string[]
  const image = product.image?.asset?.url
  const imageAlt = product.image?.alt || `${product.title} printing services`
  const canonical = `/products/${product.slug?.current}`

  return generateSEO({
    title,
    description,
    keywords,
    image,
    imageAlt,
    canonical,
    type: 'article',
    modifiedTime: product._updatedAt,
  })
}

// Utility for category SEO
export function generateCategorySEO({
  category,
  products,
}: {
  category: {
    title: string
    description?: string
    image?: { asset: { url: string }; alt?: string }
    slug?: { current: string }
    seo?: {
      metaTitle?: string
      metaDescription?: string
      keywords?: string[]
    }
    _updatedAt?: string
  }
  products?: any[]
}) {
  const title = category.seo?.metaTitle || `${category.title} Printing Services`
  const description = category.seo?.metaDescription || 
    category.description || 
    `Professional ${category.title.toLowerCase()} printing services. ${products?.length ? `Choose from ${products.length} different options.` : ''} Get your custom quote today.`
  const keywords = category.seo?.keywords || [category.title, 'printing', 'custom printing', 'professional printing']
  const image = category.image?.asset?.url
  const imageAlt = category.image?.alt || `${category.title} printing services`
  const canonical = `/products/category/${category.slug?.current}`

  return generateSEO({
    title,
    description,
    keywords,
    image,
    imageAlt,
    canonical,
    modifiedTime: category._updatedAt,
  })
}

// Utility for template SEO
export function generateTemplateSEO({
  template,
}: {
  template: {
    title: string
    description?: string
    image?: { asset: { url: string }; alt?: string }
    category?: { title: string }
    tags?: string[]
    slug?: { current: string }
    seo?: {
      metaTitle?: string
      metaDescription?: string
      keywords?: string[]
    }
    _updatedAt?: string
  }
}) {
  const title = template.seo?.metaTitle || `${template.title} Template`
  const description = template.seo?.metaDescription || 
    template.description || 
    `Professional ${template.title} template for printing. ${template.category ? `Perfect for ${template.category.title.toLowerCase()}.` : ''} Download and customize today.`
  const keywords = template.seo?.keywords || 
    template.tags || 
    [template.title, 'template', 'printing template', 'design template', template.category?.title].filter((item): item is string => Boolean(item))
  const image = template.image?.asset?.url
  const imageAlt = template.image?.alt || `${template.title} template preview`
  const canonical = `/templates/${template.slug?.current}`

  return generateSEO({
    title,
    description,
    keywords,
    image,
    imageAlt,
    canonical,
    type: 'article',
    modifiedTime: template._updatedAt,
  })
}

// JSON-LD structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DigiPrintPlus',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: 'Professional printing services and custom print solutions',
    address: {
      '@type': 'PostalAddress',
      // Add your business address here
      streetAddress: '123 Business St',
      addressLocality: 'Your City',
      addressRegion: 'Your State',
      postalCode: '12345',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-555-1234',
      contactType: 'customer service',
    },
    sameAs: [
      // Add your social media URLs here
      'https://facebook.com/digiprintplus',
      'https://twitter.com/digiprintplus',
      'https://instagram.com/digiprintplus',
    ],
  }
}

export function generateProductSchema(product: {
  title: string
  description?: string
  image?: { asset: { url: string } }
  category?: { title: string }
  slug?: { current: string }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image?.asset?.url,
    category: product.category?.title,
    url: `${baseUrl}/products/${product.slug?.current}`,
    brand: {
      '@type': 'Brand',
      name: 'DigiPrintPlus',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        price: 'Contact for pricing',
      },
    },
  }
}