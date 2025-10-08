import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

interface SitemapUrl {
  url: string
  lastModified: string
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

// Get base URL from environment or request
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  return `${protocol}://${host}`
}

export async function GET(request: NextRequest) {
  try {
    const baseUrl = getBaseUrl(request)
    const urls: SitemapUrl[] = []

    console.log('🗺️ Generating sitemap from Sanity...')

    // Static pages - high priority, change weekly
    const staticPages = [
      { path: '', priority: 1.0 }, // Homepage
      { path: 'about', priority: 0.8 },
      { path: 'contact', priority: 0.8 },
      { path: 'services', priority: 0.9 },
      { path: 'templates', priority: 0.9 },
      { path: 'products', priority: 0.9 },
      { path: 'quote', priority: 0.7 },
    ]

    staticPages.forEach(page => {
      urls.push({
        url: `${baseUrl}/${page.path}`,
        lastModified: new Date().toISOString(),
        changefreq: 'weekly',
        priority: page.priority
      })
    })

    // Fetch dynamic content from Sanity
    const [categories, products, templates, pages] = await Promise.all([
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
      // Pages (if you have a page document type)
      sanityClient.fetch(`
        *[_type == "page" && defined(slug.current)] {
          "slug": slug.current,
          _updatedAt
        }
      `).catch(() => []) // Graceful fallback if no page type exists
    ])

    console.log('📊 Sitemap content:', {
      categories: categories.length,
      products: products.length,
      templates: templates.length,
      pages: pages.length
    })

    // Add category pages
    categories.forEach((category: any) => {
      urls.push({
        url: `${baseUrl}/products/category/${category.slug}`,
        lastModified: new Date(category._updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      })
    })

    // Add individual products
    products.forEach((product: any) => {
      urls.push({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product._updatedAt).toISOString(),
        changefreq: 'monthly',
        priority: 0.7
      })

      // Add category-specific product URLs if category exists
      if (product.category) {
        urls.push({
          url: `${baseUrl}/products/category/${product.category}/${product.slug}`,
          lastModified: new Date(product._updatedAt).toISOString(),
          changefreq: 'monthly',
          priority: 0.6
        })
      }
    })

    // Add templates
    templates.forEach((template: any) => {
      urls.push({
        url: `${baseUrl}/templates/${template.slug}`,
        lastModified: new Date(template._updatedAt).toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      })
    })

    // Add additional pages
    pages.forEach((page: any) => {
      urls.push({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page._updatedAt).toISOString(),
        changefreq: 'monthly',
        priority: 0.5
      })
    })

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    console.log(`✅ Sitemap generated with ${urls.length} URLs`)

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400', // Cache for 1 hour, CDN for 1 day
      },
    })
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}

// Also support robots.txt at /api/sitemap/robots.txt if needed
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}