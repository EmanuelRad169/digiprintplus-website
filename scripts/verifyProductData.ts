import { sanityClient } from '../apps/web/lib/sanity'

async function verifyProductData() {
  try {
    console.log('🔍 Verifying product data integrity...\n')
    
    // Check product categories
    const categories = await sanityClient.fetch(`
      *[_type == "productCategory"] | order(order asc) {
        _id,
        title,
        "slug": slug.current,
        icon,
        order,
        "productCount": count(*[_type == "product" && references(^._id)])
      }
    `)
    
    console.log('📁 Product Categories:')
    categories.forEach((cat: any) => {
      console.log(`   ✅ ${cat.title || 'Untitled'} (${cat.slug}) - ${cat.productCount} products`)
    })
    
    // Check products
    const products = await sanityClient.fetch(`
      *[_type == "product"] | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        "categoryTitle": category->title,
        "categorySlug": category->slug.current,
        popular,
        featured,
        "specsCount": count(specifications),
        "featuresCount": count(features),
        "hasImage": defined(image.asset),
        "hasLongDescription": defined(longDescription)
      }
    `)
    
    console.log(`\n📦 Products (${products.length} total):`)
    products.forEach((prod: any) => {
      const badges = []
      if (prod.popular) badges.push('POPULAR')
      if (prod.featured) badges.push('FEATURED')
      
      console.log(`   ✅ ${prod.title}`)
      console.log(`      Category: ${prod.categoryTitle} (${prod.categorySlug})`)
      console.log(`      Specs: ${prod.specsCount}, Features: ${prod.featuresCount}`)
      console.log(`      Image: ${prod.hasImage ? 'Yes' : 'No'}, Long Desc: ${prod.hasLongDescription ? 'Yes' : 'No'}`)
      if (badges.length > 0) console.log(`      Badges: ${badges.join(', ')}`)
      console.log('')
    })
    
    // Summary
    const totalProducts = products.length
    const totalCategories = categories.filter((c: any) => c.title).length
    const featuredCount = products.filter((p: any) => p.featured).length
    const popularCount = products.filter((p: any) => p.popular).length
    
    console.log('📊 Summary:')
    console.log(`   Categories: ${totalCategories}`)
    console.log(`   Products: ${totalProducts}`)
    console.log(`   Featured: ${featuredCount}`)
    console.log(`   Popular: ${popularCount}`)
    console.log(`   Products with images: ${products.filter((p: any) => p.hasImage).length}`)
    console.log(`   Products with long descriptions: ${products.filter((p: any) => p.hasLongDescription).length}`)
    
    console.log('\n✅ Data verification completed successfully!')
    
  } catch (error) {
    console.error('❌ Error verifying product data:', error)
    throw error
  }
}

verifyProductData()
