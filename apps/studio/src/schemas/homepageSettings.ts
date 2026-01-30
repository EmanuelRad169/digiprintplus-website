import { defineType } from 'sanity'

export default defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Homepage Settings',
      readOnly: true,
      hidden: true,
    },
    {
      name: 'featuredProducts',
      title: 'Featured Products Carousel',
      type: 'array',
      description: 'Select products to feature in the homepage carousel. Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'featuredProduct',
          title: 'Featured Product',
          fields: [
            {
              name: 'product',
              title: 'Product Category',
              type: 'reference',
              to: [{ type: 'productCategory' }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'customImage',
              title: 'Custom Image (Optional)',
              type: 'image',
              description: 'Override the default product image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'customTitle',
              title: 'Custom Title (Optional)',
              type: 'string',
              description: 'Override the default product name',
            },
            {
              name: 'customCategory',
              title: 'Custom Category Tag (Optional)',
              type: 'string',
              description: 'e.g., "Essential", "Marketing", "New"',
            },
            {
              name: 'isActive',
              title: 'Active',
              type: 'boolean',
              description: 'Show this product in the carousel',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              productTitle: 'product.title',
              customTitle: 'customTitle',
              productImage: 'product.image',
              customImage: 'customImage',
              isActive: 'isActive',
            },
            prepare({ productTitle, customTitle, productImage, customImage, isActive }) {
              return {
                title: customTitle || productTitle || 'Untitled Product',
                subtitle: isActive ? 'Active' : 'Inactive',
                media: customImage || productImage,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(20).warning('More than 20 products may affect performance'),
    },
    {
      name: 'carouselSettings',
      title: 'Carousel Settings',
      type: 'object',
      fields: [
        {
          name: 'autoplaySpeed',
          title: 'Autoplay Speed (seconds)',
          type: 'number',
          description: 'How long each product is displayed before auto-scrolling',
          initialValue: 3,
          validation: (Rule) => Rule.min(1).max(10),
        },
        {
          name: 'itemsPerView',
          title: 'Items Per View (Desktop)',
          type: 'number',
          description: 'Number of products visible at once on desktop',
          initialValue: 5,
          validation: (Rule) => Rule.min(3).max(8),
        },
        {
          name: 'enableAutoplay',
          title: 'Enable Autoplay',
          type: 'boolean',
          initialValue: true,
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Settings',
        subtitle: 'Configure homepage content',
      }
    },
  },
})
