import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import { getPageBySlug, getAboutPage, getFinishingPage } from '@/lib/sanity/fetchers'
import { PortableTextRenderer } from '@/components/portable-text'

export const revalidate = 60

interface PageProps {
  params: {
    slug: string
  }
}

// Define a type for the service items
type ServiceItem = {
  title: string
  description: string
}

// Define a type for the whyChooseUs items
type WhyChooseUsItem = {
  title: string
  description: string
}

// Define a type for team members
type TeamMember = {
  name: string
  role: string
  bio: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params
  const { isEnabled } = draftMode()
  
  // Try to fetch as an "about" page first, then fallback to generic "page"
  let pageData = await getAboutPage(slug, isEnabled)
  let isAboutPage = !!pageData
  
  if (!pageData) {
    pageData = await getPageBySlug(slug, isEnabled)
  }

  if (!pageData) {
    notFound()
  }

  // Render about page with enhanced layout
  if (isAboutPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-4xl mx-auto">
              {pageData.heroImage && (
                <div className="mb-8">
                  <Image
                    src={pageData.heroImage.asset.url}
                    alt={pageData.heroImage.alt || pageData.title}
                    width={800}
                    height={320}
                    className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                  />
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                {pageData.title}
              </h1>
              {pageData.subtitle && (
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  {pageData.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {pageData.content && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12 mb-16">
              <div className="prose prose-slate prose-lg max-w-none">
                <PortableTextRenderer content={pageData.content} />
              </div>
            </div>
          )}

          {/* Services Section */}
          {pageData.services?.items?.length > 0 && (
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-6">
                {pageData.services.items.map((service: ServiceItem, index: number) => (
                  <div key={index} className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-slate-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Section */}
          {pageData.stats?.items?.length > 0 && (
            <div className="bg-slate-900 rounded-xl shadow-sm p-8 lg:p-12 mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {pageData.stats.title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {pageData.stats.items.map((stat: { number: string | number; label: string }, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-slate-300 text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Choose Us Section */}
          {pageData.whyChooseUs?.items?.length > 0 && (
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-6">
                {pageData.whyChooseUs.items.map((item: WhyChooseUsItem, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Section */}
          {pageData.teamSection?.members?.length > 0 && (
            <div className="mb-16">
              <div className="grid md:grid-cols-3 gap-8">
                {pageData.teamSection.members.map((member: TeamMember, index: number) => (
                  <div key={index} className="text-center">
                    {member.image && (
                      <Image
                        src={member.image.asset.url}
                        alt={member.image.alt || member.name}
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-cyan-600 font-medium mb-3">{member.role}</p>
                    <p className="text-slate-600 text-sm">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          {pageData.cta && (
            <div className="bg-gradient-to-r from-cyan-600 to-magenta-600 rounded-xl shadow-sm p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {pageData.cta.title}
              </h2>
              {pageData.cta.description && (
                <p className="text-cyan-100 mb-8 max-w-2xl mx-auto">
                  {pageData.cta.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {pageData.cta.primaryButton && (
                  <a 
                    href={pageData.cta.primaryButton.url}
                    className="bg-white text-cyan-600 hover:bg-cyan-50 px-8 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    {pageData.cta.primaryButton.text}
                  </a>
                )}
                {pageData.cta.secondaryButton && (
                  <a 
                    href={pageData.cta.secondaryButton.url}
                    className="border border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    {pageData.cta.secondaryButton.text}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render generic page layout
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {pageData.title}
            </h1>
            {pageData.subtitle && (
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {pageData.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12">
          {pageData.content && (
            <div className="prose prose-slate prose-lg max-w-none">
              <PortableTextRenderer content={pageData.content} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Generate metadata from Sanity content
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params
  
  // Try to fetch as an "about" page first, then fallback to generic "page"
  let pageData = await getAboutPage(slug, false)
  
  if (!pageData) {
    pageData = await getPageBySlug(slug, false)
  }
  
  if (!pageData) {
    return {
      title: 'Page Not Found - DigiPrintPlus',
      description: 'The requested page could not be found.',
    }
  }

  // Build the metadata object
  const metadata: Metadata = {
    title: pageData.seo?.metaTitle || `${pageData.title} - DigiPrintPlus`,
    description: pageData.seo?.metaDescription || pageData.subtitle || 'Professional printing services and solutions.',
  }

  // Add OpenGraph data if we have an image
  if (pageData.seo?.ogImage?.asset?.url) {
    metadata.openGraph = {
      title: pageData.seo?.metaTitle || pageData.title,
      description: pageData.seo?.metaDescription || pageData.subtitle,
      images: [
        {
          url: pageData.seo.ogImage.asset.url,
          width: 1200,
          height: 630,
          alt: pageData.title,
        }
      ],
    }
  }

  // Add Twitter data if we have an image
  if (pageData.seo?.ogImage?.asset?.url) {
    metadata.twitter = {
      card: 'summary_large_image',
      title: pageData.seo?.metaTitle || pageData.title,
      description: pageData.seo?.metaDescription || pageData.subtitle,
      images: [pageData.seo.ogImage.asset.url],
    }
  }

  return metadata
}

// Generate static params for known pages
export async function generateStaticParams() {
  // You can fetch all pages from Sanity here if needed
  // For now, return empty array to use ISR
  return []
}
