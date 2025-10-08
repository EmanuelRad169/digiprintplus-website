import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'media',
  title: 'Media',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title for this media item',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description or alt text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO.',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags to help organize and find this media',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Product Images', value: 'product' },
          { title: 'Hero Images', value: 'hero' },
          { title: 'Gallery', value: 'gallery' },
          { title: 'Icons', value: 'icon' },
          { title: 'Logos', value: 'logo' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'description',
    },
    prepare({ title, media, subtitle }) {
      return {
        title: title || 'Untitled Media',
        subtitle,
        media,
      }
    },
  },
})
