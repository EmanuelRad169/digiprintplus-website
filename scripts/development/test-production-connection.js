#!/usr/bin/env node
/**
 * Production Connection Test
 * Test connection to Sanity production dataset
 */

require('dotenv').config({ path: '../web/.env.production' });

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

async function testProductionConnection() {
  console.log('🏭 Testing Production Connection\n');
  
  console.log('📋 Configuration:');
  console.log(`  Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
  console.log(`  API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION}`);
  console.log(`  Studio URL: ${process.env.NEXT_PUBLIC_SANITY_STUDIO_URL}`);
  console.log(`  Has Token: ${!!process.env.SANITY_API_TOKEN}`);
  console.log('');

  try {
    // Test basic connection
    console.log('🔌 Testing connection...');
    await client.fetch('*[_type == "sanity.imageAsset"][0]');
    console.log('✅ Connection successful\n');

    // Get production data summary
    const queries = {
      categories: '*[_type == "productCategory" && !(_id in path("drafts.**"))]',
      products: '*[_type == "product" && !(_id in path("drafts.**"))]',
      pages: '*[_type == "page" && !(_id in path("drafts.**"))]',
      templates: '*[_type == "template" && !(_id in path("drafts.**"))]',
      navigation: '*[_type == "navigationMenu"]'
    };

    console.log('📊 Production Dataset Summary:');
    for (const [type, query] of Object.entries(queries)) {
      try {
        const results = await client.fetch(query);
        console.log(`  📦 ${type}: ${results.length} documents`);
      } catch (error) {
        console.log(`  ❌ ${type}: Error - ${error.message}`);
      }
    }

    // Test specific queries
    console.log('\n🎯 Testing Key Queries:');
    
    // Test categories
    const categories = await client.fetch(`
      *[_type == "productCategory" && !(_id in path("drafts.**"))] | order(order asc, title asc) {
        title,
        slug,
        "productCount": count(*[_type == "product" && references(^._id)])
      }[0...5]
    `);
    
    console.log(`  ✅ Categories: Found ${categories.length}`);
    categories.forEach((cat, i) => {
      console.log(`    ${i + 1}. ${cat.title} (${cat.slug?.current}) - ${cat.productCount} products`);
    });

    // Test navigation
    const navigation = await client.fetch(`
      *[_type == "navigationMenu" && _id == "mainNav"][0] {
        title,
        items[] {
          name,
          href
        }
      }
    `);
    
    if (navigation) {
      console.log(`\n  ✅ Navigation: ${navigation.title}`);
      navigation.items?.forEach((item, i) => {
        console.log(`    ${i + 1}. ${item.name} → ${item.href}`);
      });
    } else {
      console.log('\n  ⚠️  Navigation: No main navigation found');
    }

    console.log('\n🎉 Production connection test completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Production connection test failed:', error.message);
    
    if (error.statusCode === 401) {
      console.error('\n🔐 Authentication Issue:');
      console.error('  Check your SANITY_API_TOKEN in .env.production');
      console.error('  Ensure token has read permissions for production dataset');
    }
    
    return false;
  }
}

if (require.main === module) {
  testProductionConnection().catch(console.error);
}

module.exports = { testProductionConnection };