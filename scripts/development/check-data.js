const { createClient } = require('@sanity/client');
require('dotenv').config({ path: './apps/web/.env.local' });

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function checkDataStructure() {
  try {
    console.log('🔍 Checking current data structure...');
    
    // Get document types and counts
    const docTypes = await client.fetch(`
      {
        "types": array::unique(*[]._type),
        "products": count(*[_type == "product"]),
        "categories": count(*[_type == "productCategory"]),
        "pages": count(*[_type == "page"]),
        "total": count(*[])
      }
    `);
    
    console.log('📊 Current Dataset Summary:');
    console.log(`   Total documents: ${docTypes.total}`);
    console.log(`   Products: ${docTypes.products}`);
    console.log(`   Categories: ${docTypes.categories}`);
    console.log(`   Pages: ${docTypes.pages}`);
    console.log(`   Document types: ${docTypes.types.join(', ')}`);
    
    // Check some sample products
    const sampleProducts = await client.fetch(`
      *[_type == "product"][0...3] {
        _id,
        title,
        slug,
        _createdAt,
        _updatedAt
      }
    `);
    
    console.log('\n📦 Sample Products:');
    sampleProducts.forEach(product => {
      console.log(`   - ${product.title} (${product.slug?.current || 'no-slug'})`);
      console.log(`     Created: ${new Date(product._createdAt).toLocaleDateString()}`);
    });
    
    // Check production dataset
    console.log('\n🔍 Checking production dataset...');
    const prodClient = createClient({
      projectId: 'as5tildt',
      dataset: 'production',
      useCdn: false,
      apiVersion: '2024-01-01',
    });
    
    const prodData = await prodClient.fetch(`
      {
        "products": count(*[_type == "product"]),
        "categories": count(*[_type == "productCategory"]),
        "total": count(*[])
      }
    `);
    
    console.log('📊 Production Dataset Summary:');
    console.log(`   Total documents: ${prodData.total}`);
    console.log(`   Products: ${prodData.products}`);
    console.log(`   Categories: ${prodData.categories}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDataStructure();