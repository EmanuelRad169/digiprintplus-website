import { defineType, defineArrayMember, defineField } from "sanity";

const blockContent = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Heading 2", value: "h2" },
    { title: "Heading 3", value: "h3" },
    { title: "Heading 4", value: "h4" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Number", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
    ],
  },
});

// Migration mapping (legacy -> new)
// - description -> shortDescription
// - image -> mainImage
// - productDetails + detailedSpecs + specs/specifications -> content
// - specifications -> quickSpecs
// - quoteOptions + leadTime + inStock -> quote.options + quote.leadTime + quote.enabled
// - featured/popular/newProduct/fastDelivery/qualityGuarantee/awardWinning -> flags
// - template.downloadFile + template.htmlEmbed -> template.file + template.previewHtml
// TODO: remove deprecated fields after migration is complete.

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fieldsets: [
    { name: "core", title: "Core" },
    { name: "seo", title: "SEO" },
    { name: "flags", title: "Flags" },
    { name: "template", title: "Template" },
    { name: "quote", title: "Quote" },
    {
      name: "advanced",
      title: "Advanced",
      options: { collapsible: true, collapsed: true },
    },
  ],
  groups: [
    {
      name: "core",
      title: "Core",
      default: true,
    },
    {
      name: "seo",
      title: "SEO",
    },
    {
      name: "flags",
      title: "Flags",
    },
    {
      name: "template",
      title: "Template",
    },
    {
      name: "quote",
      title: "Quote",
    },
    {
      name: "advanced",
      title: "Advanced",
    },
  ],
  fields: [
    // Core (Essential)
    // TODO: remove deprecated fields after migration to new structure.
    defineField({
      name: "title",
      title: "Product Title",
      type: "string",
      group: "core",
      fieldset: "core",
      validation: (Rule) => Rule.required().max(80),
      description:
        "Product name as it will appear on the website (max 80 characters for SEO)",
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "core",
      fieldset: "core",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
      description: "URL-friendly version of the product name",
    }),
    defineField({
      name: "category",
      title: "Product Category",
      type: "reference",
      group: "core",
      fieldset: "core",
      to: [{ type: "productCategory" }],
      validation: (Rule) => Rule.required(),
      description: "Select the primary product category",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      group: "core",
      fieldset: "core",
      rows: 3,
      description:
        "Short summary for listings. Map from Description (deprecated).",
    }),
    defineField({
      name: "additionalCategories",
      title: "Additional Categories",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [
        {
          type: "reference",
          to: [{ type: "productCategory" }],
        },
      ],
      description:
        "Deprecated: merge into SEO keywords/tags. TODO: remove after migration.",
    }),
    defineField({
      name: "tags",
      title: "Product Tags",
      type: "array",
      group: "core",
      fieldset: "core",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Tags for filtering. Also map to SEO keywords if needed.",
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      group: "core",
      fieldset: "core",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Active", value: "active" },
          { title: "Discontinued", value: "discontinued" },
          { title: "Coming Soon", value: "coming-soon" },
        ],
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),

    // Core content (new)
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      group: "core",
      fieldset: "core",
      of: [blockContent],
      description: "Merged rich content (Product Details + Specifications).",
    }),
    defineField({
      name: "quickSpecs",
      title: "Quick Specs",
      type: "array",
      group: "core",
      fieldset: "core",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
            }),
          ],
        }),
      ],
      description:
        "Key/value summary specs. Map from Quick Specifications (deprecated).",
    }),
    defineField({
      name: "leadTime",
      title: "Lead Time",
      type: "string",
      group: "core",
      fieldset: "core",
      description: 'Production lead time (e.g., "3-5 business days").',
    }),

    // Legacy content fields (deprecated)
    defineField({
      name: "productDetails",
      title: "Product Details",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [blockContent],
      description:
        "Deprecated: merge into Content. TODO: remove after migration.",
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      group: "advanced",
      fieldset: "advanced",
      rows: 3,
      validation: (Rule) => Rule.required().min(50).max(160),
      description:
        "Deprecated: use Short Description. TODO: remove after migration.",
    }),
    defineField({
      name: "detailedSpecs",
      title: "Detailed Specifications",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [blockContent],
      description:
        "Deprecated: merge into Content. TODO: remove after migration.",
    }),
    defineField({
      name: "specifications",
      title: "Quick Specifications",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "unit",
              title: "Unit",
              type: "string",
            }),
          ],
        }),
      ],
      description:
        "Deprecated: map to Quick Specs. TODO: remove after migration.",
    }),
    // Core images
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      group: "core",
      fieldset: "core",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
      description:
        "Preferred main image. Map from Main Product Image (deprecated).",
    }),
    defineField({
      name: "image",
      title: "Main Product Image",
      type: "image",
      group: "core",
      fieldset: "core",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
          description: "Describe the image for accessibility and SEO",
        }),
      ],
      validation: (Rule) => Rule.required(),
      description:
        "Legacy main image used by frontend. TODO: remove after migration.",
    }),
    defineField({
      name: "gallery",
      title: "Product Gallery",
      type: "array",
      group: "core",
      fieldset: "core",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
      description: "Additional product images for the gallery section",
    }),

    // Template (new object)
    defineField({
      name: "template",
      title: "Template",
      type: "object",
      group: "template",
      fieldset: "template",
      fields: [
        defineField({
          name: "hasTemplate",
          title: "Has Template",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "description",
          title: "Template Description",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "file",
          title: "Template File",
          type: "file",
          description: "New field. Map from Template File (deprecated).",
        }),
        defineField({
          name: "previewHtml",
          title: "Preview HTML",
          type: "text",
          description: "New field. Map from HTML Preview (deprecated).",
        }),
        defineField({
          name: "previewImage",
          title: "Preview Image",
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
          description:
            "Deprecated: optional legacy preview image. TODO: remove after migration.",
        }),
        defineField({
          name: "downloadFile",
          title: "Template File (Legacy)",
          type: "file",
          description:
            "Deprecated: use Template File. TODO: remove after migration.",
        }),
        defineField({
          name: "htmlEmbed",
          title: "HTML Preview (Legacy)",
          type: "text",
          description:
            "Deprecated: use Preview HTML. TODO: remove after migration.",
        }),
      ],
    }),

    // Quote (new object)
    defineField({
      name: "quote",
      title: "Quote",
      type: "object",
      group: "quote",
      fieldset: "quote",
      fields: [
        defineField({
          name: "enabled",
          title: "Quote Enabled",
          type: "boolean",
          description: "New field. Map from Available for Quote (deprecated).",
        }),
        defineField({
          name: "leadTime",
          title: "Quote Lead Time",
          type: "string",
          description: "New field. Map from Lead Time (deprecated).",
        }),
        defineField({
          name: "options",
          title: "Quote Options",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  title: "Option Name",
                  type: "string",
                }),
                defineField({
                  name: "value",
                  title: "Option Value",
                  type: "string",
                }),
              ],
            }),
          ],
          description: "New field. Map from Quote Options (deprecated).",
        }),
      ],
    }),

    // Legacy Quote Options (deprecated)
    defineField({
      name: "specs",
      title: "Product Specifications",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Specification Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Specification Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      description:
        "Deprecated: merge into Content/Quick Specs. TODO: remove after migration.",
    }),
    defineField({
      name: "quoteOptions",
      title: "Quote Options",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Option Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Option Description",
              type: "text",
            }),
            defineField({
              name: "required",
              title: "Required Option",
              type: "boolean",
              initialValue: false,
            }),
          ],
        },
      ],
      description:
        "Deprecated: map to Quote Options. TODO: remove after migration.",
    }),
    defineField({
      name: "formLink",
      title: "Quote Request Form Link",
      type: "url",
      group: "advanced",
      fieldset: "advanced",
      description:
        "Deprecated: legacy quote form link. TODO: remove after migration.",
    }),
    defineField({
      name: "quoteRequestFormId",
      title: "Quote Request Form ID",
      type: "string",
      group: "advanced",
      fieldset: "advanced",
      description:
        "Deprecated: legacy quote form ID. TODO: remove after migration.",
    }),
    defineField({
      name: "inStock",
      title: "Available for Quote",
      type: "boolean",
      group: "advanced",
      fieldset: "advanced",
      initialValue: true,
      description:
        "Deprecated: map to Quote Enabled. TODO: remove after migration.",
    }),

    // Social Proof & Reviews (Advanced)
    defineField({
      name: "rating",
      title: "Average Rating",
      type: "number",
      group: "advanced",
      fieldset: "advanced",
      validation: (Rule) => Rule.min(1).max(5),
      description: "Average customer rating (1-5 stars)",
    }),
    defineField({
      name: "reviewCount",
      title: "Number of Reviews",
      type: "number",
      group: "advanced",
      fieldset: "advanced",
      validation: (Rule) => Rule.min(0),
      description: "Total number of customer reviews",
    }),
    defineField({
      name: "testimonials",
      title: "Customer Testimonials",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Testimonial Quote",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "author",
              title: "Customer Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "company",
              title: "Company (optional)",
              type: "string",
            }),
            defineField({
              name: "rating",
              title: "Rating",
              type: "number",
              validation: (Rule) => Rule.min(1).max(5),
            }),
          ],
        },
      ],
      description: "Featured customer testimonials for this product",
    }),

    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      description: "Frequently asked questions about this product",
    }),

    defineField({
      name: "videoUrl",
      title: "Product Video URL",
      type: "url",
      group: "advanced",
      fieldset: "advanced",
      description: "YouTube, Vimeo, or direct video URL",
    }),

    // Trust Indicators & Badges (Advanced)
    defineField({
      name: "qualityGuarantee",
      title: "Quality Guarantee",
      type: "boolean",
      group: "advanced",
      fieldset: "advanced",
      initialValue: true,
      description:
        "Deprecated: use Flags.qualityGuarantee. TODO: remove after migration.",
    }),
    defineField({
      name: "fastDelivery",
      title: "Fast Delivery Available",
      type: "boolean",
      group: "advanced",
      fieldset: "advanced",
      initialValue: true,
      description:
        "Deprecated: use Flags.fastDelivery. TODO: remove after migration.",
    }),
    defineField({
      name: "awardWinning",
      title: "Award Winning",
      type: "boolean",
      group: "advanced",
      fieldset: "advanced",
      initialValue: false,
      description:
        "Deprecated: use Flags.awardWinning. TODO: remove after migration.",
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [{ type: "string" }],
      description:
        "Industry certifications or standards (e.g., FSC, ISO, etc.)",
    }),

    // Product Flags (new)
    defineField({
      name: "flags",
      title: "Flags",
      type: "object",
      group: "flags",
      fieldset: "flags",
      fields: [
        defineField({ name: "featured", title: "Featured", type: "boolean" }),
        defineField({ name: "popular", title: "Popular", type: "boolean" }),
        defineField({ name: "new", title: "New", type: "boolean" }),
        defineField({
          name: "fastDelivery",
          title: "Fast Delivery",
          type: "boolean",
        }),
        defineField({
          name: "qualityGuarantee",
          title: "Quality Guarantee",
          type: "boolean",
        }),
        defineField({
          name: "awardWinning",
          title: "Award Winning",
          type: "boolean",
        }),
      ],
      description: "Unified product flags. Map from legacy booleans below.",
    }),

    // Product Flags (legacy)
    defineField({
      name: "popular",
      title: "Popular Product",
      type: "boolean",
      group: "advanced",
      fieldset: "advanced",
      initialValue: false,
      description:
        "Deprecated: use Flags.popular. TODO: remove after migration.",
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      group: "advanced",
      fieldset: "advanced",
      initialValue: false,
      description:
        "Deprecated: use Flags.featured. TODO: remove after migration.",
    }),
    defineField({
      name: "newProduct",
      title: "New Product",
      type: "boolean",
      group: "advanced",
      fieldset: "advanced",
      initialValue: false,
      description: "Deprecated: use Flags.new. TODO: remove after migration.",
    }),

    // SEO & Metadata
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      group: "seo",
      fieldset: "seo",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          validation: (Rule) => Rule.max(60),
          description:
            "SEO title (max 60 characters, leave blank to use product title)",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          validation: (Rule) => Rule.max(160),
          description:
            "SEO description (max 160 characters, leave blank to use short description)",
        }),
        defineField({
          name: "keywords",
          title: "Focus Keywords",
          type: "array",
          of: [{ type: "string" }],
          options: {
            layout: "tags",
          },
          description: "Primary keywords for SEO targeting",
        }),
        defineField({
          name: "canonicalUrl",
          title: "Canonical URL",
          type: "url",
          description: "Advanced: override canonical URL if needed",
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: "openGraph",
      title: "Social Media Preview",
      type: "object",
      group: "seo",
      fieldset: "seo",
      fields: [
        defineField({
          name: "title",
          title: "Social Title",
          type: "string",
          description:
            "Title for social media shares (leave blank to use meta title)",
        }),
        defineField({
          name: "description",
          title: "Social Description",
          type: "text",
          description: "Description for social media shares",
        }),
        defineField({
          name: "image",
          title: "Social Image",
          type: "image",
          description:
            "Custom image for social media shares (leave blank to use main image)",
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // Analytics & Tracking
    defineField({
      name: "analytics",
      title: "Analytics",
      type: "object",
      group: "advanced",
      fieldset: "advanced",
      fields: [
        defineField({
          name: "priority",
          title: "Search Priority",
          type: "number",
          validation: (Rule) => Rule.min(0).max(1),
          description: "Search engine priority (0.0 - 1.0)",
        }),
        defineField({
          name: "trackingCode",
          title: "Custom Tracking Code",
          type: "string",
          description: "Product-specific tracking code",
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // Internal Notes
    defineField({
      name: "internalNotes",
      title: "Internal Notes",
      type: "text",
      group: "advanced",
      fieldset: "advanced",
      description: "Private notes for team members (not visible on website)",
      rows: 3,
    }),

    // Related Templates
    defineField({
      name: "templates",
      title: "Related Templates",
      type: "array",
      group: "advanced",
      fieldset: "advanced",
      of: [
        {
          type: "reference",
          to: [{ type: "template" }],
        },
      ],
      description:
        "Templates related to this product that customers can download",
    }),
  ],

  // Enhanced Preview
  preview: {
    select: {
      title: "title",
      media: "image",
      category: "category.title",
      status: "status",
      featured: "featured",
      popular: "popular",
      rating: "rating",
      inStock: "inStock",
    },
    prepare(selection: any) {
      const {
        title,
        media,
        category,
        status,
        featured,
        popular,
        rating,
        inStock,
      } = selection;

      // Create status indicators
      const badges = [];
      if (featured) badges.push("⭐ Featured");
      if (popular) badges.push("🔥 Popular");
      if (!inStock) badges.push("❌ Out of Stock");
      if (rating) badges.push(`${rating}⭐`);

      const subtitle = [
        category && `📁 ${category}`,
        status && `📊 ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        badges.length > 0 && badges.join(" • "),
      ]
        .filter(Boolean)
        .join(" | ");

      return {
        title,
        subtitle,
        media,
      };
    },
  },

  // List View Options
  orderings: [
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Title Z-A",
      name: "titleDesc",
      by: [{ field: "title", direction: "desc" }],
    },
    {
      title: "Newest First",
      name: "newestFirst",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Recently Updated",
      name: "recentlyUpdated",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Status",
      name: "status",
      by: [
        { field: "status", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
});
