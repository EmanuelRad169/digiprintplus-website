import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {
      name: 'general',
      title: 'General',
      default: true
    },
    {
      name: 'contact',
      title: 'Contact',
    },
    {
      name: 'social',
      title: 'Social Media',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'analytics',
      title: 'Analytics',
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      group: 'general',
      initialValue: 'DigiPrintPlus',
      description: 'The main title of your website'
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      group: 'general',
      initialValue: 'Professional print solutions for your business',
      description: 'A brief description of your business'
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
      options: {
        hotspot: true
      },
      description: 'Upload your company logo'
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      group: 'contact',
      description: 'Your business contact details',
      fields: [
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          description: 'Main business phone number'
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          description: 'Main business email address'
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'text',
          description: 'Complete business address'
        }),
        defineField({
          name: 'businessHours',
          title: 'Business Hours',
          type: 'array',
          description: 'Your business operating hours',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'day',
                  title: 'Day',
                  type: 'string',
                  description: 'Day or day range (e.g., "Monday" or "Mon - Fri")'
                }),
                defineField({
                  name: 'hours',
                  title: 'Hours',
                  type: 'string',
                  description: 'Operating hours (e.g., "9:00 AM - 5:00 PM" or "Closed")'
                }),
              ]
            }
          ]
        }),
      ]
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      group: 'social',
      description: 'Links to your social media profiles',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'Link to your Facebook page'
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
          description: 'Link to your Twitter profile'
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Link to your Instagram profile'
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          description: 'Link to your LinkedIn profile'
        }),
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      description: 'Search engine optimization settings',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Title tag for search engines (recommended: 50-60 characters)'
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Meta description for search engines (recommended: 150-160 characters)'
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Important keywords for your website'
        }),
      ]
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      group: 'analytics',
      description: 'Website analytics and tracking codes',
      fields: [
        defineField({
          name: 'ga4Id',
          title: 'Google Analytics 4 ID',
          type: 'string',
          description: 'e.g., G-XXXXXXXXXX'
        }),
        defineField({
          name: 'gtmId',
          title: 'Google Tag Manager ID',
          type: 'string',
          description: 'e.g., GTM-XXXXXXX'
        }),
        defineField({
          name: 'googleAdsId',
          title: 'Google Ads Conversion ID',
          type: 'string',
          description: 'For tracking conversions from Google Ads'
        }),
      ]
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Configure your website settings'
      }
    }
  }
})