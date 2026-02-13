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

// Template categories matching your product categories
const templateCategories = [
  // POPULAR CATEGORIES
  {
    title: "All Templates",
    slug: "all-templates",
    description: "Browse all available templates across all categories",
    order: 1,
    group: "popular",
  },
  {
    title: "Business Cards",
    slug: "business-cards",
    description:
      "Professional business card templates for networking and brand identity",
    order: 2,
    group: "popular",
  },
  {
    title: "Announcement Cards",
    slug: "announcement-cards",
    description:
      "Templates for special announcements, invitations, and event cards",
    order: 3,
    group: "popular",
  },
  {
    title: "Booklets",
    slug: "booklets",
    description: "Multi-page booklet and catalog templates",
    order: 4,
    group: "popular",
  },
  {
    title: "Bookmarks",
    slug: "bookmarks",
    description:
      "Creative bookmark templates for libraries, schools, and businesses",
    order: 5,
    group: "popular",
  },
  {
    title: "Calendars",
    slug: "calendars",
    description: "Custom calendar templates for businesses and personal use",
    order: 6,
    group: "popular",
  },
  {
    title: "Presentation Folders",
    slug: "presentation-folders",
    description: "Professional presentation folder templates for corporate use",
    order: 7,
    group: "popular",
  },
  {
    title: "Banner Stands",
    slug: "banner-stands",
    description: "Display banner and stand templates for events and retail",
    order: 8,
    group: "popular",
  },

  // BUSINESS ESSENTIALS
  {
    title: "Counter Display Cards",
    slug: "counter-display-cards",
    description: "Point-of-sale display card templates for retail environments",
    order: 10,
    group: "business",
  },
  {
    title: "Door Hangers",
    slug: "door-hangers",
    description: "Direct marketing door hanger templates",
    order: 11,
    group: "business",
  },
  {
    title: "Envelopes",
    slug: "envelopes",
    description: "Custom envelope templates for business correspondence",
    order: 12,
    group: "business",
  },
  {
    title: "Flyers & Brochures",
    slug: "flyers-brochures",
    description: "Marketing flyer and brochure templates for promotions",
    order: 13,
    group: "business",
  },
  {
    title: "Catalogs",
    slug: "catalogs",
    description: "Product catalog and lookbook templates",
    order: 14,
    group: "business",
  },
  {
    title: "Letterheads",
    slug: "letterheads",
    description:
      "Professional letterhead templates for business correspondence",
    order: 15,
    group: "business",
  },
  {
    title: "Rack Cards",
    slug: "rack-cards",
    description: "Rack card templates for tourism and hospitality marketing",
    order: 16,
    group: "business",
  },
  {
    title: "Trading Cards",
    slug: "trading-cards",
    description:
      "Custom trading card templates for sports, games, and collectibles",
    order: 17,
    group: "business",
  },

  // SPECIALTY ITEMS
  {
    title: "NCR Forms",
    slug: "ncr-forms",
    description: "No carbon required form templates for business documentation",
    order: 20,
    group: "specialty",
  },
  {
    title: "Notepads",
    slug: "notepads",
    description: "Custom notepad and memo pad templates",
    order: 21,
    group: "specialty",
  },
  {
    title: "Postcards",
    slug: "postcards",
    description: "Marketing postcard templates for direct mail campaigns",
    order: 22,
    group: "specialty",
  },
  {
    title: "Table Tents",
    slug: "table-tents",
    description: "Restaurant and event table tent templates",
    order: 23,
    group: "specialty",
  },
  {
    title: "Posters",
    slug: "posters",
    description: "Large format poster templates for advertising and events",
    order: 24,
    group: "specialty",
  },
  {
    title: "Event Tickets",
    slug: "event-tickets",
    description: "Custom event ticket and admission pass templates",
    order: 25,
    group: "specialty",
  },
  {
    title: "Hang Tags",
    slug: "hang-tags",
    description: "Product hang tag and label templates",
    order: 26,
    group: "specialty",
  },
  {
    title: "Large Format Banners",
    slug: "large-format-banners",
    description:
      "Oversized banner templates for outdoor advertising and events",
    order: 27,
    group: "specialty",
  },
];

async function createTemplateCategories() {
  try {
    console.log("🏷️  Creating Template Categories...");

    // Check existing categories
    const existingCategories = await sanityClient.fetch(
      '*[_type == "templateCategory"]{ title, slug }',
    );
    const existingSlugs = new Set(
      existingCategories.map((cat) => cat.slug?.current),
    );

    console.log(
      `Found ${existingCategories.length} existing template categories`,
    );

    const categoriesToCreate = templateCategories.filter(
      (category) => !existingSlugs.has(category.slug),
    );

    console.log(
      `Will create ${categoriesToCreate.length} new template categories`,
    );

    if (categoriesToCreate.length === 0) {
      console.log("✅ All template categories already exist!");
      return;
    }

    // Create categories in batches
    const batchSize = 5;
    let created = 0;

    for (let i = 0; i < categoriesToCreate.length; i += batchSize) {
      const batch = categoriesToCreate.slice(i, i + batchSize);

      const promises = batch.map(async (category) => {
        const doc = {
          _type: "templateCategory",
          status: "published",
          title: category.title,
          slug: {
            _type: "slug",
            current: category.slug,
          },
          description: category.description,
          order: category.order,
        };

        console.log(`Creating: ${category.title}`);
        return sanityClient.create(doc);
      });

      const results = await Promise.all(promises);
      created += results.length;

      console.log(
        `✅ Created batch ${Math.ceil((i + 1) / batchSize)} - ${results.length} categories`,
      );
    }

    console.log(`\n🎉 Successfully created ${created} template categories!`);

    // Display summary by group
    const groups = {
      popular: templateCategories.filter((c) => c.group === "popular"),
      business: templateCategories.filter((c) => c.group === "business"),
      specialty: templateCategories.filter((c) => c.group === "specialty"),
    };

    console.log("\n📊 Categories Summary:");
    console.log(`   📌 Popular Categories: ${groups.popular.length}`);
    console.log(`   💼 Business Essentials: ${groups.business.length}`);
    console.log(`   ⭐ Specialty Items: ${groups.specialty.length}`);
    console.log(`   🎯 Total: ${templateCategories.length}`);

    return created;
  } catch (error) {
    console.error("❌ Error creating template categories:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createTemplateCategories()
    .then(() => {
      console.log("\n✅ Template category creation completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Template category creation failed:", error);
      process.exit(1);
    });
}

module.exports = { createTemplateCategories, templateCategories };
