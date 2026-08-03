import { defineType, defineField } from 'sanity'

/**
 * The Contact page's own copy.
 *
 * The contact *details* themselves (phone, email, address, opening hours) are
 * NOT here — they live on Site Settings, because the footer and other pages
 * use the same values. This document holds only the labels and copy that are
 * specific to the Contact page.
 */
export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Heading',
      type: 'string',
      initialValue: 'Contact Us',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Intro Line',
      type: 'text',
      rows: 2,
      initialValue:
        "Get in touch with our team of experts. We're here to help bring your vision to life."
    }),
    defineField({
      name: 'infoHeading',
      title: 'Contact Details Heading',
      type: 'string',
      description: 'Heading above the phone / email / address column.',
      initialValue: 'Get in Touch'
    }),
    defineField({
      name: 'infoBody',
      title: 'Contact Details Intro',
      type: 'text',
      rows: 3,
      initialValue:
        "Whether you need business cards, brochures, banners, or custom printing solutions, we're here to bring your vision to life."
    }),
    defineField({
      name: 'labels',
      title: 'Contact Method Labels',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      description:
        'The small headings and notes beside each contact method. The phone number, email and address themselves come from Site Settings.',
      fields: [
        { name: 'phone', type: 'string', title: 'Phone Label', initialValue: 'Phone' },
        {
          name: 'phoneNote',
          type: 'string',
          title: 'Phone Note',
          description: 'Small grey line under the phone number.',
          initialValue: 'Mon-Fri 8AM-6PM EST'
        },
        { name: 'email', type: 'string', title: 'Email Label', initialValue: 'Email' },
        {
          name: 'emailNote',
          type: 'string',
          title: 'Email Note',
          initialValue: 'We respond within 24 hours'
        },
        { name: 'address', type: 'string', title: 'Address Label', initialValue: 'Address' },
        {
          name: 'businessHours',
          type: 'string',
          title: 'Business Hours Label',
          initialValue: 'Business Hours'
        }
      ]
    }),
    defineField({
      name: 'formHeading',
      title: 'Form Heading',
      type: 'string',
      initialValue: 'Send us a message'
    }),
    defineField({
      name: 'formIntro',
      title: 'Form Intro',
      type: 'text',
      rows: 2,
      initialValue:
        "Fill out the form below and we'll get back to you within 24 hours."
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'metaTitle', type: 'string', title: 'Meta Title' },
        { name: 'metaDescription', type: 'text', rows: 3, title: 'Meta Description' }
      ]
    })
  ],
  preview: {
    prepare: () => ({ title: 'Contact Page' })
  }
})
