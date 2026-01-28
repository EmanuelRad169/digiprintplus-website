const { createClient } = require("@sanity/client");
require("dotenv").config({ path: "../web/.env.local" });

// Create sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "development",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
});

// Mapping between product categories and template categories
const categoryMappings = {
  // Direct mappings (product category -> template categories)
  "business-cards": ["business-cards"],
  "announcement-cards": ["announcement-cards"],
  booklets: ["booklets", "catalogs"],
  bookmarks: ["bookmarks"],
  calendars: ["calendars"],
  "presentation-folder": ["presentation-folders"],
  "banner-stand": ["banner-stands", "large-format-banners"],
  "counter-display-cards": ["counter-display-cards"],
  "door-hangers": ["door-hangers"],
  envelopes: ["envelopes"],
  "flyers-brochures": ["flyers-brochures"],
  catalogs: ["catalogs", "booklets"],
  letterheads: ["letterheads"],
  "rack-cards": ["rack-cards"],
  "trading-cards": ["trading-cards"],
  "ncr-forms": ["ncr-forms"],
  notepads: ["notepads"],
  postcards: ["postcards"],
  "table-tents": ["table-tents"],
  posters: ["posters", "large-format-banners"],
  "event-tickets": ["event-tickets"],
  "hang-tags": ["hang-tags"],
  "large-format-banner": ["large-format-banners", "posters"],
};

// Keywords for smart matching when direct mapping isn't available
const keywordMappings = {
  "business-cards": ["business", "card", "networking", "contact"],
  "flyers-brochures": [
    "flyer",
    "brochure",
    "marketing",
    "promotion",
    "tri-fold",
  ],
  letterheads: ["letterhead", "stationery", "header", "correspondence"],
  posters: ["poster", "display", "advertising", "announcement"],
  postcards: ["postcard", "mailer", "direct mail"],
  banners: ["banner", "signage", "outdoor", "display"],
  booklets: ["booklet", "catalog", "brochure", "multi-page"],
  envelopes: ["envelope", "mailing", "correspondence"],
  calendars: ["calendar", "planner", "schedule", "monthly"],
  "table-tents": ["table tent", "menu", "restaurant", "display"],
  "hang-tags": ["hang tag", "label", "product tag", "pricing"],
  "event-tickets": ["ticket", "admission", "event", "pass"],
};

async function mapTemplatesToProducts() {
  try {
    console.log("🔗 Mapping templates to products based on categories...");

    // Fetch all data
    const [products, templates, templateCategories] = await Promise.all([
      sanityClient.fetch(`
        *[_type == "product"] {
          _id,
          title,
          slug,
          category->{ title, slug },
          "existingTemplates": templates[]->_id
        }
      `),
      sanityClient.fetch(`
        *[_type == "template" && status == "published"] {
          _id,
          title,
          slug,
          category->{ title, slug }
        }
      `),
      sanityClient.fetch(`
        *[_type == "templateCategory"] {
          _id,
          title,
          slug
        }
      `),
    ]);

    console.log(`📊 Found:
    • ${products.length} products
    • ${templates.length} templates  
    • ${templateCategories.length} template categories`);

    // Create lookup maps
    const templatesByCategorySlug = {};
    templates.forEach((template) => {
      const categorySlug = template.category?.slug?.current;
      if (categorySlug) {
        if (!templatesByCategorySlug[categorySlug]) {
          templatesByCategorySlug[categorySlug] = [];
        }
        templatesByCategorySlug[categorySlug].push(template);
      }
    });

    console.log("\n📂 Templates by category:");
    Object.entries(templatesByCategorySlug).forEach(([slug, templates]) => {
      console.log(`   • ${slug}: ${templates.length} templates`);
    });

    const updates = [];
    let matchedProducts = 0;

    for (const product of products) {
      const productCategorySlug = product.category?.slug?.current;
      const existingTemplateIds = new Set(product.existingTemplates || []);
      let matchedTemplates = [];

      // Method 1: Direct category mapping
      if (productCategorySlug && categoryMappings[productCategorySlug]) {
        const templateCategorySlugs = categoryMappings[productCategorySlug];

        templateCategorySlugs.forEach((categorySlug) => {
          if (templatesByCategorySlug[categorySlug]) {
            matchedTemplates.push(...templatesByCategorySlug[categorySlug]);
          }
        });
      }

      // Method 2: Keyword-based matching if no direct match
      if (matchedTemplates.length === 0 && product.title) {
        const productTitle = (product.title || "").toLowerCase();
        const categoryTitle = (product.category?.title || "").toLowerCase();

        // Check each keyword mapping
        Object.entries(keywordMappings).forEach(
          ([templateCategory, keywords]) => {
            const hasKeywordMatch = keywords.some(
              (keyword) =>
                productTitle.includes(keyword.toLowerCase()) ||
                categoryTitle.includes(keyword.toLowerCase()),
            );

            if (hasKeywordMatch && templatesByCategorySlug[templateCategory]) {
              matchedTemplates.push(
                ...templatesByCategorySlug[templateCategory],
              );
            }
          },
        );
      }

      // Method 3: Fallback to similar category names
      if (matchedTemplates.length === 0 && productCategorySlug) {
        // Try to find template categories with similar names
        Object.keys(templatesByCategorySlug).forEach((templateCategorySlug) => {
          const similarity = calculateSimilarity(
            productCategorySlug,
            templateCategorySlug,
          );
          if (similarity > 0.6) {
            // 60% similarity threshold
            matchedTemplates.push(
              ...templatesByCategorySlug[templateCategorySlug],
            );
          }
        });
      }

      // Remove duplicates and existing templates
      const uniqueTemplates = matchedTemplates.filter(
        (template, index, self) => {
          return (
            self.findIndex((t) => t._id === template._id) === index &&
            !existingTemplateIds.has(template._id)
          );
        },
      );

      if (uniqueTemplates.length > 0) {
        // Limit to 8 templates per product to avoid overwhelming
        const selectedTemplates = uniqueTemplates.slice(0, 8);
        const templateRefs = selectedTemplates.map((template) => ({
          _type: "reference",
          _ref: template._id,
        }));

        // Combine with existing templates
        const allTemplateRefs = [
          ...(product.existingTemplates || []).map((id) => ({
            _type: "reference",
            _ref: id,
          })),
          ...templateRefs,
        ];

        updates.push({
          productId: product._id,
          productTitle: product.title,
          categorySlug: productCategorySlug,
          newTemplateCount: selectedTemplates.length,
          totalTemplateCount: allTemplateRefs.length,
          templateRefs: allTemplateRefs,
        });

        matchedProducts++;
      }
    }

    console.log(`\n🎯 Mapping Results:
    • ${matchedProducts} products will get template mappings
    • ${updates.length} total updates to perform`);

    if (updates.length === 0) {
      console.log(
        "✅ No updates needed - all products already have appropriate templates",
      );
      return;
    }

    // Show preview of updates
    console.log("\n📋 Update Preview:");
    updates.slice(0, 5).forEach((update) => {
      console.log(
        `   • ${update.productTitle}: +${update.newTemplateCount} templates (total: ${update.totalTemplateCount})`,
      );
    });

    if (updates.length > 5) {
      console.log(`   ... and ${updates.length - 5} more products`);
    }

    // Execute updates in batches
    console.log("\n🚀 Executing updates...");
    const batchSize = 10;
    let completed = 0;

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      const promises = batch.map(async (update) => {
        return sanityClient
          .patch(update.productId)
          .set({ templates: update.templateRefs })
          .commit();
      });

      await Promise.all(promises);
      completed += batch.length;

      console.log(`✅ Completed ${completed}/${updates.length} products`);
    }

    console.log(`\n🎉 Successfully mapped templates to ${completed} products!`);

    // Summary statistics
    const totalNewTemplateConnections = updates.reduce(
      (sum, update) => sum + update.newTemplateCount,
      0,
    );
    console.log(`\n📊 Mapping Summary:
    • Products updated: ${completed}
    • New template connections: ${totalNewTemplateConnections}
    • Average templates per product: ${(totalNewTemplateConnections / completed).toFixed(1)}`);

    return completed;
  } catch (error) {
    console.error("❌ Error mapping templates to products:", error);
    throw error;
  }
}

// Helper function to calculate string similarity
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Run if called directly
if (require.main === module) {
  mapTemplatesToProducts()
    .then(() => {
      console.log("\n✅ Template mapping completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Template mapping failed:", error);
      process.exit(1);
    });
}

module.exports = { mapTemplatesToProducts };
