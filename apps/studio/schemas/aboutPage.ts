import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Subtitle text displayed in the hero section'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'content',
      title: 'Main Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Main story content about the company'
    }),
    defineField({
      name: 'achievements',
      title: 'Key Achievements',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Achievement Text' },
            { name: 'icon', type: 'string', title: 'Icon Name', options: { list: ['checkCircle', 'award', 'star', 'shield'] } }
          ]
        }
      ],
      validation: (rule) => rule.max(6)
    }),
    defineField({
      name: 'teamImage',
      title: 'Team Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'values',
      title: 'Company Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Value Title' },
            { name: 'description', type: 'text', title: 'Description' },
            { name: 'icon', type: 'string', title: 'Icon Name', options: { list: ['users', 'shield', 'clock', 'award', 'star'] } },
            { name: 'color', type: 'string', title: 'Color Theme', options: { list: ['magenta', 'blue', 'green', 'purple'] } }
          ]
        }
      ],
      validation: (rule) => rule.max(4)
    }),
    defineField({
      name: 'badge',
      title: 'Achievement Badge',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Badge Title' },
        { name: 'subtitle', type: 'string', title: 'Badge Subtitle' },
        { name: 'icon', type: 'string', title: 'Icon Name', options: { list: ['award', 'star', 'shield', 'checkCircle'] } }
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        { name: 'metaTitle', type: 'string', title: 'Meta Title' },
        { name: 'metaDescription', type: 'text', title: 'Meta Description' }
      ]
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'About Page',
        subtitle: subtitle
      }
    }
  }
})
