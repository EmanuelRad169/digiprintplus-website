import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { assist } from '@sanity/assist'
import deskStructure from './structure'

export default defineConfig({
  name: 'digiprintplus-studio',
  title: 'DigiPrintPlus Admin',
  
  projectId: 'as5tildt',
  dataset: 'development',

  plugins: [
    deskTool({
      structure: deskStructure
    }),
    visionTool({
      defaultApiVersion: '2023-05-03'
    }),
    assist(),
  ],

  schema: {
    types: schemaTypes,
  },
})