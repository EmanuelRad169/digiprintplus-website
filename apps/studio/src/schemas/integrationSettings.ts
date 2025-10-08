import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'integrationSettings',
  title: '🔌 Integration Settings',
  type: 'document',
  description: 'Configure third-party service integrations and API keys',
  groups: [
    {
      name: 'payment',
      title: '💳 Payment Processing'
    },
    {
      name: 'email',
      title: '📧 Email Services'
    },
    {
      name: 'storage',
      title: '☁️ Cloud Storage'
    },
    {
      name: 'crm',
      title: '🤝 CRM Integration'
    },
    {
      name: 'analytics',
      title: '📊 Analytics & Tracking'
    }
  ],
  fields: [
    // Payment Settings
    defineField({
      name: 'stripePublishableKey',
      title: 'Stripe Publishable Key',
      type: 'string',
      group: 'payment',
      description: 'Your Stripe publishable key for processing payments (starts with pk_)',
      validation: Rule => Rule.regex(/^pk_/).warning('Should start with pk_')
    }),
    defineField({
      name: 'stripeWebhookSecret',
      title: 'Stripe Webhook Secret',
      type: 'string',
      group: 'payment',
      description: 'Webhook endpoint secret for payment confirmations (starts with whsec_)',
      validation: Rule => Rule.regex(/^whsec_/).warning('Should start with whsec_')
    }),
    defineField({
      name: 'paymentMethods',
      title: 'Accepted Payment Methods',
      type: 'array',
      group: 'payment',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Credit Card', value: 'card' },
          { title: 'PayPal', value: 'paypal' },
          { title: 'Apple Pay', value: 'apple_pay' },
          { title: 'Google Pay', value: 'google_pay' },
          { title: 'Bank Transfer', value: 'bank_transfer' }
        ]
      },
      initialValue: ['card']
    }),

    // Email Settings
    defineField({
      name: 'sendgridApiKey',
      title: 'SendGrid API Key',
      type: 'string',
      group: 'email',
      description: 'SendGrid API key for transactional emails (starts with SG.)',
      validation: Rule => Rule.regex(/^SG\./).warning('Should start with SG.')
    }),
    defineField({
      name: 'emailFrom',
      title: 'From Email Address',
      type: 'string',
      group: 'email',
      description: 'Default sender email address for notifications',
      validation: Rule => Rule.email().required()
    }),
    defineField({
      name: 'emailReplyTo',
      title: 'Reply-To Email Address',
      type: 'string',
      group: 'email',
      description: 'Email address for customer replies',
      validation: Rule => Rule.email()
    }),
    defineField({
      name: 'emailTemplates',
      title: 'Email Templates',
      type: 'object',
      group: 'email',
      fields: [
        {
          name: 'quoteConfirmation',
          title: 'Quote Confirmation Template ID',
          type: 'string',
          description: 'SendGrid template ID for quote confirmations'
        },
        {
          name: 'orderConfirmation',
          title: 'Order Confirmation Template ID',
          type: 'string',
          description: 'SendGrid template ID for order confirmations'
        },
        {
          name: 'welcomeEmail',
          title: 'Welcome Email Template ID',
          type: 'string',
          description: 'SendGrid template ID for new customer welcome emails'
        }
      ]
    }),

    // Cloud Storage Settings
    defineField({
      name: 'awsAccessKey',
      title: 'AWS Access Key ID',
      type: 'string',
      group: 'storage',
      description: 'AWS access key for S3 file uploads'
    }),
    defineField({
      name: 'awsSecretKey',
      title: 'AWS Secret Access Key',
      type: 'string',
      group: 'storage',
      description: 'AWS secret key for S3 file uploads'
    }),
    defineField({
      name: 's3Bucket',
      title: 'S3 Bucket Name',
      type: 'string',
      group: 'storage',
      description: 'AWS S3 bucket name for file storage'
    }),
    defineField({
      name: 'maxFileSize',
      title: 'Maximum File Size (MB)',
      type: 'number',
      group: 'storage',
      description: 'Maximum file size for customer uploads',
      initialValue: 50,
      validation: Rule => Rule.min(1).max(100)
    }),
    defineField({
      name: 'allowedFileTypes',
      title: 'Allowed File Types',
      type: 'array',
      group: 'storage',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'PDF Documents', value: 'pdf' },
          { title: 'Images (JPG/PNG)', value: 'image' },
          { title: 'Adobe Illustrator', value: 'ai' },
          { title: 'Adobe Photoshop', value: 'psd' },
          { title: 'Adobe InDesign', value: 'indd' },
          { title: 'Microsoft Word', value: 'docx' },
          { title: 'PowerPoint', value: 'pptx' }
        ]
      },
      initialValue: ['pdf', 'image', 'docx']
    }),

    // CRM Settings
    defineField({
      name: 'crmProvider',
      title: 'CRM Provider',
      type: 'string',
      group: 'crm',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'HubSpot', value: 'hubspot' },
          { title: 'Zoho CRM', value: 'zoho' },
          { title: 'Salesforce', value: 'salesforce' },
          { title: 'Pipedrive', value: 'pipedrive' }
        ]
      },
      initialValue: 'none'
    }),
    defineField({
      name: 'hubspotApiKey',
      title: 'HubSpot API Key',
      type: 'string',
      group: 'crm',
      description: 'HubSpot private app access token',
      hidden: ({ document }) => document?.crmProvider !== 'hubspot'
    }),
    defineField({
      name: 'zohoClientId',
      title: 'Zoho Client ID',
      type: 'string',
      group: 'crm',
      description: 'Zoho CRM application client ID',
      hidden: ({ document }) => document?.crmProvider !== 'zoho'
    }),
    defineField({
      name: 'zohoClientSecret',
      title: 'Zoho Client Secret',
      type: 'string',
      group: 'crm',
      description: 'Zoho CRM application client secret',
      hidden: ({ document }) => document?.crmProvider !== 'zoho'
    }),

    // Analytics Settings
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics 4 ID',
      type: 'string',
      group: 'analytics',
      description: 'GA4 measurement ID (starts with G-)',
      validation: Rule => Rule.regex(/^G-/).warning('Should start with G-')
    }),
    defineField({
      name: 'googleTagManagerId',
      title: 'Google Tag Manager ID',
      type: 'string',
      group: 'analytics',
      description: 'GTM container ID (starts with GTM-)',
      validation: Rule => Rule.regex(/^GTM-/).warning('Should start with GTM-')
    }),
    defineField({
      name: 'hotjarSiteId',
      title: 'Hotjar Site ID',
      type: 'string',
      group: 'analytics',
      description: 'Hotjar site ID for heatmaps and recordings'
    }),
    defineField({
      name: 'sentryDsn',
      title: 'Sentry DSN',
      type: 'string',
      group: 'analytics',
      description: 'Sentry Data Source Name for error tracking'
    }),
    defineField({
      name: 'facebookPixelId',
      title: 'Facebook Pixel ID',
      type: 'string',
      group: 'analytics',
      description: 'Facebook Pixel ID for advertising analytics'
    }),

    // General Integration Settings
    defineField({
      name: 'isTestMode',
      title: 'Test Mode',
      type: 'boolean',
      description: 'Enable test mode for all integrations (uses sandbox/test keys)',
      initialValue: true
    }),
    defineField({
      name: 'webhookUrls',
      title: 'Webhook URLs',
      type: 'object',
      fields: [
        {
          name: 'orderCreated',
          title: 'Order Created Webhook',
          type: 'url',
          description: 'URL to notify when new orders are created'
        },
        {
          name: 'paymentReceived',
          title: 'Payment Received Webhook',
          type: 'url',
          description: 'URL to notify when payments are received'
        },
        {
          name: 'quoteSubmitted',
          title: 'Quote Submitted Webhook',
          type: 'url',
          description: 'URL to notify when quotes are submitted'
        }
      ]
    })
  ],
  
  preview: {
    select: {
      title: 'title',
      crmProvider: 'crmProvider',
      isTestMode: 'isTestMode'
    },
    prepare({ title, crmProvider, isTestMode }) {
      return {
        title: 'Integration Settings',
        subtitle: `CRM: ${crmProvider || 'None'} ${isTestMode ? '(Test Mode)' : '(Live)'}`,
        media: '🔌'
      }
    }
  }
})
