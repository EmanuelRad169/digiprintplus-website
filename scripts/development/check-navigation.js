const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN
})

async function checkNavigationData() {
  console.log('🔍 Checking navigation data from Sanity...\n')

  try {
    // Check for navigationMenu documents
    const navMenus = await client.fetch(`
      *[_type == "navigationMenu"] {
        _id,
        title,
        items[] {
          name,
          href,
          order,
          isVisible,
          megaMenu[] {
            sectionTitle,
            links[] {
              name,
              href,
              description
            }
          }
        }
      }
    `)

    console.log('📋 Navigation Menu documents found:', navMenus.length)
    navMenus.forEach((nav, index) => {
      console.log(`\n${index + 1}. Navigation: ${nav.title || nav._id}`)
      console.log(`   ID: ${nav._id}`)
      console.log(`   Items: ${nav.items?.length || 0}`)
      if (nav.items) {
        nav.items.forEach((item, i) => {
          console.log(`     ${i + 1}. ${item.name} → ${item.href} ${item.megaMenu ? '(HAS MEGA MENU)' : ''}`)
        })
      }
    })

    // Check specifically for mainNav document
    const mainNav = await client.fetch(`*[_id == "mainNav"][0]`)
    console.log('\n🎯 MainNav document:', mainNav ? 'Found' : 'Not found')
    if (mainNav) {
      console.log('   Type:', mainNav._type)
      console.log('   Items:', mainNav.items?.length || 0)
    }

    // Check what the fetcher function would return
    const fetcherResult = await client.fetch(`
      *[_type == "navigationMenu"] | order(_updatedAt desc)[0] {
        _id,
        title,
        items[] {
          name,
          href,
          order,
          isVisible,
          openInNewTab,
          submenu[] {
            name,
            href,
            description,
            isVisible,
            openInNewTab
          },
          megaMenu[] {
            sectionTitle,
            sectionDescription,
            links[] {
              name,
              href,
              description,
              isVisible,
              isHighlighted,
              openInNewTab
            }
          }
        }
      }
    `)

    console.log('\n📡 What the frontend fetcher would get:')
    console.log('   Document ID:', fetcherResult?._id)
    console.log('   Document Title:', fetcherResult?.title)
    console.log('   Items count:', fetcherResult?.items?.length || 0)
    if (fetcherResult?.items) {
      fetcherResult.items.forEach((item, i) => {
        console.log(`     ${i + 1}. ${item.name} → ${item.href}`)
        if (item.megaMenu) {
          console.log(`        🔥 MEGA MENU with ${item.megaMenu.length} sections`)
        }
      })
    }

  } catch (error) {
    console.error('❌ Error checking navigation:', error)
  }
}

checkNavigationData()