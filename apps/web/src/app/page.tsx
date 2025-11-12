import { HeroSanity } from '@/components/sections/hero-sanity'
import { FeaturedServicesServerSection } from '@/components/sections/services-grid-server'
import FeaturedProducts from '@/components/sections/featured-products'
import { AboutSanity } from '@/components/sections/about-sanity'
import { CallToActionSanity } from '@/components/sections/call-to-action-sanity'

// Mark page as server component
export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

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