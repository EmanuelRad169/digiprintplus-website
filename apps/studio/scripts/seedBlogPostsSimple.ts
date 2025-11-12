// Simple blog seeding script for Sanity
import { getCliClient } from 'sanity/cli'

// Get the client from Sanity CLI context
const client = getCliClient()

// Helper function to create portable text blocks
function createBlock(text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text,
        marks: []
      }
    ]
  }
}

// Blog posts data
const posts = [
  {
    title: 'Professional Mailing Processing Services in Orange County',
    slug: 'professional-mailing-processing-services-orange-county',
    excerpt: 'Looking for reliable and efficient mailing processing services in Orange County? DigiPrint Plus offers comprehensive solutions to streamline your mailing campaigns for businesses of all sizes.',
    content: [
      createBlock('If you are looking for a trusted partner for reliable and efficient mailing processing services in Orange County, we welcome you all to DigiPrint Plus. With our expertise in data processing and commitment to quality, we offer comprehensive solutions to streamline your mailing campaigns, whether you are a small business or a large corporation.'),
      createBlock('Know More About Our Mailing Processing Service in Orange County', 'h2'),
      createBlock('As a leading data processing company in Orange County, we understand the importance of accurate data management for successful mailing campaigns. From data cleansing and deduplication to address verification and formatting, we employ robust processes to enhance the quality and effectiveness of your mailing lists.'),
      createBlock('Key Features of Our Mailing Processing Services', 'h2'),
      createBlock('Address Verification and Standardization: We employ advanced tools and techniques to verify and standardize addresses, ensuring accurate delivery and reducing undeliverable mail.'),
      createBlock('Data Cleansing and Deduplication: Our data cleansing processes eliminate errors, inconsistencies, and duplicate entries, optimizing the accuracy and effectiveness of your mailing lists.'),
      createBlock('Variable Data Printing: Personalize your mailings with variable data printing, allowing you to tailor each piece to the recipient for enhanced engagement and response rates.')
    ],
    publishedAt: '2024-07-19',
    featured: true
  },
  {
    title: 'Tell Your Story to Your Customers with Brochure Printing in Irvine',
    slug: 'tell-your-story-brochure-printing-irvine',
    excerpt: 'Brochures are visually appealing advertising materials that serve as descriptive tools for your business. Discover how professional brochure printing can help tell your story effectively.',
    content: [
      createBlock('Brochures are visually appealing advertising materials typically consisting of a single sheet with a panel fold. They are printed on high-quality paper and feature colorful and attractive visuals. Brochures serve as descriptive advertising tools, providing an introduction to a product or service along with detailed information.'),
      createBlock('Benefits of Brochure Printing', 'h2'),
      createBlock('Easy to distribute with multiple distribution channels. Cost-Effective and Budget-Friendly. Trust Builder that adds credibility and provides enduring marketing material.'),
      createBlock('Customize your Brochure with DigiPrint Plus', 'h2'),
      createBlock('We understand that you have a wealth of information to convey about your business. Custom brochures printing offers the perfect solution, allowing you to present every last detail in a concise and visually appealing design.')
    ],
    publishedAt: '2024-07-19',
    featured: false
  },
  {
    title: 'Organize and Showcase Your Documents with Custom Binders',
    slug: 'organize-showcase-documents-custom-binders',
    excerpt: 'Whether you need to organize important documents, present marketing materials, or create professional reports, DigiPrint Plus custom binder services have solutions for all your needs.',
    content: [
      createBlock('Whether you need to organize important documents, present marketing materials, or create professional reports, the custom binder services of DigiPrint Plus have solutions for all. We have several binder options to meet your needs successfully.'),
      createBlock('Custom Binder Options Available', 'h2'),
      createBlock('Vinyl Binders: Our vinyl binders are designed to withstand daily use while maintaining their professional appearance. We use high-quality materials that are tear and spill-resistant.'),
      createBlock('Lito Binders: If you\'re looking for a more refined option, our Lito binders are the perfect choice. These binders exude elegance and sophistication, making them ideal for executive presentations.')
    ],
    publishedAt: '2024-07-19',
    featured: false
  },
  {
    title: 'The Benefits of Digital Printing Services in Orange County, CA',
    slug: 'benefits-digital-printing-services-orange-county',
    excerpt: 'Orange County is known for its thriving business community. Discover the benefits of working with a local digital printing service provider for your business needs.',
    content: [
      createBlock('Orange County is known for its thriving business community, and for good reason. With a diverse range of industries and a strong entrepreneurial spirit, it\'s no wonder why so many businesses call Orange County home.'),
      createBlock('Benefits of Local Digital Printing Services', 'h2'),
      createBlock('Personalized Service: When you work with a local digital printing service provider, you receive personalized attention and service that larger, national companies simply cannot match.'),
      createBlock('Quick Turnaround Times: Local proximity means faster delivery times and the ability to handle rush orders when needed.')
    ],
    publishedAt: '2023-03-29',
    featured: true
  },
  {
    title: 'The Benefits of Digital Printing On Demand',
    slug: 'benefits-digital-printing-on-demand',
    excerpt: 'In today\'s fast-paced business world, time is money. Digital printing on demand allows you to quickly produce high-quality materials without costly setup fees or long lead times.',
    content: [
      createBlock('In today\'s fast-paced business world, time is money. That\'s why digital printing on demand is becoming increasingly popular for businesses of all sizes. This technology allows you to quickly and easily produce high-quality printed materials in small quantities.'),
      createBlock('Key Benefits of Digital Printing On Demand', 'h2'),
      createBlock('Fast Turnaround Times: Digital printing on demand allows you to quickly produce small quantities of printed materials, often within 24 to 48 hours.'),
      createBlock('Cost-Effective: Unlike traditional printing methods, digital printing on demand does not require expensive setup fees or minimum order quantities.')
    ],
    publishedAt: '2023-03-29',
    featured: false
  },
  {
    title: 'Hire DigiPrint Plus for Booklet Printing Service in Irvine',
    slug: 'digiprint-plus-booklet-printing-service-irvine',
    excerpt: 'A booklet is a compilation of comprehensive information that serves as credibility enhancers for business presentations, conferences, and marketing seminars.',
    content: [
      createBlock('A booklet is a compilation of comprehensive information. It encompasses the printing and design of a collection that includes details, data, charts, images, and any other pertinent information intended for dissemination to individuals or a specific audience.'),
      createBlock('Benefits of Professional Booklet Printing', 'h2'),
      createBlock('Professional booklet printing offers numerous advantages for businesses looking to make a lasting impression. High-quality booklets demonstrate attention to detail and professionalism.'),
      createBlock('Why Choose DigiPrint Plus', 'h2'),
      createBlock('With years of experience in the printing industry, DigiPrint Plus has the expertise and equipment necessary to produce exceptional booklets that meet your exact specifications.')
    ],
    publishedAt: '2024-07-19',
    featured: false
  }
]

// Main seeding function
export default async function seedBlogPosts() {
  console.log('🌱 Starting blog post seeding...')
  
  try {
    // Check for existing author
    console.log('👤 Checking for authors...')
    let authors = await client.fetch('*[_type == "author"]')
    
    let authorId
    if (authors.length === 0) {
      console.log('Creating default author...')
      const author = await client.create({
        _type: 'author',
        name: 'DigiPrint Plus Team',
        slug: { _type: 'slug', current: 'digiprint-plus-team' },
        bio: [createBlock('The DigiPrint Plus team consists of experienced printing professionals dedicated to delivering exceptional quality and service.')]
      })
      authorId = author._id
      console.log(`✅ Created author: ${author.name}`)
    } else {
      authorId = authors[0]._id
      console.log(`✅ Using existing author: ${authors[0].name}`)
    }

    // Check for existing categories
    console.log('🏷️ Checking for categories...')
    let categories = await client.fetch('*[_type == "category"]')
    
    let categoryIds = []
    if (categories.length === 0) {
      console.log('Creating default categories...')
      const cats = [
        { title: 'Digital Printing', slug: 'digital-printing' },
        { title: 'Marketing Materials', slug: 'marketing-materials' }
      ]
      
      for (const cat of cats) {
        const category = await client.create({
          _type: 'category',
          title: cat.title,
          slug: { _type: 'slug', current: cat.slug },
          description: `Articles about ${cat.title.toLowerCase()}`
        })
        categoryIds.push(category._id)
        console.log(`✅ Created category: ${category.title}`)
      }
    } else {
      categoryIds = categories.slice(0, 2).map((cat: any) => cat._id)
      console.log(`✅ Using existing categories`)
    }

    // Create posts
    console.log('📰 Creating blog posts...')
    let createdCount = 0
    
    for (const postData of posts) {
      // Check if post already exists
      const existing = await client.fetch(
        '*[_type == "post" && slug.current == $slug][0]',
        { slug: postData.slug }
      )
      
      if (existing) {
        console.log(`⏭️ Post "${postData.title}" already exists, skipping...`)
        continue
      }

      const post = {
        _type: 'post',
        title: postData.title,
        slug: { _type: 'slug', current: postData.slug },
        excerpt: postData.excerpt,
        content: postData.content,
        author: { _type: 'reference', _ref: authorId },
        categories: categoryIds.map((id: string) => ({ _type: 'reference', _ref: id })),
        publishedAt: new Date(postData.publishedAt).toISOString(),
        featured: postData.featured
      }

      const created = await client.create(post)
      createdCount++
      console.log(`✅ Created: "${created.title}"`)
    }

    console.log(`🎉 Seeding completed! Created ${createdCount} new blog posts.`)
    console.log('💡 You can now add cover images manually in Sanity Studio.')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}