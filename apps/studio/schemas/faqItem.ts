import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [
        {
          type: 'block'
        }
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'category',
      title: 'FAQ Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Printing', value: 'printing' },
          { title: 'Design', value: 'design' },
          { title: 'Shipping', value: 'shipping' },
          { title: 'Pricing', value: 'pricing' },
          { title: 'File Preparation', value: 'file-preparation' },
          { title: 'Quality', value: 'quality' },
          { title: 'Returns', value: 'returns' }
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'product' }]
      }]
    }),
    defineField({
      name: 'isPopular',
      title: 'Popular FAQ',
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
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
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
