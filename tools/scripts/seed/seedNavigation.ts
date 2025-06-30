// Direct Sanity client configuration for seeding
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  token: 'sk4iHYpe9SjzzFPx6uHU4ilpBX9yJLyVMC1y6idPZ8kWrjN2bXGXjd8BAICuiLyNuI5sI6Yz2QLMu1YubsIjw0YiE0OsgEVlft9ujpgDCkbSxbF5kKdlUYXUH6xilfWnjcNPZIo5gqbIutcsN0ctk25bS5UXIFa6Z70xDqzt3DACB1VXvJkE',
  useCdn: false,
  apiVersion: '2023-05-03',
})

const navigationData = {
  _id: 'mainNav',
  _type: 'navigationMenu',
  title: 'Main Navigation',
  items: [
    {
      _key: 'home',
      _type: 'navigationItem',
      name: 'Home',
      href: '/',
      order: 1,
      isVisible: true,
      openInNewTab: false,
    },
    {
      _key: 'products',
      _type: 'navigationItem',
      name: 'Products',
      href: '/products',
      order: 2,
      isVisible: true,
      openInNewTab: false,
      megaMenu: [
        {
          _key: 'marketing-materials',
          _type: 'megaMenuSection',
          sectionTitle: 'Marketing Materials',
          sectionDescription: 'Promotional materials for your business.',
          links: [
            {
              _key: 'bcards-mega',
              _type: 'megaMenuLink',
              name: 'Business Cards',
              href: '/products/category/business-cards',
              description: 'Professional cards that make lasting impressions',
              isVisible: true,
              isHighlighted: true,
            },
            {
              _key: 'flyers-mega',
              _type: 'megaMenuLink',
              name: 'Flyers & Brochures',
              href: '/products/category/flyers',
              description: 'Eye-catching marketing materials',
              isVisible: true,
              isHighlighted: false,
            },
            {
              _key: 'stickers-mega',
              _type: 'megaMenuLink',
              name: 'Stickers',
              href: '/products/category/stickers',
              description: 'Custom stickers for branding and promotion',
              isVisible: true,
              isHighlighted: false,
            },
          ],
        },
        {
          _key: 'signage-displays',
          _type: 'megaMenuSection',
          sectionTitle: 'Signage & Displays',
          sectionDescription: 'Large format printing for events and businesses.',
          links: [
            {
              _key: 'banners-mega',
              _type: 'megaMenuLink',
              name: 'Banners',
              href: '/products/category/banners',
              description: 'Durable banners for indoor and outdoor use',
              isVisible: true,
              isHighlighted: false,
            },
            {
              _key: 'yardsigns-mega',
              _type: 'megaMenuLink',
              name: 'Yard Signs',
              href: '/products/category/signs',
              description: 'Weather-resistant signs for any occasion',
              isVisible: true,
              isHighlighted: false,
            },
          ],
        },
      ],
    },
    {
      _key: 'about',
      _type: 'navigationItem',
      name: 'About Us',
      href: '/about',
      order: 3,
      isVisible: true,
      openInNewTab: false,
    },
    {
      _key: 'contact',
      _type: 'navigationItem',
      name: 'Contact',
      href: '/contact',
      order: 4,
      isVisible: true,
      openInNewTab: false,
    },
    {
      _key: 'quote',
      _type: 'navigationItem',
      name: 'Get a Quote',
      href: '/quote',
      order: 5,
      isVisible: true,
      openInNewTab: false,
    },
  ],
}

async function seedNavigation() {
  try {
    console.log('🌱 Seeding navigation menu...')
    
    // Create or replace the mainNav document
    const result = await sanityClient.createOrReplace(navigationData)
    
    console.log('✅ Navigation menu seeded successfully!')
    console.log('📄 Document ID:', result._id)
    console.log('🔗 Items created:', result.items?.length || 0)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to seed navigation menu:', error)
    process.exit(1)
  }
}

seedNavigation()
