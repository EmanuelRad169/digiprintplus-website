/**
 * Script to add business hours to the site settings in Sanity
 */
const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// Read environment variables from .env.local file
const envFile = path.join(__dirname, '../../.env.local')
const envVars = {}

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      envVars[match[1]] = match[2].replace(/^["'](.*)["']$/, '$1')
    }
  })
}

// Configure the Sanity client
const client = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: envVars.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN, // Must have a token with write access
  useCdn: false,
  apiVersion: '2023-05-03'
})

// Business hours data to add
const businessHours = [
  { day: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 3:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
]

// Patch the site settings document
async function addBusinessHours() {
  try {
    // Get the site settings document
    const siteSettings = await client.fetch('*[_type == "siteSettings"][0]')
    
    if (!siteSettings) {
      console.error('No site settings document found')
      return
    }
    
    console.log('Current site settings:', siteSettings)
    
    // Prepare the contact info with business hours
    const contact = siteSettings.contact || {}
    contact.businessHours = businessHours
    
    // Update the document
    const result = await client
      .patch(siteSettings._id)
      .set({ contact })
      .commit()
    
    console.log('Successfully added business hours:', result)
  } catch (error) {
    console.error('Error adding business hours:', error)
  }
}

// Run the function
addBusinessHours()
