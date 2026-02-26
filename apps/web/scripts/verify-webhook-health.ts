#!/usr/bin/env tsx
/**
 * Webhook Health Verification Script
 * 
 * Verifies that the Sanity webhook and revalidate endpoints are:
 * - Accessible and responding correctly
 * - Properly secured (no open access)
 * - Rejecting invalid authentication
 * - Blocking directory traversal attacks
 * 
 * Usage:
 *   tsx scripts/verify-webhook-health.ts
 *   LIVE_SITE_URL=https://custom.com tsx scripts/verify-webhook-health.ts
 */

const LIVE_SITE_URL = process.env.LIVE_SITE_URL || "https://digiprint-main-web.netlify.app";
const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET || "";

interface SecurityCheck {
  name: string;
  passed: boolean;
  message: string;
  expectedStatus: number;
  actualStatus?: number;
}

const checks: SecurityCheck[] = [];
let hasFailures = false;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function logSuccess(message: string) {
  console.log(`${colors.green}✅${colors.reset} ${message}`);
}

function logError(message: string) {
  console.log(`${colors.red}❌${colors.reset} ${message}`);
  hasFailures = true;
}

function logWarning(message: string) {
  console.log(`${colors.yellow}⚠️${colors.reset}  ${message}`);
}

function logInfo(message: string) {
  console.log(`${colors.blue}ℹ${colors.reset}  ${message}`);
}

function logHeader(message: string) {
  console.log(`\n${colors.bold}${message}${colors.reset}`);
  console.log("=".repeat(60));
}

async function testEndpoint(
  name: string,
  url: string,
  expectedStatus: number,
  description: string
): Promise<SecurityCheck> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Webhook-Health-Check/1.0',
      },
    });

    const passed = response.status === expectedStatus;
    const check: SecurityCheck = {
      name,
      passed,
      message: description,
      expectedStatus,
      actualStatus: response.status,
    };

    if (passed) {
      logSuccess(`${name}: ${description} (${response.status})`);
    } else {
      logError(`${name}: Expected ${expectedStatus}, got ${response.status}\n   URL: ${url}`);
    }

    return check;
  } catch (error) {
    const check: SecurityCheck = {
      name,
      passed: false,
      message: `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      expectedStatus,
    };
    logError(`${name}: ${check.message}`);
    return check;
  }
}

async function checkWebhookEndpoint() {
  logHeader("1️⃣  WEBHOOK FUNCTION");

  const webhookUrl = `${LIVE_SITE_URL}/.netlify/functions/sanity-webhook`;
  
  try {
    const response = await fetch(webhookUrl);
    const data = await response.json();

    if (response.status === 200 && data.message?.includes('active')) {
      logSuccess(`Webhook endpoint is active`);
      
      if (data.configured === true) {
        logSuccess(`Build hook configured: ${data.configured}`);
      } else {
        logWarning(`Build hook not configured`);
      }

      if (data.revalidateEndpoint || data.instantRevalidation) {
        logSuccess(`Instant revalidation configured`);
      } else {
        logWarning(`Instant revalidation not configured (will use full rebuild)`);
      }

      checks.push({
        name: 'Webhook Endpoint',
        passed: true,
        message: 'Webhook is active and configured',
        expectedStatus: 200,
        actualStatus: response.status,
      });
    } else {
      logError(`Webhook endpoint returned unexpected response`);
      checks.push({
        name: 'Webhook Endpoint',
        passed: false,
        message: `Unexpected response: ${JSON.stringify(data)}`,
        expectedStatus: 200,
        actualStatus: response.status,
      });
    }
  } catch (error) {
    logError(`Failed to reach webhook endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    checks.push({
      name: 'Webhook Endpoint',
      passed: false,
      message: 'Endpoint unreachable',
      expectedStatus: 200,
    });
  }
}

async function checkRevalidateSecurity() {
  logHeader("2️⃣  REVALIDATE ENDPOINT SECURITY");

  // Test 1: GET without secret (must be 401)
  const test1 = await testEndpoint(
    'No Secret',
    `${LIVE_SITE_URL}/api/revalidate?path=/products`,
    401,
    'Rejects requests without secret'
  );
  checks.push(test1);

  // Test 2: GET with wrong secret (must be 401)
  const test2 = await testEndpoint(
    'Wrong Secret',
    `${LIVE_SITE_URL}/api/revalidate?secret=wrong-secret&path=/products`,
    401,
    'Rejects requests with invalid secret'
  );
  checks.push(test2);

  // Test 3: GET with correct secret (if available)
  if (SANITY_REVALIDATE_SECRET) {
    const test3 = await testEndpoint(
      'Valid Secret',
      `${LIVE_SITE_URL}/api/revalidate?secret=${SANITY_REVALIDATE_SECRET}&path=/products`,
      200,
      'Accepts requests with valid secret'
    );
    checks.push(test3);
  } else {
    logWarning('SANITY_REVALIDATE_SECRET not set - skipping valid secret test');
    logInfo('Set SANITY_REVALIDATE_SECRET env var to test authenticated access');
  }

  // Test 4: Directory traversal attempt (must be 400)
  if (SANITY_REVALIDATE_SECRET) {
    const test4 = await testEndpoint(
      'Directory Traversal',
      `${LIVE_SITE_URL}/api/revalidate?secret=${SANITY_REVALIDATE_SECRET}&path=/../etc/passwd`,
      400,
      'Blocks directory traversal attempts'
    );
    checks.push(test4);
  } else {
    const test4 = await testEndpoint(
      'Directory Traversal (No Auth)',
      `${LIVE_SITE_URL}/api/revalidate?path=/../etc/passwd`,
      401,
      'Rejects malformed paths without auth'
    );
    checks.push(test4);
  }

  // Test 5: Double slash attempt
  if (SANITY_REVALIDATE_SECRET) {
    const test5 = await testEndpoint(
      'Double Slash',
      `${LIVE_SITE_URL}/api/revalidate?secret=${SANITY_REVALIDATE_SECRET}&path=//products`,
      400,
      'Blocks double-slash paths'
    );
    checks.push(test5);
  }

  // Test 6: Path not starting with /
  if (SANITY_REVALIDATE_SECRET) {
    const test6 = await testEndpoint(
      'Invalid Path Format',
      `${LIVE_SITE_URL}/api/revalidate?secret=${SANITY_REVALIDATE_SECRET}&path=products`,
      400,
      'Rejects paths not starting with /'
    );
    checks.push(test6);
  }
}

async function printSummary() {
  logHeader("📊 SUMMARY");

  const passed = checks.filter(c => c.passed).length;
  const failed = checks.filter(c => !c.passed).length;
  const total = checks.length;

  console.log(`Total security checks: ${total}`);
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);

  if (failed === 0) {
    console.log(`\n${colors.green}${colors.bold}🔒 ALL SECURITY CHECKS PASSED${colors.reset}`);
    console.log(`\nWebhook and revalidate endpoints are properly secured.`);
  } else {
    console.log(`\n${colors.red}${colors.bold}⚠️  SECURITY ISSUES DETECTED${colors.reset}`);
    console.log(`\nPlease review the failures above and fix before deploying to production.`);
    
    // List failed checks
    const failedChecks = checks.filter(c => !c.passed);
    if (failedChecks.length > 0) {
      console.log(`\n${colors.bold}Failed Checks:${colors.reset}`);
      failedChecks.forEach(check => {
        console.log(`  ${colors.red}→${colors.reset} ${check.name}: ${check.message}`);
      });
    }
  }

  console.log("=".repeat(60));
}

async function main() {
  console.log(`${colors.bold}🔐 Webhook Health & Security Verification${colors.reset}`);
  console.log("=".repeat(60));
  console.log(`Site URL: ${LIVE_SITE_URL}`);
  console.log(`Secret configured: ${SANITY_REVALIDATE_SECRET ? 'Yes ✅' : 'No ⚠️'}`);

  await checkWebhookEndpoint();
  await checkRevalidateSecurity();
  await printSummary();

  // Exit with error if any checks failed
  if (hasFailures || checks.some(c => !c.passed)) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`\n${colors.red}${colors.bold}💥 FATAL ERROR${colors.reset}`);
  console.error(error);
  process.exit(1);
});
