import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'component',
  title: 'Components',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name of the component',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A unique identifier for this component',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'componentType',
      title: 'Component Type',
      type: 'string',
      options: {
        list: [
          { title: 'Hero', value: 'hero' },
          { title: 'CTA', value: 'cta' },
          { title: 'Testimonials', value: 'testimonials' },
          { title: 'Features', value: 'features' },
          { title: 'Pricing', value: 'pricing' },
          { title: 'FAQ', value: 'faq' },
          { title: 'Gallery', value: 'gallery' },
          { title: 'Stats', value: 'stats' },
          { title: 'Team', value: 'team' },
          { title: 'Contact Form', value: 'contactForm' },
          { title: 'Banner', value: 'banner' },
          { title: 'Custom', value: 'custom' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the component and its purpose'
    }),
    // Hero component fields
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      hidden: ({ document }) => document?.componentType !== 'hero'
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      hidden: ({ document }) => document?.componentType !== 'hero'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ],
      hidden: ({ document }) => document?.componentType !== 'hero'
    }),
    defineField({
      name: 'heroButtons',
      title: 'Hero CTA Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', title: 'Button Text', type: 'string' },
            { name: 'url', title: 'Button URL', type: 'string' },
            { 
              name: 'style', 
              title: 'Button Style', 
              type: 'string',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                  { title: 'Ghost', value: 'ghost' }
                ]
              }
            }
          ]
        }
      ],
      hidden: ({ document }) => document?.componentType !== 'hero'
    }),

    // CTA component fields
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      hidden: ({ document }) => document?.componentType !== 'cta'
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      hidden: ({ document }) => document?.componentType !== 'cta'
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      hidden: ({ document }) => document?.componentType !== 'cta'
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'CTA Button URL',
      type: 'string',
      hidden: ({ document }) => document?.componentType !== 'cta'
    }),
    defineField({
      name: 'ctaBackgroundColor',
      title: 'CTA Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Dark', value: 'dark' },
          { title: 'Light', value: 'light' }
        ]
      },
      hidden: ({ document }) => document?.componentType !== 'cta'
    }),

    // Testimonials component fields
    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials Section Heading',
      type: 'string',
      hidden: ({ document }) => document?.componentType !== 'testimonials'
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'quote', title: 'Quote', type: 'text' },
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'title', title: 'Title/Position', type: 'string' },
            { 
              name: 'avatar', 
              title: 'Avatar', 
              type: 'image',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string'
                }
              ]
            },
            { name: 'company', title: 'Company', type: 'string' }
          ]
        }
      ],
      hidden: ({ document }) => document?.componentType !== 'testimonials'
    }),

    // Features component fields
    defineField({
      name: 'featuresHeading',
      title: 'Features Section Heading',
      type: 'string',
      hidden: ({ document }) => document?.componentType !== 'features'
    }),
    defineField({
      name: 'featuresSubheading',
      title: 'Features Section Subheading',
      type: 'text',
      hidden: ({ document }) => document?.componentType !== 'features'
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Feature Title', type: 'string' },
            { name: 'description', title: 'Feature Description', type: 'text' },
            { name: 'icon', title: 'Feature Icon Name', type: 'string', description: 'Name of Lucide icon to use' },
            { 
              name: 'image', 
              title: 'Feature Image', 
              type: 'image',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ],
      hidden: ({ document }) => document?.componentType !== 'features'
    }),

    // FAQ component fields
    defineField({
      name: 'faqHeading',
      title: 'FAQ Section Heading',
      type: 'string',
      hidden: ({ document }) => document?.componentType !== 'faq'
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' }
          ]
        }
      ],
      hidden: ({ document }) => document?.componentType !== 'faq'
    }),

    // Custom component content
    defineField({
      name: 'customContent',
      title: 'Custom Content',
      type: 'array',
      of: [
        { type: 'block' },
        { 
          type: 'image',
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string'
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            }
          ]
        }
      ],
      hidden: ({ document }) => document?.componentType !== 'custom'
    }),

    // Component settings (applied to all component types)
    defineField({
      name: 'settings',
      title: 'Component Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'paddingTop',
          title: 'Padding Top',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Small', value: 'sm' },
              { title: 'Medium', value: 'md' },
              { title: 'Large', value: 'lg' },
              { title: 'Extra Large', value: 'xl' }
            ]
          },
          initialValue: 'md'
        }),
        defineField({
          name: 'paddingBottom',
          title: 'Padding Bottom',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Small', value: 'sm' },
              { title: 'Medium', value: 'md' },
              { title: 'Large', value: 'lg' },
              { title: 'Extra Large', value: 'xl' }
            ]
          },
          initialValue: 'md'
        }),
        defineField({
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'White', value: 'white' },
              { title: 'Light', value: 'light' },
              { title: 'Dark', value: 'dark' },
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' }
            ]
          },
          initialValue: 'none'
        }),
        defineField({
          name: 'textColor',
          title: 'Text Color',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'White', value: 'white' },
              { title: 'Dark', value: 'dark' },
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' }
            ]
          },
          initialValue: 'default'
        }),
        defineField({
          name: 'fullWidth',
          title: 'Full Width',
          type: 'boolean',
          initialValue: false
        }),
        defineField({
          name: 'customClasses',
          title: 'Custom CSS Classes',
          type: 'string',
          description: 'Add custom CSS classes to the component container'
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      type: 'componentType'
    },
    prepare({ title, type }) {
      return {
        title: title || 'Untitled Component',
        subtitle: type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Component` : 'Component'
      }
    }
  }
})
