const { createClient } = require("@sanity/client");
require("dotenv").config({ path: "./apps/web/.env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
});

console.log("Testing navigation queries...");
console.log("ENV vars loaded:", {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  hasToken: !!process.env.SANITY_API_TOKEN,
});

async function testQueries() {
  try {
    console.log("\n1. Testing exact fetcher query (published only):");
    const publishedQuery = `*[_type == "navigationMenu" && !(_id in path("drafts.**"))][0]`;
    const publishedResult = await client.fetch(publishedQuery);
    console.log("Published result:", publishedResult ? "FOUND" : "NOT FOUND");
    if (publishedResult) {
      console.log("   ID:", publishedResult._id);
      console.log("   Items:", publishedResult.items?.length);
    }

    console.log("\n2. Testing simple query:");
    const simpleQuery = `*[_type == "navigationMenu"][0]`;
    const simpleResult = await client.fetch(simpleQuery);
    console.log("Simple result:", simpleResult ? "FOUND" : "NOT FOUND");
    if (simpleResult) {
      console.log("   ID:", simpleResult._id);
      console.log("   Items:", simpleResult.items?.length);
    }

    console.log("\n3. Testing by specific ID:");
    const idQuery = `*[_id == "mainNav"][0]`;
    const idResult = await client.fetch(idQuery);
    console.log("ID result:", idResult ? "FOUND" : "NOT FOUND");
    if (idResult) {
      console.log("   ID:", idResult._id);
      console.log("   Items:", idResult.items?.length);
    }
  } catch (error) {
    console.error("Query error:", error);
  }
}

testQueries();
