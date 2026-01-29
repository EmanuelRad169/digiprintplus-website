import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const params = searchParams.get('params')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    // Parse params if provided
    const queryParams = params ? JSON.parse(params) : {}
    
    // Execute the query using our Sanity client
    const result = await sanityClient.fetch(query, queryParams)
    
    // Return the result with proper CORS headers
    const response = NextResponse.json(result)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  } catch (error) {
    console.error('Sanity proxy error:', error)
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch data from Sanity' }, 
      { status: 500 }
    )
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    return errorResponse
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, params } = body
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required in request body' }, { status: 400 })
    }
    
    // Execute the query using our Sanity client
    const result = await sanityClient.fetch(query, params || {})
    
    // Return the result with proper CORS headers
    const response = NextResponse.json(result)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  } catch (error) {
    console.error('Sanity proxy error:', error)
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch data from Sanity' }, 
      { status: 500 }
    )
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    return errorResponse
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
      'Access-Control-Max-Age': '86400',
    },
  })
}
