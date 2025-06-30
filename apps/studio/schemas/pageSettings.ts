import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pageSettings',
  title: 'Page Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'pageId',
      title: 'Page Identifier',
      type: 'string',
      description: 'Unique identifier for the page (e.g., "contact", "about", "services")',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'sections',
      title: 'Section Titles',
      type: 'object',
      fields: [
        { name: 'contactInfo', type: 'string', title: 'Contact Information Section', initialValue: 'Contact Information' },
        { name: 'businessHours', type: 'string', title: 'Business Hours Section', initialValue: 'Business Hours' },
        { name: 'servicesList', type: 'string', title: 'Services List Section', initialValue: 'Our Services' },
        { name: 'aboutUs', type: 'string', title: 'About Us Section', initialValue: 'About Us' }
      ]
    })
  ]
})
