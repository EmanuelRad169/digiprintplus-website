import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_STUDIO_API_TOKEN,
  apiVersion: '2023-05-03'
})

// Validate token
if (!client.config().token) {
  throw new Error('❌ SANITY_API_TOKEN is required. Please set it in your .env.local file or environment variables.')
}

// Helper function to convert text to portable text blocks
function createPortableTextBlock(text: string, style: string = 'normal') {
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

// Helper function to create heading blocks
function createHeadingBlock(text: string, level: string = 'h2') {
  return createPortableTextBlock(text, level)
}

// Helper function to create bullet list blocks
function createListBlock(items: string[]) {
  return items.map(item => ({
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    listItem: 'bullet',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: item,
        marks: []
      }
    ]
  }))
}

// Blog posts data with full content from DigiPrintPlus
const blogPosts = [
  {
    title: 'Professional Mailing Processing Services in Orange County',
    slug: 'professional-mailing-processing-services-orange-county',
    excerpt: 'Looking for reliable and efficient mailing processing services in Orange County? DigiPrint Plus offers comprehensive solutions to streamline your mailing campaigns for businesses of all sizes.',
    coverImage: 'https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/Blog-Post-Image-006.jpg',
    publishedAt: '2024-07-19',
    featured: true,
    content: [
      createPortableTextBlock('If you are looking for a trusted partner for reliable and efficient mailing processing services in Orange County, we welcome you all to DigiPrint Plus. With our expertise in data processing and commitment to quality, we offer comprehensive solutions to streamline your mailing campaigns, whether you are a small business or a large corporation.'),
      
      createHeadingBlock('Know More About Our Mailing Processing Service in Orange County'),
      createPortableTextBlock('As a leading data processing company in Orange County, we understand the importance of accurate data management for successful mailing campaigns. From data cleansing and deduplication to address verification and formatting, we employ robust processes to enhance the quality and effectiveness of your mailing lists.'),
      
      createPortableTextBlock('At DigiPrint Plus, we provide comprehensive mailing processing services tailored to meet your specific needs. Our streamlined approach ensures that your mailings are handled with precision and efficiency. Whether you require direct mail marketing, promotional materials, or customer communications, we have the expertise and resources to execute your projects flawlessly.'),
      
      createHeadingBlock('Key Features of Our Mailing Processing Services'),
      createPortableTextBlock('Address Verification and Standardization: We employ advanced tools and techniques to verify and standardize addresses, ensuring accurate delivery and reducing undeliverable mail.'),
      createPortableTextBlock('Data Cleansing and Deduplication: Our data cleansing processes eliminate errors, inconsistencies, and duplicate entries, optimizing the accuracy and effectiveness of your mailing lists.'),
      createPortableTextBlock('Variable Data Printing: Personalize your mailings with variable data printing, allowing you to tailor each piece to the recipient for enhanced engagement and response rates.'),
      createPortableTextBlock('Postal Presorting and Barcoding: By presorting your mailings and applying postal barcodes, we help you qualify for postal discounts, resulting in significant cost savings.'),
      createPortableTextBlock('Fulfillment and Assembly: Our skilled team manages the entire fulfillment process, including printing, inserting, and packaging, ensuring that your mailings are assembled accurately and professionally.'),
      createPortableTextBlock('Track and Trace: Gain visibility into your mailings with our track and trace capabilities, allowing you to monitor delivery status and ensure timely arrival.'),
      
      createHeadingBlock('Why Choose DigiPrint Plus for Mailing Processing'),
      createPortableTextBlock('With DigiPrint Plus, you will get convenient and efficient professional mailing services in Orange County. We are a leading data processing company that provides comprehensive solutions to increase the effectiveness of mailing campaigns. If you want support to grow your business, partner with us for your mailing requirements.')
    ]
  },
  
  {
    title: 'Tell Your Story to Your Customers with Brochure Printing in Irvine',
    slug: 'tell-your-story-brochure-printing-irvine',
    excerpt: 'Brochures are visually appealing advertising materials that serve as descriptive tools for your business. Discover how professional brochure printing can help tell your story effectively.',
    coverImage: 'https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/Blog-Post-Image-005.jpg',
    publishedAt: '2024-07-19',
    featured: false,
    content: [
      createPortableTextBlock('Brochures are visually appealing advertising materials typically consisting of a single sheet with a panel fold. They are printed on high-quality paper and feature colorful and attractive visuals. Brochures serve as descriptive advertising tools, providing an introduction to a product or service along with detailed information. They don\'t necessarily follow a strict itemized order but focus on presenting the benefits from the customer\'s perspective.'),
      
      createPortableTextBlock('Brochure printing in Irvine is a cost-effective solution for small and emerging businesses to attract the interest of potential customers. Compared to product advertisements in magazines and newspapers, brochures offer an effective and budget-friendly alternative. The high cost of prime advertising space in print media, shared by multiple businesses vying for public attention, makes it difficult to stand out amidst the competition.'),
      
      createHeadingBlock('Benefits of Brochure Printing'),
      createPortableTextBlock('Easy to distribute with multiple distribution channels'),
      createPortableTextBlock('Cost-Effective/Budget-Friendly'),
      createPortableTextBlock('Trust Builder, Add credibility, and Enduring marketing material'),
      createPortableTextBlock('Reach ability to target clients'),
      createPortableTextBlock('Descriptive/Hold Crisp and Relevant information'),
      createPortableTextBlock('Tangible reference material'),
      createPortableTextBlock('Give Personalize touch to your business'),
      
      createHeadingBlock('Customize your Brochure with DigiPrint Plus'),
      createPortableTextBlock('The basic components of a brochure design are the headline, sub-headings, body copy, terms & conditions, and illustrations.'),
      
      createHeadingBlock('Personalized & Packed with Information'),
      createPortableTextBlock('We understand that you have a wealth of information to convey about your business. Custom brochures printing offers the perfect solution, allowing you to present every last detail in a concise and visually appealing design. These professionally-crafted brochures are not only budget-friendly but also serve as excellent marketing materials for mailing or distribution. With a choice of 5 sizes, 3-fold styles, and 4 paper stocks, you can create a brochure that reflects the uniqueness of your small business and enjoy low-cost brochure printing in Irvine OC.'),
      
      createHeadingBlock('Engage, Inform & Excite Customers'),
      createPortableTextBlock('No matter if you\'re aiming to extend your real estate reach, promote a restaurant menu, or market spa services, we offer a diverse range of pamphlet printing styles to suit your needs. Depending on your desired size and fold, you can select from a variety of paper stocks. Discover bi-fold, tri-fold, and z-fold options to determine the ideal page order that effectively conveys your message through our pamphlet printing company in orange county LA.')
    ]
  },
  
  {
    title: 'Organize and Showcase Your Documents with Custom Binders',
    slug: 'organize-showcase-documents-custom-binders',
    excerpt: 'Whether you need to organize important documents, present marketing materials, or create professional reports, DigiPrint Plus custom binder services have solutions for all your needs.',
    coverImage: 'https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/Blog-Post-Image-004.jpg',
    publishedAt: '2024-07-19',
    featured: false,
    content: [
      createPortableTextBlock('Whether you need to organize important documents, present marketing materials, or create professional reports, the custom binder services of DigiPrint Plus have solutions for all. We have several binder options to meet your needs successfully. With our exceptional custom binder printing in Orange County, your binders and tabs will make a lasting impression.'),
      
      createHeadingBlock('What Custom Binder Options Are Available for You?'),
      
      createHeadingBlock('Vinyl Binders: Durability and Versatility', 'h3'),
      createPortableTextBlock('Our vinyl binders are designed to withstand daily use while maintaining their professional appearance. We use high-quality materials to make vinyl binders. The materials are tear and spill-resistant. Also, there are multiple color, texture, and size options for you.'),
      
      createHeadingBlock('Lito Binders: Elegance and Sophistication', 'h3'),
      createPortableTextBlock('If you\'re looking for a more refined option, our Lito binders are the perfect choice. These binders exude elegance and sophistication, making them ideal for executive presentations, board meetings, or luxury product catalogs.'),
      
      createHeadingBlock('Custom Recycled Binders: Sustainability and Style', 'h3'),
      createPortableTextBlock('Our environment is our responsibility and DigiPrint Plus very-well understands it. So, our service includes custom recycled binders that are a combination of sustainability and style. We use recycled materials, such as recycled paperboard covers, to make them.'),
      
      createHeadingBlock('Custom Turned-Edge Binders: Premium Craftsmanship and Professionalism', 'h3'),
      createPortableTextBlock('For a truly premium look and feel, our custom-turned-edge binders are the epitome of craftsmanship and professionalism. These binders feature a seamless, wrapped cover with turned edges, giving them a polished and refined appearance. Our skilled artisans meticulously handcraft each binder to ensure flawless quality.'),
      
      createHeadingBlock('Custom Index Tabs: Efficient Document Navigation', 'h3'),
      createPortableTextBlock('To enhance the organization and accessibility of your documents, our custom index tabs are the perfect addition to your binders. Our index tabs are made from durable materials and can be printed with labels or personalized graphics for a cohesive and professional look.'),
      
      createHeadingBlock('Why Choose Digiprint Plus for Your Custom Binders?'),
      createPortableTextBlock('At Digiprint Plus, we take pride in delivering exceptional quality and craftsmanship with every custom binder printing in Orange County. With our team of experienced binder printing professionals, we can bring your vision to life as we will work closely with you from start to end and consider all your specific requirements.')
    ]
  },
  
  {
    title: 'Hire DigiPrint Plus for Booklet Printing Service in Irvine',
    slug: 'digiprint-plus-booklet-printing-service-irvine',
    excerpt: 'A booklet is a compilation of comprehensive information that serves as credibility enhancers for business presentations, conferences, and marketing seminars.',
    coverImage: 'https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/Blog-Post-Image-001.jpg',
    publishedAt: '2024-07-19',
    featured: false,
    content: [
      createPortableTextBlock('A booklet is a compilation of comprehensive information. It encompasses the printing and design of a collection that includes details, data, charts, images, and any other pertinent information intended for dissemination to individuals or a specific audience.'),
      
      createPortableTextBlock('Additionally, booklets serve as credibility enhancers for various purposes such as business sales presentations, conferences, or marketing seminars. They act as a centralized source for distributing information, ensuring that your audience has easy access to all the relevant details they need.'),
      
      createHeadingBlock('Benefits of Professional Booklet Printing'),
      createPortableTextBlock('Professional booklet printing offers numerous advantages for businesses looking to make a lasting impression. High-quality booklets demonstrate attention to detail and professionalism, while also providing a tangible reference that clients and prospects can keep and review at their convenience.'),
      
      createHeadingBlock('Design and Layout Options'),
      createPortableTextBlock('Our booklet printing services offer a wide range of design and layout options to suit your specific needs. From simple saddle-stitched booklets to more complex perfect-bound publications, we can accommodate various sizes, page counts, and finishing options.'),
      
      createHeadingBlock('Quality Materials and Printing'),
      createPortableTextBlock('We use only the highest quality papers and printing techniques to ensure your booklets look professional and feel substantial. Our state-of-the-art printing equipment produces crisp text and vibrant images that will impress your audience.'),
      
      createHeadingBlock('Why Choose DigiPrint Plus'),
      createPortableTextBlock('With years of experience in the printing industry, DigiPrint Plus has the expertise and equipment necessary to produce exceptional booklets that meet your exact specifications. Our team works closely with clients to ensure every detail is perfect, from initial design concepts to final delivery.')
    ]
  },
  
  {
    title: 'The Benefits of Digital Printing Services in Orange County, CA',
    slug: 'benefits-digital-printing-services-orange-county',
    excerpt: 'Orange County is known for its thriving business community. Discover the benefits of working with a local digital printing service provider for your business needs.',
    coverImage: 'https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/business-cards-1.png',
    publishedAt: '2023-03-29',
    featured: true,
    content: [
      createPortableTextBlock('Orange County is known for its thriving business community, and for good reason. With a diverse range of industries and a strong entrepreneurial spirit, it\'s no wonder why so many businesses call Orange County home. If you\'re looking for high-quality printing services to help elevate your brand, look no further than digital printing services in Orange County.'),
      
      createHeadingBlock('Benefits of Working with Local Digital Printing Services'),
      
      createHeadingBlock('Personalized Service', 'h3'),
      createPortableTextBlock('When you work with a local digital printing service provider, you receive personalized attention and service that larger, national companies simply cannot match. Local printers understand the unique needs of Orange County businesses and can provide customized solutions that meet your specific requirements.'),
      
      createHeadingBlock('Quick Turnaround Times', 'h3'),
      createPortableTextBlock('Local proximity means faster delivery times and the ability to handle rush orders when needed. This is particularly valuable for businesses that need to respond quickly to market opportunities or time-sensitive promotional campaigns.'),
      
      createHeadingBlock('Support for Local Economy', 'h3'),
      createPortableTextBlock('By choosing a local printing service, you\'re supporting the Orange County economy and helping to create jobs in your community. This local support often translates into better service and stronger business relationships.'),
      
      createHeadingBlock('Quality and Expertise'),
      createPortableTextBlock('Orange County digital printing services have invested in state-of-the-art equipment and employ skilled professionals who understand the latest printing technologies and techniques. This ensures that your printed materials meet the highest quality standards.'),
      
      createHeadingBlock('Cost-Effective Solutions'),
      createPortableTextBlock('Local printing services can often provide more competitive pricing due to lower overhead costs and the elimination of shipping fees. Additionally, they can work with you to find cost-effective solutions that meet your budget requirements.')
    ]
  },
  
  {
    title: 'The Benefits of Digital Printing On Demand',
    slug: 'benefits-digital-printing-on-demand',
    excerpt: 'In today\'s fast-paced business world, time is money. Digital printing on demand allows you to quickly produce high-quality materials without costly setup fees or long lead times.',
    coverImage: 'https://cms.presscentric.com/2zKfosuorGlkuAapHGINRT/images/business-cards-1.png',
    publishedAt: '2023-03-29',
    featured: false,
    content: [
      createPortableTextBlock('In today\'s fast-paced business world, time is money. That\'s why digital printing on demand is becoming increasingly popular for businesses of all sizes. This technology allows you to quickly and easily produce high-quality printed materials in small quantities, without the need for costly setup fees or long lead times.'),
      
      createHeadingBlock('Key Benefits of Digital Printing On Demand'),
      
      createHeadingBlock('1. Fast Turnaround Times', 'h3'),
      createPortableTextBlock('Digital printing on demand allows you to quickly produce small quantities of printed materials, often within 24 to 48 hours. This means you can respond quickly to changing market conditions, customer demands, or internal needs without sacrificing quality or cost-effectiveness.'),
      
      createHeadingBlock('2. Cost-Effective', 'h3'),
      createPortableTextBlock('Unlike traditional printing methods, digital printing on demand does not require expensive setup fees or minimum order quantities. This makes it an affordable option for small businesses, startups, or businesses with limited budgets.'),
      
      createHeadingBlock('3. Customizable', 'h3'),
      createPortableTextBlock('With digital printing on demand, you can easily customize your printed materials to meet your specific needs. This could include personalized marketing materials, seasonal promotions, or customized packaging.'),
      
      createHeadingBlock('4. High-Quality Output', 'h3'),
      createPortableTextBlock('Digital printing technology has come a long way in recent years, and now offers high-quality output that rivals traditional printing methods. This means you can achieve the same professional look and feel for your printed materials, without the need for expensive offset printing.'),
      
      createHeadingBlock('5. Environmentally Friendly', 'h3'),
      createPortableTextBlock('Digital printing on demand is also more environmentally friendly than traditional printing methods, as it produces less waste and uses fewer resources. This makes it an ideal choice for businesses that are committed to sustainability and reducing their carbon footprint.'),
      
      createHeadingBlock('Conclusion'),
      createPortableTextBlock('Digital printing on demand is a convenient, cost-effective, and customizable option for businesses of all sizes. With fast turnaround times, high-quality output, and minimal setup fees, it\'s no wonder why more and more businesses are turning to this technology to meet their printing needs. If you\'re interested in learning more about digital printing on demand, contact our team of experts today!')
    ]
  }
]

// Function to upload image from URL (placeholder implementation)
async function uploadImageFromUrl(imageUrl: string, fileName: string) {
  try {
    // In a real implementation, you would fetch the image and upload it to Sanity
    // For now, we'll return a placeholder reference
    console.log(`Would upload image: ${imageUrl} as ${fileName}`)
    return null // Return null for now, you can implement actual image upload later
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

// Main seeding function
async function seedBlogPosts() {
  try {
    console.log('🌱 Starting blog post seeding...')
    
    // First, ensure we have authors and categories
    console.log('📝 Checking for existing authors...')
    const existingAuthors = await client.fetch('*[_type == "author"]')
    
    let authorId: string
    if (existingAuthors.length > 0) {
      authorId = existingAuthors[0]._id
      console.log(`✅ Using existing author: ${existingAuthors[0].name}`)
    } else {
      // Create a default author
      console.log('👤 Creating default author...')
      const author = await client.create({
        _type: 'author',
        name: 'DigiPrint Plus Team',
        slug: { _type: 'slug', current: 'digiprint-plus-team' },
        bio: [
          createPortableTextBlock('The DigiPrint Plus team consists of experienced printing professionals dedicated to delivering exceptional quality and service to businesses throughout Orange County.')
        ]
      })
      authorId = author._id
      console.log(`✅ Created author: ${author.name}`)
    }

    // Check for existing categories
    console.log('🏷️ Checking for existing categories...')
    const existingCategories = await client.fetch('*[_type == "category"]')
    
    let categoryIds: string[] = []
    if (existingCategories.length > 0) {
      categoryIds = existingCategories.map((cat: any) => cat._id)
      console.log(`✅ Found ${existingCategories.length} existing categories`)
    } else {
      // Create default categories
      console.log('🏷️ Creating default categories...')
      const categories = [
        { title: 'Digital Printing', slug: 'digital-printing' },
        { title: 'Marketing Materials', slug: 'marketing-materials' },
        { title: 'Business Services', slug: 'business-services' }
      ]
      
      for (const cat of categories) {
        const category = await client.create({
          _type: 'category',
          title: cat.title,
          slug: { _type: 'slug', current: cat.slug },
          description: `Articles about ${cat.title.toLowerCase()}`
        })
        categoryIds.push(category._id)
        console.log(`✅ Created category: ${category.title}`)
      }
    }

    // Create blog posts
    console.log('📰 Creating blog posts...')
    let createdCount = 0
    
    for (const postData of blogPosts) {
      try {
        // Check if post already exists
        const existingPost = await client.fetch(
          '*[_type == "post" && slug.current == $slug][0]',
          { slug: postData.slug }
        )
        
        if (existingPost) {
          console.log(`⏭️ Post "${postData.title}" already exists, skipping...`)
          continue
        }

        // Upload cover image (placeholder implementation)
        let coverImageRef = null
        if (postData.coverImage) {
          coverImageRef = await uploadImageFromUrl(postData.coverImage, `${postData.slug}-cover`)
        }

        // Create the blog post
        const post = {
          _type: 'post',
          title: postData.title,
          slug: { _type: 'slug', current: postData.slug },
          excerpt: postData.excerpt,
          content: postData.content,
          author: { _type: 'reference', _ref: authorId },
          categories: categoryIds.slice(0, 2).map(id => ({ _type: 'reference', _ref: id })),
          publishedAt: new Date(postData.publishedAt).toISOString(),
          featured: postData.featured,
          // Note: Commenting out coverImage for now since we need to implement actual image upload
          // coverImage: coverImageRef ? { _type: 'image', asset: { _ref: coverImageRef } } : undefined
        }

        const createdPost = await client.create(post)
        createdCount++
        console.log(`✅ Created blog post: "${createdPost.title}"`)
        
      } catch (error) {
        console.error(`❌ Error creating post "${postData.title}":`, error)
      }
    }

    console.log(`🎉 Blog seeding completed! Created ${createdCount} new blog posts.`)
    console.log('💡 Note: Cover images were skipped in this seeding. You can add them manually in Sanity Studio.')
    
  } catch (error) {
    console.error('❌ Error during blog seeding:', error)
    process.exit(1)
  }
}

// Execute the seeding - Sanity exec compatible
const runSeed = async () => {
  try {
    await seedBlogPosts()
    console.log('✨ Seeding process completed successfully!')
  } catch (error) {
    console.error('💥 Seeding process failed:', error)
    throw error
  }
}

// Run if called directly
runSeed()

export default seedBlogPosts