import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactInfo',
  title: 'Contact Information',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Contact Type',
      type: 'string',
      options: {
        list: [
          { title: 'Phone', value: 'phone' },
          { title: 'Email', value: 'email' },
          { title: 'Address', value: 'address' },
          { title: 'Chat', value: 'chat' },
          { title: 'Social Media', value: 'social' },
          { title: 'Business Hours', value: 'hours' }
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'value',
      title: 'Contact Value',
      type: 'string',
      description: 'Phone number, email address, physical address, etc.',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'displayText',
      title: 'Display Text',
      type: 'string',
      description: 'Text to display to users (can be different from value)'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Additional information (e.g., "Available 24/7")'
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name'
    }),
    defineField({
      name: 'link',
      title: 'Link/URL',
      type: 'url',
      description: 'For clickable contact options'
    }),
    defineField({
      name: 'isMainContact',
      title: 'Main Contact Method',
      type: 'boolean',
      initialValue: false
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
      subtitle: 'value',
      type: 'type',
      order: 'order'
    },
    prepare(selection) {
      const { title, subtitle, type, order } = selection
      return {
        title: `${order}. ${title}`,
        subtitle: `${type.toUpperCase()}: ${subtitle}`
      }
    }
  }
})
