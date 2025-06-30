import { sanityClient } from '../apps/web/lib/sanity'
import type { SeedResult } from './types'

const componentsData = [
  {
    _id: 'hero-main',
    _type: 'component',
    title: 'Main Hero',
    slug: {
      _type: 'slug',
      current: 'main-hero'
    },
    componentType: 'hero',
    description: 'Main hero section for the homepage',
    heroHeading: 'Professional Printing Solutions',
    heroSubheading: 'Delivering high-quality prints with exceptional service and competitive pricing.',
    heroButtons: [
      {
        text: 'Get Started',
        url: '/quote',
        style: 'primary'
      },
      {
        text: 'Learn More',
        url: '/about',
        style: 'secondary'
      }
    ],
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: 'primary',
      textColor: 'white',
      fullWidth: true
    }
  },
  {
    _id: 'cta-primary',
    _type: 'component',
    title: 'Primary CTA',
    slug: {
      _type: 'slug',
      current: 'primary-cta'
    },
    componentType: 'cta',
    description: 'Primary call-to-action for the website',
    ctaHeading: 'Ready to Start Your Project?',
    ctaDescription: 'Contact us today for a free quote and consultation.',
    ctaButtonText: 'Get a Quote',
    ctaButtonUrl: '/quote',
    ctaBackgroundColor: 'primary',
    settings: {
      paddingTop: 'md',
      paddingBottom: 'md',
      backgroundColor: 'dark',
      textColor: 'white',
      fullWidth: false
    }
  },
  {
    _id: 'testimonials-section',
    _type: 'component',
    title: 'Customer Testimonials',
    slug: {
      _type: 'slug',
      current: 'customer-testimonials'
    },
    componentType: 'testimonials',
    description: 'Customer testimonials section',
    testimonialsHeading: 'What Our Customers Say',
    testimonials: [
      {
        quote: 'DigiPrintPlus delivered exceptional quality and service for our company brochures. Highly recommended!',
        name: 'John Smith',
        title: 'Marketing Director',
        company: 'Tech Innovations Inc.'
      },
      {
        quote: 'The team at DigiPrintPlus went above and beyond to meet our tight deadline. The prints were flawless!',
        name: 'Sarah Johnson',
        title: 'Event Coordinator',
        company: 'Global Events LLC'
      },
      {
        quote: 'Outstanding print quality and customer service. We\'ve been using DigiPrintPlus for all our printing needs for over 5 years.',
        name: 'Michael Brown',
        title: 'CEO',
        company: 'Brown & Associates'
      }
    ],
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: 'light',
      textColor: 'dark',
      fullWidth: false
    }
  },
  {
    _id: 'features-section',
    _type: 'component',
    title: 'Our Services Features',
    slug: {
      _type: 'slug',
      current: 'services-features'
    },
    componentType: 'features',
    description: 'Features highlighting our services',
    featuresHeading: 'Why Choose Our Services',
    featuresSubheading: 'We deliver high-quality prints with exceptional service and competitive pricing.',
    features: [
      {
        title: 'Premium Quality',
        description: 'We use top-quality materials and the latest printing technology to deliver exceptional results.',
        icon: 'Star'
      },
      {
        title: 'Fast Turnaround',
        description: 'Need it quickly? Our efficient processes ensure your prints are ready when you need them.',
        icon: 'Clock'
      },
      {
        title: 'Custom Solutions',
        description: 'We work closely with you to create customized print solutions tailored to your specific needs.',
        icon: 'Settings'
      },
      {
        title: 'Eco-Friendly Options',
        description: 'Sustainable printing options that minimize environmental impact without compromising quality.',
        icon: 'Leaf'
      }
    ],
    settings: {
      paddingTop: 'xl',
      paddingBottom: 'xl',
      backgroundColor: 'white',
      textColor: 'default',
      fullWidth: false
    }
  },
  {
    _id: 'faq-section',
    _type: 'component',
    title: 'Frequently Asked Questions',
    slug: {
      _type: 'slug',
      current: 'faq-section'
    },
    componentType: 'faq',
    description: 'Frequently asked questions about our services',
    faqHeading: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'What file formats do you accept?',
        answer: 'We accept most standard file formats including PDF, AI, PSD, JPEG, TIFF, and EPS. PDF is preferred for print-ready files.'
      },
      {
        question: 'How long does printing take?',
        answer: 'Turnaround times vary based on the product and quantity. Standard orders typically take 3-5 business days, while rush orders can be completed in 1-2 business days for an additional fee.'
      },
      {
        question: 'Do you offer design services?',
        answer: 'Yes, we offer professional design services. Our design team can help create or refine your designs to ensure they\'re print-ready and visually appealing.'
      },
      {
        question: 'What are your shipping options?',
        answer: 'We offer standard shipping (3-5 business days), expedited shipping (2 business days), and overnight shipping. Local pickup is also available at our facility.'
      },
      {
        question: 'Do you offer samples before full production?',
        answer: 'Yes, we can provide physical samples or digital proofs before proceeding with full production to ensure your satisfaction with the final product.'
      }
    ],
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'xl',
      backgroundColor: 'light',
      textColor: 'default',
      fullWidth: false
    }
  }
];

async function seedComponents(): Promise<SeedResult> {
  try {
    console.log('🌱 Seeding components data...')
    
    // Process each component individually
    const results = [];
    for (const component of componentsData) {
      const result = await sanityClient.createOrReplace(component as any);
      results.push(result);
    }
    
    console.log(`✅ ${results.length} components seeded successfully!`)
    
    return { 
      success: true, 
      message: `${results.length} components seeded successfully`, 
      data: results 
    }
  } catch (error) {
    console.error('❌ Error seeding components:', error)
    return { success: false, message: String(error) }
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  seedComponents()
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

export default seedComponents
