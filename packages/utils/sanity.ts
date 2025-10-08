import { createClient } from '@sanity/client'

// Create different client configurations for server and client-side
const createSanityClient = (useToken = false) => {
  const isDraftMode = typeof window !== 'undefined' && document.cookie.includes('__prerender_bypass')
  
  // Log visual editing status for debugging
  if (typeof window !== 'undefined') {
    console.log('Creating Sanity client:', {
      environment: process.env.NODE_ENV,
      isDraftMode,
      stegaEnabled: isDraftMode || process.env.NODE_ENV === 'development',
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.substring(0, 5) + '...',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!useToken && !!process.env.SANITY_API_TOKEN,
    })
  }
  
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: useToken ? process.env.SANITY_API_TOKEN : undefined, // Only use token on server-side
    useCdn: false, // Disable CDN for immediate updates from CMS
    apiVersion: '2024-01-01',
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: {
      enabled: isDraftMode || process.env.NODE_ENV === 'development', // Enable stega for visual editing
      studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3335',
    },
    // Add CORS and connectivity settings for browser usage
    ignoreBrowserTokenWarning: true,
    withCredentials: true,
  })
}

// For server-side operations (with token)
export const sanityClient = createSanityClient(true)

// For client-side operations (without token)
export const sanityClientNoToken = createSanityClient(false)

// Create a visual editing client with stega always enabled
export const visualEditingClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-01',
  perspective: 'previewDrafts',
  stega: {
    enabled: true,
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3335',
  },
  ignoreBrowserTokenWarning: true,
  withCredentials: true,
})

// Helper to determine which client to use
export const getSanityClient = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined'
  const isDraftMode = isBrowser && document.cookie.includes('__prerender_bypass')
  
  // Use visual editing client in draft mode
  if (isDraftMode) {
    return visualEditingClient
  }
  
  return isBrowser ? sanityClientNoToken : sanityClient
}

export async function createQuoteRequest(formData: any) {
  try {
    const quoteRequest = {
      _type: 'quoteRequest',
      status: 'new',
      priority: 'normal',
      contact: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || undefined,
      },
      jobSpecs: {
        productType: formData.productType,
        quantity: formData.quantity,
        size: formData.size || undefined,
        paperType: formData.paperType || undefined,
        finish: formData.finish || undefined,
        turnaround: formData.turnaround,
        additionalNotes: formData.additionalNotes || undefined,
      },
      // Note: File uploads would need additional handling
      submittedAt: new Date().toISOString(),
    }

    // Always use the server-side client for mutations
    const result = await sanityClient.create(quoteRequest)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating quote request:', error)
    return { success: false, error }
  }
}
