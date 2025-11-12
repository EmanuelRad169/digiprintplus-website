#!/usr/bin/env node

// WebSocket Connection Test for Sanity Studio
const { exec } = require('child_process');

console.log('🔍 Testing Sanity Studio WebSocket Connection...\n');

// Test 1: Check if the Sanity API is reachable
console.log('1. Testing Sanity API connectivity...');
exec('curl -s https://as5tildt.api.sanity.io/v2022-06-30/ping', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ API connection failed:', error.message);
  } else {
    console.log('✅ API is reachable');
    console.log('Response:', stdout);
  }
});

// Test 2: Check network connectivity
console.log('\n2. Testing general network connectivity...');
exec('ping -c 3 as5tildt.api.sanity.io', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Network ping failed:', error.message);
  } else {
    console.log('✅ Network connectivity is good');
  }
});

// Test 3: Check DNS resolution
console.log('\n3. Testing DNS resolution...');
exec('nslookup as5tildt.api.sanity.io', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ DNS resolution failed:', error.message);
  } else {
    console.log('✅ DNS resolution working');
    console.log('DNS Info:', stdout.split('\n').slice(2, 4).join('\n'));
  }
});

// Troubleshooting suggestions
setTimeout(() => {
  console.log('\n📋 Troubleshooting Suggestions:');
  console.log('');
  console.log('If WebSocket connection continues to fail:');
  console.log('1. Check browser console for detailed error messages');
  console.log('2. Try refreshing the browser (Cmd+R / Ctrl+R)');
  console.log('3. Clear browser cache and cookies');
  console.log('4. Try opening in an incognito/private browser window');
  console.log('5. Check if you\'re behind a corporate firewall blocking WebSockets');
  console.log('6. Try different browser (Chrome, Firefox, Safari)');
  console.log('7. Disable browser extensions temporarily');
  console.log('');
  console.log('🔧 Alternative solutions:');
  console.log('- The studio will still work without WebSocket (no real-time updates)');
  console.log('- Manual refresh will sync any changes');
  console.log('- WebSocket is mainly for collaborative editing features');
  console.log('');
  console.log('✨ Your dashboard and content management will work normally!');
}, 3000);
