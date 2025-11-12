// Browser-based CORS Test
// This file can be used in the browser console or served via the Next.js app

export async function testBrowserCORS() {
  console.log('🌐 Testing CORS from Browser Environment')
  console.log('📍 Origin:', window.location.origin)
  
  const tests = [
    {
      name: 'Direct API Call (No Auth)',
      url: 'https://as5tildt.api.sanity.io/v2024-01-01/data/query/development?query=*[_type == "siteSettings"][0]'
    },
    {
      name: 'Navigation Query',
      url: 'https://as5tildt.api.sanity.io/v2024-01-01/data/query/development?query=*[_type == "navigationMenu"][0]'
    }
  ]

  for (const test of tests) {
    try {
      console.log(`\n🧪 Running: ${test.name}`)
      
      const response = await fetch(test.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include' // Uncomment if you need credentials
      })
      
      if (response.ok) {
        console.log(`✅ ${test.name}: SUCCESS`)
        console.log(`📊 Status: ${response.status} ${response.statusText}`)
        
        try {
          const data = await response.json()
          console.log(`📋 Data keys: ${Object.keys(data.result || {}).slice(0, 5).join(', ')}`)
        } catch (e) {
          console.log('📋 Response received but not JSON')
        }
      } else {
        console.error(`❌ ${test.name}: HTTP Error`)
        console.error(`📊 Status: ${response.status} ${response.statusText}`)
      }
      
    } catch (error: any) {
      console.error(`❌ ${test.name}: FAILED`)
      console.error(`🔍 Error: ${error.message}`)
      
      if (error.message.includes('CORS')) {
        console.error('🚨 CORS POLICY VIOLATION!')
        console.error('📝 Need to configure CORS origins in Sanity dashboard')
      }
    }
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🌐 Browser environment detected - run testBrowserCORS() to test CORS')
} else {
  console.log('🖥️  Node.js environment - browser CORS test not applicable')
}
