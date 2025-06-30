// Image upload utility for Sanity
import { sanityClient } from '../apps/web/lib/sanity'
import * as fs from 'fs'
import * as path from 'path'

interface ImageUploadOptions {
  filePath: string
  alt: string
  title?: string
}

async function uploadImage({ filePath, alt, title }: ImageUploadOptions) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    console.log(`📸 Uploading image: ${path.basename(filePath)}`)
    
    const imageAsset = await sanityClient.assets.upload('image', fs.createReadStream(filePath), {
      filename: path.basename(filePath),
    })

    console.log(`✅ Image uploaded: ${imageAsset._id}`)

    return {
      _type: 'image',
      _id: imageAsset._id,
      asset: {
        _type: 'reference',
        _ref: imageAsset._id
      },
      alt,
      title: title || alt
    }
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error)
    throw error
  }
}

async function seedImages() {
  console.log('🌱 Starting image seeding...')
  
  try {
    // Create assets directory if it doesn't exist
    const assetsDir = path.join(__dirname, '../assets')
    if (!fs.existsSync(assetsDir)) {
      console.log('📁 Creating assets directory...')
      fs.mkdirSync(assetsDir, { recursive: true })
      console.log('ℹ️  Please add your images to the /assets directory and run this script again.')
      console.log('📋 Expected images:')
      console.log('  - logo.png (Company logo)')
      console.log('  - hero-bg.jpg (Hero background)')
      console.log('  - business-cards-sample.jpg (Business cards sample)')
      console.log('  - admin-avatar.jpg (Admin user avatar)')
      process.exit(0)
    }

    // Check for common image files
    const imageFiles = [
      { file: 'logo.png', alt: 'DigiPrintPlus Logo', docId: 'siteSettings', field: 'logo' },
      { file: 'hero-bg.jpg', alt: 'Hero Background', docId: 'homePage', field: 'heroImage' },
      { file: 'business-cards-sample.jpg', alt: 'Business Cards Sample', docId: 'product-standard-business-cards', field: 'images[0]' },
      { file: 'admin-avatar.jpg', alt: 'Admin Avatar', docId: 'user-admin', field: 'avatar' }
    ]

    const uploadedImages = []

    for (const imageFile of imageFiles) {
      const filePath = path.join(assetsDir, imageFile.file)
      
      if (fs.existsSync(filePath)) {
        const uploadedImage = await uploadImage({
          filePath,
          alt: imageFile.alt,
          title: imageFile.alt
        })
        
        uploadedImages.push({
          ...uploadedImage,
          docId: imageFile.docId,
          field: imageFile.field
        })
      } else {
        console.log(`⚠️  Skipping ${imageFile.file} (file not found)`)
      }
    }

    // Update documents with uploaded images
    for (const image of uploadedImages) {
      console.log(`🔗 Updating ${image.docId} with image...`)
      
      if (image.field === 'images[0]') {
        // Handle array field for products
        await sanityClient
          .patch(image.docId)
          .setIfMissing({ images: [] })
          .insert('after', 'images[-1]', [image])
          .commit()
      } else {
        // Handle single image field
        await sanityClient
          .patch(image.docId)
          .set({ [image.field]: image })
          .commit()
      }
      
      console.log(`✅ Updated ${image.docId}`)
    }

    console.log('\n🎉 Image seeding completed!')
    console.log(`📊 Uploaded ${uploadedImages.length} images`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Image seeding failed:', error)
    process.exit(1)
  }
}

// Check if script is called with specific image upload
const imagePath = process.argv[2]
const imageAlt = process.argv[3]

if (imagePath && imageAlt) {
  console.log('📸 Single image upload mode')
  uploadImage({ filePath: imagePath, alt: imageAlt })
    .then((result) => {
      console.log('✅ Upload completed:', result)
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Upload failed:', error)
      process.exit(1)
    })
} else {
  seedImages()
}
