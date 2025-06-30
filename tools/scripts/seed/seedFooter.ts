import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'
import type { SeedResult } from './types'

const footerData = {
  _id: 'footer',
  _type: 'footer',
  title: 'DigiPrintPlus',
  description: 'Your trusted partner for professional printing solutions. We deliver high-quality prints with exceptional service and competitive pricing.',
  socialLinks: [
    {
      platform: 'facebook',
      url: 'https://facebook.com/digiprintplus',
      isVisible: true
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/digiprintplus',
      isVisible: true
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com/digiprintplus',
      isVisible: true
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/company/digiprintplus',
      isVisible: true
    }
  ],
  services: [
    {
      label: 'Business Cards',
      slug: '/products/business-cards',
      isVisible: true
    },
    {
      label: 'Brochures',
      slug: '/products/brochures',
      isVisible: true
    },
    {
      label: 'Banners',
      slug: '/products/banners',
      isVisible: true
    },
    {
      label: 'Flyers',
      slug: '/products/flyers',
      isVisible: true
    },
    {
      label: 'Posters',
      slug: '/products/posters',
      isVisible: true
    },
    {
      label: 'Stickers',
      slug: '/products/stickers',
      isVisible: true
    }
  ],
  quickLinks: [
    {
      label: 'About Us',
      slug: '/about',
      isVisible: true
    },
    {
      label: 'Get Quote',
      slug: '/quote',
      isVisible: true
    },
    {
      label: 'Contact',
      slug: '/contact',
      isVisible: true
    },
    {
      label: 'FAQ',
      slug: '/faq',
      isVisible: true
    },
    {
      label: 'Privacy Policy',
      slug: '/privacy',
      isVisible: true
    },
    {
      label: 'Terms of Service',
      slug: '/terms',
      isVisible: true
    }
  ],
  contactInfo: {
    address: '123 Print Street, Business District, NY 10001',
    phone: '(555) 123-4567',
    email: 'sales@digiprintplus.com'
  },
  businessHours: [
    {
      day: 'Mon - Fri',
      hours: '8:00 AM - 6:00 PM'
    },
    {
      day: 'Saturday',
      hours: '9:00 AM - 4:00 PM'
    },
    {
      day: 'Sunday',
      hours: 'Closed'
    }
  ],
  copyright: 'DigiPrintPlus. All rights reserved. Built with modern technology for superior printing solutions.'
}

async function seedFooter(): Promise<SeedResult> {
  try {
    console.log('🌱 Seeding footer data...')
    
    // Create or replace the footer document
    const result = await sanityClient.createOrReplace(footerData)
    
    console.log('✅ Footer data seeded successfully!')
    console.log('📄 Document ID:', result._id)
    
    return { success: true, message: 'Footer seeded successfully', data: result }
  } catch (error) {
    console.error('❌ Error seeding footer:', error)
    return { success: false, message: String(error) }
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  seedFooter()
    .then(result => {
      if (result.success) {
        console.log('✨ Done!')
        process.exit(0)
      } else {
        console.error('Failed:', result.message)
        process.exit(1)
      }
    })
    .catch(err => {
      console.error('Unexpected error:', err)
      process.exit(1)
    })
}

export default seedFooter
