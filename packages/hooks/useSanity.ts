import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { getSanityClient } from '@/lib/sanity'

// SWR fetcher function for Sanity queries
const sanityFetcher = (query: string) => getSanityClient().fetch(query)

// Hook for mutable data (frequently changing)
export function useSanityQuery<T = any>(query: string, options?: any) {
  return useSWR<T>(query, sanityFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 60000, // Refresh every minute
    ...options
  })
}

// Hook for immutable data (rarely changing)
export function useSanityQueryImmutable<T = any>(query: string, options?: any) {
  return useSWRImmutable<T>(query, sanityFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...options
  })
}

// Hook for data with parameters
export function useSanityQueryWithParams<T = any>(
  query: string, 
  params: Record<string, any>, 
  options?: any
) {
  const queryWithParams = query.includes('$') ? [query, params] : query
  
  return useSWR<T>(
    queryWithParams,
    ([q, p]) => getSanityClient().fetch(q, p),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // More frequent for parameterized queries
      ...options
    }
  )
}

// Preload function for critical data
export function preloadSanityQuery(query: string, params?: Record<string, any>) {
  const client = getSanityClient()
  if (params) {
    return client.fetch(query, params)
  }
  return client.fetch(query)
}

// Global SWR configuration
export const swrConfig = {
  refreshInterval: 60000,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  onError: (error: Error) => {
    console.error('SWR Error:', error)
    // You can add error reporting here (e.g., Sentry)
  }
}
