import { NextResponse } from 'next/server'
import { getProducts, getProductCategories } from '@/lib/sanity/fetchers'

// API handler for products
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  
  try {
    // Fetch products and categories from Sanity
    const products = await getProducts(category)
    const categories = await getProductCategories()
    
    return NextResponse.json({ 
      products, 
      categories
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
