// Additional content seeding for Sanity CMS
import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'

// Additional Product Categories
const additionalCategories = [
  {
    _id: 'category-brochures',
    _type: 'productCategory',
    name: 'Brochures',
    slug: { _type: 'slug', current: 'brochures' },
    description: 'Professional brochures and booklets for marketing and information purposes.'
  },
  {
    _id: 'category-banners',
    _type: 'productCategory',
    name: 'Banners',
    slug: { _type: 'slug', current: 'banners' },
    description: 'Large format banners for events, trade shows, and outdoor advertising.'
  },
  {
    _id: 'category-flyers',
    _type: 'productCategory',
    name: 'Flyers',
    slug: { _type: 'slug', current: 'flyers' },
    description: 'Eye-catching flyers for promotions, events, and announcements.'
  },
  {
    _id: 'category-stickers',
    _type: 'productCategory',
    name: 'Stickers',
    slug: { _type: 'slug', current: 'stickers' },
    description: 'Custom stickers and labels for branding and promotional purposes.'
  }
]

// Additional Products
const additionalProducts = [
  {
    _id: 'product-tri-fold-brochure',
    _type: 'product',
    title: 'Tri-Fold Brochure',
    slug: { _type: 'slug', current: 'tri-fold-brochure' },
    category: { _type: 'reference', _ref: 'category-brochures' },
    description: 'Professional tri-fold brochures perfect for marketing materials and product information.',
    features: [
      '100gsm or 150gsm paper options',
      'Full color printing',
      'Professional folding',
      'Multiple sizes available',
      '3-5 day turnaround'
    ],
    specifications: [
      { name: 'Size', value: '8.5" x 11" (folded to 8.5" x 3.67")' },
      { name: 'Paper Weight', value: '100gsm or 150gsm' },
      { name: 'Finishes', value: 'Matte, Gloss' },
      { name: 'Colors', value: 'Full Color (CMYK)' },
      { name: 'Turnaround', value: '3-5 business days' }
    ],
    popular: false,
    featured: false,
    seo: {
      metaTitle: 'Tri-Fold Brochures - Professional Marketing Materials',
      metaDescription: 'Professional tri-fold brochures perfect for marketing materials and product information.'
    }
  },
  {
    _id: 'product-vinyl-banner',
    _type: 'product',
    title: 'Vinyl Banner',
    slug: { _type: 'slug', current: 'vinyl-banner' },
    category: { _type: 'reference', _ref: 'category-banners' },
    description: 'Durable vinyl banners for outdoor and indoor use. Weather-resistant and long-lasting.',
    features: [
      '13oz vinyl material',
      'Weather-resistant',
      'Grommets included',
      'Custom sizes available',
      '2-4 day turnaround'
    ],
    specifications: [
      { name: 'Size', value: 'Custom sizes available' },
      { name: 'Material', value: '13oz Vinyl' },
      { name: 'Finishes', value: 'Matte, Gloss' },
      { name: 'Colors', value: 'Full Color (CMYK)' },
      { name: 'Turnaround', value: '2-4 business days' }
    ],
    popular: true,
    featured: true,
    seo: {
      metaTitle: 'Vinyl Banners - Outdoor & Indoor Advertising',
      metaDescription: 'Durable vinyl banners for outdoor and indoor use. Weather-resistant and long-lasting.'
    }
  },
  {
    _id: 'product-promotional-flyers',
    _type: 'product',
    title: 'Promotional Flyers',
    slug: { _type: 'slug', current: 'promotional-flyers' },
    category: { _type: 'reference', _ref: 'category-flyers' },
    description: 'High-impact flyers for promotions, events, and marketing campaigns.',
    features: [
      '80gsm or 100gsm paper',
      'Full color single or double-sided',
      'Multiple sizes available',
      'Bulk pricing available',
      '1-3 day turnaround'
    ],
    specifications: [
      { name: 'Size', value: '8.5" x 11" (standard)' },
      { name: 'Paper Weight', value: '80gsm or 100gsm' },
      { name: 'Colors', value: 'Full Color (CMYK)' },
      { name: 'Turnaround', value: '1-3 business days' }
    ],
    popular: false,
    featured: false,
    seo: {
      metaTitle: 'Promotional Flyers - Marketing & Event Materials',
      metaDescription: 'High-impact flyers for promotions, events, and marketing campaigns.'
    }
  }
]

// Additional Pages
const additionalPages = [
  {
    _id: 'aboutPage',
    _type: 'page',
    title: 'About Us',
    slug: { _type: 'slug', current: 'about' },
    content: [
      {
        _type: 'block',
        _key: 'about-intro',
        children: [
          {
            _type: 'span',
            text: 'About DigiPrintPlus'
          }
        ],
        markDefs: [],
        style: 'h1'
      },
      {
        _type: 'block',
        _key: 'about-content',
        children: [
          {
            _type: 'span',
            text: 'With over 15 years of experience in the printing industry, DigiPrintPlus has been serving businesses with high-quality printing solutions. We specialize in business cards, brochures, banners, and custom printing services.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    seo: {
      metaTitle: 'About DigiPrintPlus - Professional Printing Services',
      metaDescription: 'Learn about our commitment to quality printing and exceptional customer service.'
    }
  },
  {
    _id: 'contactPage',
    _type: 'page',
    title: 'Contact Us',
    slug: { _type: 'slug', current: 'contact' },
    content: [
      {
        _type: 'block',
        _key: 'contact-heading',
        children: [
          {
            _type: 'span',
            text: 'Get in Touch'
          }
        ],
        markDefs: [],
        style: 'h1'
      },
      {
        _type: 'block',
        _key: 'contact-content',
        children: [
          {
            _type: 'span',
            text: 'Ready to start your printing project? Contact us today! We\'re here to help you with quotes, questions, or to discuss your printing needs.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    seo: {
      metaTitle: 'Contact DigiPrintPlus - Get in Touch',
      metaDescription: 'Contact us for quotes, questions, or to discuss your printing needs.'
    }
  }
]

// Additional Quote Requests (for testing)
const additionalQuoteRequests = [
  {
    _id: 'quote-sample-002',
    _type: 'quoteRequest',
    status: 'in-progress',
    priority: 'high',
    contact: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 234-5678',
      company: 'TechCorp Solutions'
    },
    jobSpecs: {
      productType: 'Tri-Fold Brochure',
      quantity: 1000,
      size: '8.5" x 11"',
      paperType: '150gsm Gloss',
      finish: 'Gloss',
      turnaround: 'Rush (1-2 days)'
    },
    additionalNotes: 'Need these for upcoming trade show. Artwork ready.',
    requestDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    estimatedTotal: 180.99
  },
  {
    _id: 'quote-sample-003',
    _type: 'quoteRequest',
    status: 'completed',
    priority: 'normal',
    contact: {
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike@localrestaurant.com',
      phone: '+1 (555) 345-6789',
      company: 'Local Restaurant'
    },
    jobSpecs: {
      productType: 'Flyers',
      quantity: 2000,
      size: '5.5" x 8.5"',
      paperType: '100gsm',
      finish: 'Matte',
      turnaround: '3-5 business days'
    },
    additionalNotes: 'Menu flyers for grand opening event.',
    requestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    estimatedTotal: 95.50
  }
]

async function seedAdditionalContent() {
  console.log('🌱 Starting additional content seeding...')
  
  try {
    // Seed additional categories
    console.log('📂 Creating additional product categories...')
    for (const category of additionalCategories) {
      await sanityClient.createOrReplace(category)
      console.log(`✅ Created category: ${category.name}`)
    }

    // Seed additional products
    console.log('📦 Creating additional products...')
    for (const product of additionalProducts) {
      await sanityClient.createOrReplace(product)
      console.log(`✅ Created product: ${product.title}`)
    }

    // Seed additional pages
    console.log('📄 Creating additional pages...')
    for (const page of additionalPages) {
      await sanityClient.createOrReplace(page)
      console.log(`✅ Created page: ${page.title}`)
    }

    // Seed additional quote requests
    console.log('💬 Creating additional quote requests...')
    for (const quote of additionalQuoteRequests) {
      await sanityClient.createOrReplace(quote)
      console.log(`✅ Created quote request: ${quote._id}`)
    }

    console.log('\n🎉 Additional content seeding completed!')
    console.log('\n📊 Summary:')
    console.log(`  ✅ Product Categories: ${additionalCategories.length}`)
    console.log(`  ✅ Products: ${additionalProducts.length}`)
    console.log(`  ✅ Pages: ${additionalPages.length}`)
    console.log(`  ✅ Quote Requests: ${additionalQuoteRequests.length}`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to seed additional content:', error)
    process.exit(1)
  }
}

seedAdditionalContent()
