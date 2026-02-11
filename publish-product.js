#!/usr/bin/env node
const { createClient } = require('@sanity/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'apps/web/.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-03-15'
});

async function publishProduct(slug) {
  try {
    // Find the product
    const product = await client.fetch(
      `*[_type == 'product' && slug.current == $slug][0]`,
      { slug }
    );

    if (!product) {
      console.log(`❌ Product not found: ${slug}`);
      return;
    }

    console.log(`📦 Found: "${product.title}"`);
    console.log(`   Current status: ${product.status || 'no status'}`);

    // Update status to active
    const result = await client
      .patch(product._id)
      .set({ status: 'active' })
      .commit();

    console.log(`✅ Published successfully!`);
    console.log(`   New status: active`);
    console.log(`\n💡 Next step: Rebuild site with npm run build:netlify`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

const slug = process.argv[2];

if (!slug) {
  console.log('Usage: node publish-product.js <slug>');
  console.log('Example: node publish-product.js raised-spot-uv-business-cards');
  process.exit(1);
}

publishProduct(slug);
