import { NextRequest, NextResponse } from 'next/server'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { sanityClient } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret') || searchParams.get('sanity-preview-secret')
  const slug = searchParams.get('slug')
  const type = searchParams.get('type')
  const perspective = searchParams.get('sanity-preview-perspective')
  const token = searchParams.get('token')

  console.log('🔍 Preview API called with params:', { 
    secret: secret ? '***' : 'none',
    slug,
    type,
    perspective,
    token: token ? '***' : 'none',
    hasOverlay: searchParams.has('sanity-overlay'),
  })

  // Check the secret and next parameters
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET || 'preview-secret-key-2024'
  
  if (!secret || secret !== expectedSecret) {
    console.log('❌ Preview API - Invalid or missing secret')
    return new NextResponse('Invalid token', { status: 401 })
  }

  console.log('✅ Preview API - Valid secret provided')

  // Fetch the document from Sanity to check if it exists (if slug and type provided)
  if (slug && type) {
    try {
      const document = await sanityClient.fetch(
        `*[_type == $type && slug.current == $slug][0]`,
        { type, slug }
      )

      // If the document doesn't exist prevent preview mode from being enabled
      if (!document) {
        console.log('❌ Document not found for preview:', { type, slug })
        return new NextResponse('Document not found', { status: 404 })
      }

      console.log('✅ Document found for preview:', { type, slug, title: document.title })
    } catch (error) {
      console.error('❌ Error fetching document for preview:', error)
      return new NextResponse('Error fetching document', { status: 500 })
    }
  }

  // Enable draft mode for Next.js 14
  draftMode().enable()

  // If this is a request from the visual editing overlay (has perspective param),
  // return JSON response instead of redirect
  if (perspective === 'drafts' || token || searchParams.has('sanity-overlay')) {
    const response = NextResponse.json({ 
      message: 'Preview mode enabled',
      perspective: perspective || 'drafts',
      slug,
      type,
      draftMode: true,
      visualEditing: true,
      success: true
    })
    
    // Add CORS headers for visual editing
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    
    console.log('📤 Returning JSON response for visual editing')
    return response
  }

  // For regular preview requests, redirect to the appropriate page
  let redirectPath = '/'
  
  if (slug && type) {
    switch (type) {
      case 'product':
        redirectPath = `/products/${slug}`
        break
      case 'category':
        redirectPath = `/products/category/${slug}`
        break
      case 'template':
        redirectPath = `/templates/${slug}`
        break
      case 'page':
        redirectPath = `/${slug}`
        break
      default:
        redirectPath = slug ? `/${slug}` : '/'
    }
  } else if (slug) {
    redirectPath = `/${slug}`
  }

  console.log('🔄 Redirecting to preview page:', redirectPath)
  redirect(redirectPath)
}

export async function POST(request: NextRequest) {
  return GET(request) // Handle POST requests the same way
}
