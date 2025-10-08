'use client'

import { useState } from 'react'
import Image from 'next/image'
// cSpell:ignore portabletext
import { PortableText } from '@portabletext/react'
import { Product, ProductSpecification, ProductFAQItem } from '@/types/product'
import { Download, ExternalLink, ChevronDown, ChevronUp, Search } from 'lucide-react'
import TemplateCard from './template-card'
import { Template } from '@/lib/sanity/fetchers'

interface ProductTabsProps {
  product: Product
}

interface TabContentProps {
  activeTab: string
  product: Product
}

function TabContent({ activeTab, product }: TabContentProps) {
  switch (activeTab) {
    case 'template':
      return (
        <div className="space-y-6">
          {product.template?.hasTemplate ? (
            <>
              {product.template.description && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.template.description}
                </p>
              )}
              
              {product.template.previewImage?.asset?.url && (
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={product.template.previewImage.asset.url}
                    alt={product.template.previewImage.alt || 'Template preview'}
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {product.template.downloadFile?.asset?.url && (
                  <a
                    href={product.template.downloadFile.asset.url}
                    className="inline-flex items-center px-6 py-3 bg-magenta-600 text-white font-medium rounded-lg hover:bg-magenta-700 transition-colors"
                    download
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Template
                  </a>
                )}
                
                {product.template.htmlEmbed && (
                  <a
                    href="#preview"
                    className="inline-flex items-center px-6 py-3 border border-magenta-600 text-magenta-600 font-medium rounded-lg hover:bg-magenta-50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Preview Template
                  </a>
                )}
              </div>

              {product.template.htmlEmbed && (
                <div className="mt-8" id="preview">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Template Preview</h4>
                  <div 
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: product.template.htmlEmbed }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Template Available</h3>
              <p className="text-gray-600">
                A template for this product is not yet available.
                Contact us for custom template creation.
              </p>
            </div>
          )}
        </div>
      )

    case 'specifications':
      return (
        <div className="space-y-6">
          {product.detailedSpecs ? (
            <div className="prose prose-lg max-w-none">
              <PortableText value={product.detailedSpecs} />
            </div>
          ) : product.specifications && product.specifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.specifications.map((spec: ProductSpecification, index: number) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-gray-900 text-lg">{spec.name}</span>
                    <span className="text-magenta-600 font-medium">
                      {spec.value} {spec.unit && <span className="text-sm text-gray-500">{spec.unit}</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Specifications Available</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Detailed specifications for this product are not yet available.
                Contact us for technical details.
              </p>
              <div className="mt-6">
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-magenta-500 text-white font-semibold rounded-xl hover:bg-magenta-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Contact Us
                </a>
              </div>
            </div>
          )}
        </div>
      )

    case 'details':
      return (
        <div className="space-y-6">
          {product.productDetails ? (
            <div className="prose prose-lg max-w-none">
              <PortableText value={product.productDetails} />
            </div>
          ) : product.longDescription ? (
            <div className="prose prose-lg max-w-none">
              <PortableText value={product.longDescription} />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Details Available</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Product details are not yet available.
                Contact us for more information.
              </p>
              <div className="mt-6">
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-magenta-500 text-white font-semibold rounded-xl hover:bg-magenta-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Contact Us
                </a>
              </div>
            </div>
          )}
        </div>
      )

    case 'faq':
      return (
        <div className="space-y-6">
          {product.faq && product.faq.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
              {product.faq.map((item: ProductFAQItem, index: number) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C7.59,4 4,12A10,10 0 0,0 12,2Z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQ Available</h3>
              <p className="text-gray-600">
                Frequently asked questions for this product are not yet available.
                Contact us if you have specific questions.
              </p>
            </div>
          )}
        </div>
      )

    case 'templates':
      // Group templates by category
      const templatesByCategory = product.templates?.reduce((acc, template) => {
        const categoryTitle = template.category?.title || 'Uncategorized'
        if (!acc[categoryTitle]) {
          acc[categoryTitle] = []
        }
        acc[categoryTitle].push(template)
        return acc
      }, {} as Record<string, Template[]>) || {}

      const categoryKeys = Object.keys(templatesByCategory)
      
      // State for filtering and sorting would be managed at parent level
      // For now, keeping it simple but adding the UI structure

      return (
        <div className="space-y-6">
          {product.templates && product.templates.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Related Templates
                </h3>
                <p className="text-gray-600">
                  Download these professionally designed templates for your {product.title.toLowerCase()} projects.
                </p>
              </div>

              {/* Template Search and Filter */}
              <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta-500 focus:border-magenta-500"
                  />
                </div>
                
                {/* Format Filter */}
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-magenta-500 focus:border-magenta-500">
                    <option value="">All Formats</option>
                    <option value="PDF">PDF</option>
                    <option value="AI">AI</option>
                    <option value="PSD">PSD</option>
                    <option value="INDD">INDD</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                
                {/* Sort Options */}
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-magenta-500 focus:border-magenta-500">
                    <option value="title">Sort by Name</option>
                    <option value="downloads">Most Downloaded</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Grouped Templates */}
              {categoryKeys.length > 1 ? (
                <div className="space-y-8">
                  {categoryKeys.map((categoryTitle) => (
                    <div key={categoryTitle}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200 flex-1">
                          {categoryTitle}
                        </h4>
                        <span className="text-sm text-gray-500 ml-4">
                          {templatesByCategory[categoryTitle].length} template{templatesByCategory[categoryTitle].length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templatesByCategory[categoryTitle].map((template: Template) => (
                          <TemplateCard
                            key={template._id}
                            template={template}
                            showCategory={false}
                            compact={true}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.templates.map((template: Template) => (
                    <TemplateCard
                      key={template._id}
                      template={template}
                      showCategory={true}
                      compact={true}
                    />
                  ))}
                </div>
              )}
              
              {product.templates.length > 6 && (
                <div className="text-center mt-8">
                  <a
                    href="/templates"
                    className="inline-flex items-center px-6 py-3 bg-magenta-500 text-white font-medium rounded-lg hover:bg-magenta-600 transition-colors"
                  >
                    View All Templates
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Templates Available</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                No templates are currently available for this product. Please check back later or request a custom design.
              </p>
              <div className="mt-6">
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-magenta-500 text-white font-semibold rounded-xl hover:bg-magenta-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Request Custom Design
                </a>
              </div>
            </div>
          )}
        </div>
      )

    default:
      return null
  }
}

// FAQ Item component with accordion
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('details')

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'templates', label: 'Related Templates' }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-none overflow-x-auto">
          <nav className="flex space-x-2 px-6 py-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold text-sm transition-all duration-300 rounded-xl whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-magenta-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        <TabContent activeTab={activeTab} product={product} />
      </div>
    </div>
  )
}
