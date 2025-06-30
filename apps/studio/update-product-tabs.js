// Test script to update a product with tabbed content
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'as5tildt',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-05-03',
})

async function updateProductWithTabs() {
  try {
    // First, get a product to update
    const products = await client.fetch('*[_type == "product"][0...5]')
    console.log('Found products:', products.map(p => ({ id: p._id, title: p.title, slug: p.slug?.current })))
    
    if (products.length === 0) {
      console.log('No products found to update')
      return
    }

    console.log('Products found, but cannot update without write token')
    
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

updateProductWithTabs()
