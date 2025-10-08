const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../apps/web/.env.local') });

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'as5tildt',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  token: process.env.SANITY_API_TOKEN || 'ski57HbdFyLtWwXmQVSv8yHYAaualTGelXvLaupzfVsBpWY6KTmKVNamVUOhb517Z16fD39I9aFBtW3pL',
  useCdn: false,
  apiVersion: '2024-01-01',
});

function escapeCSV(value) {
  if (!value) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

async function exportProductsToCSV() {
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

    console.log(`Fetched ${products.length} products. Writing to CSV...`);

    // Create CSV content
    const headers = ['Name', 'Slug', 'Description', 'Base Price', 'Category', 'Status'];
    let csvContent = headers.join(',') + '\n';

    products.forEach((product) => {
      const row = [
        escapeCSV(product.name),
        escapeCSV(product.slug),
        escapeCSV(product.description),
        escapeCSV(product.basePrice),
        escapeCSV(product.category),
        escapeCSV(product.status)
      ];
      csvContent += row.join(',') + '\n';
    });

    // Save the file
    const filePath = path.join(__dirname, '../exports/products.csv');
    fs.writeFileSync(filePath, csvContent, 'utf8');

    console.log(`Products exported successfully to ${filePath}`);
  } catch (error) {
    console.error('Error exporting products:', error);
  }
}

exportProductsToCSV();
