import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'quoteSettings',
  title: 'Quote Form Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'formTitle',
      title: 'Form Title',
      type: 'string',
      initialValue: 'Request a Quote'
    }),
    defineField({
      name: 'jobSpecsStep',
      title: 'Job Specifications Step',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', initialValue: 'Job Specifications' },
        { name: 'description', type: 'string', initialValue: 'Tell us about your project' },
        { name: 'productTypes', type: 'array', of: [{ type: 'string' }], initialValue: ['Business Cards', 'Brochures', 'Flyers', 'Posters', 'Banners'] },
        { name: 'quantities', type: 'array', of: [{ type: 'string' }], initialValue: ['100', '250', '500', '1000', '2500', '5000'] },
        { name: 'paperTypes', type: 'array', of: [{ type: 'string' }], initialValue: ['14pt C2S', '16pt C2S', '100lb Gloss Text', '70lb Uncoated Text'] },
        { name: 'finishes', type: 'array', of: [{ type: 'string' }], initialValue: ['Matte', 'Gloss', 'UV Coating', 'Soft Touch'] },
        { name: 'turnaroundTimes', type: 'array', of: [{ type: 'string' }], initialValue: ['Standard (3-5 Business Days)', 'Rush (1-2 Business Days)', 'Next Day'] },
      ]
    }),
    defineField({
      name: 'contactStep',
      title: 'Contact Info Step',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', initialValue: 'Contact Information' },
        { name: 'description', type: 'string', initialValue: 'How can we reach you?' },
      ]
    }),
    defineField({
      name: 'reviewStep',
      title: 'Review Step',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', initialValue: 'Review Your Quote Request' },
        { name: 'description', type: 'string', initialValue: 'Please review the details below before submitting.' },
        { name: 'terms', type: 'text', initialValue: 'I agree to the Terms of Service and Privacy Policy. I understand that this is a quote request and not a final order.' },
      ]
    }),
    defineField({
      name: 'labels',
      title: 'Field Labels',
      type: 'object',
      fields: [
        { name: 'productType', type: 'string', initialValue: 'Product Type' },
        { name: 'quantity', type: 'string', initialValue: 'Quantity' },
        { name: 'paperType', type: 'string', initialValue: 'Paper Type' },
        { name: 'finish', type: 'string', initialValue: 'Finish' },
        { name: 'turnaround', type: 'string', initialValue: 'Turnaround' },
        { name: 'specialInstructions', type: 'string', initialValue: 'Special Instructions' },
        { name: 'fileUpload', type: 'string', initialValue: 'Upload Your File' },
        { name: 'firstName', type: 'string', initialValue: 'First Name' },
        { name: 'lastName', type: 'string', initialValue: 'Last Name' },
        { name: 'email', type: 'string', initialValue: 'Email' },
        { name: 'phone', type: 'string', initialValue: 'Phone' },
        { name: 'company', type: 'string', initialValue: 'Company' },
      ]
    }),
    defineField({
        name: 'buttonText',
        title: 'Button Text',
        type: 'object',
        fields: [
            { name: 'next', type: 'string', initialValue: 'Next' },
            { name: 'previous', type: 'string', initialValue: 'Previous' },
            { name: 'submit', type: 'string', initialValue: 'Submit Quote Request' },
        ]
    })
  ]
})
