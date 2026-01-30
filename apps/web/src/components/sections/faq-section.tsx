'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { getFAQItems, getPopularFAQs, getFAQsByCategory, type FAQItem } from '@/lib/sanity/contentFetchers'
import { PortableText } from '@portabletext/react'

interface FAQSectionProps {
  popularOnly?: boolean
  category?: string
  searchable?: boolean
  limit?: number
  className?: string
}

export function FAQSection({ 
  popularOnly = false, 
  category, 
  searchable = true, 
  limit,
  className = '' 
}: FAQSectionProps) {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([])
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  // Load FAQ items from Sanity
  useEffect(() => {
    async function loadFAQs() {
      try {
        let faqs: FAQItem[] = []
        
        if (category) {
          faqs = await getFAQsByCategory(category)
        } else if (popularOnly) {
          faqs = await getPopularFAQs()
        } else {
          faqs = await getFAQItems()
        }

        if (limit && faqs.length > limit) {
          faqs = faqs.slice(0, limit)
        }

        setFaqItems(faqs)
        setFilteredFAQs(faqs)
      } catch (error) {
        console.error('Failed to load FAQ items:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFAQs()
  }, [popularOnly, category, limit])

  // Filter FAQs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFAQs(faqItems)
    } else {
      const filtered = faqItems.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredFAQs(filtered)
    }
  }, [searchTerm, faqItems])

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="bg-gray-200 h-6 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (faqItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No FAQ items available.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search frequently asked questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-magenta-500 focus:border-magenta-500"
          />
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No FAQs found matching your search.</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isOpen = openItems.has(faq._id)
            
            return (
              <div
                key={faq._id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-magenta-300 transition-colors"
              >
                <button
                  onClick={() => toggleItem(faq._id)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          {faq.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {faq.isPopular && (
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200">
                    <div className="prose prose-sm max-w-none text-gray-700 pt-4">
                      <PortableText value={faq.answer} />
                    </div>
                    
                    {/* Related Products */}
                    {faq.relatedProducts && faq.relatedProducts.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Related Products:</h4>
                        <div className="flex flex-wrap gap-2">
                          {faq.relatedProducts.map((product) => (
                            <a
                              key={product._id}
                              href={`/products/${product.slug.current}`}
                              className="inline-block px-3 py-1 bg-magenta-100 text-magenta-700 text-sm rounded hover:bg-magenta-200 transition-colors"
                            >
                              {product.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Show results count */}
      {searchable && searchTerm && (
        <div className="text-center text-sm text-gray-600">
          Showing {filteredFAQs.length} of {faqItems.length} results
        </div>
      )}
    </div>
  )
}

// Categories for FAQ filtering
/**
 * OPTIONAL: Consider migrating to Sanity for easier editing by content team
 * Not critical - FAQ categories rarely change, but CMS management would allow:
 * - Adding/removing categories without code deployment
 * - Reordering categories dynamically
 * - Localizing category names for multi-language support
 */
export function FAQCategories({ onCategorySelect, selectedCategory }: {
  onCategorySelect: (category: string | null) => void
  selectedCategory: string | null
}) {
  const categories = [
    { value: null, label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'printing', label: 'Printing' },
    { value: 'design', label: 'Design' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'file-preparation', label: 'File Preparation' },
    { value: 'quality', label: 'Quality' },
    { value: 'returns', label: 'Returns' },
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.value || 'all'}
          onClick={() => onCategorySelect(category.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === category.value
              ? 'bg-magenta-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}

// Complete FAQ page component
export function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions about our printing services
        </p>
      </div>

      <FAQCategories 
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      <FAQSection 
        category={selectedCategory || undefined}
        searchable={true}
      />
    </div>
  )
}
