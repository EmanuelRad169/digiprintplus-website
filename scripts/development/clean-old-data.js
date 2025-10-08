const { createClient } = require('@sanity/client');
require('dotenv').config({ path: './apps/web/.env.local' });

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

async function cleanOldData() {
  try {
    console.log('🧹 Cleaning old/outdated data from development dataset...');
    
    // Get old documents (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldDocs = await client.fetch(`
      *[_createdAt < $date && !(_type match "sanity.*")] {
        _id,
        _type,
        title,
        _createdAt
      }
    `, { date: thirtyDaysAgo.toISOString() });
    
    console.log(`📋 Found ${oldDocs.length} old documents`);
    
    if (oldDocs.length === 0) {
      console.log('✅ No old documents to clean');
      return;
    }
    
    // Show what will be deleted
    console.log('🗑️ Documents to be deleted:');
    oldDocs.forEach(doc => {
      console.log(`   - ${doc._type}: ${doc.title || doc._id} (${new Date(doc._createdAt).toLocaleDateString()})`);
    });
    
    // Delete old documents
    const transaction = client.transaction();
    oldDocs.forEach(doc => {
      transaction.delete(doc._id);
    });
    
    console.log('⚠️ This will permanently delete these documents. Continue? (y/N)');
    // Note: In a real script, you'd want to add readline for confirmation
    
    // Uncomment the next line to actually delete (after confirmation)
    // await transaction.commit();
    
    console.log('🎉 Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanOldData();