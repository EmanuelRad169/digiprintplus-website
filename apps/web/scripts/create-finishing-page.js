const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

// Create Sanity client with proper configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false
})

const finishingContent = [
  {
    _type: 'block',
    _key: 'finishing-intro',
    style: 'normal',
    children: [{
      _type: 'span',
      _key: 'finishing-intro-span',
      text: 'Order Center | Best Formats FINISHING: No job is complete until it is finished with the polish it deserves. We maintain a complete bindery where we use our technology equipment to ensure that you receive the highest quality binding and finishing at an affordable price.'
    }]
  },
  {
    _type: 'block',
    _key: 'finishing-services-header',
    style: 'h2',
    children: [{
      _type: 'span',
      _key: 'services-header-span',
      text: 'Our Finishing Services'
    }]
  },
  {
    _type: 'block',
    _key: 'finishing-quality',
    style: 'normal',
    children: [{
      _type: 'span',
      _key: 'quality-span',
      text: 'We take pride in delivering professional finishing services that add the perfect touch to your printed materials. Our state-of-the-art equipment and experienced staff ensure consistent, high-quality results for every project.'
    }]
  },
  {
    _type: 'block',
    _key: 'finishing-benefits',
    style: 'h3',
    children: [{
      _type: 'span',
      _key: 'benefits-span',
      text: 'Why Choose Our Finishing Services?'
    }]
  },
  {
    _type: 'block',
    _key: 'benefit-list1',
    style: 'normal',
    listItem: 'bullet',
    children: [{
      _type: 'span',
      _key: 'benefit1-span',
      text: 'Professional-grade equipment for consistent results'
    }]
  },
  {
    _type: 'block',
    _key: 'benefit-list2',
    style: 'normal',
    listItem: 'bullet',
    children: [{
      _type: 'span',
      _key: 'benefit2-span',
      text: 'Competitive pricing without compromising quality'
    }]
  },
  {
    _type: 'block',
    _key: 'benefit-list3',
    style: 'normal',
    listItem: 'bullet',
    children: [{
      _type: 'span',
      _key: 'benefit3-span',
      text: 'Fast turnaround times to meet your deadlines'
    }]
  },
  {
    _type: 'block',
    _key: 'benefit-list4',
    style: 'normal',
    listItem: 'bullet',
    children: [{
      _type: 'span',
      _key: 'benefit4-span',
      text: 'Expert staff with years of finishing experience'
    }]
  }
]

const heroText = [
  {
    _type: 'block',
    _key: 'hero-title',
    style: 'h1',
    children: [{
      _type: 'span',
      _key: 'hero-title-span',
      text: 'Professional Finishing Services'
    }]
  },
  {
    _type: 'block',
    _key: 'hero-subtitle',
    style: 'normal',
    children: [{
      _type: 'span',
      _key: 'hero-subtitle-span',
      text: 'Complete your printing projects with our professional binding and finishing services.'
    }]
  }
]

const defaultFinishingServices = [
  {
    _key: 'binding',
    serviceName: 'Binding Services',
    description: 'Professional binding solutions including spiral, comb, and perfect binding for books, manuals, and presentations.',
    icon: '📚',
    featured: true
  },
  {
    _key: 'lamination',
    serviceName: 'Lamination',
    description: 'Protect and enhance your printed materials with gloss or matte lamination services.',
    icon: '✨',
    featured: true
  },
  {
    _key: 'cutting',
    serviceName: 'Custom Cutting',
    description: 'Precision cutting services for custom shapes, sizes, and finishing touches.',
    icon: '✂️',
    featured: false
  },
  {
    _key: 'folding',
    serviceName: 'Folding',
    description: 'Professional folding services for brochures, newsletters, and marketing materials.',
    icon: '📄',
    featured: true
  },
  {
    _key: 'scoring',
    serviceName: 'Scoring & Creasing',
    description: 'Clean, professional creases for cards, invitations, and folded materials.',
    icon: '📏',
    featured: false
  },
  {
    _key: 'perforation',
    serviceName: 'Perforation',
    description: 'Precise perforation services for tear-off sections, tickets, and coupons.',
    icon: '🎫',
    featured: false
  },
  {
    _key: 'drilling',
    serviceName: 'Hole Drilling',
    description: 'Accurate hole drilling for binders, presentations, and filing systems.',
    icon: '🕳️',
    featured: false
  },
  {
    _key: 'embossing',
    serviceName: 'Embossing & Debossing',
    description: 'Add elegant raised or recessed designs to business cards, invitations, and premium materials.',
    icon: '💫',
    featured: true
  }
]

async function createFinishingPage() {
  try {
    console.log('🚀 Creating Finishing Page in Sanity...')
    
    // Check if finishing page already exists
    const existingPage = await client.fetch('*[_type == "finishingPage"][0]')
    
    if (existingPage) {
      console.log('⚠️  Finishing page already exists, skipping...')
      return
    }
    
    console.log('📝 Creating Finishing page with default content...')
    
    const finishingPage = await client.create({
      _type: 'finishingPage',
      title: 'Finishing',
      slug: {
        _type: 'slug',
        current: 'finishing'
      },
      heroText: heroText,
      description: finishingContent,
      finishingServices: defaultFinishingServices,
      seo: {
        metaTitle: 'Professional Finishing Services - DigiPrintPlus',
        metaDescription: 'Complete your printing projects with our professional binding and finishing services. High-quality results at affordable prices with fast turnaround.'
      },
      publishedAt: new Date().toISOString(),
      isActive: true
    })
    
    console.log('✅ Finishing page created with ID:', finishingPage._id)
    console.log('🎉 Finishing page setup completed successfully!')
    console.log('📍 You can now view it at: http://localhost:3335/structure/finishingPage')
    
  } catch (error) {
    console.error('❌ Error creating finishing page:', error)
    process.exit(1)
  }
}

createFinishingPage()