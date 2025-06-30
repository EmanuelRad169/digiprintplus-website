import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

// Import schemas one by one to find the problematic one
import siteSettings from './schemas/siteSettings'
import navigationMenu from './schemas/navigationMenu'
import page from './schemas/page'
import about from './schemas/about'
import productCategory from './schemas/productCategory'
import product from './schemas/product'
import quoteRequest from './schemas/quoteRequest'
import user from './schemas/user'
import media from './schemas/media'
import footer from './schemas/footer'
import component from './schemas/components'

// Test schemas individually
const testSchemas = [
  siteSettings,
  navigationMenu, 
  page,
  about,
  productCategory,
  // product,
  quoteRequest,
  user,
  media,
  footer,
  component
]

export default defineConfig({
  name: 'schema-test',
  title: 'Schema Test',
  
  projectId: 'as5tildt',
  dataset: 'development',

  plugins: [
    deskTool()
  ],

  schema: {
    types: testSchemas,
  },
})
