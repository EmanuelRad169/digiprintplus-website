#!/usr/bin/env tsx
/**
 * Sanity Fetchers Export Verification
 *
 * Ensures all critical fetcher functions are properly exported
 * and can be imported by pages. This prevents build-time failures.
 *
 * Usage: tsx scripts/verify-exports.ts
 */

import {
  colors,
  logSuccess,
  logError,
  logHeader,
} from "./utils/verification-utils";

let hasErrors = false;

async function verifyFetchersExports() {
  logHeader("🔍 VERIFYING SANITY FETCHERS EXPORTS");

  try {
    // Dynamically import the fetchers module
    const fetchers = await import("../src/lib/sanity/fetchers");

    const requiredExports = [
      "getAllProducts",
      "getProductBySlug",
      "getProductsByCategory",
      "getAllBlogPosts",
      "getBlogPostBySlug",
      "getAllServices",
      "getServiceBySlug",
      "getPageBySlug",
      "getTemplates",
      "getSiteSettings",
      "getNavigationMenu",
      "getFooterSettings",
    ];

    console.log(`\nChecking ${requiredExports.length} required exports...\n`);

    for (const exportName of requiredExports) {
      if (typeof fetchers[exportName] === "function") {
        logSuccess(`${exportName} ✓`);
      } else {
        logError(`${exportName} ✗ (NOT FOUND OR NOT A FUNCTION)`);
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      console.log(
        `\n${colors.green}${colors.bold}✅ ALL EXPORTS VERIFIED${colors.reset}\n`,
      );
    }
  } catch (error) {
    logError(
      `Failed to import fetchers module: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    hasErrors = true;
  }
}

async function main() {
  console.log(`${colors.bold}🔧 Export Verification${colors.reset}`);
  console.log("=".repeat(60));

  await verifyFetchersExports();

  if (hasErrors) {
    console.log(
      `\n${colors.red}${colors.bold}❌ EXPORT VERIFICATION FAILED${colors.reset}`,
    );
    console.log(`\nSome required exports are missing or incorrectly defined.`);
    console.log(`Check apps/web/src/lib/sanity/fetchers.ts\n`);
    process.exit(1);
  }

  console.log("=".repeat(60));
}

main().catch((error) => {
  console.error(`\n${colors.red}${colors.bold}💥 FATAL ERROR${colors.reset}`);
  console.error(error);
  process.exit(1);
});
