#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();
const scriptsDir = path.join(projectRoot, 'tools/scripts');

// Script categories and their descriptions
const categories = {
  seed: 'Data seeding scripts - populate Sanity CMS with initial content',
  migrate: 'Migration scripts - update existing data structures',
  verify: 'Verification & testing scripts - validate data integrity',
  utils: 'Utility scripts - maintenance and helper tools',
  archive: 'Archived scripts - completed one-time operations'
};

function listScripts(category) {
  const categoryDir = path.join(scriptsDir, category);
  if (!fs.existsSync(categoryDir)) return [];
  
  return fs.readdirSync(categoryDir)
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
    .map(file => ({
      name: file.replace(/\.(ts|js)$/, ''),
      file: file,
      path: path.join(categoryDir, file)
    }));
}

function runScript(category, scriptName, additionalArgs = []) {
  const scripts = listScripts(category);
  const script = scripts.find(s => s.name === scriptName);
  
  if (!script) {
    console.error(`❌ Script "${scriptName}" not found in category "${category}"`);
    process.exit(1);
  }
  
  console.log(`🚀 Running ${category}/${scriptName}...`);
  console.log(`📁 Path: ${script.path}`);
  console.log('');
  
  try {
    const argsStr = additionalArgs.length > 0 ? ` ${additionalArgs.join(' ')}` : '';
    const command = script.file.endsWith('.ts') 
      ? `npx tsx --tsconfig tsconfig.base.json --env-file=apps/web/.env.local "${script.path}"${argsStr}`
      : `node "${script.path}"${argsStr}`;
    
    execSync(command, { 
      stdio: 'inherit',
      cwd: projectRoot 
    });
    
    console.log('');
    console.log(`✅ Script completed successfully`);
  } catch (error) {
    console.error('');
    console.error(`❌ Script failed with exit code ${error.status}`);
    process.exit(error.status || 1);
  }
}

function showHelp() {
  console.log('🛠️  DigiPrintPlus Script Runner');
  console.log('');
  console.log('Usage:');
  console.log('  npm run script <category> <script-name>');
  console.log('  npm run script list [category]');
  console.log('  npm run script help');
  console.log('');
  console.log('Categories:');
  Object.entries(categories).forEach(([cat, desc]) => {
    console.log(`  ${cat.padEnd(8)} - ${desc}`);
  });
  console.log('');
  console.log('Examples:');
  console.log('  npm run script list seed           # List all seeding scripts');
  console.log('  npm run script seed seedProducts   # Run product seeding');
  console.log('  npm run script verify verifyAllData # Run data verification');
}

function listCategory(category) {
  if (!category) {
    console.log('📂 Available Script Categories:');
    console.log('');
    Object.entries(categories).forEach(([cat, desc]) => {
      const scripts = listScripts(cat);
      console.log(`${cat.toUpperCase()} (${scripts.length} scripts)`);
      console.log(`  ${desc}`);
      console.log('');
    });
    return;
  }
  
  if (!categories[category]) {
    console.error(`❌ Unknown category: ${category}`);
    console.error(`Available categories: ${Object.keys(categories).join(', ')}`);
    process.exit(1);
  }
  
  const scripts = listScripts(category);
  console.log(`📂 ${category.toUpperCase()} Scripts (${scripts.length} files):`);
  console.log(`   ${categories[category]}`);
  console.log('');
  
  if (scripts.length === 0) {
    console.log('   No scripts found in this category.');
    return;
  }
  
  scripts.forEach(script => {
    console.log(`   📄 ${script.name}`);
  });
  console.log('');
  console.log(`Usage: npm run script ${category} <script-name>`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const category = args[1];
const scriptName = args[2];
const additionalArgs = args.slice(3);

if (!command || command === 'help') {
  showHelp();
  process.exit(0);
}

if (command === 'list') {
  listCategory(category);
  process.exit(0);
}

// Run a script
if (command && category && scriptName) {
  runScript(command, category, additionalArgs);
  process.exit(0);
}

if (command && category) {
  runScript(command, category, additionalArgs);
  process.exit(0);
}

// Invalid usage
console.error('❌ Invalid usage');
showHelp();
process.exit(1);
