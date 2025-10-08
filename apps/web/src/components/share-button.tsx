'use client'

import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
  excerpt?: string
}

export function ShareButton({ title, excerpt }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: excerpt || '',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <button 
      onClick={handleShare}
      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  )
}