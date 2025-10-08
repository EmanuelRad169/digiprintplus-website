import { createClient } from '@sanity/client'

if (!process.env.SANITY_API_TOKEN) {
  throw new Error('SANITY_API_TOKEN environment variable is required for seeding data')
}

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // We need this false for mutating data
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01'
})
