#!/usr/bin/env tsx
/**
 * Netlify Build-Time Environment Variable Verification
 * 
 * Validates all required environment variables are present before building.
 * Fails the build with clear error messages if anything is missing.
 * 
 * Usage: Add to package.json scripts:
 *   "prebuild": "tsx scripts/verify-netlify-env.ts"
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  defaultValue?: string;
  validateFormat?: (value: string) => boolean;
}

const REQUIRED_ENV_VARS: EnvVar[] = [
  {
    name: "NEXT_PUBLIC_SANITY_PROJECT_ID",
    required: true,
    description: "Sanity project ID (e.g., 'as5tildt')",
    validateFormat: (v) => /^[a-z0-9]{8}$/.test(v),
  },
  {
    name: "NEXT_PUBLIC_SANITY_DATASET",
    required: true,
    description: "Sanity dataset name (should be 'production')",
    defaultValue: "production",
    validateFormat: (v) => v === "production" || v === "development",
  },
  {
    name: "NEXT_PUBLIC_SANITY_API_VERSION",
    required: true,
    description: "Sanity API version (format: YYYY-MM-DD)",
    defaultValue: "2024-01-01",
    validateFormat: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
  },
  {
    name: "NEXT_PUBLIC_SANITY_STUDIO_URL",
    required: true,
    description: "Sanity Studio URL (Netlify Studio subdomain)",
    defaultValue: "https://digiprint-admin-cms.netlify.app",
    validateFormat: (v) => v.startsWith("http"),
  },
  {
    name: "SANITY_API_TOKEN",
    required: true,
    description: "Sanity read token for fetching content at build time",
  },
  {
    name: "SANITY_WEBHOOK_SECRET",
    required: true,
    description: "Secret for validating Sanity webhook signatures",
  },
  {
    name: "NETLIFY_BUILD_HOOK_URL",
    required: true,
    description: "Netlify build hook URL for triggering rebuilds from Sanity",
    validateFormat: (v) => v.includes("netlify.com/build_hooks/"),
  },
  {
    name: "NEXT_PUBLIC_SITE_URL",
    required: true,
    description: "Production site URL (Netlify subdomain)",
    defaultValue: "https://digiprint-main-web.netlify.app",
    validateFormat: (v) => v.startsWith("http"),
  },
];

const OPTIONAL_ENV_VARS: EnvVar[] = [
  {
    name: "SANITY_REVALIDATE_SECRET",
    required: false,
    description: "Secret for on-demand ISR revalidation endpoint",
  },
  {
    name: "NEXT_PUBLIC_GA4_ID",
    required: false,
    description: "Google Analytics 4 tracking ID",
  },
  {
    name: "NEXT_PUBLIC_GTM_ID",
    required: false,
    description: "Google Tag Manager ID",
  },
];

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  info: Record<string, string>;
}

function validateEnvironment(): ValidationResult {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: [],
    info: {},
  };

  console.log("\n🔍 Validating Netlify Environment Variables...\n");
  console.log("=" .repeat(60));

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar.name];

    if (!value) {
      if (envVar.defaultValue) {
        result.warnings.push(
          `⚠️  ${envVar.name} not set, using default: ${envVar.defaultValue}`
        );
        result.info[envVar.name] = envVar.defaultValue;
      } else {
        result.errors.push(
          `❌ MISSING: ${envVar.name}\n   Description: ${envVar.description}\n   Set in: Netlify Dashboard → Site Settings → Environment Variables`
        );
        result.success = false;
      }
    } else {
      // Validate format if validator provided
      if (envVar.validateFormat && !envVar.validateFormat(value)) {
        result.errors.push(
          `❌ INVALID FORMAT: ${envVar.name}\n   Current value: ${value}\n   Expected: ${envVar.description}`
        );
        result.success = false;
      } else {
        // Mask sensitive values in output
        const displayValue = envVar.name.includes("SECRET") || envVar.name.includes("TOKEN")
          ? `${value.substring(0, 8)}...`
          : value;
        
        result.info[envVar.name] = displayValue;
        console.log(`✅ ${envVar.name}: ${displayValue}`);
      }
    }
  }

  console.log("\n" + "─".repeat(60));
  console.log("Optional Variables:");
  console.log("─".repeat(60));

  // Check optional variables
  for (const envVar of OPTIONAL_ENV_VARS) {
    const value = process.env[envVar.name];
    if (value) {
      const displayValue = envVar.name.includes("SECRET")
        ? `${value.substring(0, 8)}...`
        : value;
      console.log(`✓  ${envVar.name}: ${displayValue}`);
      result.info[envVar.name] = displayValue;
    } else {
      console.log(`○  ${envVar.name}: Not set (${envVar.description})`);
    }
  }

  console.log("=" .repeat(60));

  // Validate Sanity configuration consistency
  const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

  if (sanityProjectId && sanityProjectId !== "as5tildt") {
    result.warnings.push(
      `⚠️  SANITY_PROJECT_ID mismatch: env has '${sanityProjectId}' but code expects 'as5tildt'`
    );
  }

  if (sanityDataset && sanityDataset !== "production") {
    result.warnings.push(
      `⚠️  Using NON-PRODUCTION dataset: '${sanityDataset}' - ensure this is intentional!`
    );
  }

  // Validate URLs point to Netlify subdomains (not custom domains)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;

  // CRITICAL: In production Netlify builds, NEXT_PUBLIC_SITE_URL MUST be set
  // This prevents SEO issues from inconsistent fallback URLs
  if (process.env.NETLIFY === "true" && !siteUrl) {
    result.errors.push(
      `❌ CRITICAL: NEXT_PUBLIC_SITE_URL must be set in production Netlify builds\n   Required for: SEO metadata, Open Graph tags, sitemap.xml, robots.txt\n   Set to: https://digiprint-main-web.netlify.app\n   Location: Netlify Dashboard → Site Settings → Environment Variables`
    );
    result.success = false;
  } else if (siteUrl && !siteUrl.includes(".netlify.app")) {
    result.warnings.push(
      `⚠️  NEXT_PUBLIC_SITE_URL is not a Netlify subdomain: ${siteUrl}\n   Expected format: https://[site-name].netlify.app`
    );
  }

  if (studioUrl && !studioUrl.includes(".netlify.app") && !studioUrl.includes("sanity.studio")) {
    result.warnings.push(
      `⚠️  SANITY_STUDIO_URL should be Netlify subdomain: ${studioUrl}`
    );
  }

  return result;
}

function printResults(result: ValidationResult): void {
  console.log("\n");
  console.log("📊 VALIDATION SUMMARY");
  console.log("=" .repeat(60));

  if (result.warnings.length > 0) {
    console.log("\n⚠️  WARNINGS:\n");
    result.warnings.forEach((warning) => console.log(warning));
  }

  if (result.errors.length > 0) {
    console.log("\n❌ ERRORS:\n");
    result.errors.forEach((error) => console.log(error));
    console.log("\n");
    console.log("🚨 BUILD CANNOT CONTINUE");
    console.log("=" .repeat(60));
    console.log("\nTo fix:");
    console.log("1. Go to: https://app.netlify.com/sites/[your-site]/settings/deploys#environment");
    console.log("2. Add the missing environment variables");
    console.log("3. Trigger a new deployment\n");
  } else if (result.warnings.length > 0) {
    console.log("\n✅ BUILD CAN CONTINUE (but review warnings)\n");
  } else {
    console.log("\n✅ ALL ENVIRONMENT VARIABLES VALID!\n");
  }

  console.log("=" .repeat(60));
}

// Main execution
function main(): void {
  try {
    const result = validateEnvironment();
    printResults(result);

    // Exit with error if validation failed
    if (!result.success) {
      process.exit(1);
    }

    // Write validation info to file for debugging
    if (process.env.NETLIFY) {
      const fs = require("fs");
      const path = require("path");
      const outputPath = path.join(process.cwd(), ".netlify-env-validation.json");
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      console.log(`\n📝 Validation results saved to: ${outputPath}\n`);
    }
  } catch (error) {
    console.error("\n💥 Validation script error:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { validateEnvironment, ValidationResult };
