import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ctaSection',
  title: 'Call to Action Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'primaryButton',
      title: 'Primary Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          validation: (rule) => rule.required()
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
          validation: (rule) => rule.required()
        }
      ]
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Secondary Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string'
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string'
        },
        {
          name: 'type',
          title: 'Button Type',
          type: 'string',
          options: {
            list: [
              { title: 'Phone Call', value: 'phone' },
              { title: 'Link', value: 'link' }
            ]
          }
        }
      ]
    }),
    defineField({
      name: 'highlights',
      title: 'Highlight Features',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule) => rule.max(5)
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Magenta', value: 'magenta' },
          { title: 'Blue', value: 'blue' },
          { title: 'Gray', value: 'gray' },
          { title: 'Black', value: 'black' }
        ]
      },
      initialValue: 'magenta'
    }),
    defineField({
      name: 'sectionId',
      title: 'Section Identifier',
      type: 'string',
      description: 'Unique identifier for this CTA section (e.g., "homepage-cta", "contact-cta")',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true
    })
  ],
  orderings: [
    {
      title: 'Section ID',
      name: 'sectionIdAsc',
      by: [{ field: 'sectionId', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'sectionId'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title,
        subtitle: `ID: ${subtitle}`
      }
    }
  }
})
