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

async function exportProducts() {
  try {
    console.log('Fetching product data from Sanity...');

    // GROQ query to fetch product data
    const query = `*[_type == "product"] {
      "name": title,
      "slug": slug.current,
      description,
      basePrice,
      "category": category->title,
      status
    }`;

    const products = await client.fetch(query);

    if (!products.length) {
      console.log('No products found.');
      return;
    }

    console.log(`Fetched ${products.length} products. Writing to Excel...`);

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Add header row
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Slug', key: 'slug', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Base Price', key: 'basePrice', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    // Add product rows
    products.forEach((product) => {
      worksheet.addRow(product);
    });

    // Save the file
    const filePath = path.join(__dirname, '../exports/products.xlsx');
    await workbook.xlsx.writeFile(filePath);

    console.log(`Products exported successfully to ${filePath}`);
  } catch (error) {
    console.error('Error exporting products:', error);
  }
}

exportProducts();
