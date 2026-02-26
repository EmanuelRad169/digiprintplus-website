#!/usr/bin/env tsx
/**
 * Live Deployment Verification Script
 *
 * Verifies that the deployed Netlify site is correctly configured:
 * - Static routes are accessible
 * - SEO files (robots.txt, sitemap.xml) are correct
 * - Dynamic content from Sanity is accessible
 * - URLs are consistent across all endpoints
 *
 * Usage:
 *   tsx scripts/verify-live-deploy.ts
 *   LIVE_SITE_URL=https://custom.com tsx scripts/verify-live-deploy.ts
 */

import {
  colors,
  logSuccess,
  logError,
  logWarning,
  logInfo,
  logHeader,
} from "./utils/verification-utils";

const LIVE_SITE_URL =
  process.env.LIVE_SITE_URL || "https://digiprint-main-web.netlify.app";
const ADMIN_URL =
  process.env.ADMIN_URL || "https://digiprint-admin-cms.netlify.app";

interface CheckResult {
  passed: boolean;
  message: string;
  url?: string;
  status?: number;
}

const results: CheckResult[] = [];
let hasErrors = false;

// Wrapper to track errors locally
function logErrorWithTracking(message: string) {
  logError(message);
  hasErrors = true;
}

async function checkUrl(
  url: string,
  expectedStatus = 200,
): Promise<CheckResult> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Deploy-Verification-Bot/1.0",
      },
    });

    const passed = response.status === expectedStatus;
    return {
      passed,
      message: passed
        ? `${url} returned ${response.status}`
        : `Expected ${expectedStatus}, got ${response.status}`,
      url,
      status: response.status,
    };
  } catch (error) {
    return {
      passed: false,
      message: `Failed to fetch ${url}: ${error instanceof Error ? error.message : "Unknown error"}`,
      url,
    };
  }
}

async function checkStaticRoutes() {
  logHeader("1️⃣  STATIC ROUTES");

  const routes = [
    "/",
    "/about",
    "/contact",
    "/products",
    "/blog",
    "/templates",
    "/quote",
  ];

  for (const route of routes) {
    const url = `${LIVE_SITE_URL}${route}`;
    const result = await checkUrl(url);
    results.push(result);

    if (result.passed) {
      logSuccess(`${route} → ${result.status}`);
    } else {
      logErrorWithTracking(`${route} → ${result.message}`);
    }
  }
}

async function checkSEOFiles() {
  logHeader("2️⃣  SEO FILES");

  // Check robots.txt
  const robotsUrl = `${LIVE_SITE_URL}/robots.txt`;
  const robotsResult = await checkUrl(robotsUrl);
  results.push(robotsResult);

  if (robotsResult.passed) {
    logSuccess(`robots.txt exists`);

    // Parse and verify sitemap URL
    try {
      const response = await fetch(robotsUrl);
      const robotsContent = await response.text();

      const sitemapMatch = robotsContent.match(/Sitemap:\s*(.+)/i);
      if (sitemapMatch) {
        const sitemapUrl = sitemapMatch[1].trim();
        const expectedSitemapUrl = `${LIVE_SITE_URL}/sitemap.xml`;

        if (sitemapUrl === expectedSitemapUrl) {
          logSuccess(`robots.txt Sitemap URL matches: ${sitemapUrl}`);
          results.push({ passed: true, message: "Sitemap URL matches" });
        } else {
          logErrorWithTracking(
            `robots.txt Sitemap URL mismatch!\n   Expected: ${expectedSitemapUrl}\n   Found: ${sitemapUrl}`,
          );
          results.push({
            passed: false,
            message: "Sitemap URL mismatch",
            url: sitemapUrl,
          });
        }
      } else {
        logWarning("robots.txt does not contain Sitemap directive");
        results.push({ passed: false, message: "Missing Sitemap directive" });
      }
    } catch (error) {
      logErrorWithTracking(
        `Failed to parse robots.txt: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  } else {
    logErrorWithTracking(`robots.txt not accessible: ${robotsResult.message}`);
  }

  // Check sitemap.xml
  const sitemapUrl = `${LIVE_SITE_URL}/sitemap.xml`;
  const sitemapResult = await checkUrl(sitemapUrl);
  results.push(sitemapResult);

  if (sitemapResult.passed) {
    logSuccess(`sitemap.xml exists`);

    // Parse and verify URLs
    try {
      const response = await fetch(sitemapUrl);
      const sitemapContent = await response.text();

      // Extract all <loc> URLs
      const urlMatches = sitemapContent.matchAll(/<loc>(.+?)<\/loc>/g);
      const urls = Array.from(urlMatches).map((match) => match[1]);

      if (urls.length === 0) {
        logWarning("sitemap.xml contains no URLs");
        results.push({ passed: false, message: "Empty sitemap" });
      } else {
        // Check if all URLs start with LIVE_SITE_URL
        const invalidUrls = urls.filter(
          (url) => !url.startsWith(LIVE_SITE_URL),
        );

        if (invalidUrls.length === 0) {
          logSuccess(`sitemap.xml: All ${urls.length} URLs use correct domain`);
          results.push({
            passed: true,
            message: `${urls.length} URLs verified`,
          });
        } else {
          logErrorWithTracking(
            `sitemap.xml contains ${invalidUrls.length} URLs with wrong domain:`,
          );
          invalidUrls.slice(0, 3).forEach((url) => {
            console.log(`   ${colors.red}→${colors.reset} ${url}`);
          });
          if (invalidUrls.length > 3) {
            console.log(`   ... and ${invalidUrls.length - 3} more`);
          }
          results.push({
            passed: false,
            message: `${invalidUrls.length} URLs with wrong domain`,
          });
        }
      }
    } catch (error) {
      logErrorWithTracking(
        `Failed to parse sitemap.xml: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  } else {
    logErrorWithTracking(
      `sitemap.xml not accessible: ${sitemapResult.message}`,
    );
  }
}

async function checkDynamicContent() {
  logHeader("3️⃣  DYNAMIC CONTENT (SANITY)");

  try {
    // Import Sanity client and fetchers
    const { getSanityClient } = await import("../src/lib/sanity");

    const client = getSanityClient();

    // Fetch 3 products
    logInfo("Fetching products from Sanity...");
    const productsQuery = `*[_type == "product" && defined(slug.current)] | order(_createdAt desc) [0...3] {
      _id,
      title,
      "slug": slug.current
    }`;
    const products = await client.fetch(productsQuery);

    if (products.length === 0) {
      logWarning("No products found in Sanity");
    } else {
      logInfo(`Found ${products.length} products, verifying pages...`);
      for (const product of products) {
        const url = `${LIVE_SITE_URL}/products/${product.slug}`;
        const result = await checkUrl(url);
        results.push(result);

        if (result.passed) {
          logSuccess(`Product: ${product.title} → ${result.status}`);
        } else {
          logErrorWithTracking(`Product: ${product.title} → ${result.message}`);
        }
      }
    }

    // Fetch 3 blog posts
    logInfo("Fetching blog posts from Sanity...");
    const postsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...3] {
      _id,
      title,
      "slug": slug.current
    }`;
    const posts = await client.fetch(postsQuery);

    if (posts.length === 0) {
      logWarning("No blog posts found in Sanity");
    } else {
      logInfo(`Found ${posts.length} blog posts, verifying pages...`);
      for (const post of posts) {
        const url = `${LIVE_SITE_URL}/blog/${post.slug}`;
        const result = await checkUrl(url);
        results.push(result);

        if (result.passed) {
          logSuccess(`Blog: ${post.title} → ${result.status}`);
        } else {
          logErrorWithTracking(`Blog: ${post.title} → ${result.message}`);
        }
      }
    }
  } catch (error) {
    logErrorWithTracking(
      `Failed to fetch Sanity content: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    results.push({ passed: false, message: "Sanity fetch failed" });
  }
}

async function printSummary() {
  logHeader("📊 SUMMARY");

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`Total checks: ${total}`);
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);

  if (failed === 0) {
    console.log(
      `\n${colors.green}${colors.bold}🎉 ALL CHECKS PASSED${colors.reset}`,
    );
    console.log(`\nDeployment verified successfully!`);
    console.log(`Site: ${LIVE_SITE_URL}`);
    console.log(`Admin: ${ADMIN_URL}`);
  } else {
    console.log(
      `\n${colors.red}${colors.bold}❌ DEPLOYMENT VERIFICATION FAILED${colors.reset}`,
    );
    console.log(`\nPlease review the errors above and fix before proceeding.`);
  }

  console.log("=".repeat(60));
}

async function main() {
  console.log(`${colors.bold}🚀 Live Deployment Verification${colors.reset}`);
  console.log("=".repeat(60));
  console.log(`Site URL: ${LIVE_SITE_URL}`);
  console.log(`Admin URL: ${ADMIN_URL}`);

  await checkStaticRoutes();
  await checkSEOFiles();
  await checkDynamicContent();
  await printSummary();

  // Exit with error code if any checks failed
  if (hasErrors || results.some((r) => !r.passed)) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`\n${colors.red}${colors.bold}💥 FATAL ERROR${colors.reset}`);
  console.error(error);
  process.exit(1);
});
