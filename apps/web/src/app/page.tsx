import dynamic from "next/dynamic";
import { getHeroSlides, getCTASectionById } from "@/lib/sanity/contentFetchers";
import { getProductCategories } from "@/lib/sanity/fetchers";
import { draftMode } from "next/headers";
import { AboutSanity } from "@/components/sections/about-sanity";
import { FeaturedServicesServerSection } from "@/components/sections/services-grid-server";

// Dynamically import heavy components to reduce initial bundle
const HeroSanity = dynamic(
  () =>
    import("@/components/sections/hero-sanity").then((mod) => ({
      default: mod.HeroSanity,
    })),
  {
    loading: () => (
      <div className="h-[80vh] bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    ),
    ssr: true,
  },
);

const CategoryCarousel = dynamic(
  () => import("@/components/sections/category-carousel"),
  {
    loading: () => <div className="h-32 bg-white" />,
  },
);

const CallToActionSanity = dynamic(
  () =>
    import("@/components/sections/call-to-action-sanity").then((mod) => ({
      default: mod.CallToActionSanity,
    })),
  {
    loading: () => <div className="h-64 bg-slate-50" />,
  },
);

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

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
