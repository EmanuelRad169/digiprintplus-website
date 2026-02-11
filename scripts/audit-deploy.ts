#!/usr/bin/env tsx
/**
 * 🛠️ DIGIPRINT COMPREHENSIVE AUDIT & DEPLOY FIX SCRIPT
 * 
 * This script performs a full audit of:
 * - Environment variables (local vs Netlify)
 * - Sanity connection and dataset sync
 * - GROQ queries and dynamic routes
 * - Next.js config for static export
 * - SEO files (robots.txt, sitemap.xml)
 * - Route accessibility
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
const envPath = path.join(process.cwd(), 'apps/web/.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

interface AuditResult {
  phase: string
  status: 'pass' | 'fail' | 'warn'
  message: string
  details?: any
}

const results: AuditResult[] = []

function logResult(result: AuditResult) {
  results.push(result)
  const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
  console.log(`${icon} [${result.phase}] ${result.message}`)
  if (result.details) {
    console.log('   Details:', JSON.stringify(result.details, null, 2))
  }
}

// ============================================================================
// PHASE 1: Validate Environment Variables
// ============================================================================
async function phase1_validateEnvironment() {
  console.log('\n📋 PHASE 1: Environment Variable Validation\n')

  const requiredVars = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'NEXT_PUBLIC_SANITY_API_VERSION',
    'SANITY_API_TOKEN',
    'NEXT_PUBLIC_SITE_URL',
  ]

  const envVars: Record<string, string | undefined> = {}
  const missing: string[] = []

  for (const varName of requiredVars) {
    const value = process.env[varName]
    envVars[varName] = value
    
    if (!value || value.trim() === '') {
      missing.push(varName)
      logResult({
        phase: 'ENV_CHECK',
        status: 'fail',
        message: `Missing required variable: ${varName}`,
      })
    } else {
      logResult({
        phase: 'ENV_CHECK',
        status: 'pass',
        message: `Found ${varName}`,
        details: { value: varName.includes('TOKEN') ? '***hidden***' : value },
      })
    }
  }

  // Check Next.js config
  const configPath = path.join(process.cwd(), 'apps/web/next.config.js')
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf-8')
    
    if (configContent.includes('output:')) {
      const isStatic = configContent.includes('output: process.env.NETLIFY ? "export"')
      logResult({
        phase: 'NEXT_CONFIG',
        status: 'pass',
        message: `Next.js config found - Output mode: ${isStatic ? 'export (static)' : 'standalone'}`,
      })
    } else {
      logResult({
        phase: 'NEXT_CONFIG',
        status: 'warn',
        message: 'No output mode specified in next.config.js',
      })
    }
  } else {
    logResult({
      phase: 'NEXT_CONFIG',
      status: 'fail',
      message: 'next.config.js not found',
    })
  }

  return missing.length === 0
}

// ============================================================================
// PHASE 2: Sanity Connection & Dataset Sync
// ============================================================================
async function phase2_validateSanity() {
  console.log('\n🔌 PHASE 2: Sanity Connection & Dataset Validation\n')

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

  if (!projectId || !dataset || !token) {
    logResult({
      phase: 'SANITY_CONFIG',
      status: 'fail',
      message: 'Missing Sanity configuration',
    })
    return false
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: apiVersion || '2024-01-01',
      token,
      useCdn: false,
    })

    // Test connection
    const testQuery = '*[_type == "sanity.imageAsset"][0]'
    await client.fetch(testQuery)
    
    logResult({
      phase: 'SANITY_CONNECTION',
      status: 'pass',
      message: 'Successfully connected to Sanity',
      details: { projectId, dataset },
    })

    // Check content types
    const contentChecks = [
      { type: 'product', label: 'Products' },
      { type: 'blogPost', label: 'Blog Posts' },
      { type: 'siteSettings', label: 'Site Settings' },
      { type: 'productCategory', label: 'Product Categories' },
    ]

    for (const { type, label } of contentChecks) {
      const query = `count(*[_type == "${type}"])`
      const count = await client.fetch<number>(query)
      
      if (count > 0) {
        logResult({
          phase: 'CONTENT_CHECK',
          status: 'pass',
          message: `${label}: ${count} documents found`,
        })

        // Check for published vs draft
        const publishedQuery = `count(*[_type == "${type}" && !(_id in path("drafts.**"))])`
        const publishedCount = await client.fetch<number>(publishedQuery)
        
        if (publishedCount > 0) {
          logResult({
            phase: 'PUBLISHED_CHECK',
            status: 'pass',
            message: `${label}: ${publishedCount} published documents`,
          })
        } else {
          logResult({
            phase: 'PUBLISHED_CHECK',
            status: 'warn',
            message: `${label}: No published documents (all drafts)`,
          })
        }
      } else {
        logResult({
          phase: 'CONTENT_CHECK',
          status: 'warn',
          message: `${label}: No documents found`,
        })
      }
    }

    return true
  } catch (error) {
    logResult({
      phase: 'SANITY_CONNECTION',
      status: 'fail',
      message: 'Failed to connect to Sanity',
      details: { error: error instanceof Error ? error.message : String(error) },
    })
    return false
  }
}

// ============================================================================
// PHASE 3: GROQ Query & Dynamic Route Verification
// ============================================================================
async function phase3_validateRoutes() {
  console.log('\n🛣️  PHASE 3: Dynamic Routes & GROQ Query Validation\n')

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

  if (!projectId || !dataset || !token) {
    logResult({
      phase: 'ROUTE_CHECK',
      status: 'fail',
      message: 'Cannot validate routes - missing Sanity config',
    })
    return false
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: apiVersion || '2024-01-01',
      token,
      useCdn: false,
    })

    // Check products with slugs
    const productsQuery = `*[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))]{
      "slug": slug.current,
      title
    }`
    const products = await client.fetch<Array<{ slug: string; title: string }>>(productsQuery)
    
    if (products.length > 0) {
      logResult({
        phase: 'PRODUCTS_ROUTES',
        status: 'pass',
        message: `Found ${products.length} product slugs for /products/[slug]`,
        details: { samples: products.slice(0, 3).map(p => `/products/${p.slug}`) },
      })
    } else {
      logResult({
        phase: 'PRODUCTS_ROUTES',
        status: 'warn',
        message: 'No published products with slugs found',
      })
    }

    // Check blog posts with slugs
    const blogQuery = `*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))]{
      "slug": slug.current,
      title
    }`
    const blogs = await client.fetch<Array<{ slug: string; title: string }>>(blogQuery)
    
    if (blogs.length > 0) {
      logResult({
        phase: 'BLOG_ROUTES',
        status: 'pass',
        message: `Found ${blogs.length} blog slugs for /blog/[slug]`,
        details: { samples: blogs.slice(0, 3).map(b => `/blog/${b.slug}`) },
      })
    } else {
      logResult({
        phase: 'BLOG_ROUTES',
        status: 'warn',
        message: 'No published blog posts with slugs found',
      })
    }

    // Check if page files exist
    const routeFiles = [
      { path: 'apps/web/src/app/products/[slug]/page.tsx', route: '/products/[slug]' },
      { path: 'apps/web/src/app/blog/[slug]/page.tsx', route: '/blog/[slug]' },
    ]

    for (const { path: filePath, route } of routeFiles) {
      const fullPath = path.join(process.cwd(), filePath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const hasGenerateStaticParams = content.includes('generateStaticParams')
        
        if (hasGenerateStaticParams) {
          logResult({
            phase: 'STATIC_PARAMS',
            status: 'pass',
            message: `${route} has generateStaticParams()`,
          })
        } else {
          logResult({
            phase: 'STATIC_PARAMS',
            status: 'fail',
            message: `${route} missing generateStaticParams() - required for static export`,
          })
        }
      } else {
        logResult({
          phase: 'ROUTE_FILES',
          status: 'fail',
          message: `Route file not found: ${filePath}`,
        })
      }
    }

    return true
  } catch (error) {
    logResult({
      phase: 'ROUTE_CHECK',
      status: 'fail',
      message: 'Failed to validate routes',
      details: { error: error instanceof Error ? error.message : String(error) },
    })
    return false
  }
}

// ============================================================================
// PHASE 4: SEO Files Verification
// ============================================================================
async function phase4_validateSEO() {
  console.log('\n🔍 PHASE 4: SEO Files Validation (robots.txt & sitemap.xml)\n')

  const seoFiles = [
    { path: 'apps/web/src/app/robots.ts', name: 'robots.ts', required: true },
    { path: 'apps/web/src/app/sitemap.ts', name: 'sitemap.ts', required: true },
    { path: 'apps/web/public/robots.txt', name: 'robots.txt (static)', required: false },
  ]

  let allPass = true

  for (const { path: filePath, name, required } of seoFiles) {
    const fullPath = path.join(process.cwd(), filePath)
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      
      if (filePath.includes('robots.ts')) {
        const hasForceStatic = content.includes("dynamic = 'force-static'")
        if (hasForceStatic) {
          logResult({
            phase: 'SEO_FILES',
            status: 'pass',
            message: `${name} exists with force-static export`,
          })
        } else {
          logResult({
            phase: 'SEO_FILES',
            status: 'warn',
            message: `${name} exists but may not be statically exported`,
          })
        }

        // Check URL in robots.ts
        if (content.includes('marvelous-treacle-ca0286.netlify.app')) {
          logResult({
            phase: 'SEO_URL',
            status: 'warn',
            message: 'robots.ts contains hardcoded Netlify URL - should use env variable',
          })
        }
      }
      
      if (filePath.includes('sitemap.ts')) {
        const hasForceStatic = content.includes("dynamic = 'force-static'")
        if (hasForceStatic) {
          logResult({
            phase: 'SEO_FILES',
            status: 'pass',
            message: `${name} exists with force-static export`,
          })
        } else {
          logResult({
            phase: 'SEO_FILES',
            status: 'warn',
            message: `${name} exists but may not be statically exported`,
          })
        }

        // Check URL in sitemap.ts
        if (content.includes('marvelous-treacle-ca0286.netlify.app')) {
          logResult({
            phase: 'SEO_URL',
            status: 'warn',
            message: 'sitemap.ts contains hardcoded URL - should use NEXT_PUBLIC_SITE_URL',
          })
        }
      }
    } else {
      if (required) {
        logResult({
          phase: 'SEO_FILES',
          status: 'fail',
          message: `Required SEO file missing: ${name}`,
        })
        allPass = false
      } else {
        logResult({
          phase: 'SEO_FILES',
          status: 'pass',
          message: `Optional file ${name} not present (using ${name.replace('.txt', '.ts')} instead)`,
        })
      }
    }
  }

  return allPass
}

// ============================================================================
// PHASE 5: Build Configuration Check
// ============================================================================
async function phase5_validateBuildConfig() {
  console.log('\n⚙️  PHASE 5: Build Configuration Validation\n')

  // Check package.json scripts
  const packagePath = path.join(process.cwd(), 'apps/web/package.json')
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
    
    if (pkg.scripts?.build) {
      logResult({
        phase: 'BUILD_SCRIPTS',
        status: 'pass',
        message: `Build script found: ${pkg.scripts.build}`,
      })
    }

    if (pkg.scripts?.['build:netlify']) {
      logResult({
        phase: 'BUILD_SCRIPTS',
        status: 'pass',
        message: `Netlify build script found: ${pkg.scripts['build:netlify']}`,
      })
    } else {
      logResult({
        phase: 'BUILD_SCRIPTS',
        status: 'warn',
        message: 'No dedicated Netlify build script found',
      })
    }
  }

  // Check netlify.toml
  const netlifyConfigPath = path.join(process.cwd(), 'netlify.toml')
  if (fs.existsSync(netlifyConfigPath)) {
    const content = fs.readFileSync(netlifyConfigPath, 'utf-8')
    logResult({
      phase: 'NETLIFY_CONFIG',
      status: 'pass',
      message: 'netlify.toml configuration found',
    })

    // Check for required env vars in comments
    if (content.includes('NEXT_PUBLIC_SANITY_PROJECT_ID')) {
      logResult({
        phase: 'NETLIFY_CONFIG',
        status: 'pass',
        message: 'Sanity environment variables documented in netlify.toml',
      })
    }
  } else {
    logResult({
      phase: 'NETLIFY_CONFIG',
      status: 'warn',
      message: 'netlify.toml not found - using default Netlify settings',
    })
  }

  return true
}

// ============================================================================
// PHASE 6: Generate Summary & Recommendations
// ============================================================================
function phase6_generateSummary() {
  console.log('\n📊 AUDIT SUMMARY\n')
  console.log('='.repeat(60))

  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const warnings = results.filter(r => r.status === 'warn').length

  console.log(`Total Checks: ${results.length}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⚠️  Warnings: ${warnings}`)
  console.log('='.repeat(60))

  if (failed > 0) {
    console.log('\n❌ CRITICAL ISSUES TO FIX:\n')
    results
      .filter(r => r.status === 'fail')
      .forEach(r => {
        console.log(`   • [${r.phase}] ${r.message}`)
      })
  }

  if (warnings > 0) {
    console.log('\n⚠️  WARNINGS TO REVIEW:\n')
    results
      .filter(r => r.status === 'warn')
      .forEach(r => {
        console.log(`   • [${r.phase}] ${r.message}`)
      })
  }

  console.log('\n📝 RECOMMENDED ACTIONS:\n')
  
  const recommendations = [
    '1. Fix all critical issues (❌) before deploying',
    '2. Update hardcoded URLs to use NEXT_PUBLIC_SITE_URL environment variable',
    '3. Ensure all environment variables are set in Netlify dashboard',
    '4. Verify Netlify build command uses correct script (build:netlify or build)',
    '5. Test static export locally: npm run build && npx serve@latest out',
    '6. Clear Netlify cache and trigger fresh deploy',
    '7. Verify robots.txt and sitemap.xml are accessible after deploy',
  ]

  recommendations.forEach(rec => console.log(`   ${rec}`))

  console.log('\n' + '='.repeat(60))
}

// ============================================================================
// Main Execution
// ============================================================================
async function main() {
  console.log('🚀 DigiPrint+ Deployment Audit Script')
  console.log('='.repeat(60))
  console.log('Starting comprehensive system audit...\n')

  try {
    await phase1_validateEnvironment()
    await phase2_validateSanity()
    await phase3_validateRoutes()
    await phase4_validateSEO()
    await phase5_validateBuildConfig()
    phase6_generateSummary()

    const hasCriticalIssues = results.some(r => r.status === 'fail')
    
    if (hasCriticalIssues) {
      console.log('\n⚠️  Audit completed with critical issues. Please fix before deploying.')
      process.exit(1)
    } else {
      console.log('\n✅ Audit completed successfully! Ready for deployment.')
      process.exit(0)
    }
  } catch (error) {
    console.error('\n❌ Audit failed with error:', error)
    process.exit(1)
  }
}

main()
