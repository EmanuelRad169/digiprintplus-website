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

// Validation functions
function validateRequiredFields(product, rowIndex) {
  const errors = [];
  
  if (!product.name || product.name.trim() === '') {
    errors.push(`Row ${rowIndex}: Name is required`);
  }
  
  if (!product.slug || product.slug.trim() === '') {
    errors.push(`Row ${rowIndex}: Slug is required`);
  }
  
  return errors;
}

function normalizeValue(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}

function compareValues(oldValue, newValue) {
  const normalizedOld = normalizeValue(oldValue);
  const normalizedNew = normalizeValue(newValue);
  return normalizedOld !== normalizedNew;
}

async function syncProductsFromExcel() {
  try {
    const filePath = path.join(__dirname, '../exports/products.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('❌ Excel file not found at:', filePath);
      console.log('💡 Please make sure products.xlsx exists in the /exports folder');
      return;
    }

    console.log('📊 Reading Excel file...');
    
    // Read the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.getWorksheet('Products');
    if (!worksheet) {
      console.error('❌ "Products" worksheet not found in the Excel file');
      return;
    }

    // Get current products from Sanity
    console.log('🔍 Fetching current products from Sanity...');
    const currentProducts = await client.fetch(`*[_type == "product"] {
      _id,
      title,
      "slug": slug.current,
      description,
      basePrice,
      "category": category->title,
      "categoryId": category._ref,
      status
    }`);

    // Create a map for quick lookup
    const productMap = new Map();
    currentProducts.forEach(product => {
      if (product.slug) {
        productMap.set(product.slug, product);
      }
    });

    console.log(`📦 Found ${currentProducts.length} products in Sanity`);

    // Process Excel rows
    const updates = [];
    const errors = [];
    const warnings = [];
    let processedCount = 0;
    let skippedCount = 0;

    // Skip header row (row 1)
    for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      
      // Skip empty rows
      if (!row.hasValues) {
        skippedCount++;
        continue;
      }

      const excelProduct = {
        name: normalizeValue(row.getCell(1).value),
        slug: normalizeValue(row.getCell(2).value),
        description: normalizeValue(row.getCell(3).value),
        basePrice: normalizeValue(row.getCell(4).value),
        category: normalizeValue(row.getCell(5).value),
        status: normalizeValue(row.getCell(6).value)
      };

      // Validate required fields
      const validationErrors = validateRequiredFields(excelProduct, rowIndex);
      if (validationErrors.length > 0) {
        errors.push(...validationErrors);
        continue;
      }

      // Find corresponding Sanity product
      const sanityProduct = productMap.get(excelProduct.slug);
      if (!sanityProduct) {
        warnings.push(`Row ${rowIndex}: Product with slug "${excelProduct.slug}" not found in Sanity (will skip)`);
        skippedCount++;
        continue;
      }

      // Check for changes
      const changes = {};
      let hasChanges = false;

      // Compare title
      if (compareValues(sanityProduct.title, excelProduct.name)) {
        changes.title = excelProduct.name;
        hasChanges = true;
      }

      // Compare description
      if (compareValues(sanityProduct.description, excelProduct.description)) {
        changes.description = excelProduct.description;
        hasChanges = true;
      }

      // Compare basePrice
      if (compareValues(sanityProduct.basePrice, excelProduct.basePrice)) {
        changes.basePrice = excelProduct.basePrice;
        hasChanges = true;
      }

      // Compare status
      if (compareValues(sanityProduct.status, excelProduct.status)) {
        changes.status = excelProduct.status;
        hasChanges = true;
      }

      // Note: Category changes are more complex as they require reference lookup
      if (compareValues(sanityProduct.category, excelProduct.category)) {
        warnings.push(`Row ${rowIndex}: Category change detected for "${excelProduct.slug}" but category updates require manual handling (current: "${sanityProduct.category}", new: "${excelProduct.category}")`);
      }

      if (hasChanges) {
        updates.push({
          _id: sanityProduct._id,
          slug: excelProduct.slug,
          changes,
          rowIndex
        });
      } else {
        skippedCount++;
      }

      processedCount++;
    }

    // Display summary
    console.log('\n📋 Processing Summary:');
    console.log(`   📊 Total rows processed: ${processedCount}`);
    console.log(`   ✅ Products with changes: ${updates.length}`);
    console.log(`   ⏭️  Products skipped: ${skippedCount}`);
    console.log(`   ⚠️  Warnings: ${warnings.length}`);
    console.log(`   ❌ Errors: ${errors.length}`);

    // Display errors
    if (errors.length > 0) {
      console.log('\n❌ Validation Errors:');
      errors.forEach(error => console.log(`   ${error}`));
    }

    // Display warnings
    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach(warning => console.log(`   ${warning}`));
    }

    // Exit if there are errors
    if (errors.length > 0) {
      console.log('\n❌ Please fix the validation errors before continuing.');
      return;
    }

    // Exit if no updates
    if (updates.length === 0) {
      console.log('\n✅ No changes detected. All products are up to date.');
      return;
    }

    // Show what will be updated
    console.log('\n🔄 Changes to be applied:');
    updates.forEach(update => {
      console.log(`   📝 Row ${update.rowIndex} (${update.slug}):`);
      Object.entries(update.changes).forEach(([field, value]) => {
        console.log(`      ${field}: "${value}"`);
      });
    });

    // Confirm before proceeding
    console.log(`\n❓ Do you want to apply these ${updates.length} changes to Sanity?`);
    console.log('   This will update the products in your Sanity dataset.');
    console.log('   Type "yes" to continue or anything else to cancel:');

    // Wait for user input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('> ', async (answer) => {
      rl.close();

      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Update cancelled by user.');
        return;
      }

      // Apply updates
      console.log('\n🚀 Applying updates to Sanity...');
      let successCount = 0;
      let failureCount = 0;

      for (const update of updates) {
        try {
          await client.patch(update._id).set(update.changes).commit();
          console.log(`   ✅ Updated: ${update.slug}`);
          successCount++;
        } catch (error) {
          console.log(`   ❌ Failed to update ${update.slug}: ${error.message}`);
          failureCount++;
        }
      }

      console.log('\n🎉 Sync Complete!');
      console.log(`   ✅ Successfully updated: ${successCount} products`);
      if (failureCount > 0) {
        console.log(`   ❌ Failed to update: ${failureCount} products`);
      }
    });

  } catch (error) {
    console.error('❌ Error syncing products:', error);
  }
}

syncProductsFromExcel();
