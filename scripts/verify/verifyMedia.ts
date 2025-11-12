// Verify media seeding results
import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'

async function verifyMediaData() {
  console.log('🔍 Verifying media library data...\n')
  
  try {
    // Define a type for media items
    type MediaItem = {
      _id: string
      title: string
      description: string
      category: string
      tags: string[]
      imageUrl: string
      imageAlt: string
      _createdAt: string
    }

    // Get all media documents
    const mediaItems: MediaItem[] = await sanityClient.fetch(`
      *[_type == "media"] | order(_createdAt desc) {
        _id,
        title,
        description,
        category,
        tags,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        _createdAt
      }
    `)

    console.log(`📊 Found ${mediaItems.length} media items:\n`)

    // Group by category
    const categories = mediaItems.reduce((acc: Record<string, MediaItem[]>, item: MediaItem) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    }, {} as Record<string, MediaItem[]>)

    Object.entries(categories).forEach(([category, items]) => {
      console.log(`📁 ${category.toUpperCase()} (${items.length} items):`)
      items.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title}`)
        console.log(`      Description: ${item.description}`)
        console.log(`      Tags: ${item.tags.join(', ')}`)
        console.log(`      Alt Text: ${item.imageAlt}`)
        console.log(`      Image URL: ${item.imageUrl}`)
        console.log('')
      })
    })

    // Get total image assets
    const totalAssets = await sanityClient.fetch(`
      count(*[_type == "sanity.imageAsset"])
    `)

    console.log(`📸 Total image assets in Sanity: ${totalAssets}`)
    console.log('\n✅ Media verification completed!')

  } catch (error) {
    console.error('❌ Media verification failed:', error)
  }
}

verifyMediaData()
