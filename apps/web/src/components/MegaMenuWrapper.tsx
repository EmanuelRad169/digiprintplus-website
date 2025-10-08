'use client'

import { useState } from 'react'
import MegaMenuNew from './MegaMenuNew'

interface MegaMenuWrapperProps {
  trigger?: React.ReactNode
  className?: string
}

export default function MegaMenuWrapper({ trigger, className }: MegaMenuWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen(!isOpen)
  const handleClose = () => setIsOpen(false)

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <div
        onClick={handleToggle}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-pointer"
      >
        {trigger || (
          <button className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
            <span>Products</span>
            <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Mega Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <MegaMenuNew
            isOpen={isOpen}
            onLinkClick={handleClose}
            className="w-screen max-w-6xl"
          />
        </div>
      )}
    </div>
  )
}