const { createTemplateCategories } = require("./create-template-categories.js");
const { mapTemplatesToProducts } = require("./map-templates-to-products.js");

async function setupTemplateSystem() {
  console.log("🚀 Setting up complete template system...\n");

  try {
    // Step 1: Create template categories
    console.log("=".repeat(50));
    console.log("STEP 1: Creating Template Categories");
    console.log("=".repeat(50));

    const createdCategories = await createTemplateCategories();

    if (createdCategories > 0) {
      console.log(`\n⏳ Waiting 3 seconds for categories to be indexed...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // Step 2: Map templates to products
    console.log("\n" + "=".repeat(50));
    console.log("STEP 2: Mapping Templates to Products");
    console.log("=".repeat(50));

    const mappedProducts = await mapTemplatesToProducts();

    // Final summary
    console.log("\n" + "=".repeat(50));
    console.log("✅ TEMPLATE SYSTEM SETUP COMPLETE!");
    console.log("=".repeat(50));

    console.log(`
📊 Final Results:
   • Template categories: ✅ Created/Updated
   • Products mapped: ${mappedProducts} products
   • System status: Fully operational

🎯 Next Steps:
   1. Review template categories in Sanity Studio
   2. Upload template files to match categories
   3. Check product pages for template availability
   4. Test template download functionality

🔗 Quick Links:
   • Studio: http://localhost:3335
   • Website: http://localhost:3001
   • Templates: http://localhost:3001/templates
`);

    return {
      categoriesCreated: createdCategories,
      productsMapped: mappedProducts,
    };
  } catch (error) {
    console.error("\n❌ Template system setup failed:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  setupTemplateSystem()
    .then(() => {
      console.log("\n🎉 Template system setup completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Template system setup failed:", error);
      process.exit(1);
    });
}

module.exports = { setupTemplateSystem };
