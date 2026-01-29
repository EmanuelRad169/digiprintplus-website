import { NextRequest, NextResponse } from 'next/server'
import { getProductCategories } from '@/lib/sanity/fetchers'

// Sample categories for testing
const sampleCategories = [
  {
    _id: '1',
    title: 'Postcards',
    slug: { current: 'postcards' },
    description: 'High-quality postcards for marketing and personal use',
    featured: true,
  },
  {
    _id: '2', 
    title: 'Business Cards',
    slug: { current: 'business-cards' },
    description: 'Professional business cards that make lasting impressions',
    featured: false,
  },
  {
    _id: '3',
    title: 'Flyers',
    slug: { current: 'flyers' },
    description: 'Eye-catching flyers for events and promotions',
    featured: false,
  },
  {
    _id: '4',
    title: 'Brochures',
    slug: { current: 'brochures' },
    description: 'Informative brochures for your business needs',
    featured: false,
  },
  {
    _id: '5',
    title: 'Presentation Folders',
    slug: { current: 'presentation-folders' },
    description: 'Professional folders for important documents',
    featured: false,
  },
  {
    _id: '6',
    title: 'Booklets',
    slug: { current: 'booklets' },
    description: 'Custom booklets for catalogs and manuals',
    featured: false,
  },
  {
    _id: '7',
    title: 'Calendars',
    slug: { current: 'calendars' },
    description: 'Custom calendars for business and personal use',
    featured: false,
  },
  {
    _id: '8',
    title: 'Trading Cards',
    slug: { current: 'trading-cards' },
    description: 'Professional trading cards and collectibles',
    featured: true,
  },
]

export async function GET() {
  try {
    // Try to fetch from Sanity first
    const categories = await getProductCategories()
    
    // If Sanity returns data, use it; otherwise use sample data
    if (categories && categories.length > 0) {
      return NextResponse.json(categories)
    } else {
      console.log('Using sample categories - Sanity data not available')
      return NextResponse.json(sampleCategories)
    }
  } catch (error) {
    console.error('Error fetching categories from Sanity, using sample data:', error)
    
    // Return sample data as fallback
    return NextResponse.json(sampleCategories)
  }
}