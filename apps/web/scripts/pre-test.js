#!/usr/bin/env node
/**
 * Pre-test validation script
 * Checks for test files and logs warnings if none are found
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

console.log('🔍 Pre-test validation...\n');

// Recursively find test files
function findTestFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(rootDir, fullPath);
    
    // Skip these directories
    if (item.name === 'node_modules' || item.name === '.next' || 
        item.name === 'out' || item.name === 'coverage' ||
        item.name === '.git') {
      continue;
    }
    
    if (item.isDirectory()) {
      findTestFiles(fullPath, files);
    } else if (item.isFile()) {
      // Check if it's a test file
      if (/\.(test|spec)\.(js|jsx|ts|tsx)$/.test(item.name)) {
        files.push(relativePath);
      }
    }
  }
  
  return files;
}

const testFiles = findTestFiles(rootDir);

if (testFiles.length === 0) {
  console.log('⚠️  Warning: No test files found');
  console.log('   Jest will run with passWithNoTests: true\n');
  process.exit(0);
}

console.log(`✅ Found ${testFiles.length} test file(s):`);
testFiles.forEach(file => {
  console.log(`   - ${file}`);
});

// Check for setup file
const setupFile = path.join(rootDir, '__tests__/setup.ts');
if (fs.existsSync(setupFile)) {
  console.log('\n✅ Jest setup file exists: __tests__/setup.ts');
} else {
  console.log('\n⚠️  Warning: Jest setup file not found: __tests__/setup.ts');
  console.log('   Tests will run without custom setup');
}

console.log('\n🚀 Running tests...\n');
process.exit(0);
