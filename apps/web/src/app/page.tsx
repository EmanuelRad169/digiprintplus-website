import { HeroSanity } from '@/components/sections/hero-sanity'
import { FeaturedServicesServerSection } from '@/components/sections/services-grid-server'
import FeaturedProducts from '@/components/sections/featured-products'
import { AboutSanity } from '@/components/sections/about-sanity'
import { CallToActionSanity } from '@/components/sections/call-to-action-sanity'

// Mark page as static for export
export const dynamic = 'force-static'
export const revalidate = false // No revalidation for static export

export default function HomePage() {
  return (
    <>
      <HeroSanity />
      <FeaturedProducts />
      <FeaturedServicesServerSection />
      <AboutSanity />
      <CallToActionSanity sectionId="homepage-cta" />
    </>
  )
}