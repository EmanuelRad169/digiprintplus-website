# Sanity AI Assist Guide for DigiPrintPlus

This guide provides instructions on how to use Sanity AI Assist to help create content for your digital print shop products, categories, and other content.

## Setup Requirements

1. You need an OpenAI API key to use Sanity AI Assist.
2. The API key should be added to the `.env.local` file in the studio folder:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Restart the Sanity Studio after adding the API key.

## How to Use AI Assist

Sanity AI Assist appears as a magic wand icon (✨) in compatible fields when editing documents. It can help generate content for fields like descriptions, FAQ entries, and more.

### Accessing AI Assist

1. Open a document for editing (e.g., a product or product category)
2. Look for the magic wand icon (✨) next to text fields
3. Click the icon to open the AI Assist panel
4. Enter a prompt and click "Generate"

### Product Category Tagging in Basic Info

When creating or editing products, always tag all relevant product categories in the basic info section:

1. The primary category should be set in the main `category` field
2. Additional categories should be tagged appropriately
3. Ensure all applicable categories are selected before generating content with AI Assist
4. Include all tagged categories in your AI Assist prompts for more relevant content generation

### Example Prompts for Different Fields

#### Product Description

When editing the product `description` field:

```
Write a concise product description for [Product Name], a product suitable for [Category 1], [Category 2], etc. Highlight its quality, materials, and key benefits. Keep it between 120-160 characters for SEO.
```

> **Tip:** Always include all categories that are tagged in the basic info section. You can reference them as `{{category.title}}` for the primary category, and manually list any additional categories you've tagged.

#### Product Long Description

When editing the `longDescription` field:

```
Write a detailed description for [Product Name], which belongs to the [Primary Category] category and can also be used for [Other Categories]. Include 3-4 paragraphs covering:
1. An overview of what it is and its professional quality
2. Key features and materials used
3. Common use cases and applications across different categories
4. Why customers should choose this product over competitors
```

#### Product FAQ

When adding items to the `faq` array:

For Question:

```
Generate a common customer question about [specific aspect] of [Product Name] when used for [specific category] purposes
```

For Answer:

```
Provide a helpful, accurate and concise answer about [question topic] for [Product Name], explaining how it applies across [Category 1] and [Category 2] use cases in 2-3 sentences.
```

#### Product Specifications

When adding to `specifications`:

```
List 5 technical specifications for [Product Name] that are relevant for both [Category 1] and [Category 2] applications, including dimensions, materials, weight, finish options, and print quality.
```

#### SEO Metadata

For `seo.metaTitle`:

```
Write an SEO-friendly title for [Product Name] under 60 characters that includes relevant keywords for [Primary Category] and [Secondary Category] printing.
```

For `seo.metaDescription`:

```
Write an SEO meta description for [Product Name] that highlights its versatility across [Category 1] and [Category 2] applications. Include relevant printing industry keywords and keep it under 160 characters.
```

#### Product Category Description

For the `description` field in product categories:

```
Write a brief description for the [Category Name] product category. Explain what types of products are in this category and their common benefits for businesses. Keep it under 200 characters.
```

## Best Practices

1. **Be specific**: The more specific your prompt, the better the results.
2. **Review and edit**: Always review AI-generated content and edit as needed.
3. **Include context**: Mention product names, categories, and specific details in your prompts.
4. **Use industry terminology**: Include printing industry terms to get more accurate results.
5. **Keep SEO in mind**: For descriptions visible to search engines, request content with relevant keywords.

## Multi-Category Products

For products that belong to multiple categories:

1. **Tag all relevant categories** in the basic info section before using AI Assist.
2. **List all tagged categories** in your prompts for more accurate content.
3. **Prioritize categories** by listing the primary category first, followed by secondary ones.
4. **Request versatile content** that addresses how the product serves different category needs.
5. **Use category-specific examples** in descriptions to demonstrate the product's versatility.
6. **Ensure consistency** between tagged categories in Sanity and categories mentioned in content.

Example multi-category prompt for a fully-tagged product:

```
Write a description for our Premium Cardstock that has been tagged under Business Cards, Flyers, and Brochures categories. Highlight how its quality (110lb weight, smooth finish) makes it ideal for each of these applications. Keep it under 160 characters.
```

## Technical Fields to Avoid

AI Assist works best with content fields. Avoid using it for technical fields like:

- `slug`
- `status`
- IDs or reference fields
- Technical specifications that require exact measurements

## Getting Help

If you encounter issues with AI Assist:

1. Ensure your OpenAI API key is valid and has sufficient credits
2. Check that the `.env.local` file is correctly set up
3. Restart the Sanity Studio if changes were made to environment variables
4. Contact your administrator if issues persist

## Using AI Assist with Tagged Categories

To get the most out of AI Assist with tagged product categories:

1. **Complete basic info first**: Always tag all applicable categories in the basic info section before using AI Assist.
2. **Reference tagged categories**: When writing prompts, explicitly mention all categories that have been tagged.
3. **Use variables when possible**: For the primary category, you can use `{{category.title}}` to reference it dynamically.
4. **Generate category-specific content**: For products with multiple categories, generate specific content sections for each category:
   ```
   Write a paragraph about how [Product] is used specifically for [Category 1] applications.
   ```
5. **Create unified content**: After generating category-specific sections, you can ask AI Assist to combine them:
   ```
   Combine the following category-specific paragraphs into a cohesive product description that highlights versatility across all categories: [Paste previous AI-generated content]
   ```

For help with setting up your Sanity Studio structure to better manage multi-category products, see the example in `/examples/multi-category-structure.js`.
