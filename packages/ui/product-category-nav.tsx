'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Grid, Package, Layers } from 'lucide-react'
import { getProductCategories } from '@/lib/sanity/navigation'

interface ProductCategory {
  _id: string
  title: string
  slug: string
  description?: string
  productCount?: number
  order?: number
}

interface ProductCategoryNavProps {
  categories?: ProductCategory[]
  className?: string
}

export default function ProductCategoryNav({ categories: initialCategories, className = '' }: ProductCategoryNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories || [])
  const [isLoading, setIsLoading] = useState(!initialCategories)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const megaMenuRef = useRef<HTMLDivElement>(null)

  // Fetch categories if not provided
  useEffect(() => {
    const fetchCategories = async () => {
      if (!initialCategories) {
        try {
          setIsLoading(true)
          const fetchedCategories = await getProductCategories()
          setCategories(fetchedCategories || [])
        } catch (error) {
          console.error('Failed to fetch categories:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchCategories()
  }, [initialCategories])

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !event.composedPath().includes(document.querySelector('.mobile-dropdown') as EventTarget)) {
        setIsOpen(false)
      }
      
      if (isMegaMenuOpen && megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen, isMegaMenuOpen])

  // Get current category from pathname
  const getCurrentCategory = () => {
    if (!pathname || pathname === '/products') return 'All Products'
    const categorySlug = pathname.split('/').pop()
    const category = categories.find(cat => cat.slug === categorySlug)
    return category?.title || 'All Products'
  }

  // Check if a category is active
  const isActive = (categorySlug: string) => {
    if (!categorySlug || !pathname) return false
    return pathname.includes(`/products/category/${categorySlug}`)
  }

  // Filter out categories without slugs or with invalid slugs
  const validCategories = categories.filter(cat => cat.slug && typeof cat.slug === 'string' && cat.slug.trim() !== '')

  // Split categories into columns for mega menu
  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const result: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }

  const columnsCount = 3
  const categoriesPerColumn = Math.ceil(validCategories.length / columnsCount)
  const categoriesColumns = chunkArray(validCategories, categoriesPerColumn)

  if (isLoading) {
    return (
      <div className={`bg-white border-b border-slate-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 bg-slate-200 rounded w-24"></div>
              <div className="h-8 bg-slate-200 rounded w-32"></div>
              <div className="h-8 bg-slate-200 rounded w-28"></div>
              <div className="h-8 bg-slate-200 rounded w-36"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (validCategories.length === 0) {
    return null
  }

  return (
    <div className={`bg-white border-b border-slate-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Dropdown */}
        <div className="md:hidden py-4 mobile-dropdown">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-left"
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">{getCurrentCategory()}</span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <Link
                  href="/products"
                  className={`block px-4 py-3 text-sm font-medium transition-colors border-b border-slate-100 ${
                    (pathname && pathname === '/products')
                      ? 'bg-cyan-50 text-cyan-700 border-l-4 border-l-cyan-500'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <Grid className="w-4 h-4 mr-3" />
                    All Products
                  </div>
                </Link>
                
                {validCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={category.slug ? `/products/category/${category.slug}` : '/products'}
                    className={`block px-4 py-3 text-sm transition-colors border-b border-slate-100 last:border-b-0 ${
                      isActive(category.slug)
                        ? 'bg-cyan-50 text-cyan-700 border-l-4 border-l-cyan-500'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.title}</span>
                      {category.productCount !== undefined && (
                        <span className="text-xs text-slate-500">
                          {category.productCount}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Mega Menu */}
        <div className="hidden md:block relative" ref={megaMenuRef}>
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Link
                href="/products"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors mr-2 ${
                  (pathname && pathname === '/products')
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                All Products
              </Link>
              
              <button 
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isMegaMenuOpen 
                    ? 'bg-cyan-100 text-cyan-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMegaMenuOpen(!isMegaMenuOpen);
                }}
              >
                <Layers className="w-4 h-4 mr-2" />
                Categories
                <ChevronDown 
                  className={`w-4 h-4 ml-1 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>
            
            <div className="text-sm text-slate-500">
              {validCategories.length} Categories
            </div>
          </div>
          
          {/* Mega Menu Dropdown */}
          {isMegaMenuOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-6">
              <div className="grid grid-cols-3 gap-8">
                {categoriesColumns.map((column, columnIndex) => (
                  <div key={columnIndex} className="space-y-4">
                    {column.map((category) => (
                      <Link
                        key={category._id}
                        href={category.slug ? `/products/category/${category.slug}` : '/products'}
                        className={`block transition-colors ${
                          isActive(category.slug)
                            ? 'text-cyan-700 font-medium'
                            : 'text-slate-700 hover:text-cyan-600'
                        }`}
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Package className="w-5 h-5 text-slate-600 mr-3" />
                            <div>
                              <div className="font-medium">{category.title}</div>
                              {category.description && (
                                <div className="text-xs text-slate-500 mt-1">{category.description}</div>
                              )}
                            </div>
                          </div>
                          {category.productCount !== undefined && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                              {category.productCount}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between">
                <Link 
                  href="/products" 
                  className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                  onClick={() => setIsMegaMenuOpen(false)}
                >
                  View All Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
