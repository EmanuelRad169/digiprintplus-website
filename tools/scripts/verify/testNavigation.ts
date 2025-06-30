// Test navigation fetch
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  token: 'sk4iHYpe9SjzzFPx6uHU4ilpBX9yJLyVMC1y6idPZ8kWrjN2bXGXjd8BAICuiLyNuI5sI6Yz2QLMu1YubsIjw0YiE0OsgEVlft9ujpgDCkbSxbF5kKdlUYXUH6xilfWnjcNPZIo5gqbIutcsN0ctk25bS5UXIFa6Z70xDqzt3DACB1VXvJkE',
  useCdn: false,
  apiVersion: '2023-05-03',
})

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
