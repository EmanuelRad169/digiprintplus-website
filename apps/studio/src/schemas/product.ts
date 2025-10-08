import { defineType, defineArrayMember, defineField } from 'sanity'

const blockContent = defineArrayMember({
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'Heading 2', value: 'h2'},
    {title: 'Heading 3', value: 'h3'},
    {title: 'Heading 4', value: 'h4'},
  ],
  lists: [
    {title: 'Bullet', value: 'bullet'},
    {title: 'Number', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Strong', value: 'strong'},
      {title: 'Emphasis', value: 'em'},
    ],
  },
})

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Basic Info',
      default: true
    },
    {
      name: 'content',
      title: 'Content & Features',
    },
    {
      name: 'media',
      title: 'Images & Gallery',
    },
    {
      name: 'quoting',
      title: 'Quote Options',
    },
    {
      name: 'social',
      title: 'Social Proof',
    },
    {
      name: 'trust',
      title: 'Trust Indicators',
    },
    {
      name: 'seo',
      title: 'SEO & Meta',
    }
  ],
  fields: [
    // Basic Information
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      group: 'basic',
      validation: Rule => Rule.required().max(80),
      description: 'Product name as it will appear on the website (max 80 characters for SEO)'
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 96)
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly version of the product name'
    }),
    defineField({
      name: 'category',
      title: 'Product Category',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'productCategory' }],
      validation: Rule => Rule.required(),
      description: 'Select the primary product category'
    }),
    defineField({
      name: 'additionalCategories',
      title: 'Additional Categories',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'reference',
          to: [{ type: 'productCategory' }]
        }
      ],
      description: 'Select any additional categories this product belongs to'
    }),
    defineField({
      name: 'tags',
      title: 'Product Tags',
      type: 'array',
      group: 'basic',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      description: 'Add relevant tags for better organization and filtering'
    }),
    defineField({
      name: 'status',
      title: 'Product Status',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Active', value: 'active' },
          { title: 'Discontinued', value: 'discontinued' },
          { title: 'Coming Soon', value: 'coming-soon' }
        ]
      },
      initialValue: 'draft',
      validation: Rule => Rule.required()
    }),

    // Content & Features
    defineField({
      name: 'productDetails',
      title: 'Product Details',
      type: 'array',
      group: 'content',
      of: [blockContent],
      description: 'Main product details with rich text formatting'
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: Rule => Rule.required().min(50).max(160),
      description: 'Brief product description for listings (50-160 characters)'
    }),
    defineField({
      name: 'detailedSpecs',
      title: 'Detailed Specifications',
      type: 'array',
      group: 'content',
      of: [blockContent],
      description: 'Detailed specifications with rich text formatting'
    }),
    defineField({
      name: 'specifications',
      title: 'Quick Specifications',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'unit',
              title: 'Unit',
              type: 'string'
            })
          ]
        })
      ],
      description: 'Key-value specifications list'
    }),
    defineField({
      name: 'template',
      title: 'Product Template',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'hasTemplate',
          title: 'Has Template',
          type: 'boolean',
          initialValue: false
        }),
        defineField({
          name: 'description',
          title: 'Template Description',
          type: 'text',
          rows: 3
        }),
        defineField({
          name: 'previewImage',
          title: 'Preview Image',
          type: 'image',
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
          name: 'downloadFile',
          title: 'Template File',
          type: 'file'
        }),
        defineField({
          name: 'htmlEmbed',
          title: 'HTML Preview',
          type: 'text',
          description: 'HTML code for template preview'
        })
      ]
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
              validation: Rule => Rule.required()
            })
          ]
        })
      ],
      description: 'Frequently asked questions about this product'
    }),

    // Media & Gallery
    defineField({
      name: 'image',
      title: 'Main Product Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: Rule => Rule.required(),
          description: 'Describe the image for accessibility and SEO'
        })
      ],
      validation: Rule => Rule.required(),
      description: 'Primary product image displayed on listings and product page hero'
    }),
    defineField({
      name: 'gallery',
      title: 'Product Gallery',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string'
            })
          ]
        }
      ],
      description: 'Additional product images for the gallery section'
    }),
    defineField({
      name: 'videoUrl',
      title: 'Product Video URL',
      type: 'url',
      group: 'media',
      description: 'YouTube, Vimeo, or direct video URL'
    }),

    // Quote Options
    defineField({
      name: 'specs',
      title: 'Product Specifications',
      type: 'array',
      group: 'quoting',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Specification Name',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'value',
              title: 'Specification Value',
              type: 'string',
              validation: Rule => Rule.required()
            })
          ]
        }
      ],
      description: 'Technical specifications and details for the product'
    }),
    defineField({
      name: 'quoteOptions',
      title: 'Quote Options',
      type: 'array',
      group: 'quoting',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Option Name',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'description',
              title: 'Option Description',
              type: 'text'
            }),
            defineField({
              name: 'required',
              title: 'Required Option',
              type: 'boolean',
              initialValue: false
            })
          ]
        }
      ],
      description: 'Available options that customers can choose when requesting a quote'
    }),
    defineField({
      name: 'formLink',
      title: 'Quote Request Form Link',
      type: 'url',
      group: 'quoting',
      description: 'External link to a quote request form (if not using built-in form)'
    }),
    defineField({
      name: 'quoteRequestFormId',
      title: 'Quote Request Form ID',
      type: 'string',
      group: 'quoting',
      description: 'ID of the form to use for quote requests (if using built-in forms)'
    }),
    defineField({
      name: 'leadTime',
      title: 'Lead Time',
      type: 'string',
      group: 'quoting',
      description: 'Expected production time (e.g., "3-5 business days")'
    }),
    defineField({
      name: 'inStock',
      title: 'Available for Quote',
      type: 'boolean',
      group: 'quoting',
      initialValue: true,
      description: 'Whether this product is currently available for quotes'
    }),

    // Social Proof & Reviews
    defineField({
      name: 'rating',
      title: 'Average Rating',
      type: 'number',
      group: 'social',
      validation: Rule => Rule.min(1).max(5),
      description: 'Average customer rating (1-5 stars)'
    }),
    defineField({
      name: 'reviewCount',
      title: 'Number of Reviews',
      type: 'number',
      group: 'social',
      validation: Rule => Rule.min(0),
      description: 'Total number of customer reviews'
    }),
    defineField({
      name: 'testimonials',
      title: 'Customer Testimonials',
      type: 'array',
      group: 'social',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Testimonial Quote',
              type: 'text',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'author',
              title: 'Customer Name',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'company',
              title: 'Company (optional)',
              type: 'string'
            }),
            defineField({
              name: 'rating',
              title: 'Rating',
              type: 'number',
              validation: Rule => Rule.min(1).max(5)
            })
          ]
        }
      ],
      description: 'Featured customer testimonials for this product'
    }),

    // Trust Indicators & Badges
    defineField({
      name: 'qualityGuarantee',
      title: 'Quality Guarantee',
      type: 'boolean',
      group: 'trust',
      initialValue: true,
      description: 'Product comes with quality guarantee'
    }),
    defineField({
      name: 'fastDelivery',
      title: 'Fast Delivery Available',
      type: 'boolean',
      group: 'trust',
      initialValue: true,
      description: 'Rush/express delivery options available'
    }),
    defineField({
      name: 'awardWinning',
      title: 'Award Winning',
      type: 'boolean',
      group: 'trust',
      initialValue: false,
      description: 'Mark if this product has won awards'
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      group: 'trust',
      of: [{ type: 'string' }],
      description: 'Industry certifications or standards (e.g., FSC, ISO, etc.)'
    }),

    // Product Flags
    defineField({
      name: 'popular',
      title: 'Popular Product',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
      description: 'Mark as a popular/bestselling product'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
      description: 'Feature this product on homepage and category pages'
    }),
    defineField({
      name: 'newProduct',
      title: 'New Product',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
      description: 'Mark as a new product launch'
    }),

    // SEO & Metadata
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: Rule => Rule.max(60),
          description: 'SEO title (max 60 characters, leave blank to use product title)'
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          validation: Rule => Rule.max(160),
          description: 'SEO description (max 160 characters, leave blank to use short description)'
        }),
        defineField({
          name: 'keywords',
          title: 'Focus Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags'
          },
          description: 'Primary keywords for SEO targeting'
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'Override canonical URL if needed'
        })
      ],
      options: {
        collapsible: true,
        collapsed: false
      }
    }),
    defineField({
      name: 'openGraph',
      title: 'Social Media Preview',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'title',
          title: 'Social Title',
          type: 'string',
          description: 'Title for social media shares (leave blank to use meta title)'
        }),
        defineField({
          name: 'description',
          title: 'Social Description',
          type: 'text',
          description: 'Description for social media shares'
        }),
        defineField({
          name: 'image',
          title: 'Social Image',
          type: 'image',
          description: 'Custom image for social media shares (leave blank to use main image)'
        })
      ],
      options: {
        collapsible: true,
        collapsed: true
      }
    }),

    // Analytics & Tracking
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'priority',
          title: 'Search Priority',
          type: 'number',
          validation: Rule => Rule.min(0).max(1),
          description: 'Search engine priority (0.0 - 1.0)'
        }),
        defineField({
          name: 'trackingCode',
          title: 'Custom Tracking Code',
          type: 'string',
          description: 'Product-specific tracking code'
        })
      ],
      options: {
        collapsible: true,
        collapsed: true
      }
    }),

    // Internal Notes
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes',
      type: 'text',
      group: 'basic',
      description: 'Private notes for team members (not visible on website)',
      rows: 3
    }),

    // Related Templates
    defineField({
      name: 'templates',
      title: 'Related Templates',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'reference',
          to: [{ type: 'template' }],
        }
      ],
      description: 'Templates related to this product that customers can download'
    })

  ],

  // Enhanced Preview
  preview: {
    select: {
      title: 'title',
      media: 'image',
      category: 'category.title',
      status: 'status',
      featured: 'featured',
      popular: 'popular',
      rating: 'rating',
      inStock: 'inStock'
    },
    prepare(selection: any) {
      const { title, media, category, status, featured, popular, rating, inStock } = selection
      
      // Create status indicators
      const badges = []
      if (featured) badges.push('⭐ Featured')
      if (popular) badges.push('🔥 Popular')
      if (!inStock) badges.push('❌ Out of Stock')
      if (rating) badges.push(`${rating}⭐`)
      
      const subtitle = [
        category && `📁 ${category}`,
        status && `📊 ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        badges.length > 0 && badges.join(' • ')
      ].filter(Boolean).join(' | ')

      return {
        title,
        subtitle,
        media
      }
    }
  },

  // List View Options
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: 'Title Z-A',
      name: 'titleDesc', 
      by: [{ field: 'title', direction: 'desc' }]
    },
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: 'Recently Updated',
      name: 'recentlyUpdated',
      by: [{ field: '_updatedAt', direction: 'desc' }]
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'title', direction: 'asc' }
      ]
    },
    {
      title: 'Status',
      name: 'status',
      by: [
        { field: 'status', direction: 'asc' },
        { field: 'title', direction: 'asc' }
      ]
    }
  ]
})