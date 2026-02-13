import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function checkSiteSettings() {
  try {
    console.log('Checking for site settings document...')
    
    const query = '*[_type == "siteSettings"]'
    const settings = await client.fetch(query)
    
    if (settings && settings.length > 0) {
      console.log('✅ Found site settings document(s):', settings.length)
      console.log('First document:', JSON.stringify(settings[0], null, 2))
    } else {
      console.log('❌ No site settings document found')
      console.log('Creating a default site settings document...')
      
      const defaultSettings = {
        _type: 'siteSettings',
        title: 'DigiPrintPlus',
        description: 'Professional print solutions for your business',
        contact: {
          phone: '(949) 770-5000',
          email: 'order@digiprintplus.com',
          address: '9670 Research Dr, Irvine, CA 92618',
          businessHours: [
            { day: 'Mon - Fri', hours: '8:00 AM - 6:00 PM' },
            { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
            { day: 'Sunday', hours: 'Closed' }
          ]
        },
        seo: {
          metaTitle: 'DigiPrintPlus - Professional Print Solutions',
          metaDescription: 'Your trusted partner for high-quality printing services. Get instant quotes for business cards, brochures, banners, and more.',
          keywords: ['printing', 'business cards', 'brochures', 'banners', 'professional printing']
        }
      }
      
      const result = await client.create(defaultSettings)
      console.log('✅ Created default site settings:', result._id)
    }
  } catch (error) {
    console.error('❌ Error checking site settings:', error)
  }
}

checkSiteSettings()
