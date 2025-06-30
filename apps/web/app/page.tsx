import dynamic from 'next/dynamic'
import { FeaturedServicesServerSection } from '@/components/sections/services-grid-server'

// Use dynamic imports with SSR disabled for client components
const HeroSanity = dynamic(() => import('@/components/sections/hero-sanity').then(mod => ({ default: mod.HeroSanity })), { ssr: true })
const AboutSanity = dynamic(() => import('@/components/sections/about-sanity').then(mod => ({ default: mod.AboutSanity })), { ssr: true })
const CallToActionSanity = dynamic(() => import('@/components/sections/call-to-action-sanity').then(mod => ({ default: mod.CallToActionSanity })), { ssr: true })

export default function HomePage() {
  return (
    <>
      <HeroSanity />
      <FeaturedServicesServerSection />
      <AboutSanity />
      <CallToActionSanity sectionId="homepage-cta" />
    </>
  )
}