const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
})

async function createDynamicNavigation() {
  console.log('🧭 Creating dynamic navigation structure...')

  try {
    // First check if navigation already exists
    const existingNav = await client.fetch('*[_type == "navigationMenu" && _id == "mainNav"][0]')
    
    if (existingNav) {
      console.log('⏭️  Main navigation already exists, updating...')
      
      // Update the existing navigation
      await client.patch('mainNav')
        .set({
          title: 'Main Navigation',
          items: [
            {
              name: 'Home',
              href: '/',
              order: 1,
              isVisible: true,
              openInNewTab: false
            },
            {
              name: 'Products',
              href: '/products',
              order: 2,
              isVisible: true,
              openInNewTab: false,
              megaMenu: [
                {
                  sectionTitle: 'Popular Categories',
                  sectionDescription: 'Our most requested printing services',
                  links: [
                    {
                      name: 'All Products',
                      href: '/products',
                      description: 'Browse our full catalog',
                      isHighlighted: true,
                      isVisible: true
                    },
                    {
                      name: 'Business Cards',
                      href: '/products/category/business-cards',
                      description: 'Professional business cards',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Flyers & Brochures',
                      href: '/products/category/flyers-brochures',
                      description: 'Marketing materials',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Postcards',
                      href: '/products/category/postcards',
                      description: 'Direct mail postcards',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Booklets',
                      href: '/products/category/booklets',
                      description: 'Multi-page booklets',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Catalogs',
                      href: '/products/category/catalogs',
                      description: 'Product catalogs',
                      isHighlighted: false,
                      isVisible: true
                    }
                  ]
                },
                {
                  sectionTitle: 'Business Essentials',
                  sectionDescription: 'Professional business materials',
                  links: [
                    {
                      name: 'Announcement Cards',
                      href: '/products/category/announcement-cards',
                      description: 'Special event announcements',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Letterhead',
                      href: '/products/category/letterhead',
                      description: 'Professional letterhead',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Envelopes',
                      href: '/products/category/envelopes',
                      description: 'Custom printed envelopes',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'NCR Forms',
                      href: '/products/category/ncr-forms',
                      description: 'Multi-part carbon forms',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Notepads',
                      href: '/products/category/notepads',
                      description: 'Custom memo pads',
                      isHighlighted: false,
                      isVisible: true
                    }
                  ]
                },
                {
                  sectionTitle: 'Specialty Items',
                  sectionDescription: 'Unique print products',
                  links: [
                    {
                      name: 'Bookmarks',
                      href: '/products/category/bookmarks',
                      description: 'Custom bookmark designs',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Calendars',
                      href: '/products/category/calendars',
                      description: 'Wall and desk calendars',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Door Hangers',
                      href: '/products/category/door-hangers',
                      description: 'Local marketing materials',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Table Tents',
                      href: '/products/category/table-tents',
                      description: 'Restaurant table displays',
                      isHighlighted: false,
                      isVisible: true
                    },
                    {
                      name: 'Counter Display Cards',
                      href: '/products/category/counter-display-cards',
                      description: 'Point-of-sale displays',
                      isHighlighted: false,
                      isVisible: true
                    }
                  ]
                }
              ]
            },
            {
              name: 'About Us',
              href: '/about',
              order: 3,
              isVisible: true,
              openInNewTab: false
            },
            {
              name: 'Contact',
              href: '/contact',
              order: 4,
              isVisible: true,
              openInNewTab: false
            }
          ]
        })
        .commit()
      
      console.log('✅ Updated existing navigation')
    } else {
      // Create new navigation document
      const navigationDoc = {
        _type: 'navigationMenu',
        _id: 'mainNav',
        title: 'Main Navigation',
        items: [
          {
            name: 'Home',
            href: '/',
            order: 1,
            isVisible: true,
            openInNewTab: false
          },
          {
            name: 'Products',
            href: '/products',
            order: 2,
            isVisible: true,
            openInNewTab: false,
            megaMenu: [
              {
                sectionTitle: 'Popular Categories',
                sectionDescription: 'Our most requested printing services',
                links: [
                  {
                    name: 'All Products',
                    href: '/products',
                    description: 'Browse our full catalog',
                    isHighlighted: true,
                    isVisible: true
                  },
                  {
                    name: 'Business Cards',
                    href: '/products/category/business-cards',
                    description: 'Professional business cards',
                    isHighlighted: false,
                    isVisible: true
                  },
                  {
                    name: 'Flyers & Brochures',
                    href: '/products/category/flyers-brochures',
                    description: 'Marketing materials',
                    isHighlighted: false,
                    isVisible: true
                  },
                  {
                    name: 'Postcards',
                    href: '/products/category/postcards',
                    description: 'Direct mail postcards',
                    isHighlighted: false,
                    isVisible: true
                  }
                ]
              },
              {
                sectionTitle: 'Business Essentials',
                sectionDescription: 'Professional business materials',
                links: [
                  {
                    name: 'Letterhead',
                    href: '/products/category/letterhead',
                    description: 'Professional letterhead',
                    isHighlighted: false,
                    isVisible: true
                  },
                  {
                    name: 'Envelopes',
                    href: '/products/category/envelopes',
                    description: 'Custom printed envelopes',
                    isHighlighted: false,
                    isVisible: true
                  },
                  {
                    name: 'NCR Forms',
                    href: '/products/category/ncr-forms',
                    description: 'Multi-part carbon forms',
                    isHighlighted: false,
                    isVisible: true
                  }
                ]
              },
              {
                sectionTitle: 'Specialty Items',
                sectionDescription: 'Unique printing solutions',
                links: [
                  {
                    name: 'Bookmarks',
                    href: '/products/category/bookmarks',
                    description: 'Custom bookmark designs',
                    isHighlighted: false,
                    isVisible: true
                  },
                  {
                    name: 'Calendars',
                    href: '/products/category/calendars',
                    description: 'Wall and desk calendars',
                    isHighlighted: false,
                    isVisible: true
                  },
                  {
                    name: 'Door Hangers',
                    href: '/products/category/door-hangers',
                    description: 'Local marketing materials',
                    isHighlighted: false,
                    isVisible: true
                  }
                ]
              }
            ]
          },
          {
            name: 'About Us',
            href: '/about',
            order: 3,
            isVisible: true,
            openInNewTab: false
          },
          {
            name: 'Contact',
            href: '/contact',
            order: 4,
            isVisible: true,
            openInNewTab: false
          }
        ]
      }

      console.log('📝 Creating new navigation document...')
      const result = await client.create(navigationDoc)
      console.log('✅ Created navigation document:', result._id)
    }

    // Validate the navigation was created/updated
    const finalNav = await client.fetch('*[_type == "navigationMenu" && _id == "mainNav"][0] { _id, title, items }')
    if (finalNav) {
      console.log(`\n🎉 Navigation successfully set up!`)
      console.log(`📋 Title: ${finalNav.title}`)
      console.log(`📊 Items: ${finalNav.items?.length || 0}`)
      
      finalNav.items?.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} -> ${item.href}`)
        if (item.megaMenu) {
          item.megaMenu.forEach(section => {
            console.log(`   [${section.sectionTitle}]`)
            section.links?.forEach(link => {
              console.log(`     - ${link.name} -> ${link.href}`)
            })
          })
        }
      })
    }
    
  } catch (error) {
    console.error('❌ Error creating navigation:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Navigation Setup Script')
    console.log('==========================\n')
    
    await createDynamicNavigation()
    
    console.log('\n✨ Navigation setup completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Check your Sanity Studio to see the navigation document')
    console.log('2. Test the frontend to see if navigation loads from Sanity')
    console.log('3. Customize the navigation in Sanity Studio as needed')
    
  } catch (error) {
    console.error('💥 Script failed:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { createDynamicNavigation }
