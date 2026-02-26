import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

const siteUrl = getSiteUrl();

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
