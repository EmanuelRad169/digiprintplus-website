import { Metadata } from 'next'
import { getPageBySlug, getSiteSettings } from '@/lib/sanity/fetchers'
import { PortableTextRenderer } from '@/components/portable-text'
import { ContactForm } from '@/components/contact-form'
import { draftMode } from 'next/headers'

export const revalidate = 60;

export default async function ContactPage() {
  const { isEnabled } = await draftMode()
  const [pageData, siteSettings] = await Promise.all([
    getPageBySlug('contact', isEnabled),
    getSiteSettings()
  ])

  const contactInfo = siteSettings?.contact || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {pageData?.title || 'Contact Us'}
            </h1>
            <p className="text-xl text-white/90 max-w-4xl mx-auto">
              {pageData?.subtitle || 'Get in touch with our team of experts. We\'re here to help bring your vision to life.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid lg:grid-cols-3 gap-0">
              
              {/* Left Side - Contact Info */}
              <div className="bg-gray-50 p-8 lg:p-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Whether you need business cards, brochures, banners, or custom printing solutions, 
                      we&apos;re here to bring your vision to life.
                    </p>
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-6">
                    {contactInfo.phone && (
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-magenta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-magenta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5a11 11 0 002.4 2.4l1.13-1.724a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Phone</h4>
                          <p className="text-gray-600">{contactInfo.phone}</p>
                          <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM EST</p>
                        </div>
                      </div>
                    )}

                    {contactInfo.email && (
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-magenta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-magenta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.703a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Email</h4>
                          <p className="text-gray-600">{contactInfo.email}</p>
                          <p className="text-sm text-gray-500">We respond within 24 hours</p>
                        </div>
                      </div>
                    )}

                    {contactInfo.address && (
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-magenta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-magenta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Address</h4>
                          <div className="text-gray-600 whitespace-pre-line">{contactInfo.address}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business Hours */}
                  {pageData?.businessHours && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Business Hours</h4>
                      <div className="prose prose-gray prose-sm max-w-none">
                        <PortableTextRenderer content={pageData.businessHours} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="lg:col-span-2 p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Send us a message</h2>
                  <p className="text-gray-600">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata from Sanity content
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageBySlug('contact')
  
  return {
    title: pageData?.seo?.metaTitle || 'Contact DigiPrintPlus - Get in Touch',
    description: pageData?.seo?.metaDescription || 'Contact us for quotes, questions, or to discuss your printing needs.',
  }
}