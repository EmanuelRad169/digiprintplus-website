import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

// Cache settings - revalidate every 30 seconds
const revalidate = 30;

export async function GET() {
  try {
    console.log("🔍 API: Fetching templates and categories...");

    // Fetch templates and categories from Sanity
    const [templates, categories] = await Promise.all([
      sanityClient.fetch(`
        *[_type == "template" && status == "published"] | order(_createdAt desc) {
          _id,
          title,
          slug,
          description,
          status,
          category->{
            _id,
            title,
            slug,
            description
          },
          fileType,
          size,
          downloadCount,
          previewImage{
            asset->{
              _id,
              url
            },
            alt
          },
          downloadFile{
            asset->{
              _id,
              url,
              originalFilename
            }
          },
          tags,
          rating,
          isPremium,
          price,
          _createdAt,
          _updatedAt
        }
      `),
      sanityClient.fetch(`
        *[_type == "templateCategory" && status == "published"] | order(order asc) {
          _id,
          title,
          slug,
          description,
          order,
          status
        }
      `),
    ]);

    console.log("📊 API: Fetched data:", {
      templates: templates?.length || 0,
      categories: categories?.length || 0,
    });

    // Add detailed logging
    console.log("📄 Templates sample:", templates?.slice(0, 2));
    console.log("🏷️ Categories sample:", categories?.slice(0, 3));

    return NextResponse.json(
      {
        success: true,
        data: {
          templates: templates || [],
          categories: categories || [],
          templateCount: templates?.length || 0,
          categoryCount: categories?.length || 0,
          lastFetched: new Date().toISOString(),
        },
      },
      {
        headers: {
          "Cache-Control": `s-maxage=${revalidate}, stale-while-revalidate=86400`,
        },
      },
    );
  } catch (error) {
    console.error("❌ API: Error fetching templates:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: {
          templates: [],
          categories: [],
          templateCount: 0,
          categoryCount: 0,
        },
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

// Enable static generation with revalidation
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
