import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'productCategory',
  title: 'Product Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description:
        'One short line shown under the category title in the hero and on the category card. Keep it to a single sentence.',
      validation: Rule => Rule.max(120).warning('Keep this under 120 characters so it stays on one or two lines.')
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Lucide icon name (e.g., "printer", "file-text")'
    }),
    defineField({
      name: 'image',
      title: 'Category Card Image',
      type: 'image',
      description:
        'Square thumbnail used on the Products grid and in the navigation menu.',
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        })
      ]
    }),
    defineField({
      name: 'heroImage',
      title: 'Category Hero Image',
      type: 'image',
      description:
        'Wide banner behind the title at the top of the category page. Use a landscape image (about 1920×600). If left empty, the card image is used instead.',
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        })
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      description:
        'Optional. Overrides what search engines show. Leave empty to fall back to the title and short description.',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: Rule => Rule.max(60).warning('Google truncates titles past ~60 characters.')
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(320).warning('Google truncates descriptions past ~160 characters.')
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' }
        })
      ]
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0
    })
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'icon'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title,
        subtitle: subtitle || 'No description'
      }
    }
  }
})