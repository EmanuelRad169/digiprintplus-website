import { HeroSanity } from "@/components/sections/hero-sanity";
import { FeaturedServicesServerSection } from "@/components/sections/services-grid-server";
import FeaturedProductsSanity from "@/components/sections/featured-products-sanity";
import { AboutSanity } from "@/components/sections/about-sanity";
import { CallToActionSanity } from "@/components/sections/call-to-action-sanity";
import { getHeroSlides, getCTASectionById } from "@/lib/sanity/contentFetchers";
import { getFeaturedProducts, getHomepageSettings } from "@/lib/sanity/homepageFetchers";
import { draftMode } from "next/headers";

// Mark page as static for export
export const dynamic = "force-static";
export const revalidate = false; // No revalidation for static export

export default async function HomePage() {
  const { isEnabled: isDraftMode } = await draftMode();
  
  let heroSlides;
  let ctaData;
  let featuredProducts;
  let homepageSettings;

  try {
    heroSlides = await getHeroSlides();
  } catch (error) {
    console.error("Error fetching hero slides:", error);
  }

  try {
    ctaData = await getCTASectionById("homepage-cta");
  } catch (error) {
    console.error("Error fetching CTA data:", error);
  }

  try {
    featuredProducts = await getFeaturedProducts();
  } catch (error) {
    console.error("Error fetching featured products:", error);
    featuredProducts = [];
  }

  try {
    homepageSettings = await getHomepageSettings();
  } catch (error) {
    console.error("Error fetching homepage settings:", error);
  }

  return (
    <>
      <HeroSanity initialSlides={heroSlides} />
      <FeaturedProductsSanity 
        products={featuredProducts} 
        carouselSettings={homepageSettings?.carouselSettings}
      />
      <FeaturedServicesServerSection />
      <AboutSanity />
      <CallToActionSanity
        sectionId="homepage-cta"
        fallbackData={ctaData || undefined}
      />
    </>
  );
}
