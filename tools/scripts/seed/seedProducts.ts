import { sanityClient } from '../apps/web/lib/sanity'
import type { Product, SeedResult } from './types'

const productsData: Product[] = [
  // Business Cards
  {
    _id: 'product-standard-business-cards',
    _type: 'product',
    title: 'Standard Business Cards',
    slug: {
      _type: 'slug',
      current: 'standard-business-cards'
    },
    category: {
      _type: 'reference',
      _ref: 'category-business-cards'
    },
    description: 'Affordable, high-quality business cards with a clean matte finish. Perfect for networking and professional introductions.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our standard business cards are the perfect choice for professionals looking for high-quality cards at an affordable price. Printed on premium 16pt cardstock with a smooth matte finish that feels great in your hands.'
          }
        ],
        markDefs: [],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Key Features:'
          }
        ],
        markDefs: [],
        style: 'h3'
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Premium 16pt cardstock for durability\nMatte finish reduces glare and fingerprints\nFull-color CMYK printing on both sides\nStandard 3.5" x 2" size fits all wallets\nQuick 3-5 business day turnaround'
          }
        ],
        markDefs: [],
        style: 'normal',
        listItem: 'bullet'
      }
    ],
    specifications: [
      { name: 'Size', value: '3.5" x 2"' },
      { name: 'Paper Stock', value: '16pt Matte Cardstock' },
      { name: 'Finish', value: 'Matte Coating' },
      { name: 'Colors', value: 'Full Color CMYK' },
      { name: 'Turnaround', value: '3-5 Business Days' }
    ],
    features: [
      'Professional matte finish',
      'Durable 16pt cardstock',
      'Full-color printing',
      'Double-sided available',
      'Standard wallet size'
    ],
    popular: true,
    featured: false,
    seo: {
      metaTitle: 'Standard Business Cards - Professional Matte Finish',
      metaDescription: 'High-quality standard business cards with matte finish. 16pt cardstock, full-color printing, quick turnaround. Order your professional business cards today.'
    }
  },
  {
    _id: 'product-premium-business-cards',
    _type: 'product',
    title: 'Premium Business Cards',
    slug: {
      _type: 'slug',
      current: 'premium-business-cards'
    },
    category: {
      _type: 'reference',
      _ref: 'category-business-cards'
    },
    description: 'Luxury business cards with premium paper options, special finishes, and enhanced durability for maximum impact.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Make a lasting impression with our premium business cards. Choose from luxury paper stocks, special finishes, and unique textures that set you apart from the competition.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    specifications: [
      { name: 'Size', value: '3.5" x 2"' },
      { name: 'Paper Stock', value: '18pt Linen or Felt' },
      { name: 'Finish Options', value: 'UV Gloss, Soft Touch, Linen' },
      { name: 'Colors', value: 'Full Color + Spot UV' },
      { name: 'Turnaround', value: '5-7 Business Days' }
    ],
    features: [
      'Luxury paper textures',
      'Special finish options',
      'Thick 18pt cardstock',
      'Premium feel and appearance',
      'Unique design options'
    ],
    popular: false,
    featured: true,
    seo: {
      metaTitle: 'Premium Business Cards - Luxury Finishes & Paper',
      metaDescription: 'Luxury premium business cards with special finishes. Choose from linen, felt textures, UV coating, and more premium options.'
    }
  },
  {
    _id: 'product-recycled-business-cards',
    _type: 'product',
    title: 'Eco-Friendly Business Cards',
    slug: {
      _type: 'slug',
      current: 'eco-friendly-business-cards'
    },
    category: {
      _type: 'reference',
      _ref: 'category-business-cards'
    },
    description: 'Environmentally conscious business cards made from 100% recycled paper with soy-based inks.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Show your commitment to the environment with our eco-friendly business cards. Made from 100% post-consumer recycled paper and printed with vegetable-based inks.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    specifications: [
      { name: 'Size', value: '3.5" x 2"' },
      { name: 'Paper Stock', value: '14pt Recycled Cardstock' },
      { name: 'Inks', value: 'Soy-Based Eco Inks' },
      { name: 'Certification', value: 'FSC Certified' },
      { name: 'Turnaround', value: '3-5 Business Days' }
    ],
    features: [
      '100% recycled materials',
      'Soy-based inks',
      'FSC certified',
      'Environmentally responsible',
      'Professional appearance'
    ],
    popular: false,
    featured: false,
    seo: {
      metaTitle: 'Eco-Friendly Business Cards - 100% Recycled Paper',
      metaDescription: 'Environmentally conscious business cards made from recycled paper with soy-based inks. FSC certified and eco-friendly printing.'
    }
  },

  // Flyers & Brochures
  {
    _id: 'product-standard-flyers',
    _type: 'product',
    title: 'Standard Flyers',
    slug: {
      _type: 'slug',
      current: 'standard-flyers'
    },
    category: {
      _type: 'reference',
      _ref: 'category-flyers'
    },
    description: 'Cost-effective single-page flyers perfect for promotions, events, and marketing campaigns.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our standard flyers are the perfect solution for budget-conscious marketing. High-quality printing on durable paper stock ensures your message gets noticed.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    specifications: [
      { name: 'Sizes Available', value: '8.5" x 11", 5.5" x 8.5", 4.25" x 11"' },
      { name: 'Paper Stock', value: '100lb Text Paper' },
      { name: 'Finish', value: 'Matte or Gloss' },
      { name: 'Colors', value: 'Full Color CMYK' },
      { name: 'Turnaround', value: '2-3 Business Days' }
    ],
    features: [
      'Multiple size options',
      'High-quality printing',
      'Matte or gloss finish',
      'Fast turnaround',
      'Bulk pricing available'
    ],
    popular: true,
    featured: false,
    seo: {
      metaTitle: 'Standard Flyers - High-Quality Promotional Printing',
      metaDescription: 'Professional standard flyers for marketing and promotions. Multiple sizes, fast turnaround, bulk pricing available.'
    }
  },
  {
    _id: 'product-tri-fold-brochures',
    _type: 'product',
    title: 'Tri-Fold Brochures',
    slug: {
      _type: 'slug',
      current: 'tri-fold-brochures'
    },
    category: {
      _type: 'reference',
      _ref: 'category-flyers'
    },
    description: 'Professional tri-fold brochures that provide detailed information in a compact, organized format.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Tri-fold brochures are ideal for presenting detailed information about your products, services, or organization in an organized, professional format that fits easily in pockets and displays.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    specifications: [
      { name: 'Size (Flat)', value: '8.5" x 11"' },
      { name: 'Size (Folded)', value: '3.67" x 8.5"' },
      { name: 'Paper Stock', value: '100lb Gloss Text' },
      { name: 'Finish', value: 'Aqueous Coating' },
      { name: 'Turnaround', value: '3-5 Business Days' }
    ],
    features: [
      'Professional tri-fold design',
      'Compact when folded',
      'Premium paper stock',
      'Aqueous coating protection',
      'Perfect for displays'
    ],
    popular: true,
    featured: true,
    seo: {
      metaTitle: 'Tri-Fold Brochures - Professional Marketing Materials',
      metaDescription: 'High-quality tri-fold brochures perfect for detailed product information and marketing materials. Professional printing and finishing.'
    }
  },
  {
    _id: 'product-bi-fold-brochures',
    _type: 'product',
    title: 'Bi-Fold Brochures',
    slug: {
      _type: 'slug',
      current: 'bi-fold-brochures'
    },
    category: {
      _type: 'reference',
      _ref: 'category-flyers'
    },
    description: 'Simple and elegant bi-fold brochures that offer more space for content while maintaining a clean design.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Bi-fold brochures provide an elegant solution for presenting your information with more space than flyers but simpler than tri-folds. Perfect for product showcases and service overviews.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    specifications: [
      { name: 'Size (Flat)', value: '11" x 8.5"' },
      { name: 'Size (Folded)', value: '5.5" x 8.5"' },
      { name: 'Paper Stock', value: '100lb Gloss Cover' },
      { name: 'Finish', value: 'UV Coating' },
      { name: 'Turnaround', value: '3-5 Business Days' }
    ],
    features: [
      'Clean bi-fold design',
      'More content space',
      'Premium cover stock',
      'UV coating finish',
      'Professional appearance'
    ],
    popular: false,
    featured: false,
    seo: {
      metaTitle: 'Bi-Fold Brochures - Professional Product Showcases',
      metaDescription: 'Elegant bi-fold brochures with premium cover stock and UV coating. Perfect for product showcases and service overviews.'
    }
  },

  // Postcards
  {
    _id: 'product-standard-postcards',
    _type: 'product',
    title: 'Standard Postcards',
    slug: {
      _type: 'slug',
      current: 'standard-postcards'
    },
    category: {
      _type: 'reference',
      _ref: 'category-postcards'
    },
    description: 'Cost-effective postcards perfect for direct mail campaigns, announcements, and promotional mailings.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our standard postcards are designed for effective direct mail marketing. High-quality printing on durable cardstock ensures your message arrives looking professional and gets noticed.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    specifications: [
      { name: 'Sizes', value: '4" x 6", 5" x 7", 6" x 9"' },
      { name: 'Paper Stock', value: '14pt Cardstock' },
      { name: 'Finish', value: 'UV Coating (Front)' },
      { name: 'Colors', value: 'Full Color Front/Back' },
      { name: 'Turnaround', value: '2-4 Business Days' }
    ],
    features: [
      'Multiple size options',
      'USPS mailing ready',
      'UV coating protection',
      'Full-color printing',
      'Bulk pricing available'
    ],
    popular: true,
    featured: false,
    seo: {
      metaTitle: 'Standard Postcards - Direct Mail Marketing',
      metaDescription: 'Professional postcards for direct mail campaigns. Multiple sizes, USPS ready, bulk pricing available. High-quality cardstock printing.'
    }
  },
  {
    _id: 'product-jumbo-postcards',
    _type: 'product',
    title: 'Jumbo Postcards',
    slug: {
      _type: 'slug',
      current: 'jumbo-postcards'
    },
    category: {
      _type: 'reference',
      _ref: 'category-postcards'
    },
    description: 'Large format postcards that stand out in the mail and provide more space for your marketing message.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Make a big impression with jumbo postcards. These oversized mailers grab attention and provide ample space for detailed marketing messages, product showcases, and special offers.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    specifications: [
      { name: 'Sizes', value: '6" x 9", 6" x 11", 8.5" x 11"' },
      { name: 'Paper Stock', value: '16pt Cardstock' },
      { name: 'Finish', value: 'Aqueous Coating' },
      { name: 'Colors', value: 'Full Color Both Sides' },
      { name: 'Turnaround', value: '3-5 Business Days' }
    ],
    features: [
      'Eye-catching large format',
      'More space for content',
      'Premium cardstock',
      'Protective coating',
      'High impact marketing'
    ],
    popular: false,
    featured: true,
    seo: {
      metaTitle: 'Jumbo Postcards - Large Format Direct Mail',
      metaDescription: 'Eye-catching jumbo postcards for high-impact direct mail campaigns. Large format with premium cardstock and protective coating.'
    }
  },

  // Booklets
  {
    _id: 'product-saddle-stitched-booklets',
    _type: 'product',
    title: 'Saddle-Stitched Booklets',
    slug: {
      _type: 'slug',
      current: 'saddle-stitched-booklets'
    },
    category: {
      _type: 'reference',
      _ref: 'category-booklets'
    },
    description: 'Professional booklets with saddle-stitch binding, perfect for programs, manuals, and promotional materials.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Saddle-stitched booklets are perfect for programs, instruction manuals, newsletters, and marketing materials. Professional binding with multiple page count options.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    specifications: [
      { name: 'Sizes', value: '5.5" x 8.5", 8.5" x 11"' },
      { name: 'Page Count', value: '8, 12, 16, 20, 24, 28 pages' },
      { name: 'Cover Stock', value: '100lb Gloss Cover' },
      { name: 'Interior Stock', value: '80lb Gloss Text' },
      { name: 'Binding', value: 'Saddle-Stitched' },
      { name: 'Turnaround', value: '5-7 Business Days' }
    ],
    features: [
      'Professional binding',
      'Multiple page options',
      'Premium paper stocks',
      'Full-color printing',
      'Cost-effective solution'
    ],
    popular: true,
    featured: false,
    seo: {
      metaTitle: 'Saddle-Stitched Booklets - Professional Binding',
      metaDescription: 'Professional saddle-stitched booklets for programs, manuals, and marketing materials. Multiple page counts and premium paper options.'
    }
  },

  // Catalogs
  {
    _id: 'product-perfect-bound-catalogs',
    _type: 'product',
    title: 'Perfect Bound Catalogs',
    slug: {
      _type: 'slug',
      current: 'perfect-bound-catalogs'
    },
    category: {
      _type: 'reference',
      _ref: 'category-catalogs'
    },
    description: 'Premium perfect bound catalogs with square spine for professional product showcases and lookbooks.',
    longDescription: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Perfect bound catalogs offer a professional, book-like appearance with a square spine that displays beautifully on shelves. Ideal for product catalogs, lookbooks, and comprehensive marketing materials.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ],
    specifications: [
      { name: 'Sizes', value: '8.5" x 11", 8" x 10"' },
      { name: 'Page Count', value: '28-200 pages' },
      { name: 'Cover Stock', value: '100lb Gloss Cover' },
      { name: 'Interior Stock', value: '80lb Gloss Text' },
      { name: 'Binding', value: 'Perfect Bound' },
      { name: 'Turnaround', value: '7-10 Business Days' }
    ],
    features: [
      'Professional square spine',
      'High page count capacity',
      'Premium binding quality',
      'Full-color throughout',
      'Professional appearance'
    ],
    popular: false,
    featured: true,
    seo: {
      metaTitle: 'Perfect Bound Catalogs - Professional Product Showcases',
      metaDescription: 'Premium perfect bound catalogs with professional binding and high page capacity. Ideal for product catalogs and lookbooks.'
    }
  }
]

export async function seedProducts(): Promise<SeedResult> {
  try {
    console.log('🌱 Seeding products...')
    
    for (const productData of productsData) {
      // Check if product already exists
      const existingProduct = await sanityClient.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug: productData.slug.current }
      )
      
      if (existingProduct) {
        console.log(`📦 Updating product: ${productData.title}`)
        // Remove _id from update data since it's immutable
        const { _id, ...updateData } = productData
        await sanityClient.patch(existingProduct._id).set(updateData).commit()
      } else {
        console.log(`📦 Creating product: ${productData.title}`)
        await sanityClient.create(productData)
      }
    }
    
    console.log('✅ Products seeded successfully!')
    
    return {
      success: true,
      documentsCreated: productsData.length
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error seeding products:', errorMessage)
    return {
      success: false,
      documentsCreated: 0,
      errors: [errorMessage]
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedProducts()
    .then((result) => {
      if (result.success) {
        console.log(`✅ Successfully seeded ${result.documentsCreated} product(s)`)
        process.exit(0)
      } else {
        console.error('❌ Seeding failed:', result.errors?.join(', '))
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('❌ Unexpected error:', error)
      process.exit(1)
    })
}
