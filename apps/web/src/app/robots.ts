// Force static generation for static export
export const dynamic = 'force-static'
export const revalidate = false

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: 'https://marvelous-treacle-ca0286.netlify.app/sitemap.xml',
  }
}
