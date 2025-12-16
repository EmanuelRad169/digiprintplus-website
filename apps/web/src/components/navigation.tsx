'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SanityImage } from '@/components/ui/sanity-image'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { getNavigationMenu, getSiteSettings } from '@/lib/sanity/fetchers'
import { NavigationMenu, NavigationItem as SanityNavigationItem } from '@/types/navigation'
import type { SiteSettings } from '@/types/siteSettings'
import MegaMenuNew from '@/components/MegaMenuNew'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [megaMenuOpenedByClick, setMegaMenuOpenedByClick] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
  const [dropdownOpenedByClick, setDropdownOpenedByClick] = useState<Record<string, boolean>>({})
  const [navigationData, setNavigationData] = useState<NavigationMenu | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    async function loadNavigation() {
      try {
        const [navigationMenu, settings] = await Promise.all([
          getNavigationMenu(),
          getSiteSettings()
        ]);
        setNavigationData(navigationMenu)
        setSiteSettings(settings)
      } catch (error) {
        console.error('Error loading navigation and settings:', error)
        // Keep navigationData and siteSettings as null for fallback
      } finally {
        setLoading(false)
      }
    }

    loadNavigation()
  }, [])

  // Click outside handler for mega menu and dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false)
        setMegaMenuOpenedByClick(false)
      }
      
      // Check each dropdown
      Object.keys(dropdownRefs.current).forEach(key => {
        const ref = dropdownRefs.current[key]
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdowns(prev => ({ ...prev, [key]: false }))
          setDropdownOpenedByClick(prev => ({ ...prev, [key]: false }))
        }
      })
    }

    const hasOpenDropdowns = Object.values(openDropdowns).some(isOpen => isOpen)
    if (megaMenuOpen || hasOpenDropdowns) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [megaMenuOpen, openDropdowns])
  
  // Close mega menu and dropdowns when pressing Escape key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (megaMenuOpen) {
          setMegaMenuOpen(false)
          setMegaMenuOpenedByClick(false)
        }
        // Close all dropdowns
        setOpenDropdowns({})
        setDropdownOpenedByClick({})
      }
    }
    
    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [megaMenuOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleMegaMenuToggle = () => {
    if (megaMenuOpen) {
      setMegaMenuOpen(false)
      setMegaMenuOpenedByClick(false)
    } else {
      setMegaMenuOpen(true)
      setMegaMenuOpenedByClick(true)
      // Close all dropdowns when opening mega menu
      setOpenDropdowns({})
      setDropdownOpenedByClick({})
    }
  }

  const handleMegaMenuClose = () => {
    setMegaMenuOpen(false)
    setMegaMenuOpenedByClick(false)
  }

  const handleDropdownToggle = (itemName: string) => {
    const isCurrentlyOpen = openDropdowns[itemName]
    if (isCurrentlyOpen) {
      setOpenDropdowns(prev => ({ ...prev, [itemName]: false }))
      setDropdownOpenedByClick(prev => ({ ...prev, [itemName]: false }))
    } else {
      setOpenDropdowns(prev => ({ ...prev, [itemName]: true }))
      setDropdownOpenedByClick(prev => ({ ...prev, [itemName]: true }))
      // Close mega menu when opening any dropdown
      setMegaMenuOpen(false)
      setMegaMenuOpenedByClick(false)
    }
  }

  const handleDropdownClose = (itemName: string) => {
    setOpenDropdowns(prev => ({ ...prev, [itemName]: false }))
    setDropdownOpenedByClick(prev => ({ ...prev, [itemName]: false }))
  }

  const handleMouseEnter = () => {
    if (!megaMenuOpenedByClick) {
      setMegaMenuOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!megaMenuOpenedByClick) {
      setMegaMenuOpen(false)
    }
  }

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Fallback navigation items if Sanity data is not available
  const fallbackNavItems: SanityNavigationItem[] = [
    { name: 'Home', href: '/', order: 1, isVisible: true },
    { name: 'Products', href: '/products', order: 2, isVisible: true },
    { name: 'Services', href: '/services', order: 3, isVisible: true },
    { name: 'Blog', href: '/blog', order: 4, isVisible: true },
    { name: 'About', href: '/about', order: 5, isVisible: true },
    { name: 'Contact', href: '/contact', order: 6, isVisible: true },
    { name: 'Quote', href: '/quote', order: 7, isVisible: true },
  ]

  const navItems = navigationData?.items || fallbackNavItems

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {siteSettings?.logo?.asset?.url ? (
                <SanityImage 
                  src={siteSettings.logo}
                  alt={siteSettings.logo.alt || siteSettings.title || 'DigiPrintPlus'} 
                  width={225} 
                  height={40} 
                  className="h-12 w-auto object-contain" 
                  priority
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {siteSettings?.title || 'DigiPrintPlus'}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item: SanityNavigationItem) => {
              const isDropdownOpen = openDropdowns[item.name] || false
              return (
              <div key={item.name} 
                   className={`relative group ${item.megaMenu || item.submenu ? 'has-dropdown' : ''}`}
                   ref={(el) => {
                     if (item.megaMenu) {
                       megaMenuRef.current = el
                     } else if (item.submenu) {
                       dropdownRefs.current[item.name] = el
                     }
                   }}
                   onMouseEnter={() => {
                     if (item.megaMenu) {
                       handleMouseEnter()
                     }
                   }}
                   onMouseLeave={() => {
                     if (item.megaMenu) {
                       handleMouseLeave()
                     }
                   }}>
                {item.megaMenu ? (
                  <>
                    <button 
                      onClick={handleMegaMenuToggle}
                      className="flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors focus:outline-none"
                      aria-expanded={megaMenuOpen}
                      aria-haspopup="true"
                    >
                      {item.name}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Mega Menu - Positioned correctly under Products button */}
                    {megaMenuOpen && item.megaMenu && (
                      <div className="absolute z-50 mt-1 transform -translate-x-1/2 left-1/2">
                        <MegaMenuNew
                          isOpen={megaMenuOpen}
                          sections={item.megaMenu}
                          mode="sections"
                          onLinkClick={handleMegaMenuClose}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          className="w-screen max-w-6xl"
                        />
                      </div>
                    )}
                  </>
                ) : item.submenu ? (
                  <>
                    <button 
                      onClick={() => handleDropdownToggle(item.name)}
                      className="flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors focus:outline-none"
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                    >
                      {item.name}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Regular Submenu Dropdown */}
                    {isDropdownOpen && item.submenu && (
                      <div className="absolute z-50 mt-1 transform -translate-x-1/2 left-1/2 w-max min-w-48">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white">
                          <div className="py-1">
                            {item.submenu
                              .filter((subItem: any) => subItem.isVisible !== false)
                              .map((subItem: any) => (
                                <Link
                                  key={subItem.name}
                                  href={`/services/${subItem.href}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                  onClick={() => handleDropdownClose(item.name)}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Special styling for Quote button
                  item.name.toLowerCase().includes('quote') ? (
                    <Link
                      href={item.href}
                      className="flex items-center px-3.5 py-1.5 bg-magenta-600 text-white rounded-lg font-medium hover:bg-magenta-700 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleToggle}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-magenta-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item: SanityNavigationItem) => (
              <div key={item.name}>
                {item.megaMenu ? (
                  <div className="space-y-2 mb-3">
                    <div className="px-3 py-2 text-base font-medium text-gray-900 border-b border-gray-100">
                      {item.name}
                    </div>
                    <div className="space-y-3 pl-3 pr-2">
                      {item.megaMenu.map((section: any) => (
                        <div key={section.sectionTitle} className="space-y-1">
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            {section.sectionTitle}
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {section.links.filter((link: any) => link.isVisible !== false).map((link: any) => (
                              <Link
                                key={link.name}
                                href={link.href}
                                className={`block px-2 py-1.5 text-sm ${
                                  link.isHighlighted 
                                    ? 'text-magenta-700 font-medium' 
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                {link.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : item.submenu ? (
                  <div className="space-y-2 mb-3">
                    <div className="px-3 py-2 text-base font-medium text-gray-900 border-b border-gray-100">
                      {item.name}
                    </div>
                    <div className="pl-3 pr-2 space-y-1">
                      {item.submenu
                        .filter((subItem: any) => subItem.isVisible !== false)
                        .map((subItem: any) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-2 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                ) : (
                  // Special styling for Quote button in mobile
                  item.name.toLowerCase().includes('quote') ? (
                    <div className="px-3 py-2">
                      <Link
                        href={item.href}
                        className="flex items-center justify-center px-6 py-3 bg-magenta-600 text-white rounded-lg font-medium hover:bg-magenta-700 transition-colors duration-200 w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
