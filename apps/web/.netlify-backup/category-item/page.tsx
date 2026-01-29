'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getProductBySlug, getCategoryBySlug } from '@/lib/sanity/fetchers'
import { Product, ProductCategory } from '@/types/product'
import { ShoppingCart, ArrowLeft, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

interface TabContentProps {
  activeTab: string
  product: Product
}

function TabContent({ activeTab, product }: TabContentProps) {
  const demoTemplate = {
    description: 'This is a sample template for demonstration.',
    htmlEmbed: '<div style="padding: 20px; border: 2px solid #e2e8f0; border-radius: 8px; background: #f8fafc;"><h3>Sample Template Preview</h3><p>This is a preview of the template content.</p></div>',
  }
  
  const demoSpecs = [
    { name: 'Material', value: 'Premium 350gsm cardstock', unit: '' },
    { name: 'Dimensions', value: '85mm x 55mm', unit: '(standard)' },
    { name: 'Print Quality', value: '300 DPI', unit: 'full-color' },
    { name: 'Finishing', value: 'Gloss, matte, or silk coating', unit: '' }
  ]
  
  const demoFAQ = [
    {
      question: 'What file formats do you accept?',
      answer: 'We accept PDF, AI, EPS, and high-resolution JPG or PNG files.'
    },
    {
      question: 'How long does it take to print?',
      answer: 'Standard turnaround time is 2-3 business days.'
    }
  ]

  switch (activeTab) {
    case 'template':
      return (
        <div className="space-y-6">
          <p className="text-gray-600 text-lg">
            {product.template?.description || demoTemplate.description}
          </p>
          <div 
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            dangerouslySetInnerHTML={{ __html: product.template?.htmlEmbed || demoTemplate.htmlEmbed }}
          />
        </div>
      )

    case 'specifications':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(product.specifications || demoSpecs).map((spec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-900">{spec.name}</span>
                <span className="text-gray-600">{spec.value} {spec.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )

    case 'details':
      return (
        <div className="prose max-w-none">
          <p>Our premium business cards are perfect for making a lasting impression.</p>
          <ul>
            <li>Fast turnaround time (2-3 business days)</li>
            <li>Custom design support available</li>
            <li>Bulk ordering discounts available</li>
          </ul>
        </div>
      )

    case 'faq':
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
          {(product.faq || demoFAQ).map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}

interface ProductItemPageProps {
  params: {
    category: string
    item: string
  }
}

export default function ProductItemPage({ params }: ProductItemPageProps) {
  const { category, item } = params
  
  const [product, setProduct] = useState<Product | null>(null)
  const [categoryData, setCategoryData] = useState<ProductCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('template')

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const productData = await getProductBySlug(item)
        if (!productData) {
          setError('Product not found')
          return
        }

        const categoryData = await getCategoryBySlug(category)
        if (!categoryData) {
          setError('Category not found')
          return
        }

        if (productData.category?._id !== categoryData._id) {
          setError('Product does not belong to this category')
          return
        }

        setProduct(productData)
        setCategoryData(categoryData)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [category, item])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded mb-8 w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'template', label: 'Template' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'details', label: 'Details' },
    { id: 'faq', label: 'FAQ' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
            <li><span className="text-gray-400">/</span></li>
            <li><Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
            <li><span className="text-gray-400">/</span></li>
            <li>
              <Link href={`/products/category/${category}`} className="text-gray-500 hover:text-gray-700">
                {categoryData?.title || category}
              </Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li><span className="text-gray-900 font-medium">{product.title}</span></li>
          </ol>
        </nav>

        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            {product.image?.asset?.url ? (
              <div className="rounded-lg overflow-hidden bg-white border border-gray-200">
                <Image
                  src={product.image.asset.url}
                  alt={product.image.alt || product.title}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="rounded-lg bg-gray-200 flex items-center justify-center h-96">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              {product.description && (
                <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-magenta-600 mr-2">•</span>
                      <span className="text-gray-700">
                        {typeof feature === 'string' ? feature : feature.feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-magenta-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-magenta-700 transition-colors flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Request Quote
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-magenta-500 text-magenta-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <TabContent activeTab={activeTab} product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate static params for products within categories
export async function generateStaticParams({ 
  params 
}: { 
  params: { category: string } 
}) {
  try {
    const { getProductsByCategory } = await import('@/lib/sanity/fetchers')
    const products = await getProductsByCategory(params.category)
    
    return products
      .filter((product: Product) => product.slug?.current)
      .map((product: Product) => ({
        item: product.slug!.current,
      }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
