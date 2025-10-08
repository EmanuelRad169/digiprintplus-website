'use client'

import { useEffect, useState } from 'react'

export function VisualEditing() {
  const [isDraftMode, setIsDraftMode] = useState(false)

  useEffect(() => {
    // Detect various conditions that indicate visual editing should be enabled
    const hasBypassCookie = document.cookie.includes('__prerender_bypass')
    const isInFrame = window.parent !== window
    const hasVisualEditingParams = window.location.search.includes('preview') || 
                                   window.location.search.includes('sanity-preview') ||
                                   window.location.search.includes('sanity-overlay')
    const isFromStudio = document.referrer.includes('localhost:3335') || 
                        document.referrer.includes('sanity.studio')
    
    const shouldEnableEditing = hasBypassCookie || isInFrame || hasVisualEditingParams || isFromStudio
    
    console.log('🎯 Visual editing setup conditions:', {
      hasBypassCookie,
      isInFrame,
      hasVisualEditingParams,
      isFromStudio,
      referrer: document.referrer,
      search: window.location.search,
      cookies: document.cookie.includes('__prerender_bypass') ? 'Draft mode cookie present' : 'No draft mode cookie',
      shouldEnableEditing,
      url: window.location.href
    })
    
    setIsDraftMode(shouldEnableEditing)
    
    if (shouldEnableEditing) {
      console.log('✅ Visual editing component activated')
      // Add a visual indicator in development
      if (process.env.NODE_ENV === 'development') {
        const indicator = document.createElement('div')
        indicator.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          background: #2196F3;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          z-index: 999999;
          pointer-events: none;
        `
        indicator.textContent = '👁️ Visual Editing Active'
        document.body.appendChild(indicator)
        
        // Remove after 3 seconds
        setTimeout(() => {
          if (document.body.contains(indicator)) {
            document.body.removeChild(indicator)
          }
        }, 3000)
      }
    } else {
      console.log('ℹ️ Visual editing conditions not met, staying in normal mode')
    }
  }, [])

  // Return null for now since visual editing is not essential for basic functionality
  return null
}
