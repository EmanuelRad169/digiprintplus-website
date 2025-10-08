'use client'

import Link from 'next/link'
import { MegaMenuSection } from '@/types/navigation'
import { Package, CreditCard, Mail, FileText, Users, Calendar, Bookmark, Sparkles, Gift, Star, MapPin, FileImage, Clipboard, Tag } from 'lucide-react'

// Icon mapping for dynamic icon support
const iconMap = {
  'package': Package,
  'credit-card': CreditCard,
  'mail': Mail,
  'file-text': FileText,
  'users': Users,
  'calendar': Calendar,
  'bookmark': Bookmark,
  'sparkles': Sparkles,
  'gift': Gift,
  'star': Star,
  'map-pin': MapPin,
  'file-image': FileImage,
  'clipboard': Clipboard,
  'tag': Tag,
} as const

interface MegaMenuProps {
  sections: MegaMenuSection[]
  onLinkClick?: () => void
}

export default function MegaMenu({ sections, onLinkClick }: MegaMenuProps) {
  const visibleSections = sections.filter(section => 
    section.links && section.links.some(link => link.isVisible !== false)
  )

  if (visibleSections.length === 0) {
    return null
  }

  return (
    <div 
      className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden"
      role="menu" 
      aria-label="Product categories"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Header */}
        
        <div className="grid grid-cols-1 gap-6">
          {/* Responsive Grid Layout - 3 columns only on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSections.slice(0, 3).map((section, sectionIndex) => {
              const visibleLinks = section.links.filter(link => link.isVisible !== false)
            
              return (
                <div key={section.sectionTitle} className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-1">
                    {section.sectionTitle}
                  </h3>
                  
                  
                  <div className="space-y-1">
                    {visibleLinks.map((link) => {
                      const iconName = getIconNameFromText(link.name)
                      const IconComponent = iconName ? iconMap[iconName as keyof typeof iconMap] : Package
                      
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
          
          {/* Promo Card - Full width at the bottom */}
          <div className="border-t border-gray-100">
            <div className="bg-gradient-to-r from-magenta-500 via-magenta-600 to-purple-600 rounded-md p-3.5 text-white shadow-md relative overflow-hidden">
              {/* Background pattern */}
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
                    className="inline-block text-xs font-medium text-white bg-black px-4 py-2.5 rounded-md transition-colors border border-white/30"
                  >
                    Get Custom Quot
                  </Link>
                </div>
              </div>
            </div>
          </div>
        
          {/* Mobile Simplified Layout (Only visible on small screens) */}
          <div className="md:hidden space-y-3 mt-4">
            {visibleSections.map((section) => {
              const visibleLinks = section.links.filter(link => link.isVisible !== false)
              
              return (
                <div key={section.sectionTitle} className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-xs border-b border-gray-200 pb-1">
                    {section.sectionTitle}
                  </h3>
                  <div className="grid grid-cols-2 gap-1">
                    {visibleLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={onLinkClick}
                        className="text-xs text-gray-700 hover:text-gray-900 py-1 transition-colors"
                        {...(link.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to map product names to icons
function getIconNameFromText(text: string): string | null {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('business card')) return 'credit-card'
  if (lowerText.includes('envelope')) return 'mail'
  if (lowerText.includes('letter') || lowerText.includes('booklet') || lowerText.includes('catalog')) return 'file-text'
  if (lowerText.includes('calendar')) return 'calendar'
  if (lowerText.includes('bookmark')) return 'bookmark'
  if (lowerText.includes('announcement') || lowerText.includes('gift')) return 'gift'
  if (lowerText.includes('counter') || lowerText.includes('display')) return 'star'
  if (lowerText.includes('door') || lowerText.includes('hanger')) return 'map-pin'
  if (lowerText.includes('flyer') || lowerText.includes('brochure')) return 'file-image'
  if (lowerText.includes('ncr') || lowerText.includes('form')) return 'clipboard'
  if (lowerText.includes('notepad')) return 'tag'
  if (lowerText.includes('table') || lowerText.includes('tent')) return 'users'
  if (lowerText.includes('postcard')) return 'mail'
  if (lowerText.includes('all products')) return 'package'
  
  return 'package' // Default icon
}
