import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { sanityClient } from '@/lib/sanity'
import { generateSEO } from '@/lib/seo'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

// Custom components for PortableText
const portableTextComponents = {
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-6">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{children}</h4>,
    normal: ({ children }: any) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-magenta-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-gray-700">{children}</li>,
    number: ({ children }: any) => <li className="text-gray-700">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
    link: ({ children, value }: any) => (
      <a href={value.href} className="text-magenta-600 hover:text-magenta-700 hover:underline">
        {children}
      </a>
    ),
  },
}

// Fetch finishing page data
async function getFinishingPage(isPreview = false) {
  try {
    const query = `*[_type == "finishingPage"][0] {
      _id,
      title,
      slug,
      heroText,
      description,
      finishingServices[] {
        serviceName,
        description,
        icon,
        featured
      },
      featuredImage {
        asset->{
          _id,
          url
        },
        alt,
        caption
      },
      seo {
        metaTitle,
        metaDescription,
        ogImage {
          asset->{
            _id,
            url
          }
        }
      },
      publishedAt,
      isActive
    }`
    
    const page = await sanityClient.fetch(query, {}, {
      next: { revalidate: isPreview ? 0 : 60 },
    })
    
    return page
  } catch (error) {
    console.error('Error fetching finishing page:', error)
    return null
  }
}

export default async function FinishingPage() {
  const { isEnabled } = await draftMode()
  const page = await getFinishingPage(isEnabled)

  if (!page || !page.isActive) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden min-h-[20vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: page.featuredImage 
              ? `url('${page.featuredImage.asset.url}')` 
              : "url('https://images.pexels.com/photos/5816293/pexels-photo-5816293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 py-14 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {page.title}
            </h1>
            {page.heroText ? (
              <div className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl">
                <PortableText value={page.heroText} components={{
                  ...portableTextComponents,
                  block: {
                    ...portableTextComponents.block,
                    normal: ({ children }: any) => <p className="text-white/90 leading-relaxed mb-4">{children}</p>,
                    h1: ({ children }: any) => <h1 className="text-white font-bold mt-4 mb-2">{children}</h1>,
                    h2: ({ children }: any) => <h2 className="text-white font-bold mt-4 mb-2">{children}</h2>,
                    h3: ({ children }: any) => <h3 className="text-white font-semibold mt-3 mb-2">{children}</h3>,
                  }
                }} />
              </div>
            ) : (
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl">
                Transform your printed materials with our comprehensive finishing services. From binding and lamination to die-cutting and foil stamping, we deliver professional results that make your projects stand out.
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/quote" 
                className="bg-gradient-to-r from-[#ea088c] to-pink-500 hover:from-pink-600 hover:to-[#ea088c] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-[#ea088c]/20 hover:shadow-[#ea088c]/30 flex items-center gap-2"
              >
                Request a Quote <span className="ml-1">→</span>
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
      <div className="py-1">
        <div className="container mx-auto px-4">
          
          {/* Finishing Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center py-14">
            <div>
              <div className="inline-flex items-center bg-yellow-300 text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-4 h-4 mr-2">✨</span>
                Professional Finishing
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                Expert Finishing Services
              </h2>
              
              {/* Dynamic content from Sanity */}
              {page.description ? (
                <div className="prose prose-lg mb-8 text-gray-600">
                  <PortableText value={page.description} components={portableTextComponents} />
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Our state-of-the-art finishing department offers a comprehensive range of post-press services to enhance your printed materials. From simple binding to complex die-cutting, we deliver professional results.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    With advanced equipment and skilled technicians, we ensure every project meets the highest standards of quality and precision.
                  </p>
                </div>
              )}
            </div>
            
            {/* Finishing Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-100 to-magenta-100 relative">
                {page.featuredImage ? (
                  <Image
                    src={page.featuredImage.asset.url}
                    alt={page.featuredImage.alt || "Finishing Services"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl">🎨</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Finishing Services Section */}
          {page.finishingServices && page.finishingServices.length > 0 && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  Our Finishing <span className="text-magenta-500">Services</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Professional finishing options to complete your project with excellence
                </p>
              </div>

              {/* All Services */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {page.finishingServices.map((service: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 py-8 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-4">{service.icon}</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {service.serviceName}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Why Choose Our Finishing Section */}
          <div className="p-8 lg:p-16 my-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                Why Choose Our <span className="text-magenta-500">Finishing</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                Advanced technology, skilled craftsmanship, and attention to detail in every project
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-magenta-500 text-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl">01</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Advanced Equipment</h3>
                <p className="text-gray-600 leading-relaxed">
                  State-of-the-art finishing equipment ensures precision and consistency in every project.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-magenta-500 text-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl">02</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Skilled Technicians</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our experienced team brings years of expertise to handle complex finishing requirements.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-magenta-500 text-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl">03</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Quick Turnaround</h3>
                <p className="text-gray-600 leading-relaxed">
                  Efficient processes and workflow optimization deliver your finished products on time.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    {/* Bottom CTA */}
         <div className="container bg-magenta-500 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 bg-[length:20px_20px]"></div>
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to start your next print project?</h2>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                    Contact us today to discuss how our printing services can help bring your ideas to life.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link 
                        href="/quote" 
                            className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                        Get a Quote
                    </Link>
                    <Link 
                        href="/contact" 
                            className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFinishingPage()
  
  if (!page) {
    return {
      title: 'Finishing Services',
      description: 'Professional finishing services for your printing projects'
    }
  }

  return generateSEO({
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || 'Professional finishing services to complete your printing projects with quality and precision.',
    canonical: '/finishing'
  })
}