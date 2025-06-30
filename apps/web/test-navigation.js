// Test script to verify navigation fetcher works
const { getNavigationMenu } = require('./lib/sanity/fetchers.ts')

async function testNavigation() {
  try {
    console.log('Testing navigation fetcher...')
    const navigation = await getNavigationMenu()
    console.log('Navigation data:', JSON.stringify(navigation, null, 2))
    
    if (navigation && navigation.items) {
      console.log(`✓ Found ${navigation.items.length} navigation items`)
      
      // Check for mega menu data
      const productsItem = navigation.items.find(item => 
        item.name.toLowerCase().includes('product')
      )
      
      if (productsItem && productsItem.megaMenu) {
        console.log(`✓ Found mega menu with ${productsItem.megaMenu.length} sections`)
        productsItem.megaMenu.forEach((section, index) => {
          console.log(`  Section ${index + 1}: ${section.sectionTitle} (${section.links.length} links)`)
        })
      } else {
        console.log('ℹ No mega menu found for Products item')
      }
    } else {
      console.log('⚠ No navigation items found')
    }
  } catch (error) {
    console.error('❌ Error testing navigation:', error)
  }
}

testNavigation()
