'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, Mail, Twitter, Phone, MapPin } from 'lucide-react'
import { getContactInfo, getMainContactInfo, type ContactInfo } from '@/lib/sanity/contentFetchers'

// Icon mapping
const iconMap = {
  messageCircle: MessageCircle,
  mail: Mail,
  twitter: Twitter,
  phone: Phone,
  mapPin: MapPin,
}

interface ContactInfoGridProps {
  mainOnly?: boolean
  layout?: 'grid' | 'list'
  className?: string
}

export function ContactInfoGrid({ mainOnly = false, layout = 'grid', className = '' }: ContactInfoGridProps) {
  const [contactItems, setContactItems] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)

  // Load contact info from Sanity
  useEffect(() => {
    async function loadContactInfo() {
      try {
        const contacts = mainOnly ? await getMainContactInfo() : await getContactInfo()
        setContactItems(contacts)
      } catch (error) {
        console.error('Failed to load contact info:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContactInfo()
  }, [mainOnly])

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Mail
    return IconComponent
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center p-4 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
              <div className="flex-1">
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (contactItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No contact information available.</p>
      </div>
    )
  }

  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
    : 'space-y-4'

  return (
    <div className={`${gridClasses} ${className}`}>
      {contactItems.map((contact) => {
        const IconComponent = getIcon(contact.icon)
        
        const ContactItem = (
          <div className="flex items-center p-4 rounded-lg border border-slate-200 hover:border-magenta-300 hover:bg-magenta-50 hover:scale-105 transition-all duration-200 group">
            <div className="w-12 h-12 bg-magenta-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-magenta-200 transition-colors">
              <IconComponent className="w-6 h-6 text-magenta-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{contact.title}</div>
              <div className="text-sm text-slate-500">
                {contact.displayText || contact.value}
              </div>
              {contact.description && (
                <div className="text-xs text-slate-400 mt-1">
                  {contact.description}
                </div>
              )}
            </div>
          </div>
        )

        return contact.link ? (
          <Link key={contact._id} href={contact.link} className="block">
            {ContactItem}
          </Link>
        ) : (
          <div key={contact._id}>
            {ContactItem}
          </div>
        )
      })}
    </div>
  )
}

// Full contact section with different types
export function ContactSection() {
  const [contactItems, setContactItems] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContactInfo() {
      try {
        const contacts = await getContactInfo()
        setContactItems(contacts)
      } catch (error) {
        console.error('Failed to load contact info:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContactInfo()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-6 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center p-4 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Group contact items by type
  const groupedContacts = contactItems.reduce((groups, contact) => {
    const type = contact.type
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(contact)
    return groups
  }, {} as Record<string, ContactInfo[]>)

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Mail
    return IconComponent
  }

  const typeLabels = {
    chat: 'Chat with us',
    email: 'Email Support',
    phone: 'Phone Support',
    social: 'Social Media',
    address: 'Visit Us',
    hours: 'Business Hours'
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedContacts).map(([type, contacts]) => (
        <div key={type}>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            {typeLabels[type as keyof typeof typeLabels] || type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <div className="space-y-4">
            {contacts.map((contact) => {
              const IconComponent = getIcon(contact.icon)
              
              const ContactItem = (
                <div className="flex items-center p-4 rounded-lg border border-slate-200 hover:border-magenta-300 hover:bg-magenta-50 hover:scale-105 transition-all duration-200 group">
                  <div className="w-12 h-12 bg-magenta-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-magenta-200 transition-colors">
                    <IconComponent className="w-6 h-6 text-magenta-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{contact.title}</div>
                    <div className="text-sm text-slate-500">
                      {contact.displayText || contact.value}
                    </div>
                    {contact.description && (
                      <div className="text-xs text-slate-400 mt-1">
                        {contact.description}
                      </div>
                    )}
                  </div>
                </div>
              )

              return contact.link ? (
                <Link key={contact._id} href={contact.link}>
                  {ContactItem}
                </Link>
              ) : (
                <div key={contact._id}>
                  {ContactItem}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
