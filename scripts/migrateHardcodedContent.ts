import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  apiVersion: '2024-01-01'
})

// Hero Slides Data (extracted from hero.tsx)
const heroSlides = [
  {
    _id: 'hero-slide-1',
    _type: 'heroSlide',
    title: 'Premium Business Cards',
    subtitle: 'PROFESSIONAL PRINTING',
    description: 'Make a lasting impression with our premium business cards. Choose from over 50 paper stocks and finishes.',
    ctaText: 'Get Quote',
    ctaLink: '/quote',
    stats: {
      number: '24hrs',
      text: 'Rush Service'
    },
    features: ['Premium Materials', 'Free Design', 'Fast Delivery'],
    order: 1,
    isActive: true
  },
  {
    _id: 'hero-slide-2',
    _type: 'heroSlide',
    title: 'Large Format Banners',
    subtitle: 'BIG IMPACT PRINTING',
    description: 'Eye-catching banners and signage that demand attention. Weather-resistant materials for indoor and outdoor use.',
    ctaText: 'Get Quote',
    ctaLink: '/quote',
    stats: {
      number: '10ft+',
      text: 'Max Width'
    },
    features: ['Weather Resistant', 'Vibrant Colors', 'Custom Sizes'],
    order: 2,
    isActive: true
  },
  {
    _id: 'hero-slide-3',
    _type: 'heroSlide',
    title: 'Marketing Materials',
    subtitle: 'COMPLETE BRAND SOLUTIONS',
    description: 'From brochures to flyers, we help your brand stand out with professional marketing materials.',
    ctaText: 'Get Quote',
    ctaLink: '/quote',
    stats: {
      number: '500+',
      text: 'Design Templates'
    },
    features: ['Full Color', 'Multiple Formats', 'Bulk Pricing'],
    order: 3,
    isActive: true
  }
]

// Services Data (extracted from services/page.tsx)
const services = [
  {
    _id: 'service-digital-printing',
    _type: 'service',
    title: 'Digital Printing',
    slug: { current: 'digital-printing' },
    description: 'High-quality digital printing for short to medium runs with fast turnaround times.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our digital printing services provide exceptional quality for projects of all sizes. Perfect for business cards, brochures, flyers, and more.'
          }
        ]
      }
    ],
    icon: 'zap',
    features: [
      'Quick turnaround times',
      'Cost-effective for small to medium runs',
      'Full color capabilities',
      'Variable data printing options'
    ],
    category: 'digital-printing',
    isFeatured: true,
    order: 1,
    isActive: true,
    seo: {
      metaTitle: 'Digital Printing Services | DigiPrintPlus',
      metaDescription: 'High-quality digital printing services with fast turnaround times. Perfect for business cards, brochures, and marketing materials.'
    }
  },
  {
    _id: 'service-offset-printing',
    _type: 'service',
    title: 'Offset Printing',
    slug: { current: 'offset-printing' },
    description: 'Traditional offset printing for premium quality and cost-effective large volume jobs.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our offset printing delivers superior quality for large volume projects. Ideal for magazines, catalogs, books, and high-volume marketing materials.'
          }
        ]
      }
    ],
    icon: 'award',
    features: [
      'Superior image quality',
      'Cost-effective for large runs',
      'Pantone color matching',
      'Wide variety of paper stocks'
    ],
    category: 'offset-printing',
    isFeatured: true,
    order: 2,
    isActive: true,
    seo: {
      metaTitle: 'Offset Printing Services | DigiPrintPlus',
      metaDescription: 'Professional offset printing for large volume jobs. Superior quality with Pantone color matching and premium paper stocks.'
    }
  },
  {
    _id: 'service-large-format',
    _type: 'service',
    title: 'Large Format Printing',
    slug: { current: 'large-format-printing' },
    description: 'Eye-catching banners, posters, and signage for maximum visual impact.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Make a big impression with our large format printing services. From trade show displays to outdoor banners, we create stunning visuals that get noticed.'
          }
        ]
      }
    ],
    icon: 'palette',
    features: [
      'Banners and posters',
      'Trade show displays',
      'Window graphics',
      'Indoor and outdoor signage'
    ],
    category: 'large-format',
    isFeatured: true,
    order: 3,
    isActive: true,
    seo: {
      metaTitle: 'Large Format Printing | Banners & Signage | DigiPrintPlus',
      metaDescription: 'Professional large format printing for banners, posters, and signage. Indoor and outdoor options with vibrant colors.'
    }
  },
  {
    _id: 'service-design-services',
    _type: 'service',
    title: 'Design Services',
    slug: { current: 'design-services' },
    description: 'Professional graphic design to bring your brand and marketing materials to life.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our talented design team creates compelling visuals that communicate your message effectively. From logos to complete brand packages.'
          }
        ]
      }
    ],
    icon: 'users',
    features: [
      'Logo and brand design',
      'Marketing collateral',
      'Packaging design',
      'Print-ready file preparation'
    ],
    category: 'design-services',
    isFeatured: false,
    order: 4,
    isActive: true,
    seo: {
      metaTitle: 'Graphic Design Services | Logo & Brand Design | DigiPrintPlus',
      metaDescription: 'Professional graphic design services including logo design, branding, and marketing materials. Expert designers ready to help.'
    }
  },
  {
    _id: 'service-mailing-services',
    _type: 'service',
    title: 'Mailing Services',
    slug: { current: 'mailing-services' },
    description: 'End-to-end direct mail services from design and printing to delivery.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Complete direct mail solutions that reach your target audience effectively. We handle everything from design to doorstep delivery.'
          }
        ]
      }
    ],
    icon: 'clock',
    features: [
      'List acquisition and management',
      'Variable data printing',
      'Addressing and sorting',
      'USPS preparation and delivery'
    ],
    category: 'mailing-services',
    isFeatured: false,
    order: 5,
    isActive: true,
    seo: {
      metaTitle: 'Direct Mail Services | Mailing & Distribution | DigiPrintPlus',
      metaDescription: 'Complete direct mail services from design to delivery. List management, variable data printing, and USPS preparation.'
    }
  },
  {
    _id: 'service-promotional-products',
    _type: 'service',
    title: 'Promotional Products',
    slug: { current: 'promotional-products' },
    description: 'Custom branded merchandise to increase brand visibility and customer loyalty.',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Boost your brand with custom promotional products. From branded apparel to tech accessories, we help you make lasting impressions.'
          }
        ]
      }
    ],
    icon: 'checkCircle',
    features: [
      'Apparel and wearables',
      'Office supplies',
      'Tech accessories',
      'Trade show giveaways'
    ],
    category: 'promotional-products',
    isFeatured: false,
    order: 6,
    isActive: true,
    seo: {
      metaTitle: 'Promotional Products | Custom Branded Merchandise | DigiPrintPlus',
      metaDescription: 'Custom promotional products and branded merchandise. Apparel, tech accessories, and trade show giveaways to promote your brand.'
    }
  }
]

// About Sections Data (extracted from about.tsx)
const aboutSections = [
  {
    _id: 'about-statistics',
    _type: 'aboutSection',
    sectionType: 'statistics',
    title: 'Trusted by 10,000+ businesses',
    subtitle: 'Why Choose DigiPrintPlus?',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: "We've revolutionized printing with cutting-edge technology, unmatched quality, and customer service that goes above and beyond expectations."
          }
        ]
      }
    ],
    statistics: [
      {
        number: '15+',
        label: 'Years Experience',
        icon: 'award'
      },
      {
        number: '10K+',
        label: 'Happy Clients',
        icon: 'users'
      },
      {
        number: '50K+',
        label: 'Projects Completed',
        icon: 'checkCircle'
      },
      {
        number: '99%',
        label: 'Satisfaction Rate',
        icon: 'star'
      }
    ],
    features: [],
    order: 1,
    isActive: true
  },
  {
    _id: 'about-features',
    _type: 'aboutSection',
    sectionType: 'features',
    title: 'What Sets Us Apart',
    subtitle: '',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our commitment to excellence and customer satisfaction drives everything we do.'
          }
        ]
      }
    ],
    statistics: [],
    features: [
      {
        title: 'Premium Quality Materials',
        description: 'We use only the finest papers, inks, and materials sourced from trusted suppliers to ensure exceptional results.',
        highlight: 'Industry-leading standards',
        icon: 'award'
      },
      {
        title: 'Lightning Fast Delivery',
        description: 'Same-day rush orders available. Most standard orders completed within 24-48 hours with free shipping.',
        highlight: '24hr turnaround',
        icon: 'clock'
      },
      {
        title: '100% Satisfaction Promise',
        description: "Not completely satisfied? We'll reprint your order for free or provide a full refund. Your success is our priority.",
        highlight: 'Risk-free guarantee',
        icon: 'shield'
      },
      {
        title: 'Dedicated Print Experts',
        description: 'Our certified printing specialists provide personalized guidance and support throughout your entire project.',
        highlight: 'Expert consultation',
        icon: 'users'
      }
    ],
    order: 2,
    isActive: true
  }
]

// Contact Information Data (extracted from contact/page.tsx)
const contactInfo = [
  {
    _id: 'contact-chat',
    _type: 'contactInfo',
    type: 'chat',
    title: 'Start a live chat',
    value: 'Live Chat',
    description: 'Available 24/7',
    displayText: 'Live Chat',
    icon: 'messageCircle',
    link: '#',
    isMainContact: true,
    order: 1,
    isActive: true
  },
  {
    _id: 'contact-email',
    _type: 'contactInfo',
    type: 'email',
    title: 'Shoot us an email',
    value: 'order@digiprintplus.com',
    displayText: 'order@digiprintplus.com',
    description: 'Quick email support',
    icon: 'mail',
    link: 'mailto:order@digiprintplus.com',
    isMainContact: true,
    order: 2,
    isActive: true
  },
  {
    _id: 'contact-social',
    _type: 'contactInfo',
    type: 'social',
    title: 'Message us on X',
    value: '@digiprintplus',
    displayText: '@digiprintplus',
    description: 'Follow us on social media',
    icon: 'twitter',
    link: 'https://x.com/digiprintplus',
    isMainContact: false,
    order: 3,
    isActive: true
  },
  {
    _id: 'contact-phone',
    _type: 'contactInfo',
    type: 'phone',
    title: 'Call us directly',
    value: '+1 (555) 123-4567',
    displayText: '(555) 123-4567',
    description: 'Mon-Fri 8am-6pm EST',
    icon: 'phone',
    link: 'tel:+15551234567',
    isMainContact: true,
    order: 4,
    isActive: true
  },
  {
    _id: 'contact-address',
    _type: 'contactInfo',
    type: 'address',
    title: 'Visit our location',
    value: '123 Print Street, Design City, DC 12345',
    displayText: '123 Print Street\nDesign City, DC 12345',
    description: 'Mon-Fri 9am-5pm EST',
    icon: 'mapPin',
    link: '',
    isMainContact: false,
    order: 5,
    isActive: true
  }
]

// FAQ Data (common printing questions)
const faqItems = [
  {
    _id: 'faq-file-formats',
    _type: 'faqItem',
    question: 'What file formats do you accept?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'We accept PDF, AI, EPS, PNG, JPG, and TIFF files. For best results, please provide high-resolution PDF files with all fonts embedded and images at 300 DPI.'
          }
        ]
      }
    ],
    category: 'file-preparation',
    isPopular: true,
    order: 1,
    isActive: true
  },
  {
    _id: 'faq-turnaround-time',
    _type: 'faqItem',
    question: 'What is your standard turnaround time?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our standard turnaround time is 3-5 business days. Rush orders are available with 24-48 hour turnaround for an additional fee.'
          }
        ]
      }
    ],
    category: 'general',
    isPopular: true,
    order: 2,
    isActive: true
  },
  {
    _id: 'faq-minimum-order',
    _type: 'faqItem',
    question: 'Do you have minimum order quantities?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'No, we don\'t have minimum order quantities. Whether you need 1 piece or 10,000, we can accommodate your needs.'
          }
        ]
      }
    ],
    category: 'pricing',
    isPopular: true,
    order: 3,
    isActive: true
  },
  {
    _id: 'faq-color-matching',
    _type: 'faqItem',
    question: 'Can you match specific colors (Pantone)?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Yes, we offer Pantone color matching for offset printing. Please specify Pantone colors in your artwork and we\'ll match them as closely as possible.'
          }
        ]
      }
    ],
    category: 'printing',
    isPopular: false,
    order: 4,
    isActive: true
  },
  {
    _id: 'faq-shipping',
    _type: 'faqItem',
    question: 'Do you offer free shipping?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Yes, we offer free ground shipping on orders over $75. Expedited shipping options are available at additional cost.'
          }
        ]
      }
    ],
    category: 'shipping',
    isPopular: true,
    order: 5,
    isActive: true
  },
  {
    _id: 'faq-proofs',
    _type: 'faqItem',
    question: 'Do you provide proofs before printing?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Yes, we provide digital proofs for all orders. Physical proofs are available upon request for an additional fee.'
          }
        ]
      }
    ],
    category: 'quality',
    isPopular: true,
    order: 6,
    isActive: true
  }
]

// CTA Sections Data (extracted from call-to-action.tsx)
const ctaSections = [
  {
    _id: 'homepage-cta',
    _type: 'ctaSection',
    title: 'Ready to Get Started?',
    description: 'Join thousands of satisfied customers who trust DigiPrintPlus for their printing needs. Get your instant quote today and experience the difference quality makes.',
    primaryButton: {
      text: 'Get Your Free Quote',
      link: '/quote'
    },
    secondaryButton: {
      text: 'Call (555) 123-4567',
      link: 'tel:+15551234567',
      type: 'phone'
    },
    highlights: ['Rush Orders Available', 'Expert Support', 'Satisfaction Guaranteed'],
    backgroundColor: 'magenta',
    sectionId: 'homepage-cta',
    isActive: true
  },
  {
    _id: 'contact-page-cta',
    _type: 'ctaSection',
    title: 'Get Your Project Started Today',
    description: 'Ready to bring your vision to life? Contact our expert team for personalized printing solutions tailored to your needs.',
    primaryButton: {
      text: 'Request Quote',
      link: '/quote'
    },
    secondaryButton: {
      text: 'Schedule Consultation',
      link: '/contact',
      type: 'link'
    },
    highlights: ['Free Consultation', 'Custom Solutions', 'Fast Turnaround'],
    backgroundColor: 'blue',
    sectionId: 'contact-page-cta',
    isActive: true
  }
]

// Quote Settings Data (extracted from quote form components)
const quoteSettings = {
  _id: 'quote-settings',
  _type: 'quoteSettings',
  formTitle: 'Request a Quote',
  jobSpecsStep: {
    title: 'Job Specifications',
    description: 'Tell us about your project',
    productTypes: ['Business Cards', 'Brochures', 'Flyers', 'Posters', 'Banners', 'Postcards', 'Booklets', 'Catalogs'],
    quantities: ['100', '250', '500', '1000', '2500', '5000', '10000', 'Custom'],
    paperTypes: ['14pt C2S', '16pt C2S', '100lb Gloss Text', '70lb Uncoated Text', '80lb Gloss Cover', '100lb Matte Cover'],
    finishes: ['Matte', 'Gloss', 'UV Coating', 'Soft Touch', 'Spot UV', 'Foil Stamping'],
    turnaroundTimes: ['Standard (3-5 Business Days)', 'Rush (1-2 Business Days)', 'Next Day', 'Same Day (Call for Availability)']
  },
  contactStep: {
    title: 'Contact Information',
    description: 'How can we reach you?'
  },
  reviewStep: {
    title: 'Review Your Quote Request',
    description: 'Please review the details below before submitting.',
    terms: 'I agree to the Terms of Service and Privacy Policy. I understand that this is a quote request and not a final order.'
  },
  labels: {
    productType: 'Product Type',
    quantity: 'Quantity',
    paperType: 'Paper Type',
    finish: 'Finish',
    turnaround: 'Turnaround',
    specialInstructions: 'Special Instructions',
    fileUpload: 'Upload Your File',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company'
  },
  buttonText: {
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit Quote Request'
  }
}

// Page Settings Data
const pageSettings = [
  {
    _id: 'contact-page-settings',
    _type: 'pageSettings',
    pageId: 'contact',
    title: 'Contact Us',
    sections: {
      contactInfo: 'Contact Information',
      businessHours: 'Business Hours',
      servicesList: 'Our Services',
      aboutUs: 'About Us'
    }
  },
  {
    _id: 'about-page-settings',
    _type: 'pageSettings',
    pageId: 'about',
    title: 'About DigiPrintPlus',
    sections: {
      contactInfo: 'Contact Information',
      businessHours: 'Business Hours',
      servicesList: 'Our Services',
      aboutUs: 'About Us'
    }
  }
]

// Enhanced About Page Data
const aboutPageData = {
  _id: 'main-about-page',
  _type: 'aboutPage',
  title: 'About DigiPrintPlus',
  subtitle: 'Delivering exceptional printing solutions with over 15 years of industry experience and unwavering commitment to quality.',
  content: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'With over 15 years of experience in the printing industry, DigiPrintPlus has established itself as a trusted partner for businesses seeking high-quality printing solutions. We combine cutting-edge technology with traditional craftsmanship to deliver exceptional results.'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Our commitment to excellence, attention to detail, and customer-first approach have made us the preferred choice for thousands of businesses across the country.'
        }
      ]
    }
  ],
  achievements: [
    { text: 'Quality Guaranteed', icon: 'checkCircle' },
    { text: 'Expert Team', icon: 'award' },
    { text: 'Fast Turnaround', icon: 'checkCircle' },
    { text: 'Competitive Pricing', icon: 'star' }
  ],
  values: [
    {
      title: 'Customer First',
      description: 'Every decision we make is guided by what\'s best for our customers and their success.',
      icon: 'users',
      color: 'magenta'
    },
    {
      title: 'Quality Promise',
      description: 'We stand behind every project with our commitment to exceptional quality and craftsmanship.',
      icon: 'shield',
      color: 'blue'
    },
    {
      title: 'Timely Delivery',
      description: 'Meeting deadlines is crucial to your success, and we take that responsibility seriously.',
      icon: 'clock',
      color: 'green'
    }
  ],
  badge: {
    title: 'Award Winning',
    subtitle: 'Industry Recognition',
    icon: 'award'
  },
  seo: {
    metaTitle: 'About DigiPrintPlus - Professional Printing Services',
    metaDescription: 'Learn about our commitment to quality printing and exceptional customer service with over 15 years of industry experience.'
  },
  isActive: true
}

async function seedAllContent() {
  console.log('Starting content migration to Sanity...')

  try {
    // Seed Hero Slides
    console.log('Seeding hero slides...')
    for (const slide of heroSlides) {
      const result = await client.createOrReplace(slide)
      console.log(`✓ Hero slide: ${slide.title}`)
    }

    // Seed Services
    console.log('Seeding services...')
    for (const service of services) {
      const result = await client.createOrReplace(service)
      console.log(`✓ Service: ${service.title}`)
    }

    // Seed About Sections
    console.log('Seeding about sections...')
    for (const section of aboutSections) {
      const result = await client.createOrReplace(section as any)
      console.log(`✓ About section: ${section.title}`)
    }

    // Seed Contact Information
    console.log('Seeding contact information...')
    for (const contact of contactInfo) {
      const result = await client.createOrReplace(contact as any)
      console.log(`✓ Contact info: ${contact.title}`)
    }

    // Seed FAQ Items
    console.log('Seeding FAQ items...')
    for (const faq of faqItems) {
      const result = await client.createOrReplace(faq)
      console.log(`✓ FAQ: ${faq.question}`)
    }

    // Seed CTA Sections
    console.log('Seeding CTA sections...')
    for (const cta of ctaSections) {
      const result = await client.createOrReplace(cta as any)
      console.log(`✓ CTA section: ${cta.title}`)
    }

    // Seed Quote Settings
    console.log('Seeding quote settings...')
    const result = await client.createOrReplace(quoteSettings as any)
    console.log(`✓ Quote settings: ${quoteSettings.formTitle}`)

    // Seed Page Settings
    console.log('Seeding page settings...')
    for (const pageSetting of pageSettings) {
      await client.createOrReplace(pageSetting as any)
      console.log(`✓ Page settings: ${pageSetting.title}`)
    }

    // Seed Enhanced About Page
    console.log('Seeding enhanced about page...')
    await client.createOrReplace(aboutPageData as any)
    console.log(`✓ About page: ${aboutPageData.title}`)

    console.log('\\n🎉 Content migration completed successfully!')
    console.log('\\nNext steps:')
    console.log('1. Update your React components to fetch data from Sanity')
    console.log('2. Replace hardcoded content with GROQ queries')
    console.log('3. Test the updated components')

  } catch (error) {
    console.error('❌ Error during content migration:', error)
    process.exit(1)
  }
}

// Run the migration
seedAllContent()
