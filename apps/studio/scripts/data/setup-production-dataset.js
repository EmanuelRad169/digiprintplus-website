#!/usr/bin/env node

/**
 * 🎯 SETUP PRODUCTION DATASET
 * Run this script to create and migrate data to production dataset
 */

const { createClient } = require("@sanity/client");

const args = process.argv.slice(2);
if (!args.includes("--commit") || !args.includes("--confirm-production")) {
  throw new Error(
    "Production setup requires --commit --confirm-production after a verified backup",
  );
}

const client = createClient({
  projectId: "as5tildt",
  dataset: "development", // source dataset
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const prodClient = createClient({
  projectId: "as5tildt",
  dataset: "production", // target dataset
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function setupProductionDataset() {
  try {
    console.log("🔄 Setting up production dataset...");

    // First, create the production dataset using Sanity CLI
    console.log(
      "📝 To create production dataset, run: npx sanity dataset create production",
    );

    // Export all documents from development
    console.log("📤 Fetching all documents from development dataset...");
    const query = '*[!(_type match "system.*")]'; // Exclude system documents
    const docs = await client.fetch(query);

    console.log(`✅ Found ${docs.length} documents to migrate`);

    // Import to production dataset
    if (docs.length > 0) {
      console.log("📥 Importing documents to production dataset...");
      const transaction = prodClient.transaction();

      docs.forEach((doc) => {
        // Remove system fields that shouldn't be migrated
        const cleanDoc = { ...doc };
        delete cleanDoc._rev;
        delete cleanDoc._updatedAt;
        delete cleanDoc._createdAt;

        transaction.createOrReplace(cleanDoc);
      });

      await transaction.commit();
      console.log("✅ Migration completed successfully!");
    }

    console.log(`
🎉 SETUP COMPLETE!
📊 Production dataset ready with ${docs.length} documents
🌐 Studio will automatically use production dataset in production mode
🔗 Next steps:
   1. Run 'npx sanity deploy' to deploy studio 
   2. Push code to GitHub
   3. Deploy to Netlify
`);
  } catch (error) {
    console.error("❌ Error setting up production dataset:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  setupProductionDataset();
}

module.exports = { setupProductionDataset };
