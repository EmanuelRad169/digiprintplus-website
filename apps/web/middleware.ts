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

  // Handle CORS for API routes
  if (pathname.startsWith('/api/')) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    // Continue with API request and add CORS headers
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

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
     * Match all request paths including API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
