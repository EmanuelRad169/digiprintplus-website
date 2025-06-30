'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
    // You can log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error} 
          retry={() => this.setState({ hasError: false })}
        />
      )
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  retry?: () => void
}

export function DefaultErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We&apos;re sorry, but there was an error loading this content. Please try again.
        </p>
        {error && process.env.NODE_ENV === 'development' && (
          <details className="text-left mb-6 p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <pre className="mt-2 text-sm text-red-600 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center px-4 py-2 bg-magenta-600 text-white rounded-lg hover:bg-magenta-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

export function ProductErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to load products
      </h3>
      <p className="text-gray-600 mb-4">
        There was an issue loading the product data.
      </p>
      {retry && (
        <button
          onClick={retry}
          className="text-magenta-600 hover:text-magenta-700 font-medium"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function TemplateErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to load templates
      </h3>
      <p className="text-gray-600 mb-4">
        There was an issue loading the template gallery.
      </p>
      {retry && (
        <button
          onClick={retry}
          className="text-magenta-600 hover:text-magenta-700 font-medium"
        >
          Try again
        </button>
      )}
    </div>
  )
}
