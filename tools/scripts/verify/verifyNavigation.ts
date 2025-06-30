// Use the existing sanity client from the web app
import { sanityClient } from '../apps/web/lib/sanity'

async function verifyNavigation() {
  try {
    console.log('🔍 Checking navigation data...')
    
    const result = await sanityClient.fetch(`
      *[_type == "navigationMenu" && _id == "mainNav"][0] {
        items[] {
          "name": title,
          "href": url,
          submenu[] {
            "name": title,
            "href": url
          }
        }
      }
    `)
    
    console.log('📊 Navigation data:')
    console.log(JSON.stringify(result, null, 2))
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to fetch navigation data:', error)
    process.exit(1)
  }
}

verifyNavigation()
