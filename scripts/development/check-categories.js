#!/usr/bin/env node
require('dotenv').config({ path: './apps/web/.env.local' });

const { createClient } = require('@sanity/client');

// Log environment variables for debugging
console.log('Environment check:');
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('Has Token:', !!process.env.SANITY_API_TOKEN);
console.log('');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function checkCategories() {
  console.log('🔍 Analyzing Sanity Studio structure...\n');
  
  try {
    // Get all product categories
    const categoriesQuery = `*[_type == "productCategory" && !(_id in path("drafts.**"))] | order(title asc) {
      _id,
      title,
      slug,
      description,
      featured,
      order,
      "productCount": count(*[_type == "product" && references(^._id) && status == "active"])
    }`;
    
    const categories = await client.fetch(categoriesQuery);
    
    console.log(`📂 Found ${categories.length} Product Categories:\n`);
    
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.title}`);
      console.log(`   Slug: ${category.slug?.current || 'NO SLUG'}`);
      console.log(`   Products: ${category.productCount}`);
      console.log(`   Featured: ${category.featured ? 'Yes' : 'No'}`);
      console.log(`   Order: ${category.order || 'Not set'}`);
      if (category.description) {
        console.log(`   Description: ${category.description.substring(0, 50)}...`);
      }
      console.log('');
    });

    // Get all products to understand structure
    const productsQuery = `*[_type == "product" && !(_id in path("drafts.**"))] | order(title asc) {
      _id,
      title,
      slug,
      status,
      category->{
        title,
        slug
      }
    }[0...10]`; // Limit to first 10 for analysis
    
    const products = await client.fetch(productsQuery);
    
    console.log(`📦 Sample Products (showing first 10 of many):\n`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Slug: ${product.slug?.current || 'NO SLUG'}`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Category: ${product.category?.title || 'No category'} (${product.category?.slug?.current || 'no-slug'})`);
      console.log('');
    });

    // Get all pages
    const pagesQuery = `*[_type == "page" && !(_id in path("drafts.**"))] | order(title asc) {
      _id,
      title,
      slug,
      pageType
    }`;
    
    const pages = await client.fetch(pagesQuery);
    
    console.log(`📄 Found ${pages.length} Pages:\n`);
    
    pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.title}`);
      console.log(`   Slug: ${page.slug?.current || 'NO SLUG'}`);
      console.log(`   Type: ${page.pageType || 'Standard'}`);
      console.log('');
    });

    // Return structured data for site map generation
    return {
      categories,
      products,
      pages
    };

  } catch (error) {
    console.error('❌ Error fetching Sanity data:', error);
    throw error;
  }
}

if (require.main === module) {
  checkCategories().catch(console.error);
}

module.exports = { checkCategories };
