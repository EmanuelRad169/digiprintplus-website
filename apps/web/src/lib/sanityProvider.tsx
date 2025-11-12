'use client'

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react'
import type { SanityClient } from '@sanity/client'
import { getSanityClient } from './sanity'

// Types
interface SanityContextType {
  client: SanityClient
  isConnected: boolean
  connectionError: string | null
  query: <T = any>(query: string, params?: Record<string, any>) => Promise<T>
  mutate: (mutations: any[]) => Promise<any>
}

interface SanityProviderProps {
  children: React.ReactNode
}

interface QueryResult<T> {
  data: T | null
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
}

interface QueryOptions {
  initialData?: any
  enabled?: boolean
  staleTime?: number
  refetchOnWindowFocus?: boolean
}

// Create context
const SanityContext = createContext<SanityContextType | null>(null)

// Provider component
export function SanityProvider({ children }: SanityProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [client] = useState(() => getSanityClient())

  // Test connection on mount
  useEffect(() => {
    async function testConnection() {
      try {
        // Simple query to test connection
        await client.fetch('*[_type == "sanity.imageAsset"][0]')
        setIsConnected(true)
        setConnectionError(null)
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Sanity Provider: Connection established')
        }
      } catch (error: any) {
        setIsConnected(false)
        setConnectionError(error.message)
        
        console.error('❌ Sanity Provider: Connection failed:', error.message)
        
        // Handle specific authentication errors
        if (error.statusCode === 401) {
          console.error('🔐 Authentication failed. Token may be invalid.')
          console.error('💡 To fix this, ensure SANITY_API_TOKEN is set correctly.')
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          console.error('🌐 Network error. Check your internet connection or Sanity service status.')
        }
      }
    }

    testConnection()
  }, [client])

  // Query function with error handling
  const query = useCallback(async <T = any>(
    groqQuery: string, 
    params: Record<string, any> = {}
  ): Promise<T> => {
    try {
      const result = await client.fetch<T>(groqQuery, params)
      return result
    } catch (error: any) {
      console.error('Sanity query failed:', { query: groqQuery, params, error: error.message })
      throw new Error(`Sanity query failed: ${error.message}`)
    }
  }, [client])

  // Mutation function with error handling
  const mutate = useCallback(async (mutations: any[]): Promise<any> => {
    try {
      const result = await client.mutate(mutations)
      return result
    } catch (error: any) {
      console.error('Sanity mutation failed:', { mutations, error: error.message })
      throw new Error(`Sanity mutation failed: ${error.message}`)
    }
  }, [client])

  const value: SanityContextType = {
    client,
    isConnected,
    connectionError,
    query,
    mutate
  }

  return (
    <SanityContext.Provider value={value}>
      {children}
    </SanityContext.Provider>
  )
}

// Hook to use Sanity context
export function useSanity(): SanityContextType {
  const context = useContext(SanityContext)
  if (!context) {
    throw new Error('useSanity must be used within a SanityProvider')
  }
  return context
}

// Hook for queries with caching and loading states
export function useSanityQuery<T = any>(
  query: string,
  params?: Record<string, any>,
  options: QueryOptions = {}
): QueryResult<T> {
  const { query: sanityQuery } = useSanity()
  const [data, setData] = useState<T | null>(options.initialData || null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = false
  } = options

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await sanityQuery<T>(query, params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      console.error('useSanityQuery error:', err)
    } finally {
      setLoading(false)
    }
  }, [query, params, enabled, sanityQuery])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refetch on window focus (optional)
  useEffect(() => {
    if (!refetchOnWindowFocus) return

    const handleFocus = () => {
      // Only refetch if data is stale
      const now = Date.now()
      const lastFetch = data ? now : now - staleTime - 1
      
      if (now - lastFetch > staleTime) {
        fetchData()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetchOnWindowFocus, staleTime, fetchData, data])

  return {
    data,
    error,
    loading,
    refetch: fetchData
  }
}

// Hook for mutations
export function useSanityMutation() {
  const { mutate } = useSanity()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutateAsync = useCallback(async <T = any>(mutations: any[]): Promise<T> => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutate(mutations)
      return result as T
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Mutation failed')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [mutate])

  return {
    mutateAsync,
    loading,
    error
  }
}

// Connection status hook
export function useSanityConnection() {
  const { isConnected, connectionError } = useSanity()
  return { isConnected, connectionError }
}