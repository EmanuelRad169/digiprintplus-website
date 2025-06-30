import { getAllTemplates, getAllTemplateCategories } from '@/lib/sanity/fetchers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 API: Starting template fetch...')
    
    const [templates, categories] = await Promise.all([
      getAllTemplates(),
      getAllTemplateCategories()
    ])
    
    console.log('📊 API: Templates fetched:', templates?.length || 0)
    console.log('📊 API: Categories fetched:', categories?.length || 0)
    
    const response = NextResponse.json({
      success: true,
      data: {
        templates: templates || [],
        categories: categories || [],
        templateCount: templates?.length || 0,
        categoryCount: categories?.length || 0
      }
    })

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('❌ API: Error fetching templates:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {
        templates: [],
        categories: [],
        templateCount: 0,
        categoryCount: 0
      }
    })
  }
}
