// scripts/migrateFeatures.ts
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.development' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // You need a token with write permissions
  apiVersion: '2023-05-03',
});

async function migrateFeatures() {
  console.log('Starting feature migration...');
  
  try {
    // Fetch all products
    const products = await client.fetch(`*[_type == "product" && defined(features)]`);
    console.log(`Found ${products.length} products with features`);
    
    // Process each product
    for (const product of products) {
      let needsUpdate = false;
      const updatedFeatures = product.features.map((feature: any) => {
        // Check if the feature is a string
        if (typeof feature === 'string') {
          needsUpdate = true;
          // Convert to object format
          return {
            _type: 'object',
            feature: feature,
            highlight: false
          };
        }
        return feature;
      });
      
      // Only update if changes were made
      if (needsUpdate) {
        console.log(`Updating features for product: ${product.title}`);
        await client
          .patch(product._id)
          .set({ features: updatedFeatures })
          .commit();
        console.log(`✅ Updated product: ${product.title}`);
      } else {
        console.log(`No changes needed for product: ${product.title}`);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateFeatures();
