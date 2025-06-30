const { createClient } = require('@sanity/client')

// Create Sanity client for seeding
const sanityClient = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
})

// Sample template categories
const templateCategories = [
  {
    _type: 'templateCategory',
    title: 'Business Cards',
    slug: { current: 'business-cards' },
    description: 'Professional business card templates for networking and branding',
    order: 1
  },
  {
    _type: 'templateCategory',
    title: 'Flyers & Brochures',
    slug: { current: 'flyers-brochures' },
    description: 'Eye-catching promotional materials and informational brochures',
    order: 2
  },
  {
    _type: 'templateCategory',
    title: 'Banners & Posters',
    slug: { current: 'banners-posters' },
    description: 'Large format designs for events, advertising, and displays',
    order: 3
  },
  {
    _type: 'templateCategory',
    title: 'Stationery',
    slug: { current: 'stationery' },
    description: 'Letterheads, envelopes, and professional correspondence materials',
    order: 4
  },
  {
    _type: 'templateCategory',
    title: 'Social Media',
    slug: { current: 'social-media' },
    description: 'Templates optimized for social media platforms and digital marketing',
    order: 5
  }
]

// Sample templates
const templates = [
  {
    _type: 'template',
    title: 'Modern Professional Business Card',
    slug: { current: 'modern-professional-business-card' },
    description: 'Clean and modern business card design with space for your contact information and logo. Perfect for professionals in any industry.',
    fileType: 'AI',
    size: '3.5" x 2"',
    tags: ['business', 'professional', 'modern', 'clean'],
    isPremium: false,
    rating: 4.8,
    downloadCount: 0,
    instructions: 'Open the file in Adobe Illustrator. Replace the placeholder text with your information. Customize colors to match your brand. Print on high-quality cardstock for best results.',
    requiredSoftware: ['Adobe Illustrator'],
    publishedAt: new Date().toISOString()
  },
  {
    _type: 'template',
    title: 'Event Promotion Flyer',
    slug: { current: 'event-promotion-flyer' },
    description: 'Vibrant and attention-grabbing flyer template perfect for promoting events, parties, and special occasions.',
    fileType: 'PSD',
    size: '8.5" x 11"',
    tags: ['event', 'promotion', 'party', 'colorful'],
    isPremium: false,
    rating: 4.6,
    downloadCount: 0,
    instructions: 'Open in Adobe Photoshop. Edit text layers with your event details. Replace images with your own. Adjust colors as needed. Export as high-resolution PDF for printing.',
    requiredSoftware: ['Adobe Photoshop'],
    publishedAt: new Date().toISOString()
  },
  {
    _type: 'template',
    title: 'Trade Show Banner Template',
    slug: { current: 'trade-show-banner-template' },
    description: 'Professional banner template designed for trade shows and exhibitions. Includes space for company branding and key messaging.',
    fileType: 'INDD',
    size: '6ft x 3ft',
    tags: ['banner', 'trade show', 'exhibition', 'professional'],
    isPremium: true,
    price: 15.99,
    rating: 4.9,
    downloadCount: 0,
    instructions: 'Open in Adobe InDesign. Replace placeholder content with your information. Ensure all images are high resolution (300 DPI minimum) for large format printing.',
    requiredSoftware: ['Adobe InDesign'],
    publishedAt: new Date().toISOString()
  },
  {
    _type: 'template',
    title: 'Corporate Letterhead Design',
    slug: { current: 'corporate-letterhead-design' },
    description: 'Professional letterhead template with clean typography and space for company logo and contact information.',
    fileType: 'PDF',
    size: '8.5" x 11"',
    tags: ['letterhead', 'corporate', 'professional', 'stationery'],
    isPremium: false,
    rating: 4.7,
    downloadCount: 0,
    instructions: 'This PDF template can be customized in most design software. Add your company logo, contact information, and adjust colors to match your brand.',
    requiredSoftware: ['Any PDF Reader', 'Adobe Illustrator'],
    publishedAt: new Date().toISOString()
  },
  {
    _type: 'template',
    title: 'Instagram Post Template Pack',
    slug: { current: 'instagram-post-template-pack' },
    description: 'Collection of 10 Instagram post templates with various layouts and styles. Perfect for social media marketing campaigns.',
    fileType: 'PSD',
    size: '1080px x 1080px',
    tags: ['instagram', 'social media', 'marketing', 'square'],
    isPremium: true,
    price: 9.99,
    rating: 4.5,
    downloadCount: 0,
    instructions: 'Each template is in separate PSD file. Open in Photoshop, edit text and images, export as JPG or PNG for Instagram posting.',
    requiredSoftware: ['Adobe Photoshop'],
    publishedAt: new Date().toISOString()
  }
]

async function seedTemplates() {
  try {
    console.log('Starting template seeding...')
    
    // Create categories first
    console.log('Creating template categories...')
    const createdCategories = []
    for (const category of templateCategories) {
      const result = await sanityClient.create(category)
      createdCategories.push(result)
      console.log(`Created category: ${category.title}`)
    }
    
    // Map category slugs to IDs
    const categoryMap = {}
    createdCategories.forEach(cat => {
      categoryMap[cat.slug.current] = cat._id
    })
    
    // Create templates with category references
    console.log('Creating templates...')
    const categoryAssignments = [
      'business-cards',
      'flyers-brochures', 
      'banners-posters',
      'stationery',
      'social-media'
    ]
    
    for (let i = 0; i < templates.length; i++) {
      const template = {
        ...templates[i],
        category: {
          _type: 'reference',
          _ref: categoryMap[categoryAssignments[i]]
        }
      }
      
      const result = await sanityClient.create(template)
      console.log(`Created template: ${template.title}`)
    }
    
    console.log('Template seeding completed successfully!')
    
  } catch (error) {
    console.error('Error seeding templates:', error)
  }
}

if (require.main === module) {
  seedTemplates()
}

module.exports = seedTemplates
