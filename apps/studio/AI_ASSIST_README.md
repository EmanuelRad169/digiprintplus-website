# Sanity AI Assist Implementation for DigiPrintPlus

This document provides an overview of the Sanity AI Assist setup for the DigiPrintPlus digital print shop backend.

## What is Sanity AI Assist?

Sanity AI Assist is a plugin that integrates OpenAI's language models into Sanity Studio, allowing content editors to generate content suggestions directly within the editing interface. It appears as a magic wand icon (✨) next to compatible fields.

## Implementation Details

### Installed Components

- `@sanity/assist` version 4.4.0 is installed in the project
- Basic configuration added to `sanity.config.ts`
- OpenAI API key configuration in `.env.local`

### Configured Document Types

AI Assist works with all document types by default, but is most useful for:

- `product` - For generating product descriptions, specifications, FAQs, etc.
- `productCategory` - For generating category descriptions

### Key Content Fields with AI Assist Support

In the product schema:

- `description` - Short product description (50-160 characters)
- `longDescription` - Detailed product description with rich text
- `specifications` - Technical specifications
- `faq` - Frequently asked questions and answers
- `seo.metaTitle` and `seo.metaDescription` - SEO metadata

In the product category schema:

- `description` - Category description

## Setup Instructions

1. Ensure you have a valid OpenAI API key
2. Add your API key to `/apps/studio/.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Restart the Sanity Studio

## Testing Instructions

1. Start the Sanity Studio:

   ```
   cd /apps/studio
   npm run dev
   ```

2. Open a product document for editing
3. Look for the magic wand icon (✨) next to text fields like description
4. Click the icon to open the AI Assist panel
5. Enter a prompt (see examples in AI_ASSIST_GUIDE.md)
6. Click "Generate" to get AI-generated content suggestions
7. Use the suggested content as-is or edit it before saving

## Browser Console Testing Script

A testing script is provided at `/apps/studio/test-ai-assist.js`. To use it:

1. Open Sanity Studio in your browser
2. Open the browser developer console (F12 or Cmd+Option+I)
3. Copy and paste the content of the script into the console
4. Press Enter to run the diagnostic check

## Prompt Examples

See the detailed `AI_ASSIST_GUIDE.md` for specific prompt examples for different fields.

### Basic Example for Product Description

```
Write a concise product description for Professional Business Cards, highlighting premium cardstock, print quality, and customization options. Keep it between 120-160 characters for SEO.
```

### Example for Multi-Category Products

```
Write a concise product description for Premium Cardstock that highlights its versatility across Business Cards, Flyers, and Brochures. Emphasize quality and applications for each category. Keep it under 160 characters.
```

### Basic Example for FAQ

```
Generate a common customer question about turnaround time for Business Cards and provide a clear, helpful answer in 2-3 sentences.
```

## Known Limitations

- Advanced configuration options like document type filtering, system prompts, and custom templates are not supported in the current version of Sanity AI Assist
- AI-generated content should always be reviewed by a human editor
- The OpenAI API key must have sufficient credits

## Troubleshooting

If AI Assist is not working:

1. Check the OpenAI API key in `.env.local`
2. Ensure you've restarted the Studio after adding the API key
3. Verify there are no console errors in the browser
4. Try a different text field if one field isn't showing the AI Assist icon

For more information, see the [Sanity AI Assist documentation](https://www.sanity.io/docs/ai-assist).
