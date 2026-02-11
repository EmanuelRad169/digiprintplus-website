// Force static generation for static export
export const dynamic = 'force-static'
export const revalidate = false

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://digiprintplus.com'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/studio/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
