#!/usr/bin/env node

/**
 * Test script for Sanity webhook → Netlify revalidation flow
 *
 * Usage:
 *   node test-revalidation.js <document-type> [slug]
 *
 * Examples:
 *   node test-revalidation.js post "my-blog-post"
 *   node test-revalidation.js product "business-cards"
 *   node test-revalidation.js siteSettings
 */

const https = require("https");
const crypto = require("crypto");

// Configuration
const SITE_URL =
  process.env.SITE_URL || "https://digiprint-main-web.netlify.app";
const WEBHOOK_SECRET =
  process.env.SANITY_REVALIDATE_SECRET || "so26GsMt0Fr9|1puбeUQ";

// Get command line arguments
const [, , documentType, slug] = process.argv;

if (!documentType) {
  console.error("❌ Error: Document type is required");
  console.log("\nUsage: node test-revalidation.js <document-type> [slug]");
  console.log("\nExamples:");
  console.log('  node test-revalidation.js post "my-blog-post"');
  console.log('  node test-revalidation.js product "business-cards"');
  console.log("  node test-revalidation.js siteSettings");
  process.exit(1);
}

// Create webhook payload (simulating Sanity webhook)
const payload = {
  _type: documentType,
  _id: `test-${Date.now()}`,
  ...(slug && { slug: { current: slug } }),
};

const body = JSON.stringify(payload);

// Create HMAC signature (same as Sanity does)
const signature = crypto
  .createHmac("sha256", WEBHOOK_SECRET)
  .update(body)
  .digest("hex");

// Parse URL
const url = new URL(`${SITE_URL}/api/revalidate`);

console.log("\n🧪 Testing Revalidation Webhook");
console.log("================================");
console.log(`Site URL: ${SITE_URL}`);
console.log(`Document Type: ${documentType}`);
if (slug) console.log(`Slug: ${slug}`);
console.log("");

// Make POST request
const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    "x-sanity-signature": `sha256=${signature}`,
  },
};

const req = https.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("📡 Response:");
    console.log(`Status: ${res.statusCode}`);
    console.log("");

    try {
      const json = JSON.parse(data);
      console.log("✅ Result:", JSON.stringify(json, null, 2));

      if (json.success) {
        console.log("\n✅ Revalidation successful!");
        console.log(`   Paths revalidated: ${json.revalidated.join(", ")}`);
        console.log("\n💡 Your changes should now be live within seconds.");
      } else {
        console.log("\n❌ Revalidation failed:", json.message);
        process.exit(1);
      }
    } catch (e) {
      console.log("❌ Invalid JSON response:", data);
      process.exit(1);
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Request failed:", error.message);
  process.exit(1);
});

req.write(body);
req.end();
