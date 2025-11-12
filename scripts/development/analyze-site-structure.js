#!/usr/bin/env node
/**
 * Site Map Builder - Analyze Sanity structure and align with frontend routes
 */

// Use the same environment as the web app
process.env.NODE_ENV = 'development';

const path = require('path');
const fs = require('fs');

// Import the existing Sanity client and fetchers
const webAppPath = path.resolve(__dirname, '../../apps/web');
process.chdir(webAppPath);

// Load environment from web app
require('dotenv').config({ path: '.env.local' });

// We'll call the frontend fetchers to get the data
async function analyzeSiteStructure() {
  try {
    console.log('🔍 Analyzing Sanity Studio structure and frontend routes...\n');

    // Since we can't directly import the ES modules in this Node script,
    // let's create a simple query using the same client config
    const { createClient } = require('@sanity/client');
    
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
      apiVersion: '2024-01-01',
    });

    // Get categories
    const categoriesQuery = `*[_type == "productCategory" && !(_id in path("drafts.**"))] | order(order asc, title asc) {
      _id,
      title,
      slug,
      description,
      featured,
      order,
      "productCount": count(*[_type == "product" && references(^._id) && status == "active"])
    }`;

    // Get pages
    const pagesQuery = `*[_type == "page" && !(_id in path("drafts.**"))] | order(title asc) {
      _id,
      title,
      slug,
      pageType
    }`;

    // Get navigation
    const navigationQuery = `*[_type == "navigationMenu" && _id == "mainNav"][0] {
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
    }`;

    const [categories, pages, navigation] = await Promise.all([
      client.fetch(categoriesQuery),
      client.fetch(pagesQuery),
      client.fetch(navigationQuery)
    ]);

    console.log('📂 SANITY STRUCTURE ANALYSIS\n');
    
    console.log(`📦 Product Categories (${categories.length}):`);
    const categoryMap = {};
    categories.forEach((category, index) => {
      const slug = category.slug?.current;
      console.log(`  ${index + 1}. ${category.title}`);
      console.log(`     Slug: ${slug || 'NO SLUG'}`);
      console.log(`     Products: ${category.productCount}`);
      console.log(`     Expected Route: /products/category/${slug}`);
      
      if (slug) {
        categoryMap[slug] = {
          title: category.title,
          slug: slug,
          productCount: category.productCount,
          frontendPath: `/products/category/${slug}`,
          featured: category.featured
        };
      }
      console.log('');
    });

    console.log(`📄 Pages (${pages.length}):`);
    const pageMap = {};
    pages.forEach((page, index) => {
      const slug = page.slug?.current;
      console.log(`  ${index + 1}. ${page.title}`);
      console.log(`     Slug: ${slug || 'NO SLUG'}`);
      console.log(`     Type: ${page.pageType || 'Standard'}`);
      console.log(`     Expected Route: /${slug}`);
      
      if (slug) {
        pageMap[slug] = {
          title: page.title,
          slug: slug,
          frontendPath: `/${slug}`,
          pageType: page.pageType
        };
      }
      console.log('');
    });

    console.log('🧭 Navigation Structure:');
    if (navigation && navigation.items) {
      navigation.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name} → ${item.href}`);
        if (item.megaMenu && item.megaMenu.length > 0) {
          console.log(`     🔥 HAS MEGA MENU (${item.megaMenu.length} sections):`);
          item.megaMenu.forEach((section, sIndex) => {
            console.log(`       ${sIndex + 1}. ${section.sectionTitle}`);
            if (section.links) {
              section.links.forEach((link, lIndex) => {
                console.log(`          → ${link.title} (${link.href})`);
              });
            }
          });
        }
        console.log('');
      });
    }

    // Analyze current frontend structure
    console.log('📁 FRONTEND ROUTE ANALYSIS\n');
    
    const appDir = path.resolve(__dirname, '../../apps/web/src/app');
    
    function analyzeDirectory(dirPath, basePath = '') {
      const routes = [];
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
              filesystem: itemPath
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
              filesystem: itemPath
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
            filesystem: itemPath
          });
        }
      });
      
      return routes;
    }

    const frontendRoutes = analyzeDirectory(appDir);
    
    console.log('Current Frontend Routes:');
    frontendRoutes.forEach(route => {
      if (route.type === 'page') {
        console.log(`  📄 ${route.path}`);
      } else if (route.type === 'dynamic') {
        console.log(`  🔄 ${route.path} (dynamic: ${route.param})`);
      } else if (route.type === 'static') {
        console.log(`  📁 ${route.path}/ (directory)`);
      }
    });

    // Generate site map
    const siteMap = {
      meta: {
        generated: new Date().toISOString(),
        sanityProject: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET
      },
      categories: categoryMap,
      pages: pageMap,
      navigation: navigation,
      frontendRoutes: frontendRoutes,
      recommendations: []
    };

    // Analysis and recommendations
    console.log('\n🔍 ANALYSIS & RECOMMENDATIONS\n');
    
    // Check for missing category routes
    const hasProductsSlugRoute = frontendRoutes.some(r => r.path === '/products/[slug]');
    const hasCategoryRoute = frontendRoutes.some(r => r.path === '/products/category/[category]');
    
    if (!hasCategoryRoute) {
      console.log('⚠️  Missing: /products/category/[category] route for product categories');
      siteMap.recommendations.push({
        type: 'missing_route',
        description: 'Create /products/category/[category] route for product categories',
        action: 'Create apps/web/src/app/products/category/[category]/page.tsx'
      });
    } else {
      console.log('✅ Found: /products/category/[category] route exists');
    }
    
    if (!hasProductsSlugRoute) {
      console.log('⚠️  Missing: /products/[slug] route for individual products');
      siteMap.recommendations.push({
        type: 'missing_route',
        description: 'Create /products/[slug] route for individual products',
        action: 'Create apps/web/src/app/products/[slug]/page.tsx'
      });
    } else {
      console.log('✅ Found: /products/[slug] route exists');
    }

    // Check navigation alignment
    if (navigation && navigation.items) {
      navigation.items.forEach(navItem => {
        if (navItem.href !== '/' && navItem.href !== '/products' && navItem.href !== '/quote') {
          const matchingPage = pages.find(p => `/${p.slug?.current}` === navItem.href);
          if (!matchingPage) {
            console.log(`⚠️  Navigation item "${navItem.name}" (${navItem.href}) has no matching Sanity page`);
            siteMap.recommendations.push({
              type: 'missing_page',
              description: `Navigation item "${navItem.name}" (${navItem.href}) has no matching Sanity page`,
              action: `Create Sanity page document with slug "${navItem.href.slice(1)}"`
            });
          }
        }
      });
    }

    // Save site map
    const siteMapPath = path.resolve(__dirname, '../../siteMap.json');
    fs.writeFileSync(siteMapPath, JSON.stringify(siteMap, null, 2));
    console.log(`\n💾 Site map saved to: ${siteMapPath}`);

    return siteMap;

  } catch (error) {
    console.error('❌ Error analyzing site structure:', error);
    throw error;
  }
}

if (require.main === module) {
  analyzeSiteStructure().catch(console.error);
}

module.exports = { analyzeSiteStructure };