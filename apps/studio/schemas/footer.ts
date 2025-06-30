import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The company name to display in the footer',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Company Description',
      type: 'text',
      description: 'A brief description of your company',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{
        type: 'object',
        name: 'footerService',
        fields: [
          defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'slug',
            title: 'URL',
            type: 'string',
            description: 'The path to the service page (e.g., /products/business-cards)',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'isVisible',
            title: 'Visible',
            type: 'boolean',
            initialValue: true
          })
        ],
        preview: {
          select: {
            title: 'label',
            subtitle: 'slug'
          }
        }
      }]
    }),
    defineField({
      name: 'quickLinks',
      title: 'Quick Links',
      type: 'array',
      of: [{
        type: 'object',
        name: 'quickLink',
        fields: [
          defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'slug',
            title: 'URL',
            type: 'string',
            description: 'The path to the page (e.g., /about)',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'isVisible',
            title: 'Visible',
            type: 'boolean',
            initialValue: true
          })
        ],
        preview: {
          select: {
            title: 'label',
            subtitle: 'slug'
          }
        }
      }]
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright Text',
      type: 'string',
      description: 'Copyright text for the footer (year will be added automatically)',
    })
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title: title || 'Footer',
        subtitle: 'Global footer settings'
      }
    }
  }
})
