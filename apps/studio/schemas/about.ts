import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Brief description or tagline',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
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
    }),
    defineField({
      name: 'content',
      title: 'Main Content',
      type: 'array',
      of: [
        defineArrayMember({
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
              defineField({
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  defineField({
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          title: 'Image',
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
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    {
      name: 'services',
      title: 'Services Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Services',
        },
        {
          name: 'items',
          title: 'Service Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Service Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Service Description',
                  type: 'text',
                  rows: 2,
                },
                {
                  name: 'icon',
                  title: 'Icon Name',
                  type: 'string',
                  description: 'Lucide icon name (e.g., "printer", "image", "file-text")',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'whyChooseUs',
      title: 'Why Choose Us Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Why Choose Us?',
        },
        {
          name: 'items',
          title: 'Benefits',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Benefit Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Benefit Description',
                  type: 'text',
                  rows: 2,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'stats',
      title: 'Statistics Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Numbers',
        },
        {
          name: 'items',
          title: 'Statistics',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Number',
                  type: 'string',
                  description: 'e.g., "15+", "1000+", "24/7"',
                },
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  description: 'e.g., "Years Experience", "Happy Customers"',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'teamSection',
      title: 'Team Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Meet Our Team',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
          rows: 2,
        },
        {
          name: 'members',
          title: 'Team Members',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Name',
                  type: 'string',
                },
                {
                  name: 'role',
                  title: 'Role/Position',
                  type: 'string',
                },
                {
                  name: 'image',
                  title: 'Photo',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  fields: [
                    {
                      name: 'alt',
                      title: 'Alternative Text',
                      type: 'string',
                    },
                  ],
                },
                {
                  name: 'bio',
                  title: 'Bio',
                  type: 'text',
                  rows: 3,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'cta',
      title: 'Call to Action Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          initialValue: 'Ready to get started?',
        },
        {
          name: 'description',
          title: 'CTA Description',
          type: 'text',
          rows: 2,
        },
        {
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'url',
              title: 'Button URL',
              type: 'string',
            },
          ],
        },
        {
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'url',
              title: 'Button URL',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'SEO title for search engines and social sharing',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Brief description for search engines and social sharing',
          rows: 3,
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      subtitle: 'subtitle',
    },
    prepare(selection) {
      const { title, slug, subtitle } = selection;
      return {
        title,
        subtitle: subtitle || (slug ? `/${slug}` : 'No slug'),
      };
    },
  },
});
