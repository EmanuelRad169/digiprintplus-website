// Comprehensive verification script for all Sanity CMS data
import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'

async function verifyAllData() {
  console.log('🔍 Verifying all Sanity CMS data...\n')

  try {
    // Verify Site Settings
    console.log('🏢 Checking Site Settings...')
    const siteSettings = await sanityClient.fetch(`*[_type == "siteSettings"][0]`)
    if (siteSettings) {
      console.log(`✅ Site Settings found: ${siteSettings.title}`)
    } else {
      console.log('❌ Site Settings not found')
    }

    // Verify Navigation Menu
    console.log('\n🧭 Checking Navigation Menu...')
    const navigationMenu = await sanityClient.fetch(`*[_type == "navigationMenu"][0]`)
    if (navigationMenu) {
      console.log(`✅ Navigation Menu found with ${navigationMenu.items?.length || 0} items`)
      navigationMenu.items?.forEach((item: any, index: number) => {
        console.log(`   ${index + 1}. ${item.title} (${item.url})`)
      })
    } else {
      console.log('❌ Navigation Menu not found')
    }

    // Verify Product Categories
    console.log('\n📂 Checking Product Categories...')
    const categories = await sanityClient.fetch(`*[_type == "productCategory"] | order(name asc)`)
    console.log(`✅ Found ${categories.length} product categories:`)
    categories.forEach((category: any, index: number) => {
      console.log(`   ${index + 1}. ${category.name} (${category.slug?.current})`)
    })

    // Verify Products
    console.log('\n📦 Checking Products...')
    const products = await sanityClient.fetch(`
      *[_type == "product"] | order(title asc) {
        _id,
        title,
        slug,
        category->{name},
        featured,
        popular,
        specifications,
        features
      }
    `)
    console.log(`✅ Found ${products.length} products:`)
    products.forEach((product: any, index: number) => {
      const status = []
      if (product.featured) status.push('Featured')
      if (product.popular) status.push('Popular')
      const statusText = status.length > 0 ? ` [${status.join(', ')}]` : ''
      console.log(`   ${index + 1}. ${product.title} (${product.category?.name})${statusText}`)
      console.log(`      - Specifications: ${product.specifications?.length || 0} items`)
      console.log(`      - Features: ${product.features?.length || 0} items`)
    })

    // Verify Pages
    console.log('\n📄 Checking Pages...')
    const pages = await sanityClient.fetch(`*[_type == "page"] | order(title asc)`)
    console.log(`✅ Found ${pages.length} pages:`)
    pages.forEach((page: any, index: number) => {
      console.log(`   ${index + 1}. ${page.title} (/${page.slug?.current})`)
      console.log(`      - Content blocks: ${page.content?.length || 0}`)
    })

    // Verify Quote Requests
    console.log('\n💬 Checking Quote Requests...')
    const quotes = await sanityClient.fetch(`
      *[_type == "quoteRequest"] | order(_createdAt desc) {
        _id,
        status,
        priority,
        contact,
        jobSpecs,
        estimatedTotal,
        _createdAt
      }
    `)
    console.log(`✅ Found ${quotes.length} quote requests:`)
    quotes.forEach((quote: any, index: number) => {
      const date = new Date(quote._createdAt).toLocaleDateString()
      const priority = quote.priority ? ` [${quote.priority.toUpperCase()}]` : ''
      console.log(`   ${index + 1}. ${quote.contact?.firstName} ${quote.contact?.lastName} - ${quote.status}${priority} (${date})`)
      console.log(`      - Product: ${quote.jobSpecs?.productType || 'N/A'}`)
      console.log(`      - Quantity: ${quote.jobSpecs?.quantity || 'N/A'}`)
      console.log(`      - Estimated: $${quote.estimatedTotal || 'N/A'}`)
    })

    // Verify User Profiles
    console.log('\n👥 Checking User Profiles...')
    const users = await sanityClient.fetch(`*[_type == "userProfile"] | order(displayName asc)`)
    console.log(`✅ Found ${users.length} user profiles:`)
    users.forEach((user: any, index: number) => {
      console.log(`   ${index + 1}. ${user.displayName} (${user.email}) - ${user.role}`)
    })

    // Verify Assets
    console.log('\n🖼️  Checking Assets...')
    const assets = await sanityClient.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc)`)
    console.log(`✅ Found ${assets.length} image assets:`)
    assets.slice(0, 10).forEach((asset: any, index: number) => {
      const size = asset.size ? `${(asset.size / 1024).toFixed(1)}KB` : 'Unknown size'
      console.log(`   ${index + 1}. ${asset.originalFilename || 'Unnamed'} (${size})`)
    })
    if (assets.length > 10) {
      console.log(`   ... and ${assets.length - 10} more assets`)
    }

    console.log('\n🎉 Data verification completed!')
    
    // Summary
    console.log('\n📊 Summary:')
    console.log(`   🏢 Site Settings: ${siteSettings ? '✅' : '❌'}`)
    console.log(`   🧭 Navigation Menu: ${navigationMenu ? '✅' : '❌'}`)
    console.log(`   📂 Product Categories: ${categories.length}`)
    console.log(`   📦 Products: ${products.length}`)
    console.log(`   📄 Pages: ${pages.length}`)
    console.log(`   💬 Quote Requests: ${quotes.length}`)
    console.log(`   👥 User Profiles: ${users.length}`)
    console.log(`   🖼️  Image Assets: ${assets.length}`)

  } catch (error) {
    console.error('❌ Error verifying data:', error)
    process.exit(1)
  }
}

verifyAllData()
