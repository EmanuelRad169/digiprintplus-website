import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceBySlug, getServices } from '@/lib/sanity/contentFetchers'
import { PortableTextRenderer } from '@/components/portable-text'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react'

export const revalidate = 60

interface ServicePageProps {
  params: {
    slug: string
  }
}

// Generate static paths for all services
export async function generateStaticParams() {
  const services = await getServices()
  
  return services.map((service) => ({
    slug: service.slug.current,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: service.seo?.metaTitle || `${service.title} | DigiPrintPlus`,
    description: service.seo?.metaDescription || service.description,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden min-h-[40vh] flex items-center">
        {/* Background Image */}
        {service.image?.asset?.url && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${service.image.asset.url}')`
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/70"></div>
          </div>
        )}
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-7xl">
            {/* Back Link */}
            <Link 
              href="/services"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="/quote" 
                className="bg-gradient-to-r from-[#ea088c] to-pink-500 hover:from-pink-600 hover:to-[#ea088c] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-[#ea088c]/20 hover:shadow-[#ea088c]/30 flex items-center gap-2"
              >
                Get a Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/contact" 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="p-8">
              {service.content && service.content.length > 0 ? (
                <div className="prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700">
                  <PortableTextRenderer content={service.content} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose prose-lg prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">{service.description}</p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                    <p className="text-blue-900 font-medium mb-2">📝 Content Coming Soon</p>
                    <p className="text-blue-800 text-sm">
                      Full service details are being added. In the meantime, please contact us for more information about this service.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-r from-magenta-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-white/90 mb-6">
                Let&apos;s bring your project to life with our {service.title.toLowerCase()} services.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/quote"
                  className="bg-white text-magenta-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  Request a Quote <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <CheckCircle className="w-5 h-5 text-magenta-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Quick Contact */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Need Help?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Our team is ready to answer your questions and help you get started.
                  </p>
                  <Link 
                    href="/contact"
                    className="block w-full bg-magenta-600 hover:bg-magenta-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Contact Our Team
                  </Link>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  )
}
