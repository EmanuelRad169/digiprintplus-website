const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

async function createNavigationFromScratch() {
  console.log('🔄 Creating new navigation with mega menu...\n')

  try {
    // First, let's try to create instead of patch
    const megaMenuSections = [
      {
        sectionTitle: 'Popular Categories',
        sectionDescription: 'Our most requested printing services',
        links: [
          {
            name: 'All Products',
            href: '/products',
            description: 'Browse our full catalog',
            isHighlighted: true
          },
          {
            name: 'Business Cards',
            href: '/products/category/business-cards',
            description: 'Professional business cards that make a lasting impression'
          },
          {
            name: 'Announcement Cards',
            href: '/products/category/announcement-cards',
            description: 'Large format printing for events and displays'
          },
          {
            name: 'Booklets',
            href: '/products/category/booklets',
            description: 'Multi-page booklets for detailed information'
          },
          {
            name: 'Bookmarks',
            href: '/products/category/bookmarks',
            description: 'Professional product catalogs and lookbooks'
          },
          {
            name: 'Calendars',
            href: '/products/category/calendars',
            description: 'Custom calendars for your business or personal use'
          }
        ]
      },
      {
        sectionTitle: 'Business Essentials',
        sectionDescription: 'Essential materials for your business',
        links: [
          {
            name: 'Counter Display Cards',
            href: '/products/category/counter-display-cards',
            description: 'Eye-catching point-of-sale marketing materials'
          },
          {
            name: 'Door Hangers',
            href: '/products/category/door-hangers',
            description: 'Direct marketing materials for door-to-door campaigns'
          },
          {
            name: 'Envelopes',
            href: '/products/category/envelopes',
            description: 'Professional envelopes for all your mailing needs'
          },
          {
            name: 'Flyers & Brochures',
            href: '/products/category/flyers-and-brochures',
            description: 'Professional brochures and booklets for marketing'
          }
        ]
      },
      {
        sectionTitle: 'Specialty Items',
        sectionDescription: 'Unique printing solutions',
        links: [
          {
            name: 'NCR Forms',
            href: '/products/category/ncr-forms',
            description: 'Carbonless forms for invoices and receipts'
          },
          {
            name: 'Notepads',
            href: '/products/category/notepads',
            description: 'Custom notepads for your business or personal use'
          },
          {
            name: 'Postcards',
            href: '/products/category/postcards',
            description: 'Direct mail postcards for marketing campaigns'
          },
          {
            name: 'Table Tents',
            href: '/products/category/table-tents',
            description: 'Table-top marketing displays for restaurants and events'
          },
          {
            name: 'Catalogs',
            href: '/products/category/catalogs',
            description: 'Professional product catalogs and lookbooks'
          }
        ]
      }
    ]

    // Try creating a new navigation document with a different ID
    const result = await client.create({
      _id: 'navigation-' + Date.now(),
      _type: 'navigationMenu',
      title: 'Main Navigation with Mega Menu',
      items: [
        {
          name: 'Home',
          href: '/',
          order: 1,
          isVisible: true
        },
        {
          name: 'Products',
          href: '/products',
          order: 2,
          isVisible: true,
          megaMenu: megaMenuSections
        },
        {
          name: 'Services',
          href: '/services',
          order: 3,
          isVisible: true
        },
        {
          name: 'Templates',
          href: '/templates',
          order: 4,
          isVisible: true
        },
        {
          name: 'About',
          href: '/about',
          order: 5,
          isVisible: true
        },
        {
          name: 'Contact',
          href: '/contact',
          order: 6,
          isVisible: true
        },
        {
          name: 'Get Quote',
          href: '/quote',
          order: 7,
          isVisible: true
        }
      ]
    })

    console.log('✅ Successfully created new navigation with mega menu!')
    console.log('📋 Document ID:', result._id)
    console.log('🎯 Now update your fetcher to use this new document ID')

  } catch (error) {
    console.error('❌ Error creating navigation:', error.message)
    console.log('\n📋 MANUAL SETUP REQUIRED:')
    console.log('Please follow the MEGA_MENU_SETUP_GUIDE.md for manual setup')
  }
}

createNavigationFromScratch()
