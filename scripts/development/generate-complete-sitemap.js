#!/usr/bin/env node
/**
 * Complete Site Map Generator with Sanity Integration
 * Uses the enhanced Sanity client to build comprehensive site map
 */

const path = require('path');
const fs = require('fs');

// Set up Next.js environment
process.env.NODE_ENV = 'development';
const webAppPath = path.resolve(__dirname, '../../apps/web');
process.chdir(webAppPath);

// Load environment
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');

// Create client using the same config as our enhanced setup
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

async function generateCompleteSiteMap() {
  console.log('🗺️  Generating Complete Site Map with Sanity Integration\n');
  
  try {
    // Test connection first
    console.log('🔌 Testing Sanity connection...');
    await client.fetch('*[_type == "sanity.imageAsset"][0]');
    console.log('✅ Sanity connection successful\n');
    
    // Fetch all content types
    const queries = {
      categories: `*[_type == "productCategory" && !(_id in path("drafts.**"))] | order(order asc, title asc) {
        _id,
        title,
        slug,
        description,
        featured,
        order,
        "productCount": count(*[_type == "product" && references(^._id) && status == "active"])
      }`,
      
      products: `*[_type == "product" && !(_id in path("drafts.**")) && status == "active"] | order(title asc) {
        _id,
        title,
        slug,
        status,
        category->{
          title,
          slug
        }
      }[0...20]`, // Limit for analysis
      
      pages: `*[_type == "page" && !(_id in path("drafts.**"))] | order(title asc) {
        _id,
        title,
        slug,
        pageType
      }`,
      
      navigation: `*[_type == "navigationMenu" && _id == "mainNav"][0] {
        _id,
        title,
        items[] {
          name,
          href,
          order,
          isVisible,
          megaMenu[] {
            sectionTitle,
            links[] {
              title,
              href,
              description
            }
          }
        }
      }`,
      
      templates: `*[_type == "template" && !(_id in path("drafts.**"))] | order(title asc) {
        _id,
        title,
        slug,
        category,
        description
      }`,
      
      siteSettings: `*[_type == "siteSettings"][0] {
        title,
        description,
        logo,
        primaryColor,
        secondaryColor
      }`
    };

    console.log('📊 Fetching data from Sanity...\n');
    
    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      try {
        console.log(`  • Fetching ${key}...`);
        results[key] = await client.fetch(query);
        console.log(`    ✅ Found ${Array.isArray(results[key]) ? results[key].length : '1'} ${key}`);
      } catch (error) {
        console.log(`    ❌ Error fetching ${key}: ${error.message}`);
        results[key] = [];
      }
    }
    
    console.log('\n📁 Analyzing Frontend Routes...\n');
    
    // Analyze frontend routes
    const appDir = path.resolve(__dirname, '../../apps/web/src/app');
    
    function analyzeRoutes(dirPath, basePath = '') {
      const routes = [];
      try {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
          const itemPath = path.join(dirPath, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            if (item.startsWith('[') && item.endsWith(']')) {
              const paramName = item.slice(1, -1);
              const routePath = basePath + '/[' + paramName + ']';
              routes.push({
                type: 'dynamic',
                path: routePath,
                param: paramName,
                filesystem: path.relative(appDir, itemPath)
              });
              routes.push(...analyzeRoutes(itemPath, routePath));
            } else {
              const routePath = basePath + '/' + item;
              routes.push({
                type: 'directory',
                path: routePath,
                filesystem: path.relative(appDir, itemPath)
              });
              routes.push(...analyzeRoutes(itemPath, routePath));
            }
          } else if (item === 'page.tsx' || item === 'page.js') {
            routes.push({
              type: 'page',
              path: basePath || '/',
              filesystem: path.relative(appDir, itemPath)
            });
          }
        });
      } catch (error) {
        console.error(`Error reading ${dirPath}:`, error.message);
      }
      return routes;
    }

    const frontendRoutes = analyzeRoutes(appDir);
    const pageRoutes = frontendRoutes.filter(r => r.type === 'page');
    const dynamicRoutes = frontendRoutes.filter(r => r.type === 'dynamic');

    console.log(`📄 Found ${pageRoutes.length} page routes`);
    console.log(`🔄 Found ${dynamicRoutes.length} dynamic routes\n`);

    // Generate comprehensive site map
    const siteMap = {
      meta: {
        generated: new Date().toISOString(),
        sanityProject: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        frontendUrl: 'http://localhost:3001',
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL
      },
      
      // Sanity Content Structure
      sanityContent: {
        categories: results.categories.map(cat => ({
          id: cat._id,
          title: cat.title,
          slug: cat.slug?.current,
          productCount: cat.productCount,
          frontendPath: `/products/category/${cat.slug?.current}`,
          featured: cat.featured,
          order: cat.order
        })),
        
        products: results.products.map(product => ({
          id: product._id,
          title: product.title,
          slug: product.slug?.current,
          categorySlug: product.category?.slug?.current,
          frontendPath: `/products/${product.slug?.current}`,
          categoryPath: product.category?.slug?.current ? `/products/category/${product.category.slug.current}` : null
        })),
        
        pages: results.pages.map(page => ({
          id: page._id,
          title: page.title,
          slug: page.slug?.current,
          pageType: page.pageType,
          frontendPath: `/${page.slug?.current}`
        })),
        
        templates: results.templates.map(template => ({
          id: template._id,
          title: template.title,
          slug: template.slug?.current,
          category: template.category,
          frontendPath: `/templates/${template.slug?.current}`
        }))
      },
      
      // Navigation Structure
      navigation: results.navigation,
      
      // Frontend Routes
      frontendRoutes: {
        static: pageRoutes.map(route => ({
          path: route.path,
          filesystem: route.filesystem
        })),
        dynamic: dynamicRoutes.map(route => ({
          path: route.path,
          param: route.param,
          filesystem: route.filesystem
        }))
      },
      
      // Route Mapping Analysis
      routeMapping: {
        categories: {
          hasListingRoute: pageRoutes.some(r => r.path === '/products'),
          hasCategoryRoute: dynamicRoutes.some(r => r.path === '/products/category/[category]'),
          hasProductRoute: dynamicRoutes.some(r => r.path === '/products/[slug]'),
          expectedRoutes: results.categories.map(cat => `/products/category/${cat.slug?.current}`)
        },
        
        pages: {
          sanityPages: results.pages.length,
          matchingRoutes: results.pages.filter(page => 
            pageRoutes.some(route => route.path === `/${page.slug?.current}`) ||
            dynamicRoutes.some(route => route.param === 'slug' && route.path.startsWith('/[slug]'))
          ).length
        },
        
        templates: {
          hasTemplatesIndex: pageRoutes.some(r => r.path === '/templates'),
          hasTemplateRoute: dynamicRoutes.some(r => r.path === '/templates/[slug]'),
          templateCount: results.templates.length
        }
      },
      
      // Site Settings
      siteSettings: results.siteSettings,
      
      // Recommendations
      recommendations: []
    };

    // Generate recommendations
    console.log('🎯 Generating Recommendations...\n');

    // Check route completeness
    if (!siteMap.routeMapping.categories.hasCategoryRoute) {
      siteMap.recommendations.push({
        type: 'missing_route',
        priority: 'high',
        title: 'Missing Category Route',
        description: 'Product categories exist in Sanity but no dynamic category route found',
        action: 'Ensure /products/category/[category]/page.tsx exists and works correctly',
        sanityData: `${results.categories.length} categories found`
      });
    }

    if (!siteMap.routeMapping.categories.hasProductRoute) {
      siteMap.recommendations.push({
        type: 'missing_route',
        priority: 'high', 
        title: 'Missing Product Route',
        description: 'Products exist in Sanity but no dynamic product route found',
        action: 'Ensure /products/[slug]/page.tsx exists and works correctly',
        sanityData: `${results.products.length}+ products found`
      });
    }

    // Check navigation alignment
    if (results.navigation && results.navigation.items) {
      results.navigation.items.forEach(navItem => {
        const hasMatchingRoute = pageRoutes.some(route => route.path === navItem.href) ||
                               (navItem.href === '/' && pageRoutes.some(route => route.path === '/'));
        
        if (!hasMatchingRoute && navItem.href !== '/products' && navItem.href !== '/quote') {
          siteMap.recommendations.push({
            type: 'navigation_mismatch',
            priority: 'medium',
            title: `Navigation Route Missing: ${navItem.name}`,
            description: `Navigation item "${navItem.name}" (${navItem.href}) has no matching route`,
            action: `Create route for ${navItem.href} or update navigation`,
            navItem: navItem
          });
        }
      });
    }

    // Check for orphaned routes
    const orphanedPages = results.pages.filter(page => {
      const expectedPath = `/${page.slug?.current}`;
      return !pageRoutes.some(route => route.path === expectedPath) &&
             !dynamicRoutes.some(route => route.param === 'slug');
    });

    if (orphanedPages.length > 0) {
      siteMap.recommendations.push({
        type: 'orphaned_content',
        priority: 'medium',
        title: 'Orphaned Sanity Pages',
        description: `${orphanedPages.length} pages in Sanity have no matching frontend routes`,
        action: 'Ensure dynamic [slug] route exists or create specific routes',
        orphanedPages: orphanedPages.map(p => ({ title: p.title, slug: p.slug?.current }))
      });
    }

    // Display results
    console.log('📊 SANITY CONTENT SUMMARY:');
    console.log(`  📦 Categories: ${results.categories.length}`);
    console.log(`  🛍️  Products: ${results.products.length}+ (showing first 20)`);
    console.log(`  📄 Pages: ${results.pages.length}`);
    console.log(`  📋 Templates: ${results.templates.length}`);
    console.log(`  🧭 Navigation Items: ${results.navigation?.items?.length || 0}`);

    console.log('\n🎯 ROUTE ANALYSIS:');
    console.log(`  ✅ Static Routes: ${pageRoutes.length}`);
    console.log(`  🔄 Dynamic Routes: ${dynamicRoutes.length}`);
    
    console.log('\n📝 KEY FINDINGS:');
    siteMap.recommendations.forEach((rec, index) => {
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`  ${priority} ${rec.title}`);
      console.log(`     ${rec.description}`);
    });

    if (siteMap.recommendations.length === 0) {
      console.log('  🎉 No major issues found! Your Sanity structure aligns well with your frontend routes.');
    }

    // Save site map
    const siteMapPath = path.resolve(__dirname, '../../siteMap.json');
    fs.writeFileSync(siteMapPath, JSON.stringify(siteMap, null, 2));
    console.log(`\n💾 Complete site map saved to: ${siteMapPath}`);

    console.log('\n🚀 NEXT STEPS:');
    console.log('  1. Visit http://localhost:3001/sanity-test to test your Sanity integration');
    console.log('  2. Review the generated siteMap.json for detailed analysis');
    console.log('  3. Address any high-priority recommendations');
    console.log('  4. Test your category and product routes');

    return siteMap;

  } catch (error) {
    console.error('❌ Error generating site map:', error);
    
    if (error.message.includes('Unauthorized')) {
      console.error('\n🔐 Authentication Issue:');
      console.error('  Your Sanity token may be invalid or expired.');
      console.error('  Since you\'re using GitHub authentication, check:');
      console.error('  1. Your SANITY_API_TOKEN in .env.local');
      console.error('  2. Token permissions in Sanity manage console');
      console.error('  3. Project ID and dataset are correct');
    }
    
    throw error;
  }
}

if (require.main === module) {
  generateCompleteSiteMap().catch(console.error);
}

module.exports = { generateCompleteSiteMap };