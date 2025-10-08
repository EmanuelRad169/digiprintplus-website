#!/usr/bin/env node
/**
 * Sanity Authentication Helper
 * This script helps developers authenticate with Sanity CLI
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔐 Sanity Authentication Helper\n');

// Check if we're in the right directory
const studioPath = path.resolve(__dirname, '../../apps/studio');
const webPath = path.resolve(__dirname, '../../apps/web');
const envPath = path.join(webPath, '.env.local');

console.log('📁 Checking project structure...');
console.log(`  Studio path: ${studioPath}`);
console.log(`  Web app path: ${webPath}`);
console.log(`  Environment file: ${envPath}\n`);

// Check if studio directory exists
if (!fs.existsSync(studioPath)) {
  console.error('❌ Studio directory not found at:', studioPath);
  console.error('💡 Make sure you\'re running this from the project root');
  process.exit(1);
}

// Check if env file exists
if (!fs.existsSync(envPath)) {
  console.error('❌ Environment file not found at:', envPath);
  console.error('💡 Create .env.local in your web app directory');
  process.exit(1);
}

// Read current environment variables
console.log('📋 Current Sanity configuration:');
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  const config = {};
  lines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && key.includes('SANITY')) {
      config[key.trim()] = value ? value.trim() : 'NOT SET';
    }
  });
  
  Object.entries(config).forEach(([key, value]) => {
    const status = value !== 'NOT SET' ? '✅' : '❌';
    console.log(`  ${status} ${key}: ${value === 'NOT SET' ? 'NOT SET' : '***'}`)
  });
  
  console.log('');
  
} catch (error) {
  console.error('❌ Error reading environment file:', error.message);
  process.exit(1);
}

// Function to run command and capture output
function runCommand(command, cwd = process.cwd()) {
  try {
    const output = execSync(command, { 
      cwd, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || error.stderr };
  }
}

// Check if Sanity CLI is installed
console.log('🔧 Checking Sanity CLI...');
const cliCheck = runCommand('npx sanity --version');
if (!cliCheck.success) {
  console.error('❌ Sanity CLI not available');
  console.error('💡 Installing Sanity CLI...');
  
  const installResult = runCommand('npm install -g @sanity/cli');
  if (!installResult.success) {
    console.error('❌ Failed to install Sanity CLI');
    console.error('💡 Try running: npm install -g @sanity/cli');
    process.exit(1);
  }
} else {
  console.log('✅ Sanity CLI available:', cliCheck.output.trim());
}

// Check authentication status
console.log('\n🔍 Checking authentication status...');
const authCheck = runCommand('npx sanity auth list', studioPath);
if (authCheck.success) {
  console.log('✅ Current authentication status:');
  console.log(authCheck.output);
} else {
  console.log('⚠️  Not authenticated with Sanity');
}

// Function to login
function performLogin() {
  console.log('\n🚀 Starting Sanity login process...');
  console.log('💡 This will open your browser to authenticate with Sanity');
  
  try {
    // Run login interactively
    execSync('npx sanity login', { 
      cwd: studioPath,
      stdio: 'inherit'
    });
    
    console.log('\n✅ Login completed!');
    return true;
  } catch (error) {
    console.error('\n❌ Login failed:', error.message);
    return false;
  }
}

// Function to get user token
function getUserToken() {
  console.log('\n🔑 Getting user token...');
  const tokenResult = runCommand('npx sanity debug --secrets', studioPath);
  
  if (tokenResult.success) {
    try {
      const output = tokenResult.output;
      const tokenMatch = output.match(/Token: (.+)/);
      if (tokenMatch) {
        return tokenMatch[1].trim();
      }
    } catch (error) {
      console.error('❌ Error parsing token:', error.message);
    }
  }
  
  console.log('⚠️  Could not automatically retrieve token');
  console.log('💡 You can find your token at: https://manage.sanity.io');
  return null;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node sanity-auth-helper.js [options]

Options:
  --login, -l     Perform Sanity login
  --token, -t     Get user token
  --check, -c     Check authentication status
  --help, -h      Show this help

Examples:
  node sanity-auth-helper.js --login
  node sanity-auth-helper.js --token
  node sanity-auth-helper.js --check
    `);
    return;
  }
  
  if (args.includes('--login') || args.includes('-l')) {
    const loginSuccess = performLogin();
    if (loginSuccess) {
      // Try to get token after login
      setTimeout(() => {
        const token = getUserToken();
        if (token) {
          console.log('\n🔑 Your authentication token:');
          console.log(`SANITY_API_TOKEN=${token}`);
          console.log('\n💡 Add this to your .env.local file');
        }
      }, 2000);
    }
    return;
  }
  
  if (args.includes('--token') || args.includes('-t')) {
    getUserToken();
    return;
  }
  
  if (args.includes('--check') || args.includes('-c')) {
    console.log('✅ Authentication check completed');
    return;
  }
  
  // Default: show help and current status
  console.log('🎯 What would you like to do?\n');
  console.log('  1. Login to Sanity:');
  console.log('     node sanity-auth-helper.js --login\n');
  console.log('  2. Get authentication token:');
  console.log('     node sanity-auth-helper.js --token\n');
  console.log('  3. Check authentication status:');
  console.log('     node sanity-auth-helper.js --check\n');
  console.log('💡 Need help? Run: node sanity-auth-helper.js --help');
}

main().catch(console.error);