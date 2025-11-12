// Test navigation fetch
import { sanityClient } from '../../sanityClient'

async function testNavigationFetch() {
  try {
    console.log('🔍 Testing navigation fetch...')
    
    const result = await sanityClient.fetch(`
      *[_type == "navigationMenu" && _id == "mainNav"][0] {
        items[] {
          "name": title,
          "href": url,
          submenu[] {
            "name": title,
            "href": url
          },
          megaMenu[] {
            sectionTitle,
            links[] {
              "name": title,
              href,
              description
            }
          }
        }
      }
    `)
    
    console.log('✅ Navigation fetch successful!')
    console.log('📄 Result:', JSON.stringify(result, null, 2))
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to fetch navigation:', error)
    process.exit(1)
  }
}

testNavigationFetch()
