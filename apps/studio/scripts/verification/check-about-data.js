const { createClient } = require("@sanity/client");
require("dotenv").config({ path: "../../web/.env.local" });

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "development",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
});

async function checkAboutPageData() {
  console.log("🔍 Checking about page data in Sanity...");

  try {
    // Check aboutPage documents
    const aboutPageData = await sanityClient.fetch(`
      *[_type == "aboutPage" && isActive == true][0] {
        _id,
        title,
        subtitle,
        heroImage{
          asset->{
            _id,
            url
          },
          alt
        },
        teamImage{
          asset->{
            _id,
            url
          },
          alt
        },
        content,
        achievements,
        isActive
      }
    `);

    console.log("\n📄 About Page (aboutPage type):");
    if (aboutPageData) {
      console.log("✅ Found aboutPage document:");
      console.log(`   Title: ${aboutPageData.title}`);
      console.log(`   Subtitle: ${aboutPageData.subtitle}`);
      console.log(
        `   Hero Image: ${aboutPageData.heroImage?.asset?.url ? "✅ Available" : "❌ Missing"}`,
      );
      console.log(
        `   Team Image: ${aboutPageData.teamImage?.asset?.url ? "✅ Available" : "❌ Missing"}`,
      );
      console.log(
        `   Content: ${aboutPageData.content ? "✅ Available" : "❌ Missing"}`,
      );
      console.log(
        `   Achievements: ${aboutPageData.achievements?.length || 0} items`,
      );

      if (aboutPageData.heroImage?.asset?.url) {
        console.log(`   Hero Image URL: ${aboutPageData.heroImage.asset.url}`);
      }
      if (aboutPageData.teamImage?.asset?.url) {
        console.log(`   Team Image URL: ${aboutPageData.teamImage.asset.url}`);
      }
    } else {
      console.log("❌ No aboutPage document found");
    }

    // Check about documents (different type)
    const aboutData = await sanityClient.fetch(`
      *[_type == "about" && slug.current == "about"][0] {
        _id,
        title,
        subtitle,
        heroImage{
          asset->{
            _id,
            url
          },
          alt
        },
        teamSection
      }
    `);

    console.log("\n📖 About (about type):");
    if (aboutData) {
      console.log("✅ Found about document:");
      console.log(`   Title: ${aboutData.title}`);
      console.log(`   Subtitle: ${aboutData.subtitle}`);
      console.log(
        `   Hero Image: ${aboutData.heroImage?.asset?.url ? "✅ Available" : "❌ Missing"}`,
      );
      console.log(
        `   Team Section: ${aboutData.teamSection ? "✅ Available" : "❌ Missing"}`,
      );

      if (aboutData.heroImage?.asset?.url) {
        console.log(`   Hero Image URL: ${aboutData.heroImage.asset.url}`);
      }
    } else {
      console.log("❌ No about document found");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkAboutPageData();
