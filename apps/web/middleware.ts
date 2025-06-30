import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Map of legacy routes to new category routes
const CATEGORY_REDIRECTS: Record<string, string> = {
  '/business-cards': '/products/category/business-cards',
  '/flyers-brochures': '/products/category/flyers-brochures',
  '/postcards': '/products/category/postcards', 
  '/banners': '/products/category/banners',
  '/booklets': '/products/category/booklets',
  '/catalogs': '/products/category/catalogs',
  '/bookmarks': '/products/category/bookmarks',
  '/calendars': '/products/category/calendars',
  '/door-hangers': '/products/category/door-hangers',
  '/envelopes': '/products/category/envelopes',
  '/letterhead': '/products/category/letterhead',
  '/ncr-forms': '/products/category/ncr-forms',
  '/notepads': '/products/category/notepads',
  '/table-tents': '/products/category/table-tents',
  '/counter-display-cards': '/products/category/counter-display-cards',
  '/announcement-cards': '/products/category/announcement-cards',
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if this is a legacy category route that should be redirected
  if (CATEGORY_REDIRECTS[pathname]) {
    const redirectUrl = new URL(CATEGORY_REDIRECTS[pathname], request.url)
    return NextResponse.redirect(redirectUrl, { status: 301 })
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
