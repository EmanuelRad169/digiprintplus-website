import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'navigationMenu',
  title: 'Navigation Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Menu Title',
      type: 'string',
      description: 'A descriptive name for the menu (e.g., "Main Navigation")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      description: 'Add and organize your navigation menu items',
      of: [
        {
          type: 'object',
          name: 'navigationItem',
          title: 'Navigation Item',
          fields: [
            defineField({ 
              name: 'name', 
              title: 'Name', 
              type: 'string', 
              validation: (Rule) => Rule.required(),
              description: 'The text that will appear in the menu' 
            }),
            defineField({ 
              name: 'href', 
              title: 'URL (href)', 
              type: 'string', 
              validation: (Rule) => Rule.required(),
              description: 'The link destination (e.g., /about, /products). For product categories, always use format: /products/category/[slug]' 
            }),
            defineField({ 
              name: 'order', 
              title: 'Order', 
              type: 'number', 
              description: 'Sort order for the item (e.g., 1, 2, 3).',
              initialValue: 1
            }),
            defineField({ 
              name: 'isVisible', 
              title: 'Visible', 
              type: 'boolean', 
              initialValue: true,
              description: 'Show/hide this menu item' 
            }),
            defineField({ 
              name: 'openInNewTab', 
              title: 'Open in New Tab', 
              type: 'boolean', 
              initialValue: false,
              description: 'Open link in a new browser tab' 
            }),
            defineField({
              name: 'submenu',
              title: 'Submenu',
              type: 'array',
              of: [{
                type: 'object',
                name: 'submenuItem',
                title: 'Submenu Item',
                fields: [
                  defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
                  defineField({ name: 'href', title: 'URL (href)', type: 'string', validation: (Rule) => Rule.required(), description: 'For product categories, always use format: /products/category/[slug] (e.g., /products/category/business-cards)' }),
                  defineField({ name: 'description', title: 'Description', type: 'string' }),
                  defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
                  defineField({ name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean', initialValue: false }),
                ],
              }],
            }),
            defineField({
              name: 'megaMenu',
              title: 'Mega Menu',
              type: 'array',
              of: [{
                type: 'object',
                name: 'megaMenuSection',
                title: 'Mega Menu Section',
                fields: [
                  defineField({ name: 'sectionTitle', title: 'Section Title', type: 'string', validation: (Rule) => Rule.required() }),
                  defineField({ name: 'sectionDescription', title: 'Section Description', type: 'string' }),
                  defineField({
                    name: 'links',
                    title: 'Links',
                    type: 'array',
                    of: [{
                      type: 'object',
                      name: 'megaMenuLink',
                      title: 'Mega Menu Link',
                      fields: [
                        defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'href', title: 'URL (href)', type: 'string', validation: (Rule) => Rule.required(), description: 'For product categories, always use format: /products/category/[slug] (e.g., /products/category/business-cards)' }),
                        defineField({ name: 'description', title: 'Description', type: 'string' }),
                        defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
                        defineField({ name: 'isHighlighted', title: 'Highlighted', type: 'boolean', initialValue: false }),
                        defineField({ name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean', initialValue: false }),
                      ],
                    }],
                  }),
                ],
              }],
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'href',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Untitled',
                subtitle: subtitle || '',
              }
            }
          }
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({ title, items }) {
      const itemCount = items ? items.length : 0
      return {
        title: title || 'Untitled Menu',
        subtitle: `${itemCount} item(s)`,
      }
    },
  },
})