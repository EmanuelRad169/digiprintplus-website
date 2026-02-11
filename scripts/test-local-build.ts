#!/usr/bin/env tsx
/**
 * 🧪 LOCAL BUILD TESTER
 * Tests the Next.js static export locally before deployment
 */

import * as fs from 'fs'
import * as path from 'path'

const outDir = path.join(process.cwd(), 'apps/web/out')

interface TestResult {
  file: string
  exists: boolean
  type: 'static' | 'dynamic' | 'seo'
}

const results: TestResult[] = []

function testFile(filePath: string, type: 'static' | 'dynamic' | 'seo'): TestResult {
  const fullPath = path.join(outDir, filePath)
  const exists = fs.existsSync(fullPath)
  
  return { file: filePath, exists, type }
}

console.log('🧪 Testing Local Static Export Build\n')
console.log('='.repeat(60))

// Check if out directory exists
if (!fs.existsSync(outDir)) {
  console.log('❌ Build directory not found: apps/web/out')
  console.log('\n📝 Please run the build first:')
  console.log('   cd apps/web && npm run build\n')
  process.exit(1)
}

console.log(`✅ Build directory found: ${outDir}\n`)

// Test static pages
console.log('📄 Testing Static Pages...\n')
const staticPages = [
  'index.html',
  'about.html',
  'about/index.html',
  'services.html',
  'services/index.html',
  'products.html',
  'products/index.html',
  'contact.html',
  'contact/index.html',
  'templates.html',
  'templates/index.html',
]

for (const page of staticPages) {
  const result = testFile(page, 'static')
  results.push(result)
  const icon = result.exists ? '✅' : '⏭️'
  console.log(`${icon} ${page}`)
  if (!result.exists && !page.includes('/index.html')) {
    // Try the folder/index.html version
    const altPage = page.replace('.html', '/index.html')
    const altResult = testFile(altPage, 'static')
    if (altResult.exists) {
      results[results.length - 1].exists = true
      console.log(`   → Found as ${altPage}`)
    }
  }
}

// Test SEO files
console.log('\n🔍 Testing SEO Files...\n')
const seoFiles = [
  'robots.txt',
  'sitemap.xml',
]

for (const file of seoFiles) {
  const result = testFile(file, 'seo')
  results.push(result)
  const icon = result.exists ? '✅' : '❌'
  console.log(`${icon} ${file}`)
}

// Test dynamic product pages (sample)
console.log('\n🔗 Testing Dynamic Product Pages...\n')
const productPages = [
  'products/business-cards-premium.html',
  'products/business-cards-premium/index.html',
  'products/raised-spot-uv-business-cards.html',
  'products/raised-spot-uv-business-cards/index.html',
]

let foundProducts = false
for (const page of productPages) {
  const result = testFile(page, 'dynamic')
  const icon = result.exists ? '✅' : '⏭️'
  if (result.exists) {
    console.log(`${icon} ${page}`)
    foundProducts = true
    results.push(result)
  }
}

if (!foundProducts) {
  console.log('⚠️  No specific product pages tested')
  console.log('   Checking if any products were generated...\n')
  
  const productsDir = path.join(outDir, 'products')
  if (fs.existsSync(productsDir)) {
    const items = fs.readdirSync(productsDir)
    const productDirs = items.filter(item => {
      const itemPath = path.join(productsDir, item)
      return fs.statSync(itemPath).isDirectory()
    })
    
    if (productDirs.length > 0) {
      console.log(`✅ Found ${productDirs.length} product directories`)
      console.log(`   Samples: ${productDirs.slice(0, 5).join(', ')}`)
    } else {
      console.log('❌ No product pages generated')
      results.push({ file: 'products/*', exists: false, type: 'dynamic' })
    }
  } else {
    console.log('❌ Products directory not found')
    results.push({ file: 'products/', exists: false, type: 'dynamic' })
  }
}

// Summary
console.log('\n📊 BUILD TEST SUMMARY')
console.log('='.repeat(60))

const staticFound = results.filter(r => r.type === 'static' && r.exists).length
const seoFound = results.filter(r => r.type === 'seo' && r.exists).length
const dynamicFound = results.filter(r => r.type === 'dynamic' && r.exists).length

console.log(`Static Pages: ${staticFound} found`)
console.log(`SEO Files: ${seoFound}/2 found`)
console.log(`Dynamic Pages: ${dynamicFound > 0 ? '✅ Generated' : '❌ Not generated'}`)

const criticalMissing = results.filter(r => 
  (r.type === 'seo' || r.file === 'index.html') && !r.exists
)

if (criticalMissing.length > 0) {
  console.log('\n❌ CRITICAL FILES MISSING:\n')
  criticalMissing.forEach(r => console.log(`   • ${r.file}`))
  console.log('\n🔧 Possible Issues:')
  console.log('   1. Build failed or incomplete')
  console.log('   2. Next.js not configured for static export')
  console.log('   3. Missing generateStaticParams() in dynamic routes')
  console.log('\n💡 Try:')
  console.log('   1. Check build logs for errors')
  console.log('   2. Verify next.config.js has output: "export"')
  console.log('   3. Run: npm run audit:deploy')
  process.exit(1)
} else {
  console.log('\n✅ Build looks good! Ready to test locally.')
  console.log('\n🚀 To test locally, run:')
  console.log('   npx serve@latest apps/web/out')
  console.log('\nThen visit http://localhost:3000')
  process.exit(0)
}
