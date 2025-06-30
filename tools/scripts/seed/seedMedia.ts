// Media seeding script for Sanity Studio
import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'
import * as fs from 'fs'
import * as path from 'path'

interface MediaItem {
  title: string
  description: string
  category: 'product' | 'hero' | 'gallery' | 'icon' | 'logo' | 'other'
  tags: string[]
  alt: string
  fileName?: string
  url?: string
}

// Sample media data - you can replace these URLs with your own images
const sampleMediaData: MediaItem[] = [
  // Logo and Brand Assets
  {
    title: 'DigiPrintPlus Logo',
    description: 'Primary company logo for DigiPrintPlus digital printing services',
    category: 'logo',
    tags: ['logo', 'brand', 'identity'],
    alt: 'DigiPrintPlus company logo',
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop'
  },
  {
    title: 'Company Favicon',
    description: 'Small icon version of the logo for browser tabs',
    category: 'icon',
    tags: ['favicon', 'icon', 'brand'],
    alt: 'DigiPrintPlus favicon icon',
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop'
  },
  
  // Hero Images
  {
    title: 'Hero Background - Printing Press',
    description: 'High-quality printing press image for hero sections',
    category: 'hero',
    tags: ['hero', 'printing', 'background', 'machinery'],
    alt: 'Modern printing press in action',
    url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1920&h=1080&fit=crop'
  },
  {
    title: 'Hero Background - Business Cards',
    description: 'Stack of colorful business cards for hero sections',
    category: 'hero',
    tags: ['hero', 'business-cards', 'colorful', 'design'],
    alt: 'Stack of colorful business cards',
    url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop'
  },
  
  // Product Images
  {
    title: 'Premium Business Cards Sample',
    description: 'High-quality business cards with elegant design',
    category: 'product',
    tags: ['business-cards', 'premium', 'sample', 'elegant'],
    alt: 'Premium business cards sample',
    url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop'
  },
  {
    title: 'Standard Business Cards',
    description: 'Standard business cards in various colors',
    category: 'product',
    tags: ['business-cards', 'standard', 'colorful'],
    alt: 'Standard business cards in multiple colors',
    url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop'
  },
  {
    title: 'Brochure Printing Sample',
    description: 'Tri-fold brochure printing showcase',
    category: 'product',
    tags: ['brochure', 'tri-fold', 'marketing', 'print'],
    alt: 'Tri-fold brochure printing sample',
    url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop'
  },
  {
    title: 'Banner Printing Display',
    description: 'Large format banner printing examples',
    category: 'product',
    tags: ['banner', 'large-format', 'outdoor', 'advertising'],
    alt: 'Large format banner printing display',
    url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop'
  },
  
  // Gallery Images
  {
    title: 'Office Interior',
    description: 'Modern office space with printing equipment',
    category: 'gallery',
    tags: ['office', 'interior', 'workspace', 'professional'],
    alt: 'Modern office interior with printing equipment',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
  },
  {
    title: 'Team at Work',
    description: 'Professional team working on printing projects',
    category: 'gallery',
    tags: ['team', 'professional', 'work', 'collaboration'],
    alt: 'Professional team working on printing projects',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
  },
  {
    title: 'Quality Control Process',
    description: 'Quality control and inspection process in action',
    category: 'gallery',
    tags: ['quality', 'control', 'inspection', 'process'],
    alt: 'Quality control process for printed materials',
    url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop'
  },
  
  // Icons
  {
    title: 'Print Icon',
    description: 'Simple print icon for UI elements',
    category: 'icon',
    tags: ['icon', 'print', 'ui', 'interface'],
    alt: 'Print icon',
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop'
  },
  {
    title: 'Design Icon',
    description: 'Design tools icon for creative services',
    category: 'icon',
    tags: ['icon', 'design', 'creative', 'tools'],
    alt: 'Design tools icon',
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop'
  }
]

async function uploadImageFromUrl(url: string, filename: string): Promise<any> {
  try {
    console.log(`📸 Downloading and uploading: ${filename}`)
    
    // Use fetch to download the image
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    
    const buffer = Buffer.from(await response.arrayBuffer())
    
    // Upload to Sanity
    const imageAsset = await sanityClient.assets.upload('image', buffer, {
      filename: filename,
    })

    console.log(`✅ Image uploaded: ${imageAsset._id}`)
    return imageAsset
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error)
    throw error
  }
}

async function createMediaDocument(mediaItem: MediaItem, imageAsset: any): Promise<void> {
  try {
    const mediaDoc = {
      _type: 'media',
      _id: `media-${mediaItem.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      title: mediaItem.title,
      description: mediaItem.description,
      category: mediaItem.category,
      tags: mediaItem.tags,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id
        },
        alt: mediaItem.alt,
        caption: mediaItem.title
      }
    }

    const result = await sanityClient.createOrReplace(mediaDoc)
    console.log(`✅ Created media document: ${result._id}`)
  } catch (error) {
    console.error(`❌ Failed to create media document for ${mediaItem.title}:`, error)
    throw error
  }
}

async function seedMediaLibrary() {
  console.log('🌱 Starting media library seeding...')
  console.log(`📊 Will create ${sampleMediaData.length} media items`)
  
  try {
    let successCount = 0
    let errorCount = 0

    for (const mediaItem of sampleMediaData) {
      try {
        console.log(`\n📝 Processing: ${mediaItem.title}`)
        
        // Generate filename from title
        const filename = `${mediaItem.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`
        
        // Upload image from URL
        const imageAsset = await uploadImageFromUrl(mediaItem.url!, filename)
        
        // Create media document
        await createMediaDocument(mediaItem, imageAsset)
        
        successCount++
        console.log(`✅ Successfully processed: ${mediaItem.title}`)
      } catch (error) {
        errorCount++
        console.error(`❌ Failed to process ${mediaItem.title}:`, error)
        // Continue with next item instead of stopping
        continue
      }
    }

    console.log('\n🎉 Media library seeding completed!')
    console.log(`📊 Results:`)
    console.log(`   ✅ Success: ${successCount} items`)
    console.log(`   ❌ Errors: ${errorCount} items`)
    console.log(`   📁 Total processed: ${successCount + errorCount} items`)
    
    if (successCount > 0) {
      console.log('\n🔗 Media items are now available in your Sanity Studio:')
      console.log('   - Visit http://localhost:3334')
      console.log('   - Navigate to "Media" in the sidebar')
      console.log('   - Or go to "Media Library" in the desk structure')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Media seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding
if (require.main === module) {
  seedMediaLibrary()
}

export { seedMediaLibrary, sampleMediaData }
