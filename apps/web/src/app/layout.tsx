import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Navigation from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HeaderTop } from "@/components/header-top";
import { VisualEditing } from "@/components/visual-editing";
import { generateSEO, generateOrganizationSchema } from "@/lib/seo";
import { getNavigationMenu, getSiteSettings } from "@/lib/sanity/fetchers";
import { getFooter } from "@/lib/sanity/footer";

// Initialize the Inter font with SWC
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = generateSEO({
  title: "Professional Print Solutions",
  description:
    "Your trusted partner for high-quality printing services. Get instant quotes for business cards, brochures, banners, and more.",
  keywords: [
    "printing",
    "business cards",
    "brochures",
    "banners",
    "professional printing",
    "custom printing",
    "print services",
  ],
  canonical: "/",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();

  // Fetch data for navigation and footer
  const [navigationData, siteSettings, footerData] = await Promise.all([
    getNavigationMenu().catch((err) => {
      console.error("Failed to fetch navigation:", err);
      return null;
    }),
    getSiteSettings().catch((err) => {
      console.error("Failed to fetch site settings:", err);
      return null;
    }),
    getFooter().catch((err) => {
      console.error("Failed to fetch footer:", err);
      return null;
    }),
  ]);

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Preconnect to Sanity CDN for faster image loading */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/* Preconnect to Google services for faster analytics/fonts */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="font-sans">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <HeaderTop />
            <Navigation
              navigationData={navigationData}
              siteSettings={siteSettings}
            />
            <main className="flex-1">{children}</main>
            <Footer footerData={footerData} siteSettings={siteSettings} />
          </div>
          <VisualEditing />
        </Providers>
      </body>
    </html>
  );
}
