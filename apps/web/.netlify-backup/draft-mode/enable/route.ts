import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Parse query string parameters
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret') || searchParams.get('sanity-preview-secret')
  const slug = searchParams.get('slug')
  const perspective = searchParams.get('sanity-preview-perspective')
  const token = searchParams.get('token')
  const overlay = searchParams.get('sanity-overlay')
  
  console.log('Draft mode API called with params:', { 
    secret: secret ? '***' : 'none',
    slug,
    perspective,
    token: token ? '***' : 'none',
    overlay,
    hasOverlay: searchParams.has('sanity-overlay'),
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  })
  
  // Check the secret and next parameters
  // This secret should be the same as the one configured in your Sanity Studio
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET || 'preview-secret-key-2024'
  
  if (!secret || secret !== expectedSecret) {
    console.log('Draft mode enable - Invalid or missing secret:', { 
      secret, 
      expectedSecret,
      perspective,
      token: token ? '***' : 'none'
    })
    return new Response('Invalid token', { status: 401 })
  }

  // Enable Draft Mode by setting the cookie
  const draft = await draftMode()
  draft.enable()

  console.log('Draft mode enabled successfully', {
    perspective,
    slug,
    hasToken: !!token
  })

  // If this is a request from the visual editing overlay (has perspective param),
  // return JSON response instead of redirect
  if (perspective === 'drafts' || token || searchParams.has('sanity-overlay')) {
    const response = NextResponse.json({ 
      message: 'Draft mode enabled',
      perspective: perspective || 'drafts',
      slug,
      draftMode: true,
      visualEditing: true,
      success: true
    })
    
    // Add CORS headers for visual editing
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    
    console.log('Returning JSON response for visual editing')
    return response
  }

  // For regular preview requests, redirect to the page
  const redirectPath = slug ? `/${slug}` : '/'
  redirect(redirectPath)
}
