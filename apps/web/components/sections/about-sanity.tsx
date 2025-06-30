import { getAboutSections } from '@/lib/sanity/contentFetchers'
import ClientAboutSection from './client-about-section'

export async function AboutSanity() {
  const sections = await getAboutSections()
  
  if (!sections || sections.length === 0) {
    return null
  }
  return <ClientAboutSection sections={sections} />
}