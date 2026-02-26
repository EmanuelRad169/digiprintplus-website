import { sanityClient } from "@/lib/sanity";

export async function getPageBySlug(slug: string) {
  try {
    const page = await sanityClient.fetch(
      `
      *[_type == "page" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        content,
        seo {
          metaTitle,
          metaDescription
        }
      }
    `,
      { slug },
      {
        next: { revalidate: 60 },
      },
    );

    return page;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export async function getAllPages() {
  try {
    const pages = await sanityClient.fetch(
      `
      *[_type == "page"] | order(title asc) {
        _id,
        title,
        slug,
        seo {
          metaTitle,
          metaDescription
        }
      }
    `,
      {},
      {
        next: { revalidate: 300 },
      },
    );

    return pages;
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}
