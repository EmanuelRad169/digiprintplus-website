import { NextResponse } from 'next/server'
import { getProducts, getProductCategories } from '@/lib/sanity/fetchers'
import { handleCors, handleOptions } from '../cors'

// Handle preflight requests
export async function OPTIONS() {
  return handleOptions()
}

// API handler for products
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  
  try {
    // Fetch products and categories from Sanity
    const products = await getProducts(category)
    const categories = await getProductCategories()
    
    const response = NextResponse.json({ 
      products, 
      categories
    })
    
    return handleCors(response)
  } catch (error) {
    console.error('Error fetching products:', error)
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    )
    return handleCors(errorResponse)
  }
}
