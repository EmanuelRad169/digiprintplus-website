import { NextResponse } from 'next/server'
import { getAllTemplates, getAllTemplateCategories } from '@/lib/sanity/fetchers'

export async function GET() {
  try {
    console.log('🔍 API Route: Testing template fetch...')
    
    const [templates, categories] = await Promise.all([
      getAllTemplates(),
      getAllTemplateCategories()
    ])
    
    console.log('📊 API Route: Found', templates.length, 'templates')
    console.log('📊 API Route: Found', categories.length, 'categories')
    
    return NextResponse.json({
      success: true,
      data: {
        templates: templates.length,
        categories: categories.length,
        sampleTemplate: templates[0] || null,
        sampleCategory: categories[0] || null
      }
    })
  } catch (error) {
    console.error('❌ API Route Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
