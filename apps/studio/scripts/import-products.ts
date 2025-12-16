/**
 * Product Import Script for Sanity CMS
 * 
 * Reads products from DPP_Enriched_Products.csv and imports them into Sanity
 * Usage: ts-node import-products.ts
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'as5tildt',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || 'skurOFO8xH6eqvNmmOMR0SySJmHaQeCo8jcXUFKVKJllsaOk7uCztTDbez0VmGuhxtrWWC6MauEMpbyiU',
})

// Helper function to slugify text
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace special characters with ASCII equivalents
    .replace(/×/g, 'x')           // Replace × with x
    .replace(/‑/g, '-')           // Replace special dash with regular dash
    .replace(/–/g, '-')           // Replace en-dash with regular dash
    .replace(/—/g, '-')           // Replace em-dash with regular dash
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '')           // Trim - from end of text
}

// Helper function to sanitize SKU for use as document ID
function sanitizeSKU(sku: string): string {
  return sku
    .replace(/×/g, 'x')           // Replace × with x
    .replace(/‑/g, '-')           // Replace special dash with regular dash
    .replace(/–/g, '-')           // Replace en-dash with regular dash
    .replace(/—/g, '-')           // Replace em-dash with regular dash
    .replace(/\(/g, '')           // Remove opening parenthesis
    .replace(/\)/g, '')           // Remove closing parenthesis
    .replace(/\s+/g, '-')         // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars except dash
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start
    .replace(/-+$/, '')           // Trim - from end
}

// Helper function to convert string to boolean
function toBoolean(value: string | boolean | null | undefined): boolean {
  if (typeof value === 'boolean') return value
  if (!value) return false
  const str = String(value).toLowerCase().trim()
  return str === 'true' || str === '1' || str === 'yes'
}

// Helper function to parse tags
function parseTags(tagsString: string | null | undefined): string[] {
  if (!tagsString) return []
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

interface CSVRow {
  name: string
  short_description: string
  full_description: string
  price?: string
  sku: string
  category: string
  slug?: string
  image?: string
  inStock: string | boolean
  weight?: string
  dimensions?: string
  tags?: string
  featured: string | boolean
  createdAt?: string
  updatedAt?: string
}

interface SanityProduct {
  _type: 'product'
  _id: string
  name: string
  shortDescription: string
  fullDescription: string
  price?: string
  sku: string
  category: string
  slug: {
    _type: 'slug'
    current: string
  }
  inStock: boolean
  weight?: string
  dimensions?: string
  tags?: string[]
  featured: boolean
  createdAt?: string
  updatedAt?: string
}

async function importProducts() {
  console.log('🚀 Starting Product Import to Sanity...\n')

  // Read and parse CSV file
  const csvPath = '/Users/emanuelrad/Desktop/DPP_Enriched_Products.csv'
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`)
    console.log('💡 Please ensure DPP_Enriched_Products.csv is in the correct location')
    process.exit(1)
  }

  console.log(`📂 Reading CSV from: ${csvPath}`)
  const fileContent = fs.readFileSync(csvPath, 'utf-8')

  // Parse CSV (skip first row which is a title, headers are on row 2)
  const records: CSVRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: false,
    from_line: 2, // Skip the title row
  })

  console.log(`📊 Found ${records.length} products in CSV\n`)

  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  // Process each product
  for (let i = 0; i < records.length; i++) {
    const row = records[i]
    
    try {
      // Validate required fields
      if (!row.name || !row.sku) {
        console.log(`⚠️  Row ${i + 1}: Skipping - Missing required fields (name or sku)`)
        skippedCount++
        continue
      }

      // Generate slug
      const slug = row.slug || slugify(row.name)

      // Map CSV row to Sanity product document
      const product: SanityProduct = {
        _type: 'product',
        _id: `product-${sanitizeSKU(row.sku)}`, // Use sanitized SKU as unique ID
        name: row.name,
        shortDescription: row.short_description || '',
        fullDescription: row.full_description || '',
        price: row.price || 'TBD',
        sku: row.sku,
        category: row.category || 'Uncategorized',
        slug: {
          _type: 'slug',
          current: slug,
        },
        inStock: toBoolean(row.inStock),
        weight: row.weight || undefined,
        dimensions: row.dimensions || undefined,
        tags: parseTags(row.tags),
        featured: toBoolean(row.featured),
        createdAt: row.createdAt || new Date().toISOString(),
        updatedAt: row.updatedAt || new Date().toISOString(),
      }

      // Create or update product in Sanity
      await client.createOrReplace(product)
      
      successCount++
      console.log(`✅ Row ${i + 1}: Imported "${product.name}" (${product.sku})`)
      
    } catch (error) {
      errorCount++
      console.error(`❌ Row ${i + 1}: Error importing product:`, error instanceof Error ? error.message : error)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📈 Import Summary:')
  console.log('='.repeat(50))
  console.log(`✅ Successfully imported: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`⚠️  Skipped: ${skippedCount}`)
  console.log(`📊 Total processed: ${records.length}`)
  console.log('='.repeat(50) + '\n')

  if (successCount > 0) {
    console.log('🎉 Import completed successfully!')
    console.log(`🔗 View your products at: https://manage.sanity.io/projects/${client.config().projectId}`)
  }
}

// Run the import
importProducts()
  .then(() => {
    console.log('\n✨ Script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
