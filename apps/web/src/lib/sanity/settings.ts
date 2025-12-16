import { sanityClient } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'

// Type definitions for site settings
export interface SiteSettings {
  _id: string
  title: string
  description: string
  logo?: {
    asset: {
      _ref: string
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
    alt?: string
  }
  contact?: {
    email: string
    phone: string
    address: string
    businessHours?: {
      day: string
      hours: string
    }[]
  }
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
}

// Image URL Builder for Sanity images
const builder = imageUrlBuilder(sanityClient)

// Generate image URL from Sanity image reference
export const urlForImage = (source: any) => {
  if (!source || !source.asset) {
    return null
  }
  
  return builder.image(source)
}

// Fetch site settings from Sanity
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    return await sanityClient.fetch(
      `*[_type == "siteSettings"][0] {
        _id,
        title,
        description,
        logo {
          asset->{
            _ref,
            url
          },
          hotspot,
          alt
        },
        contact {
          email,
          phone,
          address,
          businessHours[] {
            day,
            hours
          }
        },
        social
      }`,
      {},
      {
        // Enable ISR with 5 minute revalidation
        next: { revalidate: 300 },
      }
    )
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

// Real-time site settings updates hook
export const subscribeToSiteSettings = (callback: () => void): { unsubscribe: () => void } => {
  return sanityClient
    .listen('*[_type == "siteSettings"]')
    .subscribe({
      next: () => {
        console.log('Site settings updated, refreshing...')
        callback()
      },
      error: (error) => {
        console.error('Site settings subscription error:', error)
      }
    })
}
