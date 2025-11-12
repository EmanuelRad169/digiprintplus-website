'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Download, ArrowLeft, Star, Eye, Clock, FileType, HardDrive, Crown } from 'lucide-react'
import { getTemplateBySlug, incrementTemplateDownload, type Template } from '@/lib/sanity/fetchers'
import RequestCustomDesignModal from '@/components/RequestCustomDesignModal'

interface Props {
  params: { slug: string }
}

export default function TemplatePage({ params }: Props) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const fetchedTemplate = await getTemplateBySlug(params.slug)
        if (!fetchedTemplate) {
          notFound()
        }
        setTemplate(fetchedTemplate)
      } catch (error) {
        console.error('Error fetching template:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [params.slug])

  const handleDownload = async () => {
    if (!template) return
    
    try {
      await incrementTemplateDownload(template._id)
    } catch (error) {
      console.error('Error incrementing download count:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-magenta-600"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    )
  }

  if (!template) {
    notFound()
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/templates"
            className="inline-flex items-center text-gray-600 hover:text-magenta-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Template Preview */}
            <div className="space-y-4">
              <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {template.previewImage?.asset?.url ? (
                  <Image
                    src={template.previewImage.asset.url}
                    alt={template.previewImage.alt || template.title}
                    width={400}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No preview available</span>
                  </div>
                )}
                
                {template.isPremium && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </div>
                )}
              </div>
              
              {/* Additional Images */}
              {template.additionalImages && template.additionalImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {template.additionalImages.map((image, index) => (
                    <div key={index} className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                      <Image
                        src={image.asset.url}
                        alt={image.alt || `${template.title} preview ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-32 object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Template Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {template.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  {template.description}
                </p>
                
                {/* Rating & Downloads */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{template.rating} out of 5</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    <span>{template.downloadCount} downloads</span>
                  </div>
                </div>
              </div>
              
              {/* Template Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Template Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <FileType className="w-4 h-4 mr-2" />
                      File Type
                    </span>
                    <span className="font-medium">{template.fileType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Dimensions
                    </span>
                    <span className="font-medium">{template.size}</span>
                  </div>
                  {template.fileSize && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <HardDrive className="w-4 h-4 mr-2" />
                        File Size
                      </span>
                      <span className="font-medium">{template.fileSize}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <Link 
                      href={`/templates?category=${template.category.slug.current}`}
                      className="font-medium text-magenta-600 hover:text-magenta-700"
                    >
                      {template.category.title}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Published
                    </span>
                    <span className="font-medium">
                      {new Date(template.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              {template.tags && template.tags.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Required Software */}
              {template.requiredSoftware && template.requiredSoftware.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">Required Software</h3>
                  <div className="space-y-2">
                    {template.requiredSoftware.map((software, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-magenta-500 rounded-full mr-3"></div>
                        {software}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Download Button */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <a
                  href={template.downloadFile?.asset?.url}
                  download={template.downloadFile?.asset?.originalFilename || template.title}
                  className="block w-full bg-magenta-500 hover:bg-magenta-600 text-white text-center py-4 px-6 rounded-xl font-semibold transition-colors shadow-lg"
                  onClick={handleDownload}
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  Download Template
                  {template.isPremium && template.price && ` ($${template.price})`}
                </a>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Free for personal and commercial use
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      {template.instructions && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Instructions</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{template.instructions}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Design CTA */}
      <div className="bg-magenta-500">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Something Custom?
            </h2>
            <p className="text-lg text-white mb-8">
              Our design team can create custom templates tailored to your specific needs and brand requirements.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-magenta-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              ✨ Request Custom Design
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RequestCustomDesignModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
