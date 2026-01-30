import { defineType } from 'sanity'

export default defineType({
  name: 'faqCategory',
  title: 'FAQ Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (e.g., "general", "printing", "shipping")',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    },
    {
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., "HelpCircle", "Package", "Truck")',
      options: {
        list: [
          { title: 'Help Circle', value: 'help-circle' },
          { title: 'Printer', value: 'printer' },
          { title: 'Palette', value: 'palette' },
          { title: 'Truck', value: 'truck' },
          { title: 'Dollar Sign', value: 'dollar-sign' },
          { title: 'File', value: 'file' },
          { title: 'Check Circle', value: 'check-circle' },
          { title: 'Rotate CCW', value: 'rotate-ccw' },
        ],
      },
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faq',
          title: 'FAQ Item',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'isHighlighted',
              title: 'Highlight This FAQ',
              type: 'boolean',
              description: 'Mark as a frequently asked question',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              question: 'question',
              isHighlighted: 'isHighlighted',
            },
            prepare({ question, isHighlighted }) {
              return {
                title: question,
                subtitle: isHighlighted ? '⭐ Highlighted' : undefined,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Show this category in the FAQ section',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      faqCount: 'faqs',
      order: 'order',
      isActive: 'isActive',
    },
    prepare({ title, faqCount, order, isActive }) {
      const count = Array.isArray(faqCount) ? faqCount.length : 0
      return {
        title: `${order}. ${title}`,
        subtitle: `${count} FAQ${count !== 1 ? 's' : ''} • ${isActive ? 'Active' : 'Inactive'}`,
      }
    },
  },
})
