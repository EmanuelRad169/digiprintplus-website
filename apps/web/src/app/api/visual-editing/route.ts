import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const perspective = searchParams.get('perspective')
  
  // Basic visual editing endpoint for Sanity presentation tool
  return NextResponse.json({
    perspective: perspective || 'published',
    message: 'Visual editing endpoint ready'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle visual editing events from the presentation tool
    console.log('Visual editing event:', body)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling visual editing event:', error)
    return NextResponse.json({ error: 'Failed to process visual editing event' }, { status: 500 })
  }
}
