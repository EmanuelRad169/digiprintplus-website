const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

async function restoreProductMegaMenu() {
  console.log('🔄 Restoring Product Mega Menu with existing categories...\n')

  try {
    // Get all existing product categories
    const categories = await client.fetch(`
      *[_type == "productCategory" && defined(slug.current)] | order(name asc) {
        _id,
        name,
        slug,
        description
      }
    `)

    console.log(`📦 Found ${categories.length} product categories with slugs`)

    // Group categories into the 3 mega menu sections
    const popularCategories = [
      'business-cards',
      'announcement-cards', 
      'booklets',
      'bookmarks',
      'calendars'
    ]

    const businessEssentials = [
      'counter-display-cards',
      'door-hangers', 
      'envelopes',
      'flyers-and-brochures'
    ]

    const specialtyItems = [
      'ncr-forms',
      'notepads',
      'postcards',
      'table-tents',
      'catalogs'
    ]

    // Create mega menu structure
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
          ...categories
            .filter(cat => popularCategories.includes(cat.slug?.current))
            .map(cat => ({
              name: cat.name || cat.slug.current.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              href: `/products/category/${cat.slug.current}`,
              description: cat.description || `Professional ${cat.name || cat.slug.current.replace(/-/g, ' ')} printing services`
            }))
        ]
      },
      {
        sectionTitle: 'Business Essentials',
        sectionDescription: 'Essential materials for your business',
        links: categories
          .filter(cat => businessEssentials.includes(cat.slug?.current))
          .map(cat => ({
            name: cat.name || cat.slug.current.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            href: `/products/category/${cat.slug.current}`,
            description: cat.description || `Professional ${cat.name || cat.slug.current.replace(/-/g, ' ')} for your business needs`
          }))
      },
      {
        sectionTitle: 'Specialty Items',
        sectionDescription: 'Unique printing solutions',
        links: categories
          .filter(cat => specialtyItems.includes(cat.slug?.current))
          .map(cat => ({
            name: cat.name || cat.slug.current.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            href: `/products/category/${cat.slug.current}`,
            description: cat.description || `Specialized ${cat.name || cat.slug.current.replace(/-/g, ' ')} printing services`
          }))
      }
    ]

    // Update the navigation with mega menu
    const result = await client
      .patch('mainNav')
      .setIfMissing({ items: [] })
      .set({
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
      .commit()

    console.log('✅ Successfully updated navigation with mega menu!')
    console.log(`📋 Mega menu sections created:`)
    megaMenuSections.forEach((section, i) => {
      console.log(`  ${i + 1}. ${section.sectionTitle} (${section.links.length} links)`)
      section.links.forEach(link => {
        console.log(`     - ${link.name} → ${link.href}`)
      })
    })

  } catch (error) {
    console.error('❌ Error restoring mega menu:', error)
    if (error.message.includes('permission')) {
      console.log('\n💡 To fix permission issues:')
      console.log('1. Get a write token from Sanity Dashboard')
      console.log('2. Add it to your .env file as SANITY_API_TOKEN=your_token')
      console.log('3. Or create the navigation manually in Sanity Studio')
    }
  }
}

restoreProductMegaMenu()
