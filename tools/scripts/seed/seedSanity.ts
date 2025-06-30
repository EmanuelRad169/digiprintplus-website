// Comprehensive Sanity CMS seed script
import { sanityClient } from '../apps/web/lib/sanity'

// Site Settings Data
const siteSettingsData = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'DigiPrintPlus',
  description: 'Professional printing services for all your business needs. From business cards to banners, we deliver quality printing solutions.',
  keywords: ['printing', 'business cards', 'brochures', 'banners', 'professional printing', 'custom printing'],
  logo: {
    _type: 'image',
    alt: 'DigiPrintPlus Logo'
    // Note: Image asset will need to be uploaded separately
  },
  contact: {
    email: 'info@digiprintplus.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Print Street',
      city: 'Design City',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    }
  },
  socialMedia: {
    facebook: 'https://facebook.com/digiprintplus',
    instagram: 'https://instagram.com/digiprintplus',
    twitter: 'https://twitter.com/digiprintplus',
    linkedin: 'https://linkedin.com/company/digiprintplus'
  },
  seo: {
    metaTitle: 'DigiPrintPlus - Professional Printing Services',
    metaDescription: 'Get high-quality printing services for business cards, brochures, banners, and more. Fast turnaround, competitive prices, professional results.',
    ogImage: {
      _type: 'image',
      alt: 'DigiPrintPlus Social Media Image'
    }
  }
}

// Navigation Menu Data
const navigationMenuData = {
  _id: 'mainNav',
  _type: 'navigationMenu',
  title: 'Main Navigation',
  items: [
    { 
      title: 'Home', 
      url: '/' 
    },
    {
      title: 'Products',
      url: '/products',
      submenu: [
        { title: 'Business Cards', url: '/products/business-cards' },
        { title: 'Brochures', url: '/products/brochures' },
        { title: 'Banners', url: '/products/banners' },
        { title: 'Flyers', url: '/products/flyers' },
        { title: 'Posters', url: '/products/posters' },
        { title: 'Stickers', url: '/products/stickers' },
        { title: 'Letterheads', url: '/products/letterheads' },
        { title: 'Envelopes', url: '/products/envelopes' }
      ]
    },
    { 
      title: 'About', 
      url: '/about' 
    },
    { 
      title: 'Contact', 
      url: '/contact' 
    }
  ]
}

// Home Page Data
const homePageData = {
  _id: 'homePage',
  _type: 'page',
  title: 'Home',
  slug: {
    _type: 'slug',
    current: '/'
  },
  metaTitle: 'DigiPrintPlus - Professional Printing Services',
  metaDescription: 'Get high-quality printing services for business cards, brochures, banners, and more. Fast turnaround, competitive prices, professional results.',
  content: [
    {
      _type: 'hero',
      _key: 'hero1',
      headline: 'Professional Printing Services',
      subheadline: 'From business cards to banners, we deliver quality printing solutions for your business needs.',
      ctaText: 'Get Quote',
      ctaLink: '/quote'
    },
    {
      _type: 'featuredProducts',
      _key: 'featuredProducts1',
      title: 'Our Popular Products',
      description: 'Discover our most requested printing services'
    },
    {
      _type: 'about',
      _key: 'about1',
      title: 'Why Choose DigiPrintPlus?',
      description: 'We combine cutting-edge technology with expert craftsmanship to deliver exceptional printing results.',
      features: [
        'Fast turnaround times',
        'High-quality materials',
        'Competitive pricing',
        'Expert design assistance',
        'Satisfaction guarantee'
      ]
    }
  ]
}

// Product Category Data
const businessCardsCategory = {
  _id: 'category-business-cards',
  _type: 'productCategory',
  name: 'Business Cards',
  slug: {
    _type: 'slug',
    current: 'business-cards'
  },
  description: 'Professional business cards that make a lasting impression. Available in various finishes and paper stocks.',
  image: {
    _type: 'image',
    alt: 'Business Cards Category'
  }
}

// Product Data
const businessCardProduct = {
  _id: 'product-standard-business-cards',
  _type: 'product',
  name: 'Standard Business Cards',
  slug: {
    _type: 'slug',
    current: 'standard-business-cards'
  },
  category: {
    _type: 'reference',
    _ref: 'category-business-cards'
  },
  description: 'Premium quality business cards printed on professional card stock. Perfect for networking and making a great first impression.',
  features: [
    '350gsm premium card stock',
    'Full color printing on both sides',
    'Multiple finish options available',
    'Standard size: 3.5" x 2"',
    'Fast 2-3 day turnaround'
  ],
  specifications: {
    size: '3.5" x 2" (Standard)',
    paperWeight: '350gsm',
    finishes: ['Matte', 'Gloss', 'Satin'],
    colors: 'Full Color (CMYK)',
    turnaround: '2-3 business days'
  },
  pricing: {
    basePrice: 29.99,
    currency: 'USD',
    unit: 'per 250 cards'
  },
  images: [
    {
      _type: 'image',
      alt: 'Standard Business Cards Sample',
      _key: 'img1'
    }
  ],
  isActive: true,
  featured: true
}

// Quote Request Data
const sampleQuoteRequest = {
  _id: 'quote-sample-001',
  _type: 'quoteRequest',
  status: 'new',
  priority: 'normal',
  contact: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Sample Business LLC'
  },
  jobSpecs: {
    productType: 'Business Cards',
    quantity: 500,
    size: '3.5" x 2"',
    paperType: '350gsm Card Stock',
    finish: 'Matte',
    turnaround: '3-5 business days'
  },
  additionalNotes: 'Need design assistance. Company logo will be provided.',
  files: [],
  requestDate: new Date().toISOString(),
  estimatedTotal: 45.99
}

// User Profile Data
const adminUserProfile = {
  _id: 'user-admin',
  _type: 'user',
  name: 'Admin User',
  email: 'admin@digiprintplus.com',
  role: 'admin',
  avatar: {
    _type: 'image',
    alt: 'Admin Avatar'
  },
  bio: 'System administrator for DigiPrintPlus CMS',
  isActive: true,
  permissions: ['read', 'write', 'delete', 'admin'],
  createdAt: new Date().toISOString()
}

// Seed function
async function seedSanity() {
  console.log('🌱 Starting comprehensive Sanity CMS seeding...')
  
  try {
    // Seed Site Settings
    console.log('📄 Creating site settings...')
    await sanityClient.createOrReplace(siteSettingsData)
    console.log('✅ Site settings created')

    // Seed Navigation Menu
    console.log('🧭 Creating navigation menu...')
    await sanityClient.createOrReplace(navigationMenuData)
    console.log('✅ Navigation menu created')

    // Seed Home Page
    console.log('🏠 Creating home page...')
    await sanityClient.createOrReplace(homePageData)
    console.log('✅ Home page created')

    // Seed Product Category
    console.log('📂 Creating product category...')
    await sanityClient.createOrReplace(businessCardsCategory)
    console.log('✅ Business cards category created')

    // Seed Product
    console.log('📦 Creating product...')
    await sanityClient.createOrReplace(businessCardProduct)
    console.log('✅ Standard business cards product created')

    // Seed Quote Request
    console.log('💬 Creating sample quote request...')
    await sanityClient.createOrReplace(sampleQuoteRequest)
    console.log('✅ Sample quote request created')

    // Seed User Profile
    console.log('👤 Creating admin user profile...')
    await sanityClient.createOrReplace(adminUserProfile)
    console.log('✅ Admin user profile created')

    console.log('\n🎉 Sanity CMS seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('  ✅ Site Settings')
    console.log('  ✅ Navigation Menu (8 items)')
    console.log('  ✅ Home Page')
    console.log('  ✅ Product Category (Business Cards)')
    console.log('  ✅ Product (Standard Business Cards)')
    console.log('  ✅ Quote Request (Sample)')
    console.log('  ✅ User Profile (Admin)')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to seed Sanity CMS:', error)
    process.exit(1)
  }
}

seedSanity()
