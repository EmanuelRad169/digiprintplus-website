import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'development',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false, // `false` if you want to ensure fresh data
});

// --- Sample Product Data ---
const sampleProducts = [
  {
    _type: 'product',
    title: 'Premium Business Cards',
    slug: { current: 'premium-business-cards' },
    description: 'High-quality, thick business cards with a matte finish.',
    basePrice: 49.99,
    status: 'published',
  },
  {
    _type: 'product',
    title: 'A5 Flyers - Glossy',
    slug: { current: 'a5-flyers-glossy' },
    description: 'Vibrant, full-color flyers perfect for promotions.',
    basePrice: 99.99,
    status: 'published',
  },
  {
    _type: 'product',
    title: 'Roll-Up Banner Stand',
    slug: { current: 'roll-up-banner-stand' },
    description: 'Durable and portable roll-up banner for events.',
    basePrice: 129.50,
    status: 'draft',
  },
];

// --- Sample Template Data ---
const sampleTemplates = [
  {
    _type: 'template',
    title: 'Modern Business Card Layout',
    slug: { current: 'modern-business-card-layout' },
    description: 'A clean and modern business card template.',
    fileType: 'AI',
    status: 'published',
    downloadCount: 0,
    rating: 0,
  },
  {
    _type: 'template',
    title: 'Corporate Flyer Design',
    slug: { current: 'corporate-flyer-design' },
    description: 'Professional flyer template for corporate announcements.',
    fileType: 'PSD',
    status: 'published',
    downloadCount: 0,
    rating: 0,
  },
];

async function seedData() {
  console.log('Starting to seed products...');
  for (const product of sampleProducts) {
    try {
      const document = {
        ...product,
        _id: `product-${product.slug.current}`.replace(/_/g, '-'),
      };
      const result = await sanityClient.createOrReplace(document);
      console.log(`Seeded: ${result.title} (_id: ${result._id})`);
    } catch (error) {
      console.error(`Error seeding ${product.title}:`, error);
    }
  }
  console.log('Product seeding complete.');

  console.log('\nStarting to seed templates...');
  for (const template of sampleTemplates) {
    try {
      const document = {
        ...template,
        _id: `template-${template.slug.current}`.replace(/_/g, '-'),
      };
      const result = await sanityClient.createOrReplace(document);
      console.log(`Seeded: ${result.title} (_id: ${result._id})`);
    } catch (error) {
      console.error(`Error seeding ${template.title}:`, error);
    }
  }
  console.log('Template seeding complete.');

  console.log('\n---\nSeeding finished!');
}

seedData();
