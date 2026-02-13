const { createClient } = require("@sanity/client");
require("dotenv").config({ path: "./apps/web/.env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-03-15",
});

(async () => {
  console.log("=== CHECKING SANITY PRODUCTS ===\n");

  const allQuery = `*[_type == 'product'] | order(title asc) { title, 'slug': slug.current, status }`;
  const all = await client.fetch(allQuery);
  console.log("📦 Total products:", all.length);

  const activeQuery = `*[_type == 'product' && status == 'active' && !(_id in path('drafts.**'))] | order(title asc) { title, 'slug': slug.current, status }`;
  const active = await client.fetch(activeQuery);
  console.log("✅ Active products:", active.length);

  const drafts = all.filter((p) => p.status === "draft");
  console.log("⚠️  Draft products:", drafts.length);

  if (drafts.length > 0) {
    console.log("\n--- Draft Products (not included in build) ---");
    drafts.slice(0, 10).forEach((p) => {
      console.log(`  - ${p.slug}`);
    });
    if (drafts.length > 10) {
      console.log(`  ... and ${drafts.length - 10} more`);
    }
  }

  console.log("\n💡 To publish draft products:");
  console.log("   1. Go to Sanity Studio");
  console.log("   2. Find the product");
  console.log('   3. Change status from "draft" to "active"');
  console.log('   4. Click "Publish"');
  console.log("   5. Rebuild site: npm run build:netlify\n");
})();
