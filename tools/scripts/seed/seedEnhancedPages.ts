// Enhanced content seeding for About and Contact pages
import { sanityClient } from '/Applications/MAMP/htdocs/FredCMs/apps/web/lib/sanity'

async function seedEnhancedPages() {
  console.log('📄 Seeding enhanced page content...\n')

  try {
    // Enhanced About page content
    const aboutPageContent = {
      _id: 'aboutPage',
      _type: 'page',
      title: 'About DigiPrintPlus',
      slug: { _type: 'slug', current: 'about' },
      content: [
        {
          _type: 'block',
          _key: 'hero-text',
          children: [
            {
              _type: 'span',
              text: 'Your Trusted Partner in Professional Printing'
            }
          ],
          markDefs: [],
          style: 'h1'
        },
        {
          _type: 'block',
          _key: 'intro-text',
          children: [
            {
              _type: 'span',
              text: 'With over 15 years of experience in the printing industry, DigiPrintPlus has been serving businesses with high-quality printing solutions. We combine cutting-edge technology with traditional craftsmanship to deliver exceptional results every time.'
            }
          ],
          markDefs: [],
          style: 'normal'
        },
        {
          _type: 'block',
          _key: 'mission-heading',
          children: [
            {
              _type: 'span',
              text: 'Our Mission'
            }
          ],
          markDefs: [],
          style: 'h2'
        },
        {
          _type: 'block',
          _key: 'mission-text',
          children: [
            {
              _type: 'span',
              text: 'To provide businesses with premium printing services that help them communicate effectively and stand out in their market. We believe that quality printing is an investment in your brand\'s success.'
            }
          ],
          markDefs: [],
          style: 'normal'
        },
        {
          _type: 'block',
          _key: 'experience-heading',
          children: [
            {
              _type: 'span',
              text: 'Experience & Expertise'
            }
          ],
          markDefs: [],
          style: 'h2'
        },
        {
          _type: 'block',
          _key: 'experience-text',
          children: [
            {
              _type: 'span',
              text: 'Our team of printing professionals brings decades of combined experience to every project. From business cards to large-format banners, we understand the unique requirements of each printing job and deliver results that exceed expectations.'
            }
          ],
          markDefs: [],
          style: 'normal'
        }
      ],
      seo: {
        metaTitle: 'About DigiPrintPlus - Professional Printing Services Since 2009',
        metaDescription: 'Learn about DigiPrintPlus, your trusted partner in professional printing with over 15 years of experience serving businesses with high-quality printing solutions.'
      }
    }

    // Enhanced Contact page content
    const contactPageContent = {
      _id: 'contactPage',
      _type: 'page',
      title: 'Contact DigiPrintPlus',
      slug: { _type: 'slug', current: 'contact' },
      content: [
        {
          _type: 'block',
          _key: 'contact-hero',
          children: [
            {
              _type: 'span',
              text: 'Let\'s Start Your Project'
            }
          ],
          markDefs: [],
          style: 'h1'
        },
        {
          _type: 'block',
          _key: 'contact-intro',
          children: [
            {
              _type: 'span',
              text: 'Ready to bring your printing project to life? Our experienced team is here to help you every step of the way. From initial concept to final delivery, we\'re committed to making your project a success.'
            }
          ],
          markDefs: [],
          style: 'normal'
        },
        {
          _type: 'block',
          _key: 'response-time',
          children: [
            {
              _type: 'span',
              text: 'We typically respond to all inquiries within 2 business hours during normal business hours. For urgent requests, please call us directly.'
            }
          ],
          markDefs: [],
          style: 'normal'
        }
      ],
      seo: {
        metaTitle: 'Contact DigiPrintPlus - Get Your Quote Today',
        metaDescription: 'Contact DigiPrintPlus for quotes, questions, or to discuss your printing needs. Fast response times and expert guidance for all your printing projects.'
      }
    }

    // Update the pages
    console.log('✏️  Updating About page content...')
    await sanityClient.createOrReplace(aboutPageContent)
    console.log('✅ About page updated successfully')

    console.log('✏️  Updating Contact page content...')
    await sanityClient.createOrReplace(contactPageContent)
    console.log('✅ Contact page updated successfully')

    console.log('\n🎉 Enhanced page content seeding completed!')
    console.log('\n📋 Updated pages:')
    console.log('  ✅ About page with mission and expertise sections')
    console.log('  ✅ Contact page with project focus and response times')
    console.log('  ✅ Enhanced SEO metadata for both pages')

  } catch (error) {
    console.error('❌ Error seeding enhanced pages:', error)
    process.exit(1)
  }
}

seedEnhancedPages()
