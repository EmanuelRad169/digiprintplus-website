import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'template',
  title: 'Template',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'details',
      title: 'Details',
    },
    {
      name: 'files',
      title: 'Files',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Template Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'content',
      to: [{ type: 'templateCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fileType',
      title: 'File Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'PDF', value: 'PDF' },
          { title: 'Adobe Illustrator (AI)', value: 'AI' },
          { title: 'Photoshop (PSD)', value: 'PSD' },
          { title: 'InDesign (INDD)', value: 'INDD' },
          { title: 'PowerPoint (PPTX)', value: 'PPTX' },
          { title: 'Word (DOCX)', value: 'DOCX' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Dimensions/Size',
      type: 'string',
      group: 'details',
      description: 'e.g., 8.5" x 11", 3.5" x 2", A4',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Keywords to help users find this template',
    }),
    defineField({
      name: 'isPremium',
      title: 'Premium Template',
      type: 'boolean',
      group: 'details',
      initialValue: false,
      description: 'Mark as premium/paid template',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      group: 'details',
      description: 'Price in USD (leave empty for free templates)',
      hidden: ({ document }) => !document?.isPremium,
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.min(0).max(5),
      description: 'Rating out of 5 stars',
      initialValue: 5,
    }),
    defineField({
      name: 'downloadCount',
      title: 'Download Count',
      type: 'number',
      group: 'details',
      initialValue: 0,
      description: 'Number of times this template has been downloaded',
    }),
    defineField({
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      group: 'files',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for SEO and accessibility.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'additionalImages',
      title: 'Additional Preview Images',
      type: 'array',
      group: 'files',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'downloadFile',
      title: 'Download File',
      type: 'file',
      group: 'files',
      options: {
        accept: '.pdf,.ai,.psd,.indd,.pptx,.docx,.zip',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size',
      type: 'string',
      group: 'files',
      description: 'e.g., 2.5 MB, 1.2 GB',
    }),
    defineField({
      name: 'instructions',
      title: 'Usage Instructions',
      type: 'text',
      group: 'details',
      rows: 4,
      description: 'Instructions on how to use or customize this template',
    }),
    defineField({
      name: 'requiredSoftware',
      title: 'Required Software',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Adobe Illustrator', value: 'Adobe Illustrator' },
          { title: 'Adobe Photoshop', value: 'Adobe Photoshop' },
          { title: 'Adobe InDesign', value: 'Adobe InDesign' },
          { title: 'Microsoft PowerPoint', value: 'Microsoft PowerPoint' },
          { title: 'Microsoft Word', value: 'Microsoft Word' },
          { title: 'Canva', value: 'Canva' },
          { title: 'Any PDF Reader', value: 'Any PDF Reader' },
        ],
      },
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Title for search engines (if different from main title)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Description for search engines',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Most Downloaded',
      name: 'downloadCount',
      by: [{ field: 'downloadCount', direction: 'desc' }],
    },
    {
      title: 'Newest First',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Highest Rated',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      media: 'previewImage',
      fileType: 'fileType',
      isPremium: 'isPremium',
    },
    prepare({ title, subtitle, media, fileType, isPremium }) {
      return {
        title,
        subtitle: `${subtitle} • ${fileType}${isPremium ? ' • Premium' : ''}`,
        media,
      }
    },
  },
})
