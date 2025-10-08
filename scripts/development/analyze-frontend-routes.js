#!/usr/bin/env node
/**
 * Frontend Route Analysis - Analyze current frontend structure without API dependency
 */

const path = require('path');
const fs = require('fs');

function analyzeFrontendStructure() {
  console.log('📁 FRONTEND ROUTE ANALYSIS\n');
  
  const appDir = path.resolve(__dirname, '../../apps/web/src/app');
  
  function analyzeDirectory(dirPath, basePath = '') {
    const routes = [];
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          if (item.startsWith('[') && item.endsWith(']')) {
            // Dynamic route
            const paramName = item.slice(1, -1);
            const routePath = basePath + '/[' + paramName + ']';
            routes.push({
              type: 'dynamic',
              path: routePath,
              param: paramName,
              filesystem: itemPath,
              relativePath: path.relative(appDir, itemPath)
            });
            
            // Recursively analyze subdirectories
            const subRoutes = analyzeDirectory(itemPath, routePath);
            routes.push(...subRoutes);
          } else {
            // Static route
            const routePath = basePath + '/' + item;
            routes.push({
              type: 'static',
              path: routePath,
              filesystem: itemPath,
              relativePath: path.relative(appDir, itemPath)
            });
            
            // Recursively analyze subdirectories
            const subRoutes = analyzeDirectory(itemPath, routePath);
            routes.push(...subRoutes);
          }
        } else if (item === 'page.tsx' || item === 'page.js') {
          // This directory has a page
          routes.push({
            type: 'page',
            path: basePath || '/',
            filesystem: itemPath,
            relativePath: path.relative(appDir, itemPath)
          });
        } else if (item === 'layout.tsx' || item === 'layout.js') {
          routes.push({
            type: 'layout',
            path: basePath || '/',
            filesystem: itemPath,
            relativePath: path.relative(appDir, itemPath)
          });
        } else if (item === 'loading.tsx' || item === 'loading.js') {
          routes.push({
            type: 'loading',
            path: basePath || '/',
            filesystem: itemPath,
            relativePath: path.relative(appDir, itemPath)
          });
        } else if (item === 'error.tsx' || item === 'error.js') {
          routes.push({
            type: 'error',
            path: basePath || '/',
            filesystem: itemPath,
            relativePath: path.relative(appDir, itemPath)
          });
        } else if (item === 'not-found.tsx' || item === 'not-found.js') {
          routes.push({
            type: 'not-found',
            path: basePath || '/',
            filesystem: itemPath,
            relativePath: path.relative(appDir, itemPath)
          });
        }
      });
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error.message);
    }
    
    return routes;
  }

  const frontendRoutes = analyzeDirectory(appDir);
  
  // Organize by type
  const routesByType = {
    pages: frontendRoutes.filter(r => r.type === 'page'),
    dynamic: frontendRoutes.filter(r => r.type === 'dynamic'),
    static: frontendRoutes.filter(r => r.type === 'static'),
    layouts: frontendRoutes.filter(r => r.type === 'layout'),
    loading: frontendRoutes.filter(r => r.type === 'loading'),
    error: frontendRoutes.filter(r => r.type === 'error'),
    notFound: frontendRoutes.filter(r => r.type === 'not-found')
  };

  console.log('📄 PAGE ROUTES:');
  routesByType.pages.forEach(route => {
    console.log(`  ${route.path} → ${route.relativePath}`);
  });

  console.log('\n🔄 DYNAMIC ROUTES:');
  routesByType.dynamic.forEach(route => {
    console.log(`  ${route.path} (param: ${route.param}) → ${route.relativePath}`);
  });

  console.log('\n📁 STATIC DIRECTORIES:');
  routesByType.static.forEach(route => {
    console.log(`  ${route.path}/ → ${route.relativePath}/`);
  });

  // Analyze specific patterns
  console.log('\n🎯 ROUTING PATTERN ANALYSIS:\n');

  // Check for products routing
  const productRoutes = frontendRoutes.filter(r => r.path.startsWith('/products'));
  console.log('🛍️ Products Routes:');
  productRoutes.forEach(route => {
    console.log(`  ${route.type.toUpperCase()}: ${route.path} → ${route.relativePath}`);
  });

  // Check for templates routing
  const templateRoutes = frontendRoutes.filter(r => r.path.startsWith('/templates'));
  console.log('\n📋 Templates Routes:');
  templateRoutes.forEach(route => {
    console.log(`  ${route.type.toUpperCase()}: ${route.path} → ${route.relativePath}`);
  });

  // Check for dynamic slug routing
  const slugRoutes = frontendRoutes.filter(r => r.type === 'dynamic' && r.param === 'slug');
  console.log('\n🏷️ Dynamic [slug] Routes:');
  slugRoutes.forEach(route => {
    console.log(`  ${route.path} → ${route.relativePath}`);
  });

  // Expected Sanity-based routes
  console.log('\n📝 EXPECTED SANITY-BASED ROUTING STRUCTURE:\n');
  
  console.log('Based on typical Sanity CMS patterns, we expect:');
  console.log('  ✅ / - Home page');
  console.log('  ✅ /about - About page (static or Sanity page)');
  console.log('  ✅ /contact - Contact page (static or Sanity page)');
  console.log('  ✅ /services - Services page (static or Sanity page)');
  console.log('  ✅ /templates - Templates page (likely Sanity page)');
  console.log('  ✅ /quote - Quote request page (static)');
  
  console.log('\n  📦 Product routing:');
  console.log('  ✅ /products - Products listing page');
  console.log('  ❓ /products/[slug] - Individual product pages');
  console.log('  ❓ /products/category/[category] - Category listing pages');
  
  console.log('\n  🎨 Template routing (if needed):');
  console.log('  ❓ /templates/[slug] - Individual template pages');
  console.log('  ❓ /templates/category/[category] - Template category pages');

  // Generate basic site map based on frontend analysis
  const siteMap = {
    meta: {
      generated: new Date().toISOString(),
      analysis: 'Frontend route analysis only',
      note: 'Sanity data integration pending authentication fix'
    },
    staticRoutes: routesByType.pages.map(r => r.path),
    dynamicRoutes: routesByType.dynamic.map(r => ({
      path: r.path,
      param: r.param
    })),
    productRouting: {
      hasProductsIndex: routesByType.pages.some(r => r.path === '/products'),
      hasProductSlug: routesByType.dynamic.some(r => r.path === '/products/[slug]'),
      hasCategorySlug: routesByType.dynamic.some(r => r.path === '/products/category/[category]'),
      categoryRoutes: productRoutes.filter(r => r.path.includes('category'))
    },
    templateRouting: {
      hasTemplatesIndex: routesByType.pages.some(r => r.path === '/templates'),
      hasTemplateSlug: routesByType.dynamic.some(r => r.path === '/templates/[slug]'),
      templateRoutes: templateRoutes
    },
    recommendations: []
  };

  // Add recommendations based on analysis
  if (!siteMap.productRouting.hasProductSlug) {
    siteMap.recommendations.push({
      type: 'missing_route',
      priority: 'high',
      description: 'Missing individual product page route',
      action: 'Create /products/[slug]/page.tsx for individual product pages'
    });
  }

  if (!siteMap.productRouting.hasCategorySlug) {
    siteMap.recommendations.push({
      type: 'missing_route',
      priority: 'high',
      description: 'Missing product category route',
      action: 'Create /products/category/[category]/page.tsx for category listing pages'
    });
  }

  if (!siteMap.templateRouting.hasTemplateSlug) {
    siteMap.recommendations.push({
      type: 'potential_route',
      priority: 'medium',
      description: 'Consider individual template pages if templates have detailed content',
      action: 'Create /templates/[slug]/page.tsx if individual template pages are needed'
    });
  }

  console.log('\n📊 ROUTE COMPLETENESS ANALYSIS:\n');
  
  console.log(`✅ Static Pages: ${routesByType.pages.length} found`);
  console.log(`🔄 Dynamic Routes: ${routesByType.dynamic.length} found`);
  console.log(`📁 Route Directories: ${routesByType.static.length} found`);
  
  console.log('\n🎯 PRODUCT ROUTING STATUS:');
  console.log(`  Products Index: ${siteMap.productRouting.hasProductsIndex ? '✅' : '❌'}`);
  console.log(`  Product Detail [slug]: ${siteMap.productRouting.hasProductSlug ? '✅' : '❌'}`);
  console.log(`  Category Listing [category]: ${siteMap.productRouting.hasCategorySlug ? '✅' : '❌'}`);
  
  console.log('\n📋 TEMPLATE ROUTING STATUS:');
  console.log(`  Templates Index: ${siteMap.templateRouting.hasTemplatesIndex ? '✅' : '❌'}`);
  console.log(`  Template Detail [slug]: ${siteMap.templateRouting.hasTemplateSlug ? '✅' : '❌'}`);

  // Save the analysis
  const outputPath = path.resolve(__dirname, '../../frontend-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    ...siteMap,
    allRoutes: frontendRoutes
  }, null, 2));
  console.log(`\n💾 Frontend analysis saved to: ${outputPath}`);

  return siteMap;
}

if (require.main === module) {
  try {
    analyzeFrontendStructure();
  } catch (error) {
    console.error('❌ Error analyzing frontend structure:', error);
  }
}

module.exports = { analyzeFrontendStructure };