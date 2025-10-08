import { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log('🗺️ Generating Next.js 14 sitemap from Sanity...')
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
  
  try {
    // Fetch dynamic content from Sanity
    const [categories, products, templates] = await Promise.all([
      // Categories
      sanityClient.fetch(`
        *[_type == "category" && defined(slug.current)] {
          "slug": slug.current,
          _updatedAt
        }
      `),
      // Products
      sanityClient.fetch(`
        *[_type == "product" && defined(slug.current)] {
          "slug": slug.current,
          "category": category->slug.current,
          _updatedAt
        }
      `),
      // Templates
      sanityClient.fetch(`
        *[_type == "template" && defined(slug.current)] {
          "slug": slug.current,
          _updatedAt
        }
      `),
    ])

    console.log('📊 Dynamic content found:', {
      categories: categories.length,
      products: products.length,
      templates: templates.length,
    })

    const dynamicRoutes: MetadataRoute.Sitemap = []

    // Add category pages
    categories.forEach((category: any) => {
      dynamicRoutes.push({
        url: `${baseUrl}/products/category/${category.slug}`,
        lastModified: new Date(category._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })

    // Add product pages
    products.forEach((product: any) => {
      dynamicRoutes.push({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product._updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      })

      // Add category-specific product URLs if category exists
      if (product.category) {
        dynamicRoutes.push({
          url: `${baseUrl}/products/category/${product.category}/${product.slug}`,
          lastModified: new Date(product._updatedAt),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })

    // Add template pages
    templates.forEach((template: any) => {
      dynamicRoutes.push({
        url: `${baseUrl}/templates/${template.slug}`,
        lastModified: new Date(template._updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })

    const allRoutes = [...staticRoutes, ...dynamicRoutes]
    console.log(`✅ Sitemap generated with ${allRoutes.length} URLs`)
    
    return allRoutes
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    // Return static routes as fallback
    return staticRoutes
  }
}