'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Globe, Printer, Clock } from 'lucide-react'
import { getFooter, subscribeToFooterUpdates, type Footer as FooterType, DEFAULT_FOOTER } from '@/lib/sanity/footer'
import { getSiteSettings, subscribeToSiteSettings, urlForImage, type SiteSettings } from '@/lib/sanity/settings'

export function Footer() {
  const [footerData, setFooterData] = useState<FooterType>(DEFAULT_FOOTER)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Function to load footer data
  const loadFooterData = useCallback(async () => {
    try {
      const data = await getFooter()
      setFooterData(data)
    } catch (error) {
      console.error('Failed to load footer data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Function to load site settings (for logo)
  const loadSiteSettings = useCallback(async () => {
    try {
      const settings = await getSiteSettings()
      if (settings) {
        console.log('Loaded site settings:', settings)
        setSiteSettings(settings)
      }
    } catch (error) {
      console.error('Failed to load site settings:', error)
    }
  }, [])

  // Initial data load
  useEffect(() => {
    loadFooterData()
    loadSiteSettings()
  }, [loadFooterData, loadSiteSettings])

  // Real-time updates subscription for footer
  useEffect(() => {
    let footerSubscription: any = null
    
    try {
      footerSubscription = subscribeToFooterUpdates(() => {
        console.log('Footer updated, reloading...')
        loadFooterData()
      })
    } catch (error) {
      console.error('Failed to setup real-time footer updates:', error)
    }
    
    return () => {
      if (footerSubscription) {
        footerSubscription.unsubscribe()
      }
    }
  }, [loadFooterData])

  // Real-time updates subscription for site settings
  useEffect(() => {
    let siteSettingsSubscription: any = null
    
    try {
      siteSettingsSubscription = subscribeToSiteSettings(() => {
        console.log('Site settings updated, reloading...')
        loadSiteSettings()
      })
    } catch (error) {
      console.error('Failed to setup real-time site settings updates:', error)
    }
    
    return () => {
      if (siteSettingsSubscription) {
        siteSettingsSubscription.unsubscribe()
      }
    }
  }, [loadSiteSettings])

  // Helper to render social media icons
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />
      case 'twitter':
      case 'x':
        return <Twitter className="w-5 h-5" />
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />
      case 'youtube':
        return <Youtube className="w-5 h-5" />
      case 'pinterest':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
        )
      case 'tiktok':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.9 2.9 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          </svg>
        )
      default:
        return <Globe className="w-5 h-5" />
    }
  }

  return (
    <footer className="bg-white text-black">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-5">
            {isLoading ? (
              <div className="animate-pulse space-y-5">
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
                <div className="h-6 flex space-x-1 mt-2">
                  <div className="h-6 w-12 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/" className="group">
                  {siteSettings?.logo?.asset ? (
                    <div className="h-[45px]">
                      <Image 
                        src={urlForImage(siteSettings.logo)?.url() || ''}
                        alt={siteSettings.logo.alt || siteSettings.title || 'Company Logo'}
                        width={0}
                        height={45}
                        style={{ width: 'auto', height: '45px' }}
                        className="object-contain transition-all duration-300 group-hover:opacity-90"
                      />
                    </div>
                  ) : (
                    <span className="text-xl font-medium tracking-wide">{siteSettings?.title || footerData.title}</span>
                  )}
                </Link>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {siteSettings?.description || footerData.description}
                </p>
                
                <div className="flex flex-wrap space-x-3">
                  {siteSettings?.social && Object.entries(siteSettings.social)
                    .filter(([_, url]) => url)
                    .map(([platform, url], index) => (
                      <a 
                        key={`${platform}-${index}`}
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-white hover:bg-magenta-600 p-2 rounded-full transition-colors"
                        aria-label={`Visit our ${platform} page`}
                      >
                        {getSocialIcon(platform)}
                      </a>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Services */}
          <div className="space-y-5">
            <h3 className="text-lg font-medium tracking-wide">Services</h3>
            <ul className="space-y-3 text-sm">
              {footerData.services?.filter(service => service.isVisible !== false).map((service, index) => (
                <li key={`service-${index}`}>
                  <Link 
                    href={service.slug} 
                    className="text-gray-800 hover:text-magenta-500"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-medium tracking-wide">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {footerData.quickLinks?.filter(link => link.isVisible !== false).map((link, index) => (
                <li key={`quicklink-${index}`}>
                  <Link 
                    href={link.slug} 
                    className="text-gray-800 hover:text-magenta-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="text-lg font-medium tracking-wide">Contact Info</h3>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {/* Contact Info Loading */}
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                
                {/* Business Hours Loading */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="pl-8 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full flex justify-between mb-2">
                      <div className="w-1/3 h-full bg-gray-300 rounded"></div>
                      <div className="w-1/3 h-full bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full flex justify-between mb-2">
                      <div className="w-1/4 h-full bg-gray-300 rounded"></div>
                      <div className="w-1/3 h-full bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full flex justify-between">
                      <div className="w-1/4 h-full bg-gray-300 rounded"></div>
                      <div className="w-1/6 h-full bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-sm">
                  {siteSettings?.contact?.address && (
                    <div className="flex items-center space-x-3 group">
                      <div className="p-2 rounded-full bg-magenta-500 group-hover:bg-magenta-600 transition-all duration-300">
                        <MapPin className="w-3 h-3 text-white flex-shrink-0" />
                      </div>
                      <span className="text-gray-800">{siteSettings.contact.address}</span>
                    </div>
                  )}
                  
                  {siteSettings?.contact?.phone && (
                    <div className="flex items-center space-x-3 group">
                      <div className="p-2 rounded-full bg-magenta-500 group-hover:bg-magenta-600 transition-all duration-300">
                        <Phone className="w-3 h-3 text-white flex-shrink-0" />
                      </div>
                      <a href={`tel:${siteSettings.contact.phone.replace(/\D/g, '')}`} className="text-gray-800 hover:text-magenta-500">
                        {siteSettings.contact.phone}
                      </a>
                    </div>
                  )}
                  
                  {siteSettings?.contact?.email && (
                    <div className="flex items-center space-x-3 group">
                      <div className="p-2 rounded-full bg-magenta-500 group-hover:bg-magenta-600 transition-all duration-300">
                        <Mail className="w-3 h-3 text-white flex-shrink-0" />
                      </div>
                      <a href={`mailto:${siteSettings.contact.email}`} className="text-gray-800 hover:text-magenta-500">
                        {siteSettings.contact.email}
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Business Hours */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h4 className="font-medium mb-3 text-gray-800 flex items-center">
                    <div className="p-2 mr-2 rounded-full bg-magenta-500">
                      <Clock className="w-3 h-3 text-white flex-shrink-0" />
                    </div>
                    Business Hours
                  </h4>
                  <div className="text-sm text-gray-800 space-y-2 pl-8">
                    {siteSettings?.contact?.businessHours && siteSettings.contact.businessHours.length > 0 ? (
                      siteSettings.contact.businessHours.map((schedule, index) => (
                        <p key={`hours-${index}`} className="flex justify-between">
                          <span className="font-medium">{schedule.day}:</span>
                          <span>{schedule.hours}</span>
                        </p>
                      ))
                    ) : (
                      <>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-magenta-500 mt-12 pt-8 text-center text-sm text-gray-800">
          <p>&copy; {new Date().getFullYear()} {siteSettings?.title || footerData.copyright} | All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}