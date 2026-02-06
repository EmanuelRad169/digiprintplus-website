#!/usr/bin/env tsx

/**
 * 🔍 Sanity Environment Variable Validator
 * 
 * Validates that environment variables are correctly configured for:
 * 1. Local development (.env.local)
 * 2. Sanity Studio connection
 * 3. Production deployment (Netlify)
 * 4. Live GROQ query test
 * 
 * Usage: tsx scripts/verify-sanity-env.ts
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from apps/web/.env.local
const envPath = resolve(__dirname, '../apps/web/.env.local');
dotenv.config({ path: envPath });

console.log('\n🔍 ═══════════════════════════════════════════════════════');
console.log('   SANITY CMS ENVIRONMENT VALIDATION');
console.log('═══════════════════════════════════════════════════════\n');

// 1. Display all relevant environment variables
console.log('📋 Environment Variables:\n');
const envVars = {
  'Project ID': process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ MISSING',
  'Dataset': process.env.NEXT_PUBLIC_SANITY_DATASET || '❌ MISSING',
  'API Version': process.env.NEXT_PUBLIC_SANITY_API_VERSION || '❌ MISSING',
  'API Token': process.env.SANITY_API_TOKEN ? '✅ SET (hidden)' : '❌ MISSING',
  'Studio URL': process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '❌ MISSING',
  'Site URL': process.env.NEXT_PUBLIC_SITE_URL || '❌ MISSING',
  'Revalidate Secret': process.env.SANITY_REVALIDATE_SECRET ? '✅ SET (hidden)' : '⚠️  OPTIONAL',
  'Webhook Secret': process.env.SANITY_WEBHOOK_SECRET ? '✅ SET (hidden)' : '⚠️  OPTIONAL',
  'Node Environment': process.env.NODE_ENV || 'development',
  'Netlify Build': process.env.NETLIFY ? '✅ YES' : 'No',
};

console.table(envVars);

// 2. Validate required variables
console.log('\n🔐 Validation Status:\n');
const required = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'NEXT_PUBLIC_SANITY_API_VERSION',
  'SANITY_API_TOKEN',
];

let hasErrors = false;
for (const key of required) {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ MISSING: ${key}`);
    hasErrors = true;
  } else {
    console.log(`✅ VALID: ${key}`);
  }
}

if (hasErrors) {
  console.error('\n❌ Validation failed! Missing required environment variables.');
  console.log('\n💡 Fix by adding missing variables to apps/web/.env.local');
  process.exit(1);
}

// 3. Test Sanity API connection
console.log('\n🌐 Testing Sanity API Connection...\n');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: 'published',
});

// Main validation function
async function validateEnvironment() {
  interface TestResults {
    test: string;
    status: string;
    result?: string;
    error?: string;
  }

  const tests: TestResults[] = [];

  // Test 1: Fetch site settings
  console.log('📝 Test 1: Fetching site settings...');
  try {
    const siteSettings = await client.fetch(`*[_type == "siteSettings" && !(_id in path('drafts.**'))][0]{
    title,
    description,
    _id
  }`);
  
    if (siteSettings) {
      tests.push({
        test: 'Fetch Site Settings',
        status: '✅ PASS',
        result: siteSettings.title || 'Site settings found',
      });
      console.log(`   ✅ Success: ${siteSettings.title}`);
    } else {
      tests.push({
        test: 'Fetch Site Settings',
        status: '⚠️  WARNING',
        result: 'No site settings document found',
      });
      console.log('   ⚠️  No site settings found (create one in Sanity Studio)');
    }
  } catch (error) {
    const err = error as Error;
    tests.push({
      test: 'Fetch Site Settings',
      status: '❌ FAIL',
      error: err.message,
    });
    console.error(`   ❌ Failed: ${err.message}`);
  }

  // Test 2: Count products (with draft filter)
  console.log('\n📦 Test 2: Counting products...');
  try {
    const productCount = await client.fetch(`count(*[_type == "product" && !(_id in path('drafts.**')) && status == "active"])`);
    tests.push({
      test: 'Count Products',
      status: '✅ PASS',
      result: `${productCount} active products`,
    });
    console.log(`   ✅ Found ${productCount} active products`);
  } catch (error) {
    const err = error as Error;
    tests.push({
      test: 'Count Products',
      status: '❌ FAIL',
      error: err.message,
    });
    console.error(`   ❌ Failed: ${err.message}`);
  }

  // Test 3: Count blog posts (with draft filter)
  console.log('\n📰 Test 3: Counting blog posts...');
  try {
    const blogCount = await client.fetch(`count(*[_type == "post" && !(_id in path('drafts.**')) && defined(publishedAt)])`);
    tests.push({
      test: 'Count Blog Posts',
      status: '✅ PASS',
      result: `${blogCount} published posts`,
    });
    console.log(`   ✅ Found ${blogCount} published blog posts`);
  } catch (error) {
    const err = error as Error;
    tests.push({
      test: 'Count Blog Posts',
      status: '❌ FAIL',
      error: err.message,
    });
    console.error(`   ❌ Failed: ${err.message}`);
  }

  // Test 4: Verify draft filtering works
  console.log('\n🔒 Test 4: Testing draft filter...');
  try {
    const draftCount = await client.fetch(`count(*[_id in path('drafts.**')])`);
    const publishedCount = await client.fetch(`count(*[!(_id in path('drafts.**'))])`);
    tests.push({
      test: 'Draft Filter Test',
      status: '✅ PASS',
      result: `${draftCount} drafts excluded, ${publishedCount} published docs`,
    });
    console.log(`   ✅ Draft filtering working: ${draftCount} drafts, ${publishedCount} published`);
  } catch (error) {
    const err = error as Error;
    tests.push({
      test: 'Draft Filter Test',
      status: '❌ FAIL',
      error: err.message,
    });
    console.error(`   ❌ Failed: ${err.message}`);
  }

  // Test 5: Check API token permissions (try to fetch a document)
  console.log('\n🔑 Test 5: Verifying API token permissions...');
  try {
    const testQuery = await client.fetch(`*[_type in ["product", "post", "template"]][0]{_type, _id}`);
    if (testQuery) {
      tests.push({
        test: 'API Token Permissions',
        status: '✅ PASS',
        result: 'Read access confirmed',
      });
      console.log('   ✅ API token has read access');
    } else {
      tests.push({
        test: 'API Token Permissions',
        status: '⚠️  WARNING',
        result: 'No content found to test permissions',
      });
      console.log('   ⚠️  No content available to verify permissions');
    }
  } catch (error) {
    const err = error as Error;
    tests.push({
      test: 'API Token Permissions',
      status: '❌ FAIL',
      error: err.message,
    });
    console.error(`   ❌ Token permission error: ${err.message}`);
  }

  // Display summary
  console.log('\n\n📊 Test Summary:\n');
  console.table(tests);

  const passed = tests.filter(t => t.status.includes('PASS')).length;
  const failed = tests.filter(t => t.status.includes('FAIL')).length;
  const warnings = tests.filter(t => t.status.includes('WARNING')).length;

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed | ${failed} failed | ${warnings} warnings`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (failed > 0) {
    console.error('❌ Some tests failed. Check the errors above and fix configuration.\n');
    console.log('💡 Common fixes:');
    console.log('   • Run: cd apps/studio && npx sanity login');
    console.log('   • Check: apps/web/.env.local has all required variables');
    console.log('   • Verify: Sanity project ID and dataset are correct');
    console.log('   • Ensure: API token has read permissions\n');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('⚠️  All critical tests passed, but some warnings exist.\n');
    process.exit(0);
  } else {
    console.log('✅ All tests passed! Environment is correctly configured.\n');
    console.log('🚀 Ready for deployment to Netlify.\n');
    process.exit(0);
  }
}

// Run the validation
validateEnvironment().catch((error) => {
  console.error('\n❌ Fatal error during validation:', error);
  process.exit(1);
});
