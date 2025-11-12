'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-6xl mb-6">😕</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => reset()}
          className="bg-[#ea088c] hover:bg-[#d0077e] text-white font-medium py-2 px-4 rounded-lg"
        >
          Try again
        </button>
        <Link href="/" className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50">
          Return home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-gray-500">
          Error digest: {error.digest}
        </p>
      )}
    </div>
  )
}
