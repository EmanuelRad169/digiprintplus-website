'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Download, Eye } from 'lucide-react'
import { 
  getAllTemplates, 
  getAllTemplateCategories,
  incrementTemplateDownload,
  type Template,
  type TemplateCategory 
} from '@/lib/sanity/fetchers'

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [templatesData, categoriesData] = await Promise.all([
          getAllTemplates(),
          getAllTemplateCategories()
        ])
        
        setTemplates(templatesData || [])
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error loading templates data:', error)
        setTemplates([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category?.slug?.current === activeCategory
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const handleDownload = async (template: Template) => {
    try {
      await incrementTemplateDownload(template._id)
      
      setTemplates(prev => prev.map(t =>
        t._id === template._id
          ? { ...t, downloadCount: t.downloadCount + 1 }
          : t
      ))

      const link = document.createElement('a')
      link.href = template.downloadFile.asset.url
      link.download = template.downloadFile.asset.originalFilename || template.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading template:', error)
    }
  }

  const getCategoryCount = (categorySlug: string) => {
    if (categorySlug === 'all') return templates.length
    return templates.filter(t => t.category?.slug?.current === categorySlug).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-magenta-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading templates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional <span className="text-magenta-400">Templates</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Download professionally designed templates for all your printing needs. Customize with your brand colors, text, and images for stunning results.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-500"
                />
              </div>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                All Formats
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                📁 Categories
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between ${
                    activeCategory === 'all'
                      ? 'bg-magenta-100 text-magenta-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>All Templates</span>
                  <span className="text-sm text-gray-500">{getCategoryCount('all')}</span>
                </button>
                
                {categories.map(category => (
                  <button
                    key={category._id}
                    onClick={() => setActiveCategory(category.slug.current)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between ${
                      activeCategory === category.slug.current
                        ? 'bg-magenta-100 text-magenta-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.title}</span>
                    <span className="text-sm text-gray-500">{getCategoryCount(category.slug.current)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Showing {filteredTemplates.length} templates
              </h2>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No templates found</h3>
                <p className="text-gray-600 mb-8">
                  Try adjusting your search or selecting a different category
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setActiveCategory('all')
                  }}
                  className="bg-magenta-600 hover:bg-magenta-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <motion.div
                    key={template._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={template.previewImage?.asset?.url || '/api/placeholder/300/225'}
                        alt={template.previewImage?.alt || template.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex space-x-3">
                          <Link 
                            href={`/templates/${template.slug.current}`}
                            className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDownload(template)}
                            className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-magenta-600 transition-colors">
                        {template.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{template.fileType}</span>
                        <span>{template.size}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          href={`/templates/${template.slug.current}`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors"
                        >
                          Preview
                        </Link>
                        <button
                          onClick={() => handleDownload(template)}
                          className="flex-1 bg-magenta-600 hover:bg-magenta-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-magenta-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Design?
          </h2>
          <p className="text-xl text-magenta-100 mb-8 max-w-2xl mx-auto">
            Can&apos;t find the perfect template? Our design team can create custom templates tailored to your brand and specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              ✨ Request Custom Design
            </button>
            <Link
              href="/contact"
              className="bg-transparent border border-white hover:bg-white hover:text-magenta-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Designer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
