import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'finishingPage',
  title: 'Finishing Page',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'settings',
      title: 'Settings',
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      initialValue: 'Finishing',
      validation: Rule => Rule.required(),
      description: 'The main title of the finishing page'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context)
      },
      initialValue: {
        current: 'finishing'
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly version of the title (e.g., finishing)'
    }),
    defineField({
      name: 'heroText',
      title: 'Hero Text',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        }
      ],
      description: 'Hero section text content'
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        }
      ],
      description: 'Main content describing finishing services'
    }),
    defineField({
      name: 'finishingServices',
      title: 'Finishing Services',
      type: 'array',
      group: 'content',
      initialValue: [
        { serviceName: 'Stapling', description: 'Professional stapling services for document binding', icon: '📎', featured: false },
        { serviceName: 'Numbering', description: 'Sequential numbering for forms and documents', icon: '🔢', featured: false },
        { serviceName: 'Variable Data', description: 'Personalized printing with variable text and images', icon: '📊', featured: true },
        { serviceName: 'Perfect Bind Books', description: 'Professional book binding with perfect spine', icon: '📚', featured: true },
        { serviceName: 'Plastic Coil Bind', description: 'Durable plastic coil binding for presentations', icon: '🌀', featured: false },
        { serviceName: 'Plastic Com Bind', description: 'Plastic comb binding for easy page turning', icon: '🔗', featured: false },
        { serviceName: 'Double Wire-O Bind', description: 'Wire-O binding for lay-flat functionality', icon: '🔗', featured: false },
        { serviceName: 'Velo Bind', description: 'VeloBind hot knife binding system', icon: '🔥', featured: false },
        { serviceName: 'Folding', description: 'Professional paper folding services', icon: '📄', featured: false },
        { serviceName: 'Score and Perforation', description: 'Precise scoring and perforation for clean folds', icon: '✂️', featured: false },
        { serviceName: 'Index Tabs', description: 'Custom index tabs for organization', icon: '📑', featured: false },
        { serviceName: 'Collate', description: 'Document collating and assembly services', icon: '📋', featured: false },
        { serviceName: 'Drilling (Round corners, ID Badge Hole Punch)', description: 'Custom drilling services for various applications', icon: '🔨', featured: false },
        { serviceName: 'Die-Cut', description: 'Custom die-cutting for unique shapes', icon: '✂️', featured: true },
        { serviceName: 'Emboss', description: 'Raised embossing for premium finishes', icon: '🎨', featured: false },
        { serviceName: 'Foil-Stamp', description: 'Metallic foil stamping for elegant presentation', icon: '✨', featured: true },
        { serviceName: 'Mount', description: 'Professional mounting on various substrates', icon: '🖼️', featured: false },
        { serviceName: 'Laminate (Soft-Touch, Silk Lam)', description: 'Protective and aesthetic lamination options', icon: '🛡️', featured: true },
        { serviceName: 'UV Coat', description: 'UV coating for durability and shine', icon: '☀️', featured: false },
        { serviceName: 'Shrink-Wrap', description: 'Protective shrink-wrap packaging', icon: '📦', featured: false },
        { serviceName: 'Coil Binding', description: 'Flexible coil binding for documents', icon: '🌀', featured: false },
        { serviceName: 'Comb Binding', description: 'Easy-to-use comb binding system', icon: '🔗', featured: false },
        { serviceName: 'Perfect Binding', description: 'Professional perfect binding for books', icon: '📖', featured: false },
        { serviceName: 'Types of Folds', description: 'Various professional folding options', icon: '📐', featured: false }
      ],
      of: [
        {
          type: 'object',
          name: 'finishingService',
          title: 'Finishing Service',
          fields: [
            {
              name: 'serviceName',
              title: 'Service Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Service Description',
              type: 'text',
              rows: 3,
              description: 'Brief description of the finishing service'
            },
            {
              name: 'icon',
              title: 'Service Icon',
              type: 'string',
              description: 'Icon name or emoji to represent this service'
            },
            {
              name: 'featured',
              title: 'Featured Service',
              type: 'boolean',
              description: 'Mark this service as featured to highlight it'
            }
          ],
          preview: {
            select: {
              title: 'serviceName',
              subtitle: 'description',
              media: 'icon'
            },
            prepare(selection) {
              const { title, subtitle } = selection
              return {
                title,
                subtitle: subtitle ? subtitle.substring(0, 50) + '...' : 'No description'
              }
            }
          }
        }
      ],
      description: 'List of finishing services offered'
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for SEO and accessibility.',
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
      description: 'Main image for the finishing page'
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'SEO title for search engines and social sharing'
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Brief description for search engines and social sharing',
          rows: 3
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing',
          options: {
            hotspot: true,
          },
        }
      ]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
      description: 'When this page was published'
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
      description: 'Whether this page is active and visible on the website'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'featuredImage'
    },
    prepare(selection) {
      const { title, slug, media } = selection
      return {
        title,
        subtitle: slug ? `/${slug}` : 'No slug',
        media
      }
    },
  },
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: 'Published Date, New',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    }
  ]
})