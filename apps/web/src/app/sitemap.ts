import { MetadataRoute } from 'next'
import { getAllBlogPosts, getProducts, getProductCategories, getAllTemplates } from '@/lib/sanity/fetchers'

// Force static generation for static export
export const dynamic = 'force-static'
export const revalidate = false

const baseUrl = 'https://marvelous-treacle-ca0286.netlify.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content
  const [blogs, products, categories, templates] = await Promise.all([
    getAllBlogPosts(),
    getProducts(),
    getProductCategories(),
    getAllTemplates(),
  ])

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Blog posts
  const blogPages = blogs
    .filter((post) => post.slug?.current)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug!.current}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  // Products
  const productPages = products
    .filter((product: any) => product.slug?.current)
    .map((product: any) => ({
      url: `${baseUrl}/products/${product.slug!.current}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  // Product categories
  const categoryPages = categories
    .filter((category: any) => category.slug?.current)
    .map((category: any) => ({
      url: `${baseUrl}/products/category/${category.slug!.current}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  // Templates
  const templatePages = templates
    .filter((template: any) => template.slug?.current)
    .map((template: any) => ({
      url: `${baseUrl}/templates/${template.slug!.current}`,
      lastModified: template.publishedAt ? new Date(template.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [
    ...staticPages,
    ...blogPages,
    ...productPages,
    ...categoryPages,
    ...templatePages,
  ]
}
