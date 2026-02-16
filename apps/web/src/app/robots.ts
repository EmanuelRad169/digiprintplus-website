export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digiprintplus.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/studio/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
