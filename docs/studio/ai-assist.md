---
title: 'AI Assist Features'
description: 'Using Sanity AI Assist for content generation in DigiPrintPlus Studio'
category: 'studio'
tags: ['ai', 'content', 'sanity', 'automation']
last_updated: '2025-06-30'
audience: 'admin'
---

# 🤖 AI Assist Features

Sanity AI Assist integrates OpenAI's language models into Sanity Studio, allowing content editors to generate high-quality content suggestions directly within the editing interface.

## 🚀 Quick Start

### Prerequisites

- OpenAI API key
- Sanity Studio access

### Setup

1. Add your OpenAI API key to `/apps/studio/.env.local`:

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. Restart Sanity Studio:

   ```bash
   npm run dev:studio
   ```

3. Look for the magic wand icon (✨) next to compatible fields

## 📝 Content Generation

### Supported Fields

AI Assist works with these document types and fields:

#### Products

- **Description** - Short product descriptions (50-160 characters)
- **Long Description** - Detailed product descriptions with rich text
- **Specifications** - Technical specifications and features
- **FAQ** - Frequently asked questions and answers
- **SEO Metadata** - Meta titles and descriptions

#### Product Categories

- **Description** - Category descriptions and overviews
- **Marketing Content** - Category-specific marketing copy

### Best Practices

#### 1. Product Category Tagging

Always tag all relevant product categories before generating content:

1. Set the primary category in the main `category` field
2. Tag additional categories in the basic info section
3. Include all tagged categories in AI prompts for better relevance

#### 2. Effective Prompting

**Product Description Example:**

```
Write a concise product description for [Product Name], suitable for [Category 1], [Category 2]. Highlight quality, materials, and key benefits. Keep it 120-160 characters for SEO.
```

**Long Description Example:**

```
Create a detailed product description for [Product Name] targeting [target audience]. Include:
- Key features and benefits
- Material quality and durability
- Printing specifications
- Use cases and applications
- Call-to-action for quotes
Keep it engaging and informative, around 200-300 words.
```

**FAQ Example:**

```
Generate 5 frequently asked questions and answers for [Product Name]. Cover:
- Ordering process
- Customization options
- Turnaround time
- Pricing structure
- File requirements
Make answers helpful and professional.
```

**SEO Metadata Example:**

```
Create SEO-optimized meta title (50-60 characters) and meta description (150-160 characters) for [Product Name] in [Category]. Include relevant keywords for digital printing services.
```

## 🎯 Content Strategy

### Product Content Guidelines

1. **Consistency**: Maintain consistent tone and style across products
2. **Keywords**: Include relevant industry keywords naturally
3. **Benefits**: Focus on customer benefits, not just features
4. **Specificity**: Be specific about materials, sizes, and options
5. **Action**: Include clear calls-to-action

### Category Content Guidelines

1. **Overview**: Provide clear category explanations
2. **Use Cases**: Explain when customers need these products
3. **Variety**: Highlight the range of options available
4. **Quality**: Emphasize quality and professional results

## 🔧 Technical Implementation

### Configuration

The AI Assist plugin is configured in `sanity.config.ts`:

```typescript
import { assist } from '@sanity/assist';

export default defineConfig({
  // ... other config
  plugins: [
    assist(),
    // ... other plugins
  ],
});
```

### Environment Variables

Required environment variables in `/apps/studio/.env.local`:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Custom model settings
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=500
```

### Document Schema Integration

AI Assist automatically works with text fields, but can be enhanced with custom configurations:

```typescript
// Enhanced field with AI assist context
{
  name: 'description',
  title: 'Product Description',
  type: 'text',
  description: 'Brief product description for listings and SEO',
  // AI Assist will use this context for better suggestions
  options: {
    aiAssist: {
      context: 'Product description for digital printing service'
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **AI Assist icon not appearing**
   - Verify OpenAI API key is set correctly
   - Restart Sanity Studio
   - Check browser console for errors

2. **Poor content quality**
   - Improve prompt specificity
   - Include more context about the product/category
   - Reference tagged categories in prompts

3. **Rate limiting**
   - OpenAI has usage limits based on your plan
   - Consider upgrading your OpenAI plan for higher limits

### Error Messages

- **"API key not configured"**: Add OPENAI_API_KEY to .env.local
- **"Rate limit exceeded"**: Wait or upgrade OpenAI plan
- **"Network error"**: Check internet connection and API status

## 📊 Best Results Tips

1. **Be Specific**: Include product details, target audience, and context
2. **Reference Categories**: Mention all relevant product categories
3. **Set Expectations**: Specify desired length and tone
4. **Iterate**: Refine prompts based on output quality
5. **Review**: Always review and edit AI-generated content

## 🔗 Related Resources

- [Product Seeding Guide](product-seeding.md) - Initial product data setup
- [Studio Overview](README.md) - General studio documentation
- [Mega Menu Setup](mega-menu-setup.md) - Navigation configuration

---

_AI Assist helps accelerate content creation while maintaining quality and consistency across your digital print shop's product catalog._
