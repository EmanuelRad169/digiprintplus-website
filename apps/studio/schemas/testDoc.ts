import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testDoc',
  title: 'Test Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    })
  ]
})
