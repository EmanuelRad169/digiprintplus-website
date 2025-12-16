/**
 * Seed Service Pages to Sanity
 * 
 * Creates service pages for:
 * 1. Digital Printing
 * 2. Offset Printing
 * 3. Large Format Printing
 * 
 * Usage: pnpm seed:services
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'as5tildt',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
})

const services = [
  {
    _id: 'service-digital-printing',
    _type: 'service',
    title: 'Digital Printing',
    slug: {
      _type: 'slug',
      current: 'digital-printing'
    },
    description: 'Fast, high-quality digital printing for short runs and quick turnarounds. Perfect for on-demand printing needs.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Digital printing is the ideal solution for businesses that need quick turnarounds without sacrificing quality. Our state-of-the-art digital presses deliver vibrant colors and sharp details for projects of all sizes.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [
          {
            _type: 'span',
            text: 'Why Choose Digital Printing?'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Digital printing offers unmatched flexibility and speed. Whether you need 10 copies or 1,000, we can deliver professional results with minimal setup time. Variable data printing capabilities allow for personalized marketing materials, making each piece unique and targeted to your audience.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [
          {
            _type: 'span',
            text: 'Applications'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Our digital printing services are perfect for business cards, brochures, flyers, postcards, posters, booklets, catalogs, and much more. We handle everything from concept to completion, ensuring your vision becomes reality.'
          }
        ]
      }
    ],
    features: [
      'Fast turnaround times (24-48 hours)',
      'Cost-effective for short runs',
      'Variable data printing capabilities',
      'High-quality color reproduction',
      'No minimum order quantities',
      'Quick proofing and revisions',
      'Wide range of paper stocks',
      'Professional finishing options'
    ],
    category: 'digital-printing',
    icon: 'zap',
    isFeatured: true,
    isActive: true,
    order: 1,
    seo: {
      metaTitle: 'Digital Printing Services | Fast, High-Quality Prints',
      metaDescription: 'Professional digital printing services with quick turnaround times. Perfect for business cards, brochures, flyers, and more. Order online today!',
      keywords: ['digital printing', 'quick printing', 'short run printing', 'on-demand printing', 'business cards', 'brochures']
    }
  },
  {
    _id: 'service-offset-printing',
    _type: 'service',
    title: 'Offset Printing',
    slug: {
      _type: 'slug',
      current: 'offset-printing'
    },
    description: 'Traditional offset printing for large volume runs with exceptional quality and cost efficiency.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Offset printing remains the gold standard for high-volume print projects. This traditional printing method delivers superior image quality and color accuracy, making it the preferred choice for magazines, catalogs, and large marketing campaigns.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [
          {
            _type: 'span',
            text: 'The Offset Advantage'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Offset printing provides unmatched consistency across large print runs. The per-unit cost decreases significantly with higher quantities, making it the most economical choice for projects requiring thousands of copies. Our offset presses deliver crisp text, smooth gradients, and vibrant images that capture attention.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [
          {
            _type: 'span',
            text: 'Best For'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Magazines, catalogs, annual reports, newsletters, direct mail campaigns, packaging, and any project requiring 1,000+ copies. Offset printing is also ideal for projects using special inks, varnishes, or unique paper stocks.'
          }
        ]
      }
    ],
    features: [
      'Superior color accuracy and consistency',
      'Cost-effective for large quantities (1,000+)',
      'Wide range of paper and ink options',
      'Pantone color matching available',
      'Special finishes (UV coating, embossing)',
      'Large format capabilities',
      'Professional bindery services',
      'Consistent results across entire run'
    ],
    category: 'offset-printing',
    icon: 'award',
    isFeatured: true,
    isActive: true,
    order: 2,
    seo: {
      metaTitle: 'Offset Printing Services | High Volume Commercial Printing',
      metaDescription: 'Professional offset printing for high-volume projects. Exceptional quality for magazines, catalogs, and marketing materials. Request a quote today!',
      keywords: ['offset printing', 'commercial printing', 'high volume printing', 'magazine printing', 'catalog printing', 'bulk printing']
    }
  },
  {
    _id: 'service-large-format-printing',
    _type: 'service',
    title: 'Large Format Printing',
    slug: {
      _type: 'slug',
      current: 'large-format-printing'
    },
    description: 'Eye-catching large format printing for banners, posters, signage, and displays. Make a big impression.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Large format printing transforms your big ideas into even bigger visuals. Our wide-format printers produce stunning graphics up to 60 inches wide with exceptional clarity and color vibrancy, perfect for making a bold statement at trade shows, events, or retail spaces.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [
          {
            _type: 'span',
            text: 'Go Big or Go Home'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Whether you need a towering banner for your storefront or eye-catching graphics for a trade show booth, our large format printing services deliver impact. We use premium materials and advanced printing technology to ensure your message stands out from across the room.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [
          {
            _type: 'span',
            text: 'Popular Products'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Banners, posters, window graphics, wall murals, trade show displays, retractable banner stands, vehicle wraps, canvas prints, and outdoor signage. All available in custom sizes to fit your exact specifications.'
          }
        ]
      }
    ],
    features: [
      'Prints up to 60" wide',
      'Indoor and outdoor materials',
      'UV-resistant inks for durability',
      'Multiple substrate options',
      'Trade show graphics and displays',
      'Vehicle wraps and decals',
      'Wall murals and window graphics',
      'Professional mounting and finishing'
    ],
    category: 'large-format',
    icon: 'maximize-2',
    isFeatured: true,
    isActive: true,
    order: 3,
    seo: {
      metaTitle: 'Large Format Printing | Banners, Posters & Signage',
      metaDescription: 'Professional large format printing services for banners, posters, trade show displays, and signage. Custom sizes up to 60 inches wide. Get a quote!',
      keywords: ['large format printing', 'banner printing', 'poster printing', 'trade show graphics', 'signage', 'wide format printing']
    }
  }
]

async function seedServices() {
  console.log('🚀 Starting Service Pages Seeding...\n')

  let successCount = 0
  let errorCount = 0

  for (const service of services) {
    try {
      await client.createOrReplace(service)
      successCount++
      console.log(`✅ Created/Updated: ${service.title}`)
    } catch (error) {
      errorCount++
      console.error(`❌ Error creating ${service.title}:`, error instanceof Error ? error.message : error)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📈 Seeding Summary:')
  console.log('='.repeat(50))
  console.log(`✅ Successfully created: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📊 Total processed: ${services.length}`)
  console.log('='.repeat(50) + '\n')

  if (successCount > 0) {
    console.log('🎉 Service pages created successfully!')
    console.log(`🔗 View in Sanity Studio: http://localhost:3335/structure/service`)
  }
}

// Run the seed script
seedServices()
  .then(() => {
    console.log('\n✨ Script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
