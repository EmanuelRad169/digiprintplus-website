#!/usr/bin/env node
/**
 * Build Toolchain Verification Script
 * 
 * Validates that the build environment matches expected versions
 * before starting the build. This prevents wasted build time and
 * provides clear error messages.
 * 
 * Usage: node scripts/verify-build-toolchain.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅${colors.reset} ${message}`);
}

function logError(message) {
  console.log(`${colors.red}❌${colors.reset} ${message}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️${colors.reset}  ${message}`);
}

function logHeader(message) {
  console.log(`\n${colors.bold}${message}${colors.reset}`);
  console.log("=".repeat(60));
}

let hasErrors = false;

// Get current versions
function getNodeVersion() {
  return process.version.replace('v', '');
}

function getPnpmVersion() {
  try {
    return execSync('pnpm -v', { encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

function getPackageVersion(packageName, cwd = process.cwd()) {
  try {
    const packageJsonPath = path.join(cwd, 'node_modules', packageName, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return packageJson.version;
    }
    return null;
  } catch (error) {
    return null;
  }
}

function verifyNodeVersion() {
  logHeader("1️⃣  NODE VERSION");
  
  const currentVersion = getNodeVersion();
  const majorVersion = parseInt(currentVersion.split('.')[0], 10);
  const expectedMajor = 20;

  if (majorVersion === expectedMajor) {
    logSuccess(`Node.js ${currentVersion} (matches required ${expectedMajor}.x)`);
  } else {
    logError(`Node.js ${currentVersion} does NOT match required ${expectedMajor}.x`);
    logError(`Please use Node.js ${expectedMajor}.x (via nvm: "nvm use 20" or "nvm install 20")`);
    hasErrors = true;
  }
}

function verifyPnpmVersion() {
  logHeader("2️⃣  PNPM VERSION");
  
  const currentVersion = getPnpmVersion();
  const expectedMajor = 9;

  if (!currentVersion) {
    logError('pnpm is not installed!');
    logError('Install pnpm: npm install -g pnpm@9');
    hasErrors = true;
    return;
  }

  const majorVersion = parseInt(currentVersion.split('.')[0], 10);

  if (majorVersion === expectedMajor) {
    logSuccess(`pnpm ${currentVersion} (matches required ${expectedMajor}.x)`);
  } else {
    logWarning(`pnpm ${currentVersion} (expected ${expectedMajor}.x) - may work but not guaranteed`);
  }
}

function verifyNextVersion() {
  logHeader("3️⃣  NEXT.JS VERSION");
  
  const currentVersion = getPackageVersion('next');
  const expectedVersion = '15.5.12';

  if (!currentVersion) {
    logError('Next.js is not installed! Run: pnpm install');
    hasErrors = true;
    return;
  }

  if (currentVersion === expectedVersion || currentVersion.startsWith('15.5.')) {
    logSuccess(`Next.js ${currentVersion} (matches expected ${expectedVersion})`);
  } else {
    logError(`Next.js ${currentVersion} does NOT match expected ${expectedVersion}`);
    logError('Run: pnpm install --frozen-lockfile');
    hasErrors = true;
  }
}

function verifyEslintVersion() {
  logHeader("4️⃣  ESLINT VERSION");
  
  const eslintVersion = getPackageVersion('eslint');
  const eslintConfigNextVersion = getPackageVersion('eslint-config-next');
  const nextVersion = getPackageVersion('next');

  if (!eslintVersion) {
    logWarning('ESLint not installed (lint may be disabled in production builds)');
    return;
  }

  const eslintMajor = parseInt(eslintVersion.split('.')[0], 10);
  
  if (eslintMajor === 8) {
    logSuccess(`ESLint ${eslintVersion} (required 8.x for Next.js 15)`);
  } else {
    logError(`ESLint ${eslintVersion} (expected 8.x) - Next.js 15 requires ESLint 8!`);
    hasErrors = true;
  }

  if (eslintConfigNextVersion && nextVersion) {
    // eslint-config-next version should match Next.js major.minor
    const nextMajorMinor = nextVersion.split('.').slice(0, 2).join('.');
    const configMajorMinor = eslintConfigNextVersion.split('.').slice(0, 2).join('.');

    if (nextMajorMinor === configMajorMinor) {
      logSuccess(`eslint-config-next ${eslintConfigNextVersion} matches Next.js ${nextVersion}`);
    } else {
      logError(`eslint-config-next ${eslintConfigNextVersion} does NOT match Next.js ${nextVersion}`);
      logError(`Expected eslint-config-next ${nextMajorMinor}.x`);
      logError('This will cause "Cannot find module babel/eslint-parser" errors!');
      hasErrors = true;
    }
  }
}

function verifyWorkspaceConsistency() {
  logHeader("5️⃣  WORKSPACE CONSISTENCY");
  
  try {
    const path = require('path');
    // Determine if we're in apps/web or root
    const cwd = process.cwd();
    const isInAppsWeb = cwd.endsWith('apps/web') || cwd.includes('/apps/web');
    const rootDir = isInAppsWeb ? path.join(cwd, '../..') : cwd;
    const webDir = isInAppsWeb ? cwd : path.join(cwd, 'apps/web');
    
    const rootPackageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    const webPackageJson = JSON.parse(fs.readFileSync(path.join(webDir, 'package.json'), 'utf8'));

    // Check Next.js version consistency
    const rootNextVersion = rootPackageJson.devDependencies?.next || rootPackageJson.dependencies?.next;
    const webNextVersion = webPackageJson.devDependencies?.next || webPackageJson.dependencies?.next;

    if (rootNextVersion && webNextVersion) {
      // Normalize versions (remove ^ and ~)
      const normalizeVersion = (v) => v.replace(/^[\^~]/, '');
      
      if (normalizeVersion(rootNextVersion) === normalizeVersion(webNextVersion)) {
        logSuccess(`Next.js versions aligned: ${rootNextVersion} = ${webNextVersion}`);
      } else {
        logWarning(`Next.js version mismatch: root=${rootNextVersion}, web=${webNextVersion}`);
        logWarning('This may cause hoisting issues in pnpm workspace');
      }
    }

    // Check if pnpm overrides are configured
    if (rootPackageJson.pnpm?.overrides) {
      logSuccess('pnpm overrides configured for version consistency');
    } else {
      logWarning('No pnpm overrides found - consider adding them to lock versions');
    }

  } catch (error) {
    logError(`Failed to check workspace consistency: ${error.message}`);
  }
}

function main() {
  console.log(`${colors.bold}🔧 Build Toolchain Verification${colors.reset}`);
  console.log("=".repeat(60));
  console.log(`Environment: ${process.env.NETLIFY ? 'Netlify' : 'Local'}`);
  console.log(`CWD: ${process.cwd()}`);

  verifyNodeVersion();
  verifyPnpmVersion();
  verifyNextVersion();
  verifyEslintVersion();
  verifyWorkspaceConsistency();

  logHeader("📊 SUMMARY");

  if (hasErrors) {
    console.log(`\n${colors.red}${colors.bold}❌ TOOLCHAIN VERIFICATION FAILED${colors.reset}`);
    console.log(`\nPlease fix the errors above before building.`);
    console.log(`\nQuick fix:`);
    console.log(`  1. nvm use 20 (or nvm install 20)`);
    console.log(`  2. pnpm install --frozen-lockfile`);
    console.log(`  3. Re-run this script`);
    console.log("=".repeat(60));
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}✅ ALL TOOLCHAIN CHECKS PASSED${colors.reset}`);
    console.log(`\nYou can proceed with the build.`);
    console.log("=".repeat(60));
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
