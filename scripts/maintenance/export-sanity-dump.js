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

// Convert portable text blocks to plain text
function blocksToText(blocks) {
  if (!Array.isArray(blocks)) return '';
  
  return blocks
    .filter(block => block._type === 'block')
    .map(block => {
      if (!block.children) return '';
      return block.children
        .filter(child => child._type === 'span')
        .map(span => span.text || '')
        .join('');
    })
    .join('\n\n');
}

// Convert portable text blocks to markdown
function blocksToMarkdown(blocks) {
  if (!Array.isArray(blocks)) return '';
  
  return blocks
    .map(block => {
      if (block._type === 'block') {
        if (!block.children) return '';
        
        const text = block.children
          .filter(child => child._type === 'span')
          .map(span => {
            let text = span.text || '';
            if (span.marks && span.marks.includes('strong')) {
              text = `**${text}**`;
            }
            if (span.marks && span.marks.includes('em')) {
              text = `*${text}*`;
            }
            return text;
          })
          .join('');
        
        // Handle different block styles
        const style = block.style || 'normal';
        switch (style) {
          case 'h1':
            return `# ${text}`;
          case 'h2':
            return `## ${text}`;
          case 'h3':
            return `### ${text}`;
          case 'h4':
            return `#### ${text}`;
          case 'h5':
            return `##### ${text}`;
          case 'h6':
            return `###### ${text}`;
          case 'blockquote':
            return `> ${text}`;
          default:
            return text;
        }
      }
      return '';
    })
    .filter(text => text.trim())
    .join('\n\n');
}

// Flatten nested objects and arrays
function flattenValue(value, prefix = '', maxDepth = 3, currentDepth = 0) {
  const result = {};
  
  if (currentDepth >= maxDepth) {
    result[prefix || 'value'] = JSON.stringify(value);
    return result;
  }
  
  if (value === null || value === undefined) {
    result[prefix || 'value'] = null;
    return result;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    result[prefix || 'value'] = value;
    return result;
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      result[prefix || 'array'] = null;
      return result;
    }
    
    // Check if array contains portable text blocks
    if (value.some(item => item._type === 'block')) {
      result[`${prefix}_text`] = blocksToText(value);
      result[`${prefix}_markdown`] = blocksToMarkdown(value);
      return result;
    }
    
    // For other arrays, flatten each item
    value.forEach((item, index) => {
      const itemPrefix = prefix ? `${prefix}_${index}` : `item_${index}`;
      const flattened = flattenValue(item, itemPrefix, maxDepth, currentDepth + 1);
      Object.assign(result, flattened);
    });
    
    return result;
  }
  
  if (typeof value === 'object' && value !== null) {
    // Handle special Sanity objects
    if (value._type === 'reference') {
      result[`${prefix}_ref`] = value._ref;
      if (value._key) result[`${prefix}_key`] = value._key;
      return result;
    }
    
    if (value._type === 'slug') {
      result[`${prefix}_slug`] = value.current;
      return result;
    }
    
    if (value._type === 'image' || value._type === 'file') {
      if (value.asset) {
        result[`${prefix}_asset_ref`] = value.asset._ref;
      }
      if (value.alt) result[`${prefix}_alt`] = value.alt;
      if (value.caption) result[`${prefix}_caption`] = value.caption;
      return result;
    }
    
    // Flatten regular objects
    Object.entries(value).forEach(([key, val]) => {
      const newPrefix = prefix ? `${prefix}_${key}` : key;
      const flattened = flattenValue(val, newPrefix, maxDepth, currentDepth + 1);
      Object.assign(result, flattened);
    });
    
    return result;
  }
  
  result[prefix || 'value'] = String(value);
  return result;
}

// Get referenced document titles
async function enrichReferences(documents) {
  console.log('🔗 Resolving references...');
  
  // Collect all reference IDs
  const refIds = new Set();
  documents.forEach(doc => {
    JSON.stringify(doc, (key, value) => {
      if (value && typeof value === 'object' && value._type === 'reference' && value._ref) {
        refIds.add(value._ref);
      }
      return value;
    });
  });
  
  if (refIds.size === 0) return documents;
  
  // Fetch referenced documents
  const referencedDocs = await client.fetch(
    `*[_id in $ids] { _id, _type, title, name, slug }`
    , { ids: Array.from(refIds) }
  );
  
  const refMap = new Map();
  referencedDocs.forEach(doc => {
    const title = doc.title || doc.name || doc.slug?.current || doc._id;
    refMap.set(doc._id, { title, type: doc._type });
  });
  
  // Enrich documents with reference titles
  return documents.map(doc => {
    const enriched = JSON.parse(JSON.stringify(doc), (key, value) => {
      if (value && typeof value === 'object' && value._type === 'reference' && value._ref) {
        const ref = refMap.get(value._ref);
        return {
          ...value,
          _title: ref?.title || value._ref,
          _refType: ref?.type || 'unknown'
        };
      }
      return value;
    });
    return enriched;
  });
}

async function exportAllDocuments() {
  try {
    console.log('🚀 Starting complete Sanity dataset export...');
    
    // Get all document types first
    console.log('📋 Fetching document types...');
    const documentTypes = await client.fetch(`
      array::unique(*[]._type)
    `);
    
    console.log(`📊 Found ${documentTypes.length} document types:`, documentTypes.join(', '));
    
    // Fetch all documents
    console.log('📦 Fetching all documents...');
    const allDocuments = await client.fetch(`*[!(_id in path("drafts.**"))] {
      ...,
      "references": *[references(^._id)] {_id, _type, title, name}
    }`);
    
    console.log(`📄 Found ${allDocuments.length} total documents`);
    
    // Enrich with reference titles
    const enrichedDocuments = await enrichReferences(allDocuments);
    
    // Create workbook
    console.log('📝 Creating Excel workbook...');
    const workbook = new ExcelJS.Workbook();
    
    // Group documents by type
    const documentsByType = {};
    enrichedDocuments.forEach(doc => {
      const type = doc._type || 'unknown';
      if (!documentsByType[type]) {
        documentsByType[type] = [];
      }
      documentsByType[type].push(doc);
    });
    
    // Create overview worksheet
    const overviewSheet = workbook.addWorksheet('Overview');
    overviewSheet.columns = [
      { header: 'Document Type', key: 'type', width: 30 },
      { header: 'Count', key: 'count', width: 10 },
      { header: 'Sample Fields', key: 'fields', width: 80 }
    ];
    
    Object.entries(documentsByType).forEach(([type, docs]) => {
      const sampleDoc = docs[0];
      const sampleFields = Object.keys(sampleDoc).slice(0, 10).join(', ');
      overviewSheet.addRow({
        type,
        count: docs.length,
        fields: sampleFields
      });
    });
    
    // Create worksheet for each document type
    Object.entries(documentsByType).forEach(([type, documents]) => {
      console.log(`📋 Processing ${type} (${documents.length} documents)...`);
      
      // Collect all possible fields from all documents of this type
      const allFields = new Set(['_type', '_id', '_createdAt', '_updatedAt', '_rev']);
      documents.forEach(doc => {
        const flattened = flattenValue(doc);
        Object.keys(flattened).forEach(key => allFields.add(key));
      });
      
      const fieldsList = Array.from(allFields).sort();
      
      // Create worksheet
      const worksheet = workbook.addWorksheet(type.substring(0, 31)); // Excel sheet name limit
      
      // Set up columns
      const columns = fieldsList.map(field => ({
        header: field,
        key: field,
        width: Math.min(Math.max(field.length + 5, 15), 50)
      }));
      worksheet.columns = columns;
      
      // Add data rows
      documents.forEach(doc => {
        const flattened = flattenValue(doc);
        const row = {};
        fieldsList.forEach(field => {
          let value = flattened[field];
          
          // Convert dates to readable format
          if (field.includes('createdAt') || field.includes('updatedAt')) {
            if (value) {
              try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  value = date.toISOString().split('T')[0];
                }
              } catch (e) {
                // Keep original value if date conversion fails
              }
            }
          }
          
          // Truncate very long values
          if (typeof value === 'string' && value.length > 32767) {
            value = value.substring(0, 32760) + '...';
          }
          
          row[field] = value;
        });
        worksheet.addRow(row);
      });
      
      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    });
    
    // Create all documents sheet (limited fields)
    console.log('📋 Creating combined view...');
    const allSheet = workbook.addWorksheet('All Documents');
    allSheet.columns = [
      { header: '_type', key: '_type', width: 20 },
      { header: '_id', key: '_id', width: 30 },
      { header: 'title', key: 'title', width: 40 },
      { header: 'name', key: 'name', width: 30 },
      { header: 'slug', key: 'slug', width: 30 },
      { header: '_createdAt', key: '_createdAt', width: 15 },
      { header: '_updatedAt', key: '_updatedAt', width: 15 },
      { header: 'description', key: 'description', width: 50 }
    ];
    
    enrichedDocuments.forEach(doc => {
      const flattened = flattenValue(doc);
      allSheet.addRow({
        _type: doc._type,
        _id: doc._id,
        title: flattened.title || flattened.name || '',
        name: flattened.name || '',
        slug: flattened.slug_current || flattened.slug || '',
        _createdAt: doc._createdAt ? (() => {
          try {
            const date = new Date(doc._createdAt);
            return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : doc._createdAt;
          } catch (e) {
            return doc._createdAt;
          }
        })() : '',
        _updatedAt: doc._updatedAt ? (() => {
          try {
            const date = new Date(doc._updatedAt);
            return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : doc._updatedAt;
          } catch (e) {
            return doc._updatedAt;
          }
        })() : '',
        description: flattened.description || ''
      });
    });
    
    // Style headers
    allSheet.getRow(1).font = { bold: true };
    allSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Save the file
    const filePath = path.join(__dirname, '../exports/sanity-dump.xlsx');
    await workbook.xlsx.writeFile(filePath);
    
    console.log('\n🎉 Export Complete!');
    console.log(`📁 File saved: ${filePath}`);
    console.log(`📊 Total documents: ${allDocuments.length}`);
    console.log(`📋 Document types: ${Object.keys(documentsByType).length}`);
    console.log(`📄 Worksheets created: ${workbook.worksheets.length}`);
    
    console.log('\n📋 Worksheets:');
    workbook.worksheets.forEach(sheet => {
      console.log(`   - ${sheet.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error exporting documents:', error);
  }
}

exportAllDocuments();
