'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import Link from 'next/link'
import { getProductCategories } from '@/lib/sanity/fetchers'
import { 
  Package, 
  CreditCard, 
  Mail, 
  FileText, 
  Users, 
  Calendar, 
  Bookmark, 
  Sparkles, 
  Gift, 
  Star,
  MapPin,
  FileImage,
  Clipboard,
  Tag,
  Grid,
  ArrowRight,
  Loader2,
  Printer,
  PenTool,
  ImageIcon,
  Building2,
  Phone,
  BookOpen
} from 'lucide-react'

// Icon mapping for categories
const categoryIconMap = {
  'postcards': Mail,
  'business-cards': CreditCard,
  'flyers': FileImage,
  'brochures': FileText,
  'presentation-folders': Clipboard,
  'booklets': FileText,
  'catalogs': FileText,
  'calendars': Calendar,
  'bookmarks': Bookmark,
  'door-hangers': MapPin,
  'table-tents': Users,
  'announcements': Gift,
  'invitations': Sparkles,
  'envelopes': Mail,
  'labels': Tag,
  'stickers': Star,
  'posters': FileImage,
  'banners': FileImage,
  'trading-cards': CreditCard,
  'greeting-cards': Gift,
} as const

interface ProductCategory {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
  featured?: boolean
  image?: string
}

interface MegaMenuSection {
  sectionTitle: string
  sectionDescription?: string
  links: Array<{
    name: string
    href: string
    description?: string
    isHighlighted?: boolean
    isVisible?: boolean
    openInNewTab?: boolean
  }>
}

interface MegaMenuProps {
  isOpen?: boolean
  onLinkClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  className?: string
  sections?: MegaMenuSection[]  // New: support static sections
  mode?: 'products' | 'sections'  // New: explicit mode
}

export default function MegaMenu({ 
  isOpen = false, 
  onLinkClick, 
  onMouseEnter, 
  onMouseLeave,
  className = '',
  sections,
  mode = 'products'
}: MegaMenuProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // Only fetch if in products mode and no sections provided
  const shouldFetchCategories = mode === 'products' && !sections

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getProductCategories()
        setCategories(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
        console.error('Error loading categories:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen && shouldFetchCategories && categories.length === 0) {
      loadCategories()
    }
  }, [isOpen, categories.length])

  // Reset focus when menu closes
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen || categories.length === 0) return

    const { key } = event
    const gridColumns = 4
    const totalItems = categories.length
    
    switch (key) {
      case 'ArrowRight':
        event.preventDefault()
        setFocusedIndex(prev => {
          const next = prev + 1
          return next >= totalItems ? 0 : next
        })
        break
        
      case 'ArrowLeft':
        event.preventDefault()
        setFocusedIndex(prev => {
          const next = prev - 1
          return next < 0 ? totalItems - 1 : next
        })
        break
        
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => {
          const next = prev + gridColumns
          return next >= totalItems ? prev % gridColumns : next
        })
        break
        
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => {
          const next = prev - gridColumns
          return next < 0 ? Math.floor(totalItems / gridColumns) * gridColumns + (prev % gridColumns) : next
        })
        break
        
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < totalItems) {
          const link = itemRefs.current[focusedIndex]
          if (link) {
            link.click()
          }
        }
        break
        
      case 'Escape':
        event.preventDefault()
        onLinkClick?.()
        break
        
      default:
        break
    }
  }

  // Focus the focused item
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < itemRefs.current.length) {
      const item = itemRefs.current[focusedIndex]
      if (item) {
        item.focus()
      }
    }
  }, [focusedIndex])

  // Get icon for category
  const getIconForCategory = (slug: string): React.ComponentType<any> => {
    const key = slug.toLowerCase() as keyof typeof categoryIconMap
    return categoryIconMap[key] || Package
  }

  // Show loading state
  if (!isOpen) {
    return null
  }

  // Helper function to get icon for link
  const getIconForLink = (name: string) => {
    const lowerName = name.toLowerCase()
    
    // Product categories
    if (lowerName.includes('business card')) return CreditCard
    if (lowerName.includes('envelope') || lowerName.includes('postcard')) return Mail
    if (lowerName.includes('letter') || lowerName.includes('booklet') || lowerName.includes('catalog') || lowerName.includes('brochure')) return FileText
    if (lowerName.includes('calendar')) return Calendar
    if (lowerName.includes('bookmark')) return Bookmark
    if (lowerName.includes('announcement') || lowerName.includes('gift')) return Gift
    if (lowerName.includes('counter') || lowerName.includes('display') || lowerName.includes('star')) return Star
    if (lowerName.includes('door') || lowerName.includes('hanger')) return MapPin
    if (lowerName.includes('flyer') || lowerName.includes('poster') || lowerName.includes('banner')) return FileImage
    if (lowerName.includes('ncr') || lowerName.includes('form') || lowerName.includes('folder')) return Clipboard
    if (lowerName.includes('notepad') || lowerName.includes('label') || lowerName.includes('sticker')) return Tag
    if (lowerName.includes('table') || lowerName.includes('tent')) return Users
    if (lowerName.includes('all products')) return Package
    
    // Services
    if (lowerName.includes('digital') || lowerName.includes('printing')) return Printer
    if (lowerName.includes('offset')) return Printer
    if (lowerName.includes('large format') || lowerName.includes('wide format')) return ImageIcon
    if (lowerName.includes('design') || lowerName.includes('custom')) return PenTool
    
    // Company/About
    if (lowerName.includes('about') || lowerName.includes('company')) return Building2
    if (lowerName.includes('contact') || lowerName.includes('get in touch')) return Phone
    if (lowerName.includes('blog') || lowerName.includes('news')) return BookOpen
    
    return Package // Default
  }

  // Render sections mode (static data)
  if (sections && sections.length > 0) {
    const visibleSections = sections.filter(section => 
      section.links && section.links.some(link => link.isVisible !== false)
    )

    if (visibleSections.length === 0) {
      return null
    }

    return (
      <div
        ref={menuRef}
        className={`bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden ${className}`}
        role="menu"
        aria-label="Menu"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 gap-6">
            {/* 3-column grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleSections.slice(0, 3).map((section) => {
                const visibleLinks = section.links.filter(link => link.isVisible !== false)
                
                return (
                  <div key={section.sectionTitle} className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-1">
                      {section.sectionTitle}
                    </h3>
                    
                    <div className="space-y-1">
                      {visibleLinks.map((link) => {
                        const IconComponent = getIconForLink(link.name)
                        
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={onLinkClick}
                            className={`group flex items-start space-x-2 p-1.5 rounded-md transition-all duration-200 ${
                              link.isHighlighted
                                ? 'bg-magenta-50 border border-magenta-200 hover:bg-magenta-100'
                                : 'hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            {...(link.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                          >
                            <IconComponent className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                              link.isHighlighted
                                ? 'text-magenta-600'
                                : 'text-gray-400 group-hover:text-magenta-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium text-sm ${
                                link.isHighlighted
                                  ? 'text-magenta-700'
                                  : 'text-gray-700 group-hover:text-gray-900'
                              }`}>
                                {link.name}
                              </div>
                              {link.description && (
                                <div className={`text-xs mt-0.5 line-clamp-2 ${
                                  link.isHighlighted
                                    ? 'text-magenta-600'
                                    : 'text-gray-500'
                                }`}>
                                  {link.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Promo Card */}
            <div className="border-t border-gray-100">
              <div className="bg-gradient-to-r from-magenta-500 via-magenta-600 to-purple-600 rounded-md p-3.5 text-white shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-white rounded-full -mr-6 -mt-6"></div>
                  <div className="absolute left-0 bottom-0 w-16 h-16 bg-white rounded-full -ml-4 -mb-4"></div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
                  <div className="flex items-start space-x-3">
                    <Gift className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">Custom Printing Solutions</div>
                      <div className="text-white text-xs mt-1 max-w-md opacity-90">
                        Need something unique for your business? Our experts can help you create custom printing solutions tailored to your specific needs.
                      </div>
                    </div>
                  </div>
                  <div className="md:flex-shrink-0">
                    <Link
                      href="/quote"
                      onClick={onLinkClick}
                      className="inline-block text-xs font-medium text-white bg-black px-4 py-2.5 rounded-md transition-colors border border-white/30 hover:bg-white hover:text-magenta-600"
                    >
                      Get Custom Quote
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render products mode (dynamic Sanity data)
  return (
    <div
      ref={menuRef}
      className={`bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden ${className}`}
      role="menu"
      aria-label="Product categories"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Grid className="h-5 w-5 text-blue-600" />
            Product Categories
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Professional printing solutions for your business needs
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading categories...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">⚠️ Unable to load categories</div>
            <div className="text-sm text-gray-500">{error}</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No categories available at the moment.
          </div>
        ) : (
          <>
            {/* 4-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {categories.map((category, index) => {
                const IconComponent = getIconForCategory(category.slug.current)
                const isFocused = focusedIndex === index
                
                return (
                  <Link
                    key={category._id}
                    href={`/products/${category.slug.current}`}
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    onClick={onLinkClick}
                    className={`
                      group p-4 rounded-lg border transition-all duration-200 
                      hover:border-blue-200 hover:bg-blue-50 hover:shadow-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${isFocused ? 'bg-blue-50 border-blue-200 shadow-md' : 'border-gray-200 bg-white'}
                      ${category.featured ? 'ring-2 ring-yellow-200 bg-yellow-50' : ''}
                    `}
                    role="menuitem"
                    tabIndex={isFocused ? 0 : -1}
                    onFocus={() => setFocusedIndex(index)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        flex-shrink-0 p-2 rounded-md transition-colors
                        ${category.featured 
                          ? 'bg-yellow-200 text-yellow-700' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-200 group-hover:text-blue-700'
                        }
                      `}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`
                          font-medium text-sm mb-1 transition-colors
                          ${category.featured ? 'text-yellow-900' : 'text-gray-900 group-hover:text-blue-900'}
                        `}>
                          {category.title}
                          {category.featured && (
                            <Star className="inline-block ml-1 h-3 w-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        {category.description && (
                          <div className={`
                            text-xs leading-relaxed line-clamp-2 transition-colors
                            ${category.featured ? 'text-yellow-700' : 'text-gray-500 group-hover:text-blue-700'}
                          `}>
                            {category.description}
                          </div>
                        )}
                        
                        <div className="flex items-center mt-2 text-xs font-medium transition-colors text-blue-600 group-hover:text-blue-700">
                          View Products
                          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Footer CTA */}
            <div className="border-t border-gray-100 pt-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Gift className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-sm">Need something custom?</div>
                      <div className="text-xs text-blue-100 mt-0.5">
                        Get personalized solutions for your unique requirements
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/quote"
                    onClick={onLinkClick}
                    className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}