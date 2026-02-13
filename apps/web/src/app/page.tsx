import { HeroSanity } from "@/components/sections/hero-sanity";
import { FeaturedServicesServerSection } from "@/components/sections/services-grid-server";
import CategoryCarousel from "@/components/sections/category-carousel";
import { AboutSanity } from "@/components/sections/about-sanity";
import { CallToActionSanity } from "@/components/sections/call-to-action-sanity";
import { getHeroSlides, getCTASectionById } from "@/lib/sanity/contentFetchers";
import { getProductCategories } from "@/lib/sanity/fetchers";
import { draftMode } from "next/headers";

// Mark page as static for export
export const dynamic = "force-static";
export const revalidate = false; // No revalidation for static export

export default async function HomePage() {
  const { isEnabled: isDraftMode } = await draftMode();

  let heroSlides;
  let ctaData;
  let productCategories: any[] = [];

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
    productCategories = await getProductCategories();
  } catch (error) {
    console.error("Error fetching product categories:", error);
    productCategories = [];
  }

  return (
    <>
      <HeroSanity initialSlides={heroSlides} />
      <CategoryCarousel categories={productCategories} />
      <FeaturedServicesServerSection />
      <AboutSanity />
      <CallToActionSanity
        sectionId="homepage-cta"
        fallbackData={ctaData || undefined}
      />
    </>
  );
}
