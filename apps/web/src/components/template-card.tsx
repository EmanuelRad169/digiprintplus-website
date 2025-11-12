'use client'

import { useState } from 'react'
import { SanityProductImage } from '@/components/ui/sanity-image'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Download, Eye, Star, Crown } from 'lucide-react'
import { incrementTemplateDownload, type Template } from '@/lib/sanity/fetchers'

interface TemplateCardProps {
  template: Template
  onDownloadComplete?: (template: Template) => void
  showCategory?: boolean
  compact?: boolean
}

export default function TemplateCard({ 
  template, 
  onDownloadComplete, 
  showCategory = false, 
  compact = false 
}: TemplateCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isDownloading) return
    
    try {
      setIsDownloading(true)
      
      // Increment download count
      await incrementTemplateDownload(template._id)
      
      // Trigger download
      if (template.downloadFile?.asset?.url) {
        const link = document.createElement('a')
        link.href = template.downloadFile.asset.url
        link.download = template.downloadFile.asset.originalFilename || template.title
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Notify parent component
        if (onDownloadComplete) {
          onDownloadComplete({
            ...template,
            downloadCount: template.downloadCount + 1
          })
        }
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group ${
        compact ? 'border border-gray-200' : ''
      }`}
    >
      <div className="relative">
        <div className={`aspect-video overflow-hidden ${compact ? 'aspect-[4/3]' : ''}`}>
          {template.previewImage?.asset?.url ? (
            <SanityProductImage
              src={template.previewImage}
              alt={template.previewImage.alt || template.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No preview</span>
            </div>
          )}
        </div>
        
        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Link 
              href={`/templates/${template.slug.current}`}
              className="flex items-center px-3 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg text-sm font-medium hover:bg-white/30 transition-all"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center px-3 py-2 bg-magenta-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-magenta-600 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-1" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>
      </div>
      
      <div className={`p-${compact ? '3' : '4'}`}>
        <h3 className={`font-bold text-gray-900 mb-2 group-hover:text-magenta-600 transition-colors ${
          compact ? 'text-sm' : ''
        }`}>
          {template.title}
        </h3>
        <p className={`text-gray-600 mb-3 line-clamp-2 ${
          compact ? 'text-xs' : 'text-sm'
        }`}>
          {template.description}
        </p>
        
        {/* Category */}
        {showCategory && template.category && (
          <div className="mb-2">
            <Link 
              href={`/templates?category=${template.category.slug.current}`}
              className="text-xs text-magenta-600 hover:text-magenta-700 font-medium"
            >
              {template.category.title}
            </Link>
          </div>
        )}
        
        {/* Stats */}
        <div className={`flex items-center justify-between text-gray-500 mb-3 ${
          compact ? 'text-xs' : 'text-xs'
        }`}>
          <span>{template.fileType} • {template.size}</span>
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-400 mr-1" />
            <span>{template.rating}</span>
          </div>
        </div>
        
        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {template.tags.slice(0, compact ? 2 : 3).map((tag, idx) => (
              <span key={idx} className={`bg-gray-100 text-gray-600 px-2 py-1 rounded-full ${
                compact ? 'text-xs' : 'text-xs'
              }`}>
                {tag}
              </span>
            ))}
            {template.tags.length > (compact ? 2 : 3) && (
              <span className="text-xs text-gray-400">+{template.tags.length - (compact ? 2 : 3)} more</span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link 
            href={`/templates/${template.slug.current}`}
            className={`flex-1 text-center py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            Preview
          </Link>
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex-1 py-2 font-medium text-white bg-magenta-500 hover:bg-magenta-600 rounded-lg shadow-sm transition-colors disabled:opacity-50 ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
        
        {/* Download count */}
        <div className={`text-gray-400 mt-2 text-center ${
          compact ? 'text-xs' : 'text-xs'
        }`}>
          {template.downloadCount} download{template.downloadCount !== 1 ? 's' : ''}
        </div>
      </div>
    </motion.div>
  )
}
