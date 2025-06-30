import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Basic Info',
      default: true
    },
    {
      name: 'content',
      title: 'Content & Features',
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      group: 'basic',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    })
  ]
})
