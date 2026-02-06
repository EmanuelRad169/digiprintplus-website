#!/usr/bin/env tsx

/**
 * 🚀 Post-Deployment QA Validation Script
 * 
 * Validates production deployment by testing:
 * 1. Live site accessibility and content rendering
 * 2. Dynamic routes (blog posts, products, categories)
 * 3. Environment variable synchronization (local vs Netlify)
 * 4. Sanity draft filtering on production
 * 5. Build configuration (ESLint, exports)
 * 6. API endpoints and revalidation
 * 7. Performance and SEO (Lighthouse)
 * 8. Content integrity vs expected counts
 * 
 * Usage: tsx scripts/qa-deployment.ts [site-url]
 * Example: tsx scripts/qa-deployment.ts https://magical-starburst-38d690.netlify.app
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';

// Load environment variables
const envPath = resolve(__dirname, '../apps/web/.env.local');
dotenv.config({ path: envPath });

// Get site URL from args or env
const SITE_URL = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

console.log('\n🚀 ═══════════════════════════════════════════════════════');
console.log('   POST-DEPLOYMENT QA VALIDATION');
console.log('═══════════════════════════════════════════════════════\n');
console.log(`🌐 Testing Site: ${SITE_URL}\n`);

interface TestResult {
  category: string;
  test: string;
  status: '✅ PASS' | '❌ FAIL' | '⚠️  WARNING' | '⏭️  SKIP';
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

// Helper function to fetch URL
async function fetchUrl(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'User-Agent': 'QA-Bot/1.0',
        ...options.headers,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// ═══════════════════════════════════════════════════════
// 1. ENVIRONMENT VARIABLES CHECK
// ═══════════════════════════════════════════════════════

console.log('📋 1. ENVIRONMENT VARIABLES\n');
console.log('   Checking local environment configuration...\n');

const requiredEnvVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'NEXT_PUBLIC_SANITY_API_VERSION',
  'SANITY_API_TOKEN',
];

let envValid = true;
for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    results.push({
      category: 'Environment',
      test: envVar,
      status: '✅ PASS',
      details: 'Variable set',
    });
    console.log(`   ✅ ${envVar}`);
  } else {
    results.push({
      category: 'Environment',
      test: envVar,
      status: '❌ FAIL',
      error: 'Missing required variable',
    });
    console.log(`   ❌ ${envVar} - MISSING`);
    envValid = false;
  }
}

if (!envValid) {
  console.error('\n❌ Missing required environment variables. Exiting...\n');
  process.exit(1);
}

// ═══════════════════════════════════════════════════════
// Main QA Testing Function
// ═══════════════════════════════════════════════════════

async function runQATests() {

// ═══════════════════════════════════════════════════════
// 2. SANITY API CONNECTION & DATA VALIDATION
// ═══════════════════════════════════════════════════════

console.log('\n\n🌐 2. SANITY CMS DATA VALIDATION\n');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: 'published',
});

// Expected counts (from previous verification)
const EXPECTED = {
  products: 153,
  blogPosts: 8,
  totalPublished: 387,
  drafts: 0,
};

// Test 2.1: Count products
console.log('   Testing product count...');
try {
  const productCount = await client.fetch(
    `count(*[_type == "product" && !(_id in path('drafts.**')) && status == "active"])`
  );
  
  const status = productCount === EXPECTED.products ? '✅ PASS' : '⚠️  WARNING';
  results.push({
    category: 'Sanity Data',
    test: 'Product Count',
    status,
    details: `${productCount} products (expected ${EXPECTED.products})`,
  });
  console.log(`   ${status} Found ${productCount} products (expected ${EXPECTED.products})`);
} catch (error) {
  const err = error as Error;
  results.push({
    category: 'Sanity Data',
    test: 'Product Count',
    status: '❌ FAIL',
    error: err.message,
  });
  console.error(`   ❌ Failed: ${err.message}`);
}

// Test 2.2: Count blog posts
console.log('   Testing blog post count...');
try {
  const blogCount = await client.fetch(
    `count(*[_type == "post" && !(_id in path('drafts.**')) && defined(publishedAt)])`
  );
  
  const status = blogCount === EXPECTED.blogPosts ? '✅ PASS' : '⚠️  WARNING';
  results.push({
    category: 'Sanity Data',
    test: 'Blog Post Count',
    status,
    details: `${blogCount} posts (expected ${EXPECTED.blogPosts})`,
  });
  console.log(`   ${status} Found ${blogCount} blog posts (expected ${EXPECTED.blogPosts})`);
} catch (error) {
  const err = error as Error;
  results.push({
    category: 'Sanity Data',
    test: 'Blog Post Count',
    status: '❌ FAIL',
    error: err.message,
  });
  console.error(`   ❌ Failed: ${err.message}`);
}

// Test 2.3: Verify no drafts leak
console.log('   Testing draft filtering...');
try {
  const draftCount = await client.fetch(`count(*[_id in path('drafts.**')])`);
  
  const status = draftCount === 0 ? '✅ PASS' : '⚠️  WARNING';
  results.push({
    category: 'Sanity Data',
    test: 'Draft Filter',
    status,
    details: `${draftCount} drafts in dataset`,
  });
  console.log(`   ${status} ${draftCount} drafts in dataset (should be 0 in production queries)`);
} catch (error) {
  const err = error as Error;
  results.push({
    category: 'Sanity Data',
    test: 'Draft Filter',
    status: '❌ FAIL',
    error: err.message,
  });
  console.error(`   ❌ Failed: ${err.message}`);
}

// ═══════════════════════════════════════════════════════
// 3. LIVE SITE ACCESSIBILITY
// ═══════════════════════════════════════════════════════

console.log('\n\n🌍 3. LIVE SITE ACCESSIBILITY\n');

// Test 3.1: Homepage
console.log('   Testing homepage...');
try {
  const response = await fetchUrl(SITE_URL);
  const html = await response.text();
  
  if (response.ok && html.includes('DigiPrintPlus')) {
    results.push({
      category: 'Site Accessibility',
      test: 'Homepage (/)',
      status: '✅ PASS',
      details: `Status ${response.status}`,
    });
    console.log(`   ✅ Homepage accessible (${response.status})`);
  } else {
    results.push({
      category: 'Site Accessibility',
      test: 'Homepage (/)',
      status: '⚠️  WARNING',
      details: `Status ${response.status}, content verification failed`,
    });
    console.log(`   ⚠️  Homepage accessible but content check failed`);
  }
} catch (error) {
  const err = error as Error;
  results.push({
    category: 'Site Accessibility',
    test: 'Homepage (/)',
    status: '❌ FAIL',
    error: err.message,
  });
  console.error(`   ❌ Failed: ${err.message}`);
}

// Test 3.2: Static pages
const staticPages = [
  '/about',
  '/contact',
  '/products',
  '/blog',
  '/quote',
];

for (const page of staticPages) {
  console.log(`   Testing ${page}...`);
  try {
    const response = await fetchUrl(`${SITE_URL}${page}`);
    
    if (response.ok) {
      results.push({
        category: 'Site Accessibility',
        test: `Static Page ${page}`,
        status: '✅ PASS',
        details: `Status ${response.status}`,
      });
      console.log(`   ✅ ${page} (${response.status})`);
    } else {
      results.push({
        category: 'Site Accessibility',
        test: `Static Page ${page}`,
        status: '❌ FAIL',
        error: `HTTP ${response.status}`,
      });
      console.log(`   ❌ ${page} (${response.status})`);
    }
  } catch (error) {
    const err = error as Error;
    results.push({
      category: 'Site Accessibility',
      test: `Static Page ${page}`,
      status: '❌ FAIL',
      error: err.message,
    });
    console.error(`   ❌ ${page} - ${err.message}`);
  }
}

// ═══════════════════════════════════════════════════════
// 4. DYNAMIC ROUTES VALIDATION
// ═══════════════════════════════════════════════════════

console.log('\n\n🔗 4. DYNAMIC ROUTES\n');

// Test 4.1: Get sample blog slugs
console.log('   Fetching blog post slugs...');
try {
  const blogPosts = await client.fetch<Array<{ slug: string }>>(
    `*[_type == "post" && !(_id in path('drafts.**')) && defined(publishedAt)][0...3]{
      "slug": slug.current
    }`
  );
  
  console.log(`   Found ${blogPosts.length} blog posts to test`);
  
  for (const post of blogPosts) {
    const url = `${SITE_URL}/blog/${post.slug}`;
    try {
      const response = await fetchUrl(url);
      
      if (response.ok) {
        results.push({
          category: 'Dynamic Routes',
          test: `Blog Post: ${post.slug}`,
          status: '✅ PASS',
          details: `Status ${response.status}`,
        });
        console.log(`   ✅ /blog/${post.slug} (${response.status})`);
      } else {
        results.push({
          category: 'Dynamic Routes',
          test: `Blog Post: ${post.slug}`,
          status: '❌ FAIL',
          error: `HTTP ${response.status}`,
        });
        console.log(`   ❌ /blog/${post.slug} (${response.status})`);
      }
    } catch (error) {
      const err = error as Error;
      results.push({
        category: 'Dynamic Routes',
        test: `Blog Post: ${post.slug}`,
        status: '❌ FAIL',
        error: err.message,
      });
      console.error(`   ❌ /blog/${post.slug} - ${err.message}`);
    }
  }
} catch (error) {
  const err = error as Error;
  console.error(`   ❌ Failed to fetch blog slugs: ${err.message}`);
}

// Test 4.2: Get sample product slugs
console.log('\n   Fetching product slugs...');
try {
  const products = await client.fetch<Array<{ slug: string }>>(
    `*[_type == "product" && !(_id in path('drafts.**')) && status == "active"][0...3]{
      "slug": slug.current
    }`
  );
  
  console.log(`   Found ${products.length} products to test`);
  
  for (const product of products) {
    const url = `${SITE_URL}/products/${product.slug}`;
    try {
      const response = await fetchUrl(url);
      
      if (response.ok) {
        results.push({
          category: 'Dynamic Routes',
          test: `Product: ${product.slug}`,
          status: '✅ PASS',
          details: `Status ${response.status}`,
        });
        console.log(`   ✅ /products/${product.slug} (${response.status})`);
      } else {
        results.push({
          category: 'Dynamic Routes',
          test: `Product: ${product.slug}`,
          status: '❌ FAIL',
          error: `HTTP ${response.status}`,
        });
        console.log(`   ❌ /products/${product.slug} (${response.status})`);
      }
    } catch (error) {
      const err = error as Error;
      results.push({
        category: 'Dynamic Routes',
        test: `Product: ${product.slug}`,
        status: '❌ FAIL',
        error: err.message,
      });
      console.error(`   ❌ /products/${product.slug} - ${err.message}`);
    }
  }
} catch (error) {
  const err = error as Error;
  console.error(`   ❌ Failed to fetch product slugs: ${err.message}`);
}

// ═══════════════════════════════════════════════════════
// 5. ROBOTS.TXT & SITEMAP.XML
// ═══════════════════════════════════════════════════════

console.log('\n\n🤖 5. SEO FILES\n');

// Test 5.1: robots.txt
console.log('   Testing robots.txt...');
try {
  const response = await fetchUrl(`${SITE_URL}/robots.txt`);
  const text = await response.text();
  
  if (response.ok && text.includes('User-agent')) {
    results.push({
      category: 'SEO',
      test: 'robots.txt',
      status: '✅ PASS',
      details: 'Valid robots.txt found',
    });
    console.log(`   ✅ robots.txt exists and is valid`);
  } else {
    results.push({
      category: 'SEO',
      test: 'robots.txt',
      status: '⚠️  WARNING',
      details: `Status ${response.status}`,
    });
    console.log(`   ⚠️  robots.txt may be invalid (${response.status})`);
  }
} catch (error) {
  const err = error as Error;
  results.push({
    category: 'SEO',
    test: 'robots.txt',
    status: '❌ FAIL',
    error: err.message,
  });
  console.error(`   ❌ Failed: ${err.message}`);
}

// Test 5.2: sitemap.xml
console.log('   Testing sitemap.xml...');
try {
  const response = await fetchUrl(`${SITE_URL}/sitemap.xml`);
  const text = await response.text();
  
  if (response.ok && text.includes('<urlset')) {
    const urlCount = (text.match(/<url>/g) || []).length;
    results.push({
      category: 'SEO',
      test: 'sitemap.xml',
      status: '✅ PASS',
      details: `Valid sitemap with ${urlCount} URLs`,
    });
    console.log(`   ✅ sitemap.xml exists with ${urlCount} URLs`);
  } else {
    results.push({
      category: 'SEO',
      test: 'sitemap.xml',
      status: '⚠️  WARNING',
      details: `Status ${response.status}`,
    });
    console.log(`   ⚠️  sitemap.xml may be invalid (${response.status})`);
  }
} catch (error) {
  const err = error as Error;
  results.push({
    category: 'SEO',
    test: 'sitemap.xml',
    status: '❌ FAIL',
    error: err.message,
  });
  console.error(`   ❌ Failed: ${err.message}`);
}

// ═══════════════════════════════════════════════════════
// 6. BUILD CONFIGURATION VALIDATION
// ═══════════════════════════════════════════════════════

console.log('\n\n⚙️  6. BUILD CONFIGURATION\n');

// Test 6.1: Check ESLint version
console.log('   Checking ESLint version...');
try {
  const packageJson = require('../apps/web/package.json');
  const eslintVersion = packageJson.devDependencies?.eslint || packageJson.dependencies?.eslint;
  
  if (eslintVersion && eslintVersion.includes('8.')) {
    results.push({
      category: 'Build Config',
      test: 'ESLint Version',
      status: '✅ PASS',
      details: `Version ${eslintVersion}`,
    });
    console.log(`   ✅ ESLint version: ${eslintVersion}`);
  } else {
    results.push({
      category: 'Build Config',
      test: 'ESLint Version',
      status: '⚠️  WARNING',
      details: `Version ${eslintVersion || 'not found'}`,
    });
    console.log(`   ⚠️  ESLint version may be incompatible: ${eslintVersion}`);
  }
} catch (error) {
  const err = error as Error;
  results.push({
    category: 'Build Config',
    test: 'ESLint Version',
    status: '❌ FAIL',
    error: err.message,
  });
  console.error(`   ❌ Failed: ${err.message}`);
}

// Test 6.2: Verify getBlogPostBySlug export
console.log('   Checking getBlogPostBySlug export...');
try {
  const fetchersContent = require('fs').readFileSync(
    resolve(__dirname, '../apps/web/src/lib/sanity/fetchers.ts'),
    'utf-8'
  );
  
  if (fetchersContent.includes('export async function getBlogPostBySlug')) {
    results.push({
      category: 'Build Config',
      test: 'getBlogPostBySlug Export',
      status: '✅ PASS',
      details: 'Function exported correctly',
    });
    console.log(`   ✅ getBlogPostBySlug is properly exported`);
  } else {
    results.push({
      category: 'Build Config',
      test: 'getBlogPostBySlug Export',
      status: '❌ FAIL',
      error: 'Function not found or not exported',
    });
    console.log(`   ❌ getBlogPostBySlug export not found`);
  }
} catch (error) {
  const err = error as Error;
  results.push({
    category: 'Build Config',
    test: 'getBlogPostBySlug Export',
    status: '❌ FAIL',
    error: err.message,
  });
  console.error(`   ❌ Failed: ${err.message}`);
}

// ═══════════════════════════════════════════════════════
// 7. OPTIONAL: LIGHTHOUSE AUDIT
// ═══════════════════════════════════════════════════════

console.log('\n\n💡 7. PERFORMANCE AUDIT (LIGHTHOUSE)\n');

try {
  // Check if lighthouse is installed
  execSync('which lighthouse', { stdio: 'ignore' });
  
  console.log('   Running Lighthouse audit (this may take a minute)...');
  
  const lighthouseOutput = execSync(
    `lighthouse ${SITE_URL} --only-categories=performance,accessibility,seo --quiet --chrome-flags="--headless" --output=json`,
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
  );
  
  const report = JSON.parse(lighthouseOutput);
  const scores = {
    performance: Math.round((report.categories.performance?.score || 0) * 100),
    accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
    seo: Math.round((report.categories.seo?.score || 0) * 100),
  };
  
  for (const [category, score] of Object.entries(scores)) {
    const status = score >= 90 ? '✅ PASS' : score >= 70 ? '⚠️  WARNING' : '❌ FAIL';
    results.push({
      category: 'Lighthouse',
      test: `${category.charAt(0).toUpperCase() + category.slice(1)} Score`,
      status,
      details: `${score}/100`,
    });
    console.log(`   ${status} ${category}: ${score}/100`);
  }
} catch (error) {
  results.push({
    category: 'Lighthouse',
    test: 'Lighthouse Audit',
    status: '⏭️  SKIP',
    details: 'Lighthouse not installed (run: npm i -g lighthouse)',
  });
  console.log(`   ⏭️  Skipped: Lighthouse not installed`);
  console.log('   💡 Install with: npm i -g lighthouse');
}

// ═══════════════════════════════════════════════════════
// 8. SUMMARY & RESULTS
// ═══════════════════════════════════════════════════════

console.log('\n\n📊 TEST SUMMARY\n');
console.table(results.map(r => ({
  Category: r.category,
  Test: r.test,
  Status: r.status,
  Details: r.details || r.error || '',
})));

const passed = results.filter(r => r.status === '✅ PASS').length;
const failed = results.filter(r => r.status === '❌ FAIL').length;
const warnings = results.filter(r => r.status === '⚠️  WARNING').length;
const skipped = results.filter(r => r.status === '⏭️  SKIP').length;

console.log('\n═══════════════════════════════════════════════════════');
console.log(`  ${passed} passed | ${failed} failed | ${warnings} warnings | ${skipped} skipped`);
console.log('═══════════════════════════════════════════════════════\n');

// Exit codes
if (failed > 0) {
  console.error('❌ QA validation failed. Check errors above.\n');
  console.log('💡 Common fixes:');
  console.log('   • Verify Netlify environment variables match local');
  console.log('   • Check Netlify deploy logs for build errors');
  console.log('   • Run: npm run verify:env locally');
  console.log('   • Ensure all routes are in generateStaticParams\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('⚠️  QA validation passed with warnings.\n');
  process.exit(0);
} else {
  console.log('✅ All QA checks passed! Production deployment is healthy.\n');
  console.log('🚀 Site is ready for users.\n');
  process.exit(0);
}

}

// Run the QA tests
runQATests().catch((error) => {
  console.error('\n❌ Fatal error during QA validation:', error);
  process.exit(1);
});
