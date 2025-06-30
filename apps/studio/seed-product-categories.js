const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  // Remove token requirement for now - we'll check if we can read first
  apiVersion: '2023-05-03',
})

const productCategories = [
  {
    slug: 'business-cards',
    title: 'Business Cards',
    description: 'Professional business cards in various styles and finishes to make a lasting impression.'
  },
  {
    slug: 'flyers-brochures',
    title: 'Flyers & Brochures',
    description: 'Eye-catching flyers and detailed brochures for marketing and promotional campaigns.'
  },
  {
    slug: 'postcards',
    title: 'Postcards',
    description: 'Custom postcards for direct mail marketing, announcements, and promotional campaigns.'
  },
  {
    slug: 'announcement-cards',
    title: 'Announcement Cards',
    description: 'Elegant announcement cards for special events, business updates, and personal milestones.'
  },
  {
    slug: 'booklets',
    title: 'Booklets',
    description: 'Professional booklets and catalogs for product showcases, manuals, and informational materials.'
  },
  {
    slug: 'catalogs',
    title: 'Catalogs',
    description: 'Comprehensive product catalogs and lookbooks to showcase your offerings professionally.'
  },
  {
    slug: 'bookmarks',
    title: 'Bookmarks',
    description: 'Custom bookmarks for libraries, bookstores, educational institutions, and promotional use.'
  },
  {
    slug: 'calendars',
    title: 'Calendars',
    description: 'Custom calendars including wall calendars, desk calendars, and promotional calendar designs.'
  },
  {
    slug: 'door-hangers',
    title: 'Door Hangers',
    description: 'Effective door hanger marketing materials for local businesses and service providers.'
  },
  {
    slug: 'envelopes',
    title: 'Envelopes',
    description: 'Custom printed envelopes in various sizes and styles for business and personal use.'
  },
  {
    slug: 'letterhead',
    title: 'Letterhead',
    description: 'Professional letterhead designs to enhance your business correspondence and branding.'
  },
  {
    slug: 'ncr-forms',
    title: 'NCR Forms',
    description: 'No Carbon Required forms for invoices, receipts, work orders, and multi-part documents.'
  },
  {
    slug: 'notepads',
    title: 'Notepads',
    description: 'Custom notepads and memo pads for offices, promotional giveaways, and personal use.'
  },
  {
    slug: 'table-tents',
    title: 'Table Tents',
    description: 'Table tent cards perfect for restaurants, events, and promotional displays.'
  },
  {
    slug: 'counter-display-cards',
    title: 'Counter Display Cards',
    description: 'Point-of-sale display cards and counter cards for retail and promotional use.'
  }
]

async function createProductCategories() {
  console.log('🌱 Starting to seed product categories...')

  try {
    // Check if categories already exist
    console.log('📋 Checking for existing categories...')
    const existingCategories = await client.fetch('*[_type == "productCategory"]')
    console.log(`Found ${existingCategories.length} existing categories`)

    const createdCategories = []
    
    for (const category of productCategories) {
      // Check if this category already exists
      const existingCategory = existingCategories.find(
        existing => existing.slug?.current === category.slug
      )
      
      if (existingCategory) {
        console.log(`⏭️  Category "${category.title}" already exists, skipping...`)
        continue
      }

      const categoryDoc = {
        _type: 'productCategory',
        title: category.title,
        slug: {
          _type: 'slug',
          current: category.slug
        },
        description: category.description,
        featured: false,
        products: [], // Will be populated later when products are assigned
        seo: {
          metaTitle: `${category.title} - Professional Printing Services | DigiPrintPlus`,
          metaDescription: category.description
        }
      }

      console.log(`📝 Creating category: ${category.title}`)
      const result = await client.create(categoryDoc)
      createdCategories.push(result)
      console.log(`✅ Created category: ${category.title} (ID: ${result._id})`)
    }

    console.log(`\n🎉 Successfully created ${createdCategories.length} new product categories!`)
    console.log(`📊 Total categories in system: ${existingCategories.length + createdCategories.length}`)
    
    return createdCategories
  } catch (error) {
    console.error('❌ Error creating product categories:', error)
    throw error
  }
}

async function validateCategories() {
  console.log('\n🔍 Validating created categories...')
  
  try {
    const allCategories = await client.fetch(`
      *[_type == "productCategory"] | order(title asc) {
        _id,
        title,
        slug,
        description,
        featured
      }
    `)
    
    console.log(`\n📋 Found ${allCategories.length} product categories:`)
    allCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.title} (/${category.slug?.current})`)
    })
    
    return allCategories
  } catch (error) {
    console.error('❌ Error validating categories:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Product Category Seeding Script')
    console.log('==================================\n')
    
    const createdCategories = await createProductCategories()
    const allCategories = await validateCategories()
    
    console.log('\n✨ Category seeding completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Update your product documents to reference these categories')
    console.log('2. Test the category pages in your frontend')
    console.log('3. Verify category navigation is working correctly')
    
  } catch (error) {
    console.error('💥 Script failed:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { createProductCategories, validateCategories }
