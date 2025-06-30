const { createClient } = require('@sanity/client')

// Create Sanity client for seeding
const sanityClient = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  token: process.env.SANITY_API_TOKEN || 'sk4iHYpe9SjzzFPx6uHU4ilpBX9yJLyVMC1y6idPZ8kWrjN2bXGXjd8BAICuiLyNuI5sI6Yz2QLMu1YubsIjw0YiE0OsgEVlft9ujpgDCkbSxbF5kKdlUYXUH6xilfWnjcNPZIo5gqbIutcsN0ctk25bS5UXIFa6Z70xDqzt3DACB1VXvJkE',
  useCdn: false,
  apiVersion: '2023-05-03'
})

// Sample template categories
const templateCategories = [
  {
    _type: 'templateCategory',
    title: 'Business Cards',
    slug: { _type: 'slug', current: 'business-cards' },
    description: 'Professional business card templates for networking and branding',
    order: 1
  },
  {
    _type: 'templateCategory',
    title: 'Flyers & Brochures',
    slug: { _type: 'slug', current: 'flyers-brochures' },
    description: 'Eye-catching promotional materials and informational brochures',
    order: 2
  },
  {
    _type: 'templateCategory',
    title: 'Banners & Posters',
    slug: { _type: 'slug', current: 'banners-posters' },
    description: 'Large format designs for events, advertising, and displays',
    order: 3
  },
  {
    _type: 'templateCategory',
    title: 'Stationery',
    slug: { _type: 'slug', current: 'stationery' },
    description: 'Letterheads, envelopes, and professional correspondence materials',
    order: 4
  }
]

// Sample templates (without files for now)
const templatesData = [
  {
    _type: 'template',
    title: 'Modern Professional Business Card',
    slug: { _type: 'slug', current: 'modern-professional-business-card' },
    description: 'Clean and modern business card design with space for your contact information and logo. Perfect for professionals in any industry.',
    fileType: 'AI',
    size: '3.5" x 2"',
    tags: ['business', 'professional', 'modern', 'clean'],
    isPremium: false,
    rating: 4.8,
    downloadCount: 125,
    instructions: 'Open the file in Adobe Illustrator. Replace the placeholder text with your information. Customize colors to match your brand. Print on high-quality cardstock for best results.',
    requiredSoftware: ['Adobe Illustrator'],
    publishedAt: new Date().toISOString(),
    categorySlug: 'business-cards'
  },
  {
    _type: 'template',
    title: 'Creative Event Flyer',
    slug: { _type: 'slug', current: 'creative-event-flyer' },
    description: 'Vibrant and attention-grabbing flyer template perfect for promoting events, parties, and special occasions.',
    fileType: 'PSD',
    size: '8.5" x 11"',
    tags: ['event', 'promotion', 'party', 'colorful'],
    isPremium: false,
    rating: 4.6,
    downloadCount: 89,
    instructions: 'Open in Adobe Photoshop. Edit text layers with your event details. Replace images with your own. Adjust colors as needed. Export as high-resolution PDF for printing.',
    requiredSoftware: ['Adobe Photoshop'],
    publishedAt: new Date().toISOString(),
    categorySlug: 'flyers-brochures'
  },
  {
    _type: 'template',
    title: 'Trade Show Banner Template',
    slug: { _type: 'slug', current: 'trade-show-banner-template' },
    description: 'Professional banner template designed for trade shows and exhibitions. Includes space for company branding and key messaging.',
    fileType: 'INDD',
    size: '6ft x 3ft',
    tags: ['banner', 'trade show', 'exhibition', 'professional'],
    isPremium: true,
    price: 15.99,
    rating: 4.9,
    downloadCount: 42,
    instructions: 'Open in Adobe InDesign. Replace placeholder content with your information. Ensure all images are high resolution (300 DPI minimum) for large format printing.',
    requiredSoftware: ['Adobe InDesign'],
    publishedAt: new Date().toISOString(),
    categorySlug: 'banners-posters'
  },
  {
    _type: 'template',
    title: 'Corporate Letterhead Design',
    slug: { _type: 'slug', current: 'corporate-letterhead-design' },
    description: 'Professional letterhead template with clean typography and space for company logo and contact information.',
    fileType: 'PDF',
    size: '8.5" x 11"',
    tags: ['letterhead', 'corporate', 'professional', 'stationery'],
    isPremium: false,
    rating: 4.7,
    downloadCount: 67,
    instructions: 'This PDF template can be customized in most design software. Add your company logo, contact information, and adjust colors to match your brand.',
    requiredSoftware: ['Any PDF Reader', 'Adobe Illustrator'],
    publishedAt: new Date().toISOString(),
    categorySlug: 'stationery'
  },
  {
    _type: 'template',
    title: 'Minimalist Business Card',
    slug: { _type: 'slug', current: 'minimalist-business-card' },
    description: 'Clean, minimalist business card design that focuses on typography and whitespace for a sophisticated look.',
    fileType: 'AI',
    size: '3.5" x 2"',
    tags: ['minimalist', 'clean', 'typography', 'sophisticated'],
    isPremium: false,
    rating: 4.5,
    downloadCount: 156,
    instructions: 'Open in Adobe Illustrator. Edit text fields with your information. Choose from included color variations or customize to your brand.',
    requiredSoftware: ['Adobe Illustrator'],
    publishedAt: new Date().toISOString(),
    categorySlug: 'business-cards'
  }
]

async function seedTemplates() {
  try {
    console.log('🌱 Starting template seeding...')
    
    // Create categories first
    console.log('📁 Creating template categories...')
    const createdCategories = []
    for (const category of templateCategories) {
      try {
        const result = await sanityClient.create(category)
        createdCategories.push(result)
        console.log(`✅ Created category: ${category.title}`)
      } catch (error) {
        console.log(`⚠️  Category ${category.title} may already exist or error occurred:`, error.message)
      }
    }
    
    // Get all categories to map slugs to IDs
    const allCategories = await sanityClient.fetch('*[_type == "templateCategory"]{ _id, slug }')
    const categoryMap = {}
    allCategories.forEach(cat => {
      categoryMap[cat.slug.current] = cat._id
    })
    
    console.log('🏷️  Category mapping:', categoryMap)
    
    // Create templates with category references
    console.log('📄 Creating templates...')
    for (const templateData of templatesData) {
      try {
        const { categorySlug, ...templateFields } = templateData
        const template = {
          ...templateFields,
          category: {
            _type: 'reference',
            _ref: categoryMap[categorySlug]
          }
        }
        
        if (!categoryMap[categorySlug]) {
          console.log(`⚠️  Warning: Category ${categorySlug} not found, skipping template ${template.title}`)
          continue
        }
        
        const result = await sanityClient.create(template)
        console.log(`✅ Created template: ${template.title}`)
      } catch (error) {
        console.log(`⚠️  Template ${templateData.title} may already exist or error occurred:`, error.message)
      }
    }
    
    console.log('🎉 Template seeding completed successfully!')
    console.log('📊 Summary:')
    
    // Get counts
    const categoryCount = await sanityClient.fetch('count(*[_type == "templateCategory"])')
    const templateCount = await sanityClient.fetch('count(*[_type == "template"])')
    
    console.log(`   - Template Categories: ${categoryCount}`)
    console.log(`   - Templates: ${templateCount}`)
    console.log('')
    console.log('🎯 Next steps:')
    console.log('   1. Visit http://localhost:3334 (Sanity Studio) to view/edit content')
    console.log('   2. Visit http://localhost:3000/templates to see the templates page')
    console.log('   3. Add template relationships to products in Sanity Studio')
    
  } catch (error) {
    console.error('❌ Error seeding templates:', error)
  }
}

if (require.main === module) {
  seedTemplates()
}

module.exports = seedTemplates
