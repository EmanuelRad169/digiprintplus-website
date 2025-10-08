'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ProductsError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Something went wrong</h2>
        <p className="text-slate-600 mb-8">
          We encountered an error while loading the products page. Please try again or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-slate-300 text-slate-700 hover:border-slate-400 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
