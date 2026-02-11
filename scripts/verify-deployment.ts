#!/usr/bin/env tsx
/**
 * 🔍 POST-DEPLOYMENT VERIFICATION SCRIPT
 *
 * Tests all critical routes after deployment to ensure everything is working
 */

interface TestResult {
  url: string;
  status: "pass" | "fail";
  statusCode?: number;
  error?: string;
}

const results: TestResult[] = [];

async function testUrl(url: string): Promise<TestResult> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "DigiPrint-Deployment-Verification/1.0",
      },
    });

    return {
      url,
      status: response.ok ? "pass" : "fail",
      statusCode: response.status,
    };
  } catch (error) {
    return {
      url,
      status: "fail",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const baseUrl =
    process.argv[2] ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://digiprint-main-web.netlify.app";

  console.log("🔍 DigiPrint+ Post-Deployment Verification");
  console.log("=".repeat(60));
  console.log(`Testing site: ${baseUrl}\n`);

  // Static pages
  const staticPages = [
    "/",
    "/about",
    "/services",
    "/products",
    "/contact",
    "/templates",
  ];

  console.log("📄 Testing Static Pages...\n");
  for (const path of staticPages) {
    const result = await testUrl(`${baseUrl}${path}`);
    results.push(result);

    const icon = result.status === "pass" ? "✅" : "❌";
    const status = result.statusCode ? `[${result.statusCode}]` : "";
    console.log(`${icon} ${path} ${status}`);

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  // SEO files
  console.log("\n🔍 Testing SEO Files...\n");
  const seoFiles = ["/robots.txt", "/sitemap.xml"];

  for (const path of seoFiles) {
    const result = await testUrl(`${baseUrl}${path}`);
    results.push(result);

    const icon = result.status === "pass" ? "✅" : "❌";
    const status = result.statusCode ? `[${result.statusCode}]` : "";
    console.log(`${icon} ${path} ${status}`);

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  // Sample dynamic routes (if you want to test specific products)
  console.log("\n🔗 Testing Dynamic Routes...\n");
  const dynamicRoutes = [
    "/products/business-cards-premium",
    "/products/raised-spot-uv-business-cards",
  ];

  for (const path of dynamicRoutes) {
    const result = await testUrl(`${baseUrl}${path}`);
    results.push(result);

    const icon = result.status === "pass" ? "✅" : "❌";
    const status = result.statusCode ? `[${result.statusCode}]` : "";
    console.log(`${icon} ${path} ${status}`);

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  // Summary
  console.log("\n📊 VERIFICATION SUMMARY");
  console.log("=".repeat(60));

  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log("=".repeat(60));

  if (failed > 0) {
    console.log("\n❌ Some tests failed. Check deployment logs.");
    process.exit(1);
  } else {
    console.log("\n✅ All tests passed! Deployment verified.");
    process.exit(0);
  }
}

main();
