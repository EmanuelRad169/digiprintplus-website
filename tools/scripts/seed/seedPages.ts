import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'

const pageData = [
  {
    _id: 'page-contact',
    _type: 'page',
    title: 'Contact Us',
    slug: {
      _type: 'slug',
      current: 'contact'
    },
    subtitle: 'Ready to start your next project? We\'d love to hear from you.',
    content: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro-span',
            text: 'Get in touch with our team to discuss your printing needs. We\'re here to help bring your vision to life with professional printing solutions.',
            marks: []
          }
        ],
        markDefs: []
      }
    ],
    seo: {
      metaTitle: 'Contact DigiPrintPlus - Get in Touch',
      metaDescription: 'Contact us for quotes, questions, or to discuss your printing needs. Professional printing services with expert support.',
    },
    publishedAt: new Date().toISOString()
  },
  {
    _id: 'page-about',
    _type: 'page',
    title: 'About DigiPrintPlus',
    slug: {
      _type: 'slug',
      current: 'about'
    },
    subtitle: 'Your trusted partner for professional printing solutions since 2010.',
    content: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro-span',
            text: 'DigiPrintPlus has been delivering exceptional printing services for over a decade. We combine cutting-edge technology with traditional craftsmanship to produce stunning results for businesses of all sizes.',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'mission',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'mission-span',
            text: 'Our Mission',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'mission-text',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'mission-text-span',
            text: 'To provide high-quality printing solutions that help businesses communicate effectively and make a lasting impression. We believe every project deserves attention to detail and professional excellence.',
            marks: []
          }
        ],
        markDefs: []
      }
    ],
    seo: {
      metaTitle: 'About DigiPrintPlus - Professional Printing Since 2010',
      metaDescription: 'Learn about DigiPrintPlus, your trusted printing partner since 2010. Professional printing services with exceptional quality and customer service.',
    },
    publishedAt: new Date().toISOString()
  },
  {
    _id: 'page-services',
    _type: 'page',
    title: 'Our Services',
    slug: {
      _type: 'slug',
      current: 'services'
    },
    subtitle: 'Comprehensive printing solutions for all your business needs.',
    content: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro-span',
            text: 'From business cards to large format displays, we offer a complete range of printing services to help your business succeed.',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'digital',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'digital-span',
            text: 'Digital Printing',
            marks: []
          }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'digital-text',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'digital-text-span',
            text: 'Fast, high-quality digital printing for short runs and quick turnarounds.',
            marks: []
          }
        ],
        markDefs: []
      }
    ],
    seo: {
      metaTitle: 'Professional Printing Services - DigiPrintPlus',
      metaDescription: 'Explore our comprehensive printing services including digital printing, offset printing, and large format solutions for your business.',
    },
    publishedAt: new Date().toISOString()
  }
]

export async function seedPages() {
  try {
    console.log('🌱 Seeding pages...')
    
    for (const page of pageData) {
      const existingPage = await sanityClient.fetch(
        `*[_type == "page" && _id == $id][0]`,
        { id: page._id }
      )
      
      if (existingPage) {
        console.log(`✅ Updating page: ${page.title}`)
        await sanityClient.createOrReplace(page)
      } else {
        console.log(`🆕 Creating page: ${page.title}`)
        await sanityClient.create(page)
      }
    }
    
    console.log('✅ Pages seeded successfully!')
    console.log(`📄 Total pages: ${pageData.length}`)
    return true
  } catch (error) {
    console.error('❌ Error seeding pages:', error)
    return false
  }
}

// Run if called directly
if (require.main === module) {
  seedPages().then((success) => {
    if (success) {
      console.log('🎉 Page seeding completed!')
      process.exit(0)
    } else {
      console.log('💥 Page seeding failed!')
      process.exit(1)
    }
  })
}
