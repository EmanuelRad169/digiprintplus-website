import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      options: {
        list: [
          { title: 'Statistics', value: 'statistics' },
          { title: 'Features', value: 'features' },
          { title: 'Company Story', value: 'story' },
          { title: 'Values', value: 'values' },
          { title: 'Team', value: 'team' },
          { title: 'Testimonials', value: 'testimonials' }
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'string'
    }),
    defineField({
      name: 'content',
      title: 'Section Content',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ]
    }),
    defineField({
      name: 'statistics',
      title: 'Statistics',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'number',
            title: 'Number/Value',
            type: 'string',
            validation: (rule) => rule.required()
          },
          {
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: (rule) => rule.required()
          },
          {
            name: 'icon',
            title: 'Icon Name',
            type: 'string',
            description: 'Lucide icon name'
          }
        ]
      }],
      hidden: ({ document }) => document?.sectionType !== 'statistics'
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            title: 'Feature Title',
            type: 'string',
            validation: (rule) => rule.required()
          },
          {
            name: 'description',
            title: 'Feature Description',
            type: 'text',
            validation: (rule) => rule.required()
          },
          {
            name: 'highlight',
            title: 'Highlight Text',
            type: 'string'
          },
          {
            name: 'icon',
            title: 'Icon Name',
            type: 'string',
            description: 'Lucide icon name'
          }
        ]
      }],
      hidden: ({ document }) => document?.sectionType !== 'features'
    }),
    defineField({
      name: 'image',
      title: 'Section Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text'
        }
      ]
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
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
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'sectionType',
      media: 'image',
      order: 'order'
    },
    prepare(selection) {
      const { title, subtitle, order } = selection
      return {
        title: `${order}. ${title}`,
        subtitle: subtitle?.replace('-', ' ').toUpperCase()
      }
    }
  }
})
