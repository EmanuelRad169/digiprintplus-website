/**
 * This file provides a reference implementation for enhancing your Sanity Studio
 * desk structure to better visualize and manage products with multiple categories.
 * 
 * Add this to your structure.ts file or adapt as needed for your specific setup.
 */

import { StructureBuilder } from 'sanity/desk'
import { FolderIcon, TagIcon } from '@sanity/icons'

export const getDefaultDocumentNode = ({ schemaType }) => {
  // Add any custom document views here
  return S.document()
}

export default () => {
  return S.list()
    .title('Content')
    .items([
      // Other items in your structure...
      
      // Products section with category filters
      S.listItem()
        .title('Products')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Products')
            .items([
              // Show all products
              S.listItem()
                .title('All Products')
                .child(
                  S.documentList()
                    .title('All Products')
                    .filter('_type == "product"')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Divider
              S.divider(),
              
              // Products by category
              S.listItem()
                .title('Products by Category')
                .icon(FolderIcon)
                .child(
                  // Get all categories and create a list item for each
                  S.documentTypeList('productCategory')
                    .title('Products by Category')
                    .child(categoryId =>
                      S.documentList()
                        .title('Products')
                        .filter('_type == "product" && $categoryId in [category._ref, additionalCategories[]._ref]')
                        .params({ categoryId })
                    )
                ),
              
              // Multi-category products
              S.listItem()
                .title('Multi-Category Products')
                .child(
                  S.documentList()
                    .title('Products in Multiple Categories')
                    .filter('_type == "product" && defined(additionalCategories) && count(additionalCategories) > 0')
                )
            ])
        ),
        
      // Regular categories list
      S.documentTypeListItem('productCategory').title('Product Categories'),
      
      // Other document types...
    ])
}

/**
 * If you're using a basic structure, you can add this filter to your desk structure:
 * 
 * Example for basic structure:
 * 
 * export default () => 
 *   S.list()
 *     .title('Content')
 *     .items([
 *       // Other items...
 *       
 *       S.listItem()
 *         .title('Multi-Category Products')
 *         .child(
 *           S.documentList()
 *             .title('Products in Multiple Categories')
 *             .filter('_type == "product" && defined(additionalCategories) && count(additionalCategories) > 0')
 *         ),
 *         
 *       // Other items...
 *     ])
 */
