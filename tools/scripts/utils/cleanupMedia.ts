// Cleanup media library script
import { sanityClient } from '../apps/web/lib/sanity'

async function cleanupMediaLibrary() {
  console.log('🧹 Starting media library cleanup...')
  
  try {
    // Get all media documents
    const mediaItems = await sanityClient.fetch(`
      *[_type == "media"] {
        _id,
        title
      }
    `)

    console.log(`📊 Found ${mediaItems.length} media documents to delete`)

    if (mediaItems.length === 0) {
      console.log('✅ No media documents to clean up')
      return
    }

    // Delete all media documents
    for (const item of mediaItems) {
      console.log(`🗑️  Deleting: ${item.title}`)
      await sanityClient.delete(item._id)
    }

    console.log(`\n✅ Deleted ${mediaItems.length} media documents`)
    console.log('ℹ️  Note: Image assets remain in Sanity (they can be cleaned up via Studio)')
    console.log('\n🎉 Media library cleanup completed!')

  } catch (error) {
    console.error('❌ Media cleanup failed:', error)
    process.exit(1)
  }
}

cleanupMediaLibrary()
