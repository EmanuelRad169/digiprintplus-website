const { createClient } = require('@sanity/client')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'as5tildt',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-10-01',
})

async function addFinishingToNavigation() {
  try {
    console.log('🔍 Checking for existing navigation menu...')
    
    // Get the current navigation menu
    const navigationMenu = await client.fetch(`*[_type == "navigationMenu"][0]`)
    
    if (!navigationMenu) {
      console.log('❌ No navigation menu found. Please create one in Sanity Studio first.')
      return
    }
    
    console.log(`📋 Found navigation menu: "${navigationMenu.title}"`)
    
    // Check if Finishing already exists
    const existingFinishing = navigationMenu.items?.find(item => 
      item.name === 'Finishing' || item.href === '/finishing'
    )
    
    if (existingFinishing) {
      console.log('✅ Finishing link already exists in navigation')
      return
    }
    
    // Find Order Center section
    const orderCenterItem = navigationMenu.items?.find(item => 
      item.name === 'Order Center' || item.name === 'Services' || item.name === 'Products'
    )
    
    if (orderCenterItem && orderCenterItem.submenu) {
      // Add to existing Order Center submenu
      console.log('📝 Adding Finishing to Order Center submenu...')
      
      const updatedSubmenu = [
        ...orderCenterItem.submenu,
        {
          name: 'Finishing',
          href: '/finishing',
          description: 'Professional finishing services for your print materials',
          isVisible: true,
          openInNewTab: false
        }
      ]
      
      // Update the submenu
      await client
        .patch(navigationMenu._id)
        .set({
          'items': navigationMenu.items.map(item => 
            item === orderCenterItem 
              ? { ...item, submenu: updatedSubmenu }
              : item
          )
        })
        .commit()
      
      console.log('✅ Successfully added Finishing to Order Center submenu')
    } else {
      // Add as new top-level item if no Order Center found
      console.log('📝 Adding Finishing as new navigation item...')
      
      const newItem = {
        name: 'Finishing',
        href: '/finishing',
        order: (navigationMenu.items?.length || 0) + 1,
        isVisible: true,
        openInNewTab: false,
        submenu: [],
        megaMenu: []
      }
      
      const updatedItems = [
        ...(navigationMenu.items || []),
        newItem
      ]
      
      await client
        .patch(navigationMenu._id)
        .set({ 'items': updatedItems })
        .commit()
      
      console.log('✅ Successfully added Finishing as new navigation item')
    }
    
  } catch (error) {
    console.error('❌ Error updating navigation:', error)
  }
}

// Run the script
addFinishingToNavigation()