const { createClient } = require('@sanity/client')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'as5tildt',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-10-01',
})

async function createFinishingPageContent() {
  try {
    console.log('🔍 Checking for existing finishing page content...')
    
    // Check if finishing page already exists
    const existingPage = await client.fetch(`*[_type == "finishingPage" && slug.current == "finishing"][0]`)
    
    if (existingPage) {
      console.log('✅ Finishing page content already exists')
      console.log(`📄 Page ID: ${existingPage._id}`)
      console.log(`📝 Title: ${existingPage.title}`)
      return
    }
    
    console.log('📝 Creating finishing page content...')
    
    const finishingPageData = {
      _type: 'finishingPage',
      title: 'Finishing',
      slug: {
        _type: 'slug',
        current: 'finishing'
      },
      heroText: [
        {
          _type: 'block',
          _key: 'hero1',
          style: 'h1',
          children: [
            {
              _type: 'span',
              text: 'Professional Finishing Services',
              _key: 'hero1-span1'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'hero2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Take your print materials to the next level with our comprehensive finishing services. From binding and lamination to die-cutting and foil stamping, we provide the professional touch your projects deserve.',
              _key: 'hero2-span1'
            }
          ]
        }
      ],
      description: [
        {
          _type: 'block',
          _key: 'desc1',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Complete Finishing Solutions',
              _key: 'desc1-span1'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'desc2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Our state-of-the-art finishing department offers a full range of post-press services to enhance the appearance, durability, and functionality of your printed materials. Whether you need simple binding or complex die-cutting, our experienced team delivers consistent, high-quality results.',
              _key: 'desc2-span1'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'desc3',
          style: 'h3',
          children: [
            {
              _type: 'span',
              text: 'Why Choose Our Finishing Services?',
              _key: 'desc3-span1'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'desc4',
          style: 'normal',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              text: 'Advanced equipment and technology',
              _key: 'desc4-span1'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'desc5',
          style: 'normal',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              text: 'Skilled technicians with years of experience',
              _key: 'desc5-span1'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'desc6',
          style: 'normal',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              text: 'Quick turnaround times',
              _key: 'desc6-span1'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'desc7',
          style: 'normal',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              text: 'Competitive pricing for all project sizes',
              _key: 'desc7-span1'
            }
          ]
        }
      ],
      seo: {
        metaTitle: 'Professional Finishing Services - DigiPrintPlus',
        metaDescription: 'Complete finishing solutions including binding, lamination, die-cutting, foil stamping, and more. Professional post-press services for all your print materials.'
      },
      publishedAt: new Date().toISOString(),
      isActive: true
    }
    
    const result = await client.create(finishingPageData)
    
    console.log('✅ Successfully created finishing page content')
    console.log(`📄 Page ID: ${result._id}`)
    console.log(`📝 Title: ${result.title}`)
    console.log(`🔗 Slug: /${result.slug.current}`)
    
  } catch (error) {
    console.error('❌ Error creating finishing page content:', error)
  }
}

// Run the script
createFinishingPageContent()