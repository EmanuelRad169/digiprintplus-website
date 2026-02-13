const { createClient } = require("@sanity/client");
require("dotenv").config({ path: "../../web/.env.local" });

// Create sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "development",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
});

async function checkTemplateSystemStatus() {
  try {
    console.log("📊 Template System Status Report");
    console.log("=".repeat(50));

    // Get all data
    const [
      templateCategories,
      templates,
      products,
      productTemplateConnections,
    ] = await Promise.all([
      sanityClient.fetch(
        `*[_type == "templateCategory"] | order(order asc) { title, slug, status, order }`,
      ),
      sanityClient.fetch(
        `*[_type == "template"] { title, status, category->{ title, slug } }`,
      ),
      sanityClient.fetch(
        `*[_type == "product"] { title, slug, category->{ title, slug } }`,
      ),
      sanityClient.fetch(
        `*[_type == "product" && defined(templates)] { title, "templateCount": count(templates) }`,
      ),
    ]);

    console.log(`\n🏷️  Template Categories: ${templateCategories.length}`);

    // Group categories
    const categoriesByGroup = {
      popular: templateCategories.slice(0, 8),
      business: templateCategories.slice(8, 16),
      specialty: templateCategories.slice(16),
    };

    console.log(
      `   📌 Popular Categories: ${categoriesByGroup.popular.length}`,
    );
    categoriesByGroup.popular.forEach((cat) =>
      console.log(`      • ${cat.title}`),
    );

    console.log(
      `   💼 Business Essentials: ${categoriesByGroup.business.length}`,
    );
    categoriesByGroup.business.forEach((cat) =>
      console.log(`      • ${cat.title}`),
    );

    console.log(`   ⭐ Specialty Items: ${categoriesByGroup.specialty.length}`);
    categoriesByGroup.specialty.forEach((cat) =>
      console.log(`      • ${cat.title}`),
    );

    console.log(`\n📄 Templates: ${templates.length}`);
    const templatesByStatus = templates.reduce((acc, template) => {
      acc[template.status || "draft"] =
        (acc[template.status || "draft"] || 0) + 1;
      return acc;
    }, {});

    Object.entries(templatesByStatus).forEach(([status, count]) => {
      console.log(`   • ${status}: ${count} templates`);
    });

    console.log(`\n🛍️  Products: ${products.length}`);
    console.log(
      `   • Products with templates: ${productTemplateConnections.length}`,
    );

    if (productTemplateConnections.length > 0) {
      const totalTemplateConnections = productTemplateConnections.reduce(
        (sum, product) => sum + product.templateCount,
        0,
      );
      const avgTemplates = (
        totalTemplateConnections / productTemplateConnections.length
      ).toFixed(1);
      console.log(
        `   • Total template connections: ${totalTemplateConnections}`,
      );
      console.log(`   • Average templates per product: ${avgTemplates}`);

      console.log("\n🔗 Top products with templates:");
      productTemplateConnections
        .sort((a, b) => b.templateCount - a.templateCount)
        .slice(0, 5)
        .forEach((product) => {
          console.log(
            `      • ${product.title}: ${product.templateCount} templates`,
          );
        });
    }

    // Check template distribution by category
    console.log(`\n📂 Template distribution by category:`);
    const templatesByCategory = templates.reduce((acc, template) => {
      const categoryTitle = template.category?.title || "Uncategorized";
      acc[categoryTitle] = (acc[categoryTitle] || 0) + 1;
      return acc;
    }, {});

    Object.entries(templatesByCategory)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`   • ${category}: ${count} templates`);
      });

    console.log("\n✅ Template System Status: OPERATIONAL");

    if (templates.length === 0) {
      console.log(
        "\n⚠️  Recommendation: Upload template files to Sanity Studio",
      );
    }

    if (productTemplateConnections.length < products.length * 0.5) {
      console.log(
        "⚠️  Recommendation: Consider mapping more templates to products",
      );
    }

    console.log("\n🔗 Quick Links:");
    console.log(`   • Studio: http://localhost:3335`);
    console.log(`   • Website: http://localhost:3001`);
    console.log(`   • Templates Page: http://localhost:3001/templates`);
  } catch (error) {
    console.error("❌ Error checking template system status:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  checkTemplateSystemStatus()
    .then(() => {
      console.log("\n📊 Status check completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Status check failed:", error);
      process.exit(1);
    });
}

module.exports = { checkTemplateSystemStatus };
