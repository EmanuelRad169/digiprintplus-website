import { HeroSanity } from "@/components/sections/hero-sanity";
import { FeaturedServicesServerSection } from "@/components/sections/services-grid-server";
import FeaturedProducts from "@/components/sections/featured-products";
import { AboutSanity } from "@/components/sections/about-sanity";
import { CallToActionSanity } from "@/components/sections/call-to-action-sanity";
import { getHeroSlides, getCTASectionById } from "@/lib/sanity/contentFetchers";

// Mark page as static for export
export const dynamic = "force-static";
export const revalidate = false; // No revalidation for static export

export default async function HomePage() {
  let heroSlides;
  let ctaData;

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
  return (
    <>
      <HeroSanity initialSlides={heroSlides} />
      <FeaturedProducts />
      <FeaturedServicesServerSection />
      <AboutSanity />
      <CallToActionSanity
        sectionId="homepage-cta"
        fallbackData={ctaData || undefined}
      />
    </>
  );
}
