// Use the existing sanity client from the web app
import { sanityClient } from '../apps/web/lib/sanity'
import type { NavigationMenu, SeedResult } from './types'

const navigationData: NavigationMenu = {
  _id: 'mainNav',
  _type: 'navigationMenu',
  title: 'Main Navigation',
  items: [
    {
      _key: 'home',
      title: 'Home',
      url: '/'
    },
    {
      _key: 'products',
      title: 'Products',
      url: '/products',
      submenu: [
        {
          _key: 'business-cards',
          title: 'Business Cards',
          url: '/products/category/business-cards'
        },
        {
          _key: 'flyers-brochures',
          title: 'Flyers & Brochures',
          url: '/products/category/flyers'
        },
        {
          _key: 'stickers',
          title: 'Stickers',
          url: '/products/category/stickers'
        }
      ],
      megaMenu: [
        {
          _key: 'marketing-materials',
          sectionTitle: 'MARKETING MATERIALS',
          links: [
            {
              _key: 'business-cards',
              title: 'Business Cards',
              href: '/products/category/business-cards',
              description: 'Professional cards that make lasting impressions'
            },
            {
              _key: 'flyers-brochures',
              title: 'Flyers & Brochures',
              href: '/products/category/flyers',
              description: 'Eye-catching marketing materials'
            },
            {
              _key: 'stickers',
              title: 'Stickers',
              href: '/products/category/stickers',
              description: 'Custom stickers for branding and promotion'
            }
          ]
        }
      ]
    },
    {
      _key: 'services',
      title: 'Services',
      url: '/services'
    },
    {
      _key: 'templates',
      title: 'Templates',
      url: '/templates'
    },
    {
      _key: 'about',
      title: 'About',
      url: '/about'
    },
    {
      _key: 'contact',
      title: 'Contact',
      url: '/contact'
    },
    {
      _key: 'quote',
      title: 'Get Quote',
      url: '/quote'
    }
  ]
}

async function seedNavigation(): Promise<SeedResult> {
  try {
    console.log('🌱 Seeding navigation menu...')
    
    // Create or replace the mainNav document
    const result = await sanityClient.createOrReplace(navigationData)
    
    console.log('✅ Navigation menu seeded successfully!')
    console.log('📄 Document ID:', result._id)
    console.log('🔗 Items created:', result.items?.length || 0)
    
    return {
      success: true,
      documentsCreated: 1
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Failed to seed navigation menu:', errorMessage)
    return {
      success: false,
      documentsCreated: 0,
      errors: [errorMessage]
    }
  }
}

// Execute the seeding function
seedNavigation().then((result) => {
  if (result.success) {
    console.log(`✅ Successfully seeded ${result.documentsCreated} document(s)`)
    process.exit(0)
  } else {
    console.error('❌ Seeding failed:', result.errors?.join(', '))
    process.exit(1)
  }
}).catch((error) => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})
