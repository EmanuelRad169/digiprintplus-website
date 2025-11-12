import { createClient, type SanityClient } from '@sanity/client'

// Configuration interface
interface SanityConfig {
  projectId: string
  dataset: string
  apiVersion: string
  token?: string
  useCdn: boolean
  perspective: 'published' | 'previewDrafts'
  studioUrl: string
}

// Validate environment variables
function validateSanityConfig(): SanityConfig {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
  const token = process.env.SANITY_API_TOKEN
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3335'

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in environment variables')
  }

  if (!dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET in environment variables')
  }

  // Warn if token is missing (not critical for read-only operations)
  if (!token && typeof window === 'undefined') {
    console.warn('⚠️  SANITY_API_TOKEN is missing. Write operations will fail.')
    console.warn('💡 To fix this, run: cd apps/studio && npx sanity login')
  }

  return {
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false, // Disable CDN for immediate updates
    perspective: 'published',
    studioUrl
  }
}

// Global configuration
let sanityConfig: SanityConfig
try {
  sanityConfig = validateSanityConfig()
} catch (error) {
  console.error('❌ Sanity configuration error:', error)
  throw error
}

// Enhanced client creation with authentication handling
const createSanityClient = (options: {
  useToken?: boolean
  perspective?: 'published' | 'previewDrafts'
  enableStega?: boolean
} = {}): SanityClient => {
  const { 
    useToken = false, 
    perspective = 'published',
    enableStega = false 
  } = options

  const isDraftMode = typeof window !== 'undefined' && 
    document.cookie.includes('__prerender_bypass')
  
  const finalPerspective = isDraftMode ? 'previewDrafts' : perspective
  const shouldUseToken = useToken && !!sanityConfig.token
  const shouldEnableStega = enableStega || isDraftMode || 
    (process.env.NODE_ENV === 'development')

  // Log client creation in development
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    console.log('🔌 Creating Sanity client:', {
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      perspective: finalPerspective,
      hasToken: shouldUseToken,
      stegaEnabled: shouldEnableStega,
      environment: process.env.NODE_ENV
    })
  }

  const client = createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    token: shouldUseToken ? sanityConfig.token : undefined,
    useCdn: sanityConfig.useCdn,
    perspective: finalPerspective,
    stega: shouldEnableStega ? {
      enabled: true,
      studioUrl: sanityConfig.studioUrl,
    } : undefined,
    ignoreBrowserTokenWarning: true,
    withCredentials: true,
  })

  return client
}

// Test connection function
async function testConnection(client: SanityClient): Promise<boolean> {
  try {
    const result = await client.fetch('*[_type == "sanity.imageAsset"][0]')
    return true
  } catch (error: any) {
    console.error('❌ Sanity connection test failed:', error.message)
    
    // Handle specific authentication errors
    if (error.statusCode === 401) {
      console.error('🔐 Authentication failed. Please check your SANITY_API_TOKEN.')
      console.error('💡 To fix this, run: cd apps/studio && npx sanity login')
    }
    
    return false
  }
}

// Client instances
export const sanityClient = createSanityClient({ useToken: true })
export const sanityClientNoToken = createSanityClient({ useToken: false })
export const visualEditingClient = createSanityClient({ 
  useToken: true, 
  perspective: 'previewDrafts',
  enableStega: true 
})

// Smart client selector
export const getSanityClient = (): SanityClient => {
  const isBrowser = typeof window !== 'undefined'
  const isDraftMode = isBrowser && document.cookie.includes('__prerender_bypass')
  
  if (isDraftMode) {
    return visualEditingClient
  }
  
  return isBrowser ? sanityClientNoToken : sanityClient
}

// Connection validation on module load (server-side only)
if (typeof window === 'undefined') {
  testConnection(sanityClient).then(isConnected => {
    if (isConnected) {
      console.log('✅ Sanity connection established')
    } else {
      console.log('⚠️  Sanity connection issues detected')
    }
  })
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
