const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
require('dotenv').config({ path: path.join(__dirname, '../apps/web/.env.local') });

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'as5tildt',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  token: process.env.SANITY_API_TOKEN || 'ski57HbdFyLtWwXmQVSv8yHYAaualTGelXvLaupzfVsBpWY6KTmKVNamVUOhb517Z16fD39I9aFBtW3pL',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function syncProductsAuto() {
  try {
    const filePath = path.join(__dirname, '../exports/products.xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ Excel file not found at:', filePath);
      return;
    }

    console.log('📊 Reading Excel file...');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Products');

    console.log('🔍 Fetching current products from Sanity...');
    const currentProducts = await client.fetch(`*[_type == "product"] {
      _id,
      title,
      "slug": slug.current,
      description,
      basePrice,
      status
    }`);

    const productMap = new Map();
    currentProducts.forEach(product => {
      if (product.slug) {
        productMap.set(product.slug, product);
      }
    });

    const updates = [];
    let processedCount = 0;

    for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      if (!row.hasValues) continue;

      const excelProduct = {
        name: row.getCell(1).value?.toString()?.trim(),
        slug: row.getCell(2).value?.toString()?.trim(),
        description: row.getCell(3).value?.toString()?.trim(),
        basePrice: row.getCell(4).value,
        status: row.getCell(6).value?.toString()?.trim()
      };

      if (!excelProduct.slug) continue;

      const sanityProduct = productMap.get(excelProduct.slug);
      if (!sanityProduct) continue;

      const changes = {};
      let hasChanges = false;

      if (sanityProduct.title !== excelProduct.name && excelProduct.name) {
        changes.title = excelProduct.name;
        hasChanges = true;
      }

      if (sanityProduct.description !== excelProduct.description) {
        changes.description = excelProduct.description || null;
        hasChanges = true;
      }

      if (sanityProduct.basePrice !== excelProduct.basePrice) {
        changes.basePrice = excelProduct.basePrice || null;
        hasChanges = true;
      }

      if (sanityProduct.status !== excelProduct.status && excelProduct.status) {
        changes.status = excelProduct.status;
        hasChanges = true;
      }

      if (hasChanges) {
        updates.push({
          _id: sanityProduct._id,
          slug: excelProduct.slug,
          changes
        });
      }

      processedCount++;
    }

    console.log(`📋 Processed ${processedCount} rows, found ${updates.length} updates`);

    if (updates.length === 0) {
      console.log('✅ No changes detected.');
      return;
    }

    console.log('🚀 Applying updates...');
    let successCount = 0;

    for (const update of updates) {
      try {
        await client.patch(update._id).set(update.changes).commit();
        console.log(`✅ Updated: ${update.slug}`);
        successCount++;
      } catch (error) {
        console.log(`❌ Failed: ${update.slug} - ${error.message}`);
      }
    }

    console.log(`🎉 Complete! Updated ${successCount}/${updates.length} products`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Check if --auto flag is provided
const isAutoMode = process.argv.includes('--auto');

if (isAutoMode) {
  syncProductsAuto();
} else {
  console.log('Use --auto flag for automatic sync without confirmation');
  console.log('Example: node tools/sync-products-from-excel-auto.js --auto');
}
