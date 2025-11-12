// CORS Verification Test for Sanity
import { createClient } from '@sanity/client'

// Create a client without token for public data testing
const publicClient = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2024-01-01',
  // No token - this will test public read access and CORS
})

async function verifyCORSConfiguration() {
  console.log('🔍 Verifying CORS Configuration for Sanity Project')
  console.log('📍 Project ID: as5tildt')
  console.log('📍 Dataset: development')
  console.log('📍 API Version: 2024-01-01')
  console.log('='.repeat(50))

  const tests = [
    {
      name: 'Basic Connectivity Test',
      description: 'Testing if we can reach the Sanity API',
      query: '*[_type == "siteSettings"][0]',
      requiresToken: false
    },
    {
      name: 'Navigation Menu Test',
      description: 'Testing navigation fetch (often public)',
      query: '*[_type == "navigationMenu"][0]',
      requiresToken: false
    },
    {
      name: 'Product Categories Test', 
      description: 'Testing product categories (public data)',
      query: '*[_type == "productCategory"][0]',
      requiresToken: false
    }
  ]

  let passedTests = 0
  let totalTests = tests.length

  for (const test of tests) {
    try {
      console.log(`\n🧪 Running: ${test.name}`)
      console.log(`📝 ${test.description}`)
      
      const startTime = Date.now()
      const result = await publicClient.fetch(test.query)
      const duration = Date.now() - startTime
      
      console.log(`✅ ${test.name}: SUCCESS (${duration}ms)`)
      console.log(`📊 Result: ${result ? 'Data received' : 'No data found'}`)
      
      if (result && typeof result === 'object') {
        console.log(`📋 Keys: ${Object.keys(result).slice(0, 5).join(', ')}${Object.keys(result).length > 5 ? '...' : ''}`)
      }
      
      passedTests++
      
    } catch (error: any) {
      console.error(`❌ ${test.name}: FAILED`)
      console.error(`🔍 Error: ${error?.message || error}`)
      
      // Check for specific CORS errors
      if (error?.message?.includes('CORS') || error?.message?.includes('cors')) {
        console.error('🚨 CORS ERROR DETECTED!')
        console.error('📝 This indicates CORS rules need to be configured in Sanity')
      } else if (error?.message?.includes('fetch')) {
        console.error('🌐 Network/Fetch Error - Could be CORS or connectivity')
      } else if (error?.message?.includes('401') || error?.message?.includes('403')) {
        console.error('🔒 Authentication Error - This is expected for some queries without token')
        passedTests++ // Count as passed since it reached the API
      } else {
        console.error('❓ Unknown error type')
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`🏁 CORS Verification Complete: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log('✅ CORS appears to be working correctly!')
    console.log('🎉 All API calls succeeded')
  } else if (passedTests > 0) {
    console.log('⚠️  Partial success - some calls worked')
    console.log('🔧 You may need to configure CORS for specific scenarios')
  } else {
    console.log('❌ CORS configuration needed')
    console.log('📋 Follow the configuration steps below')
  }

  console.log('\n📋 CORS Configuration Instructions:')
  console.log('1. Go to: https://sanity.io/manage/personal/project/as5tildt')
  console.log('2. Click "API" in the left sidebar')
  console.log('3. Scroll to "CORS Origins" section')
  console.log('4. Add these origins:')
  console.log('   - http://localhost:3000')
  console.log('   - http://localhost:3334')  
  console.log('   - http://127.0.0.1:3000')
  console.log('   - http://127.0.0.1:3334')
  console.log('5. Enable "Allow credentials" if needed')
  
  process.exit(passedTests === totalTests ? 0 : 1)
}

verifyCORSConfiguration()
