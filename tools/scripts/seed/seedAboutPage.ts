import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'

const aboutPageData = {
  _type: 'about',
  title: 'About DigiPrintPlus',
  slug: {
    _type: 'slug',
    current: 'about'
  },
  subtitle: 'Your trusted partner for professional printing solutions since 2008',
  content: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'With over 15 years of experience in the printing industry, DigiPrintPlus has been serving businesses with high-quality printing solutions. We specialize in delivering exceptional results that help your business stand out.'
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
          text: 'Our commitment to quality and exceptional customer service has made us a trusted partner for businesses of all sizes. From small startups to large corporations, we provide the same level of attention and care to every project.'
        }
      ],
      markDefs: [],
      style: 'normal'
    }
  ],
  services: {
    title: 'Our Services',
    items: [
      {
        title: 'Business Cards & Stationery',
        description: 'Professional business cards, letterheads, and corporate stationery',
        icon: 'credit-card'
      },
      {
        title: 'Brochures & Marketing Materials',
        description: 'Eye-catching brochures, flyers, and promotional materials',
        icon: 'file-text'
      },
      {
        title: 'Banners & Large Format',
        description: 'Trade show banners, posters, and large format prints',
        icon: 'image'
      },
      {
        title: 'Custom Printing Solutions',
        description: 'Tailored printing services for unique requirements',
        icon: 'settings'
      },
      {
        title: 'Digital & Offset Printing',
        description: 'High-quality digital and offset printing services',
        icon: 'printer'
      },
      {
        title: 'Design Services',
        description: 'Professional design and layout services',
        icon: 'palette'
      }
    ]
  },
  whyChooseUs: {
    title: 'Why Choose DigiPrintPlus?',
    items: [
      {
        title: 'High-Quality Results',
        description: 'We use the latest printing technology and premium materials to ensure exceptional quality in every project.'
      },
      {
        title: 'Fast Turnaround',
        description: 'Quick turnaround times without compromising on quality. Most orders completed within 24-48 hours.'
      },
      {
        title: 'Competitive Pricing',
        description: 'Transparent, competitive pricing with no hidden fees. Get the best value for your investment.'
      },
      {
        title: 'Expert Team',
        description: 'Our experienced team provides professional advice and support throughout your project.'
      },
      {
        title: 'Environmental Responsibility',
        description: 'We use eco-friendly inks and sustainable printing practices whenever possible.'
      },
      {
        title: 'Customer Satisfaction',
        description: '100% satisfaction guarantee. We\'re not happy until you\'re completely satisfied.'
      }
    ]
  },
  stats: {
    title: 'Our Numbers',
    items: [
      {
        number: '15+',
        label: 'Years Experience'
      },
      {
        number: '5,000+',
        label: 'Happy Customers'
      },
      {
        number: '50,000+',
        label: 'Projects Completed'
      },
      {
        number: '24/7',
        label: 'Customer Support'
      }
    ]
  },
  teamSection: {
    title: 'Meet Our Team',
    description: 'Our passionate team of printing professionals is dedicated to bringing your vision to life with precision and creativity.',
    members: [
      {
        name: 'Sarah Johnson',
        role: 'Founder & CEO',
        bio: 'With 20 years in the printing industry, Sarah founded DigiPrintPlus with a vision to provide exceptional printing services.'
      },
      {
        name: 'Mike Chen',
        role: 'Production Manager',
        bio: 'Mike oversees our production processes, ensuring every project meets our high standards of quality and timeliness.'
      },
      {
        name: 'Lisa Rodriguez',
        role: 'Design Director',
        bio: 'Lisa leads our creative team, helping clients bring their ideas to life with stunning visual designs.'
      }
    ]
  },
  cta: {
    title: 'Ready to get started?',
    description: 'Contact us today for a quote on your printing project. We\'re here to help bring your ideas to life.',
    primaryButton: {
      text: 'Get Free Quote',
      url: '/quote'
    },
    secondaryButton: {
      text: 'View Our Work',
      url: '/portfolio'
    }
  },
  seo: {
    metaTitle: 'About DigiPrintPlus - Professional Printing Services Since 2008',
    metaDescription: 'Learn about DigiPrintPlus, your trusted partner for professional printing solutions. Over 15 years of experience, 5,000+ happy customers, and exceptional quality.',
  },
  publishedAt: new Date().toISOString(),
}

export async function seedAboutPage() {
  try {
    console.log('🌱 Seeding about page...')
    
    // Check if about page already exists
    const existingAbout = await sanityClient.fetch(`*[_type == "about" && slug.current == "about"][0]`)
    
    if (existingAbout) {
      console.log('📄 About page already exists, updating...')
      await sanityClient.patch(existingAbout._id).set(aboutPageData).commit()
      console.log('✅ About page updated successfully!')
    } else {
      console.log('📄 Creating new about page...')
      await sanityClient.create(aboutPageData)
      console.log('✅ About page created successfully!')
    }
    
    console.log('🎉 About page seeding completed!')
    
  } catch (error) {
    console.error('❌ Error seeding about page:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedAboutPage()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
