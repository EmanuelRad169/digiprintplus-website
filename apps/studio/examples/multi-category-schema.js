/**
 * This is a sample script that could be used to update the product schema
 * to support multiple categories if your current schema only supports a single category.
 * 
 * Important: This is just a reference implementation. You'll need to:
 * 1. Review and adapt it to your specific schema
 * 2. Back up your data before running any schema migrations
 * 3. Test in a development environment first
 */

import { defineType } from 'sanity'

// Example of how to modify the product schema to support multiple categories
export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  // Keep existing groups
  fields: [
    // Keep existing fields
    
    // Option 1: Keep the existing single category field for backward compatibility
    // and add a new field for additional categories
    {
      name: 'category',
      title: 'Primary Product Category',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'productCategory' }],
      validation: Rule => Rule.required(),
      description: 'Select the primary product category'
    },
    {
      name: 'additionalCategories',
      title: 'Additional Categories',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'reference',
          to: [{ type: 'productCategory' }]
        }
      ],
      description: 'Select any additional categories this product belongs to'
    },
    
    // Option 2: Replace the single category field with an array
    // (would require data migration)
    /*
    {
      name: 'categories',
      title: 'Product Categories',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'reference',
          to: [{ type: 'productCategory' }]
        }
      ],
      validation: Rule => Rule.required().min(1),
      description: 'Select all categories this product belongs to (first one is considered primary)'
    },
    */
    
    // Keep all other existing fields
  ],
  // Keep preview configuration, orderings, etc.
})

/**
 * Example migration script if you decide to convert from single category to array
 * (for reference only, would need to be implemented as a proper migration script)
 */
/*
import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'your-project-id',
  dataset: 'your-dataset',
  token: 'your-token', // needs write access
  useCdn: false
})

// 1. Get all products with their current category
client.fetch('*[_type == "product"]{ _id, _rev, category->{_ref} }')
  .then(products => {
    // 2. For each product, update to use the new categories array field
    return Promise.all(
      products.map(product => {
        if (!product.category) return null
        
        return client
          .patch(product._id)
          .set({
            categories: [{ _type: 'reference', _ref: product.category._ref }]
          })
          .unset(['category']) // Remove old field
          .commit({ autoGenerateArrayKeys: true })
      }).filter(Boolean)
    )
  })
  .then(result => {
    console.log(`Migrated ${result.length} products to use categories array`)
  })
  .catch(err => {
    console.error('Migration failed: ', err)
  })
*/
