/**
 * Site URL utilities
 * 
 * Provides centralized access to the site URL with safe fallback.
 * In production, NEXT_PUBLIC_SITE_URL should always be set in Netlify.
 */

/**
 * Get the site URL from environment variables with safe fallback
 * 
 * Returns NEXT_PUBLIC_SITE_URL if set, otherwise falls back to
 * the Netlify subdomain. This ensures consistent URL usage across
 * sitemap, robots.txt, SEO metadata, and canonical links.
 * 
 * @returns The site URL (always includes protocol, no trailing slash)
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://digiprint-main-web.netlify.app"
  );
}
