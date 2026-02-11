#!/usr/bin/env tsx
/**
 * 🔧 DIGIPRINT AUTO-FIX SCRIPT
 *
 * This script automatically fixes common deployment issues:
 * - Updates hardcoded URLs to use environment variables
 * - Ensures proper static export configuration
 * - Validates and fixes SEO files
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
const envPath = path.join(process.cwd(), "apps/web/.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

interface Fix {
  name: string;
  status: "applied" | "skipped" | "failed";
  message: string;
}

const fixes: Fix[] = [];

function logFix(fix: Fix) {
  fixes.push(fix);
  const icon =
    fix.status === "applied" ? "✅" : fix.status === "skipped" ? "⏭️" : "❌";
  console.log(`${icon} ${fix.name}: ${fix.message}`);
}

// ============================================================================
// FIX 1: Update robots.ts to use environment variable
// ============================================================================
function fix1_updateRobotsTs() {
  console.log("\n🔧 FIX 1: Update robots.ts to use environment variable\n");

  const robotsPath = path.join(process.cwd(), "apps/web/src/app/robots.ts");

  if (!fs.existsSync(robotsPath)) {
    logFix({
      name: "Update robots.ts",
      status: "skipped",
      message: "File not found",
    });
    return;
  }

  const content = fs.readFileSync(robotsPath, "utf-8");

  if (content.includes("marvelous-treacle-ca0286.netlify.app")) {
    const newContent = `// Force static generation for static export
export const dynamic = 'force-static'
export const revalidate = false

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://digiprintplus.com'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/studio/'],
      },
    ],
    sitemap: \`\${siteUrl}/sitemap.xml\`,
  }
}
`;

    fs.writeFileSync(robotsPath, newContent, "utf-8");

    logFix({
      name: "Update robots.ts",
      status: "applied",
      message: "Replaced hardcoded URL with environment variable",
    });
  } else {
    logFix({
      name: "Update robots.ts",
      status: "skipped",
      message: "Already uses environment variable or correct URL",
    });
  }
}

// ============================================================================
// FIX 2: Update sitemap.ts to use environment variable
// ============================================================================
function fix2_updateSitemapTs() {
  console.log("\n🔧 FIX 2: Update sitemap.ts to use environment variable\n");

  const sitemapPath = path.join(process.cwd(), "apps/web/src/app/sitemap.ts");

  if (!fs.existsSync(sitemapPath)) {
    logFix({
      name: "Update sitemap.ts",
      status: "skipped",
      message: "File not found",
    });
    return;
  }

  const content = fs.readFileSync(sitemapPath, "utf-8");

  if (
    content.includes(
      "const baseUrl = 'https://marvelous-treacle-ca0286.netlify.app'",
    )
  ) {
    const updatedContent = content.replace(
      /const baseUrl = ['"]https:\/\/[^'"]+['"]/,
      "const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://digiprintplus.com'",
    );

    fs.writeFileSync(sitemapPath, updatedContent, "utf-8");

    logFix({
      name: "Update sitemap.ts",
      status: "applied",
      message: "Replaced hardcoded URL with environment variable",
    });
  } else {
    logFix({
      name: "Update sitemap.ts",
      status: "skipped",
      message: "Already uses environment variable or correct URL",
    });
  }
}

// ============================================================================
// FIX 3: Verify .env.local has correct site URL
// ============================================================================
function fix3_validateEnvLocal() {
  console.log("\n🔧 FIX 3: Validate .env.local configuration\n");

  const envPath = path.join(process.cwd(), "apps/web/.env.local");

  if (!fs.existsSync(envPath)) {
    logFix({
      name: "Validate .env.local",
      status: "failed",
      message: ".env.local file not found",
    });
    return;
  }

  const content = fs.readFileSync(envPath, "utf-8");
  const lines = content.split("\n");

  const requiredVars = [
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "NEXT_PUBLIC_SANITY_DATASET",
    "NEXT_PUBLIC_SANITY_API_VERSION",
    "SANITY_API_TOKEN",
    "NEXT_PUBLIC_SITE_URL",
  ];

  const missingVars = requiredVars.filter((varName) => {
    return !lines.some((line) => line.trim().startsWith(`${varName}=`));
  });

  if (missingVars.length > 0) {
    logFix({
      name: "Validate .env.local",
      status: "failed",
      message: `Missing variables: ${missingVars.join(", ")}`,
    });
  } else {
    logFix({
      name: "Validate .env.local",
      status: "applied",
      message: "All required environment variables present",
    });
  }

  // Check if NEXT_PUBLIC_SITE_URL is set correctly
  const siteUrlLine = lines.find((line) =>
    line.trim().startsWith("NEXT_PUBLIC_SITE_URL="),
  );
  if (siteUrlLine) {
    const url = siteUrlLine.split("=")[1]?.trim();
    if (url && url.includes("localhost")) {
      logFix({
        name: "NEXT_PUBLIC_SITE_URL",
        status: "skipped",
        message: `Currently set to ${url}. Update to production URL before deploying.`,
      });
    } else {
      logFix({
        name: "NEXT_PUBLIC_SITE_URL",
        status: "applied",
        message: `Set to ${url}`,
      });
    }
  }
}

// ============================================================================
// FIX 4: Create Netlify environment variables template
// ============================================================================
function fix4_createNetlifyEnvTemplate() {
  console.log("\n🔧 FIX 4: Create Netlify environment variables template\n");

  const templatePath = path.join(process.cwd(), "NETLIFY_ENV_VARS.txt");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.netlify.app";

  const template = `# Netlify Environment Variables
# Copy these to your Netlify dashboard:
# Settings → Environment variables → Add a variable

## Required for digiprint-main-web (Frontend)

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id"}
NEXT_PUBLIC_SANITY_DATASET=${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
NEXT_PUBLIC_SANITY_API_VERSION=${process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"}
SANITY_API_TOKEN=${process.env.SANITY_API_TOKEN ? "***get-from-sanity-dashboard***" : "your-token-here"}

# Site Configuration
NEXT_PUBLIC_SITE_URL=${siteUrl}

# Optional: Sanity Preview
SANITY_REVALIDATE_SECRET=${process.env.SANITY_REVALIDATE_SECRET || "your-secret-here"}

# Optional: Analytics
NEXT_PUBLIC_GA4_ID=${process.env.NEXT_PUBLIC_GA4_ID || ""}
NEXT_PUBLIC_GTM_ID=${process.env.NEXT_PUBLIC_GTM_ID || ""}

## Build Settings
# Build command: npm run build:netlify
# Publish directory: out
# Node version: 18 or higher

## Important Notes:
# 1. Get SANITY_API_TOKEN from Sanity dashboard (needs read permissions)
# 2. Update NEXT_PUBLIC_SITE_URL to your actual Netlify URL
# 3. Ensure NEXT_PUBLIC_SANITY_DATASET is set to "production"
# 4. After setting variables, trigger a new deploy
`;

  fs.writeFileSync(templatePath, template, "utf-8");

  logFix({
    name: "Create Netlify template",
    status: "applied",
    message: "Created NETLIFY_ENV_VARS.txt with your current config",
  });
}

// ============================================================================
// FIX 5: Validate Next.js config for static export
// ============================================================================
function fix5_validateNextConfig() {
  console.log("\n🔧 FIX 5: Validate Next.js config for Netlify\n");

  const configPath = path.join(process.cwd(), "apps/web/next.config.js");

  if (!fs.existsSync(configPath)) {
    logFix({
      name: "Validate next.config.js",
      status: "failed",
      message: "next.config.js not found",
    });
    return;
  }

  const content = fs.readFileSync(configPath, "utf-8");

  const checks = [
    {
      pattern: /output:\s*process\.env\.NETLIFY\s*\?\s*['"]export['"]/,
      name: "Static export for Netlify",
      pass: "Configured for static export on Netlify",
      fail: "Not configured for static export",
    },
    {
      pattern: /images:\s*{[^}]*unoptimized:\s*true/,
      name: "Image optimization",
      pass: "Images set to unoptimized (required for static export)",
      fail: "Images may need unoptimized: true for static export",
    },
  ];

  checks.forEach((check) => {
    if (check.pattern.test(content)) {
      logFix({
        name: check.name,
        status: "applied",
        message: check.pass,
      });
    } else {
      logFix({
        name: check.name,
        status: "skipped",
        message: check.fail,
      });
    }
  });
}

// ============================================================================
// FIX 6: Create deployment checklist
// ============================================================================
function fix6_createDeploymentChecklist() {
  console.log("\n🔧 FIX 6: Create deployment checklist\n");

  const checklistPath = path.join(process.cwd(), "DEPLOYMENT_CHECKLIST.md");

  const checklist = `# 🚀 Deployment Checklist for DigiPrint+

## Pre-Deployment

- [ ] Run audit script: \`npm run audit:deploy\`
- [ ] Fix all critical issues from audit
- [ ] Update \`.env.local\` with production values
- [ ] Test build locally: \`cd apps/web && npm run build\`
- [ ] Verify static export: \`npx serve@latest out\`

## Netlify Configuration

### Environment Variables (Settings → Environment variables)

Copy from \`NETLIFY_ENV_VARS.txt\`:

- [ ] NEXT_PUBLIC_SANITY_PROJECT_ID
- [ ] NEXT_PUBLIC_SANITY_DATASET
- [ ] NEXT_PUBLIC_SANITY_API_VERSION
- [ ] SANITY_API_TOKEN
- [ ] NEXT_PUBLIC_SITE_URL

### Build Settings (Site configuration → Build & deploy)

- [ ] Build command: \`npm run build:netlify\`
- [ ] Publish directory: \`out\`
- [ ] Node version: \`18\` or higher

## Sanity Studio

- [ ] Verify dataset is "production"
- [ ] Check all content is published (not drafts)
- [ ] Verify products have slugs
- [ ] Verify blog posts have slugs
- [ ] Test Sanity API token has read permissions

## Post-Deployment Verification

- [ ] Visit homepage: \`/\`
- [ ] Test static pages: \`/about\`, \`/services\`, \`/contact\`
- [ ] Test dynamic routes: \`/products/[slug]\`, \`/blog/[slug]\`
- [ ] Check SEO files: \`/robots.txt\`, \`/sitemap.xml\`
- [ ] Verify content loads from Sanity
- [ ] Test forms (if applicable)

## Troubleshooting

### If routes return 404:

1. Check Netlify deploy logs for missing pages
2. Verify \`generateStaticParams()\` exists in dynamic routes
3. Ensure content has valid slugs in Sanity
4. Clear Netlify cache and redeploy

### If Sanity content doesn't appear:

1. Verify environment variables in Netlify
2. Check API token permissions
3. Ensure dataset is "production"
4. Verify content is published (not drafts)

### If SEO files don't work:

1. Verify \`robots.ts\` and \`sitemap.ts\` have \`dynamic = 'force-static'\`
2. Check build output includes these files
3. Verify they're accessible at \`/robots.txt\` and \`/sitemap.xml\`

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Sanity API Tokens](https://www.sanity.io/docs/http-auth)
`;

  fs.writeFileSync(checklistPath, checklist, "utf-8");

  logFix({
    name: "Create deployment checklist",
    status: "applied",
    message: "Created DEPLOYMENT_CHECKLIST.md",
  });
}

// ============================================================================
// Main Execution
// ============================================================================
function main() {
  console.log("🔧 DigiPrint+ Auto-Fix Script");
  console.log("=".repeat(60));
  console.log("Applying fixes to common deployment issues...\n");

  try {
    fix1_updateRobotsTs();
    fix2_updateSitemapTs();
    fix3_validateEnvLocal();
    fix4_createNetlifyEnvTemplate();
    fix5_validateNextConfig();
    fix6_createDeploymentChecklist();

    console.log("\n📊 FIX SUMMARY\n");
    console.log("=".repeat(60));

    const applied = fixes.filter((f) => f.status === "applied").length;
    const skipped = fixes.filter((f) => f.status === "skipped").length;
    const failed = fixes.filter((f) => f.status === "failed").length;

    console.log(`Total Fixes: ${fixes.length}`);
    console.log(`✅ Applied: ${applied}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log("=".repeat(60));

    if (failed > 0) {
      console.log("\n❌ Some fixes failed. Please review and fix manually.");
      process.exit(1);
    } else {
      console.log("\n✅ All fixes applied successfully!");
      console.log("\n📝 Next Steps:");
      console.log("   1. Review NETLIFY_ENV_VARS.txt");
      console.log("   2. Follow DEPLOYMENT_CHECKLIST.md");
      console.log("   3. Run: npm run audit:deploy");
      console.log("   4. Deploy to Netlify");
      process.exit(0);
    }
  } catch (error) {
    console.error("\n❌ Auto-fix failed with error:", error);
    process.exit(1);
  }
}

main();
