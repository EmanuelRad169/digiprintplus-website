import { NextRequest, NextResponse } from 'next/server'
import { draftMode } from 'next/headers'

export async function GET() {
  console.log('🔒 Exiting draft/preview mode')
  
  // Disable draft mode
  draftMode().disable()

  const response = NextResponse.json({ 
    message: 'Draft mode disabled',
    draftMode: false 
  })

  // Add CORS headers for visual editing
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
}

export async function POST() {
  return GET() // Handle POST requests the same way
}