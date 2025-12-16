'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SanityImage } from '@/components/ui/sanity-image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { getNavigationMenu, getSiteSettings } from '@/lib/sanity/fetchers'
import { NavigationMenu, NavigationItem as SanityNavigationItem } from '@/types/navigation'
import type { SiteSettings } from '@/types/siteSettings'
import MegaMenuNew from '@/components/MegaMenuNew'

interface NavigationProps {
  useNewMegaMenu?: boolean // Toggle between old and new mega menu
}

export default function NavigationEnhanced({ useNewMegaMenu = false }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [megaMenuOpenedByClick, setMegaMenuOpenedByClick] = useState(false)
  const [navigationData, setNavigationData] = useState<NavigationMenu | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const megaMenuRef = useRef<HTMLDivElement>(null)

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
      } finally {
        setLoading(false)
      }
    }

    loadNavigation()
  }, [])

  // ... (keeping all the existing handlers)
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
    }
  }

  const handleMegaMenuClose = () => {
    setMegaMenuOpen(false)
    setMegaMenuOpenedByClick(false)
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

  // Fallback navigation items
  const fallbackNavItems: SanityNavigationItem[] = [
    { name: 'Home', href: '/', order: 1, isVisible: true },
    { name: 'Products', href: '/products', order: 2, isVisible: true },
    { name: 'About', href: '/about', order: 3, isVisible: true },
    { name: 'Contact', href: '/contact', order: 4, isVisible: true },
    { name: 'Quote', href: '/quote', order: 5, isVisible: true },
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
                  width={120}
                  height={40}
                  className="h-8 w-auto"
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
            {navItems.map((item: SanityNavigationItem) => (
              <div key={item.name} 
                   className={`relative group ${item.megaMenu || (item.name.toLowerCase() === 'products' && useNewMegaMenu) ? 'has-dropdown' : ''}`}
                   ref={item.megaMenu || (item.name.toLowerCase() === 'products' && useNewMegaMenu) ? megaMenuRef : undefined}
                   onMouseEnter={() => (item.megaMenu || (item.name.toLowerCase() === 'products' && useNewMegaMenu)) && handleMouseEnter()}
                   onMouseLeave={() => (item.megaMenu || (item.name.toLowerCase() === 'products' && useNewMegaMenu)) && handleMouseLeave()}>
                
                {/* Products with New Mega Menu */}
                {item.name.toLowerCase() === 'products' && useNewMegaMenu ? (
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
                    {megaMenuOpen && (
                      <div className="absolute z-50 mt-1 transform -translate-x-1/2 left-1/2">
                        <MegaMenuNew
                          isOpen={megaMenuOpen}
                          onLinkClick={handleMegaMenuClose}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          className="w-screen max-w-6xl"
                        />
                      </div>
                    )}
                  </>
                ) : item.megaMenu ? (
                  /* Unified Mega Menu with sections */
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
                ) : (
                  /* Regular navigation links */
                  item.name.toLowerCase().includes('quote') ? (
                    <Link
                      href={item.href}
                      className="flex items-center px-3.5 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleToggle}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item: SanityNavigationItem) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}