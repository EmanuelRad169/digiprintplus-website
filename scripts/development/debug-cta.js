const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'as5tildt',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function testCTAFetch() {
  try {
    console.log('Testing CTA data fetch...')
    
    // Test all CTA sections
    const allCTA = await client.fetch(`
      *[_type == "ctaSection"] {
        _id,
        title,
        description,
        sectionId,
        isActive
      }
    `)
    console.log('All CTA sections:', allCTA)
    
    // Test specific homepage CTA
    const homepageCTA = await client.fetch(`
      *[_type == "ctaSection" && sectionId == "homepage-cta"][0] {
        _id,
        title,
        description,
        primaryButton,
        secondaryButton,
        highlights,
        backgroundColor,
        sectionId,
        isActive
      }
    `)
    console.log('Homepage CTA:', homepageCTA)
    
  } catch (error) {
    console.error('Error fetching CTA data:', error)
  }
}

testCTAFetch()
