import { Metadata } from 'next'
import { getAboutPage } from '@/lib/sanity/fetchers'
import { getAboutPageData } from '@/lib/sanity/contentFetchers'
import { PortableTextRenderer } from '@/components/portable-text'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, CheckCircle, Users, Clock, Shield, Star } from 'lucide-react'
import { AboutSanity } from '@/components/sections/about-sanity'
import { CallToActionSanity } from '@/components/sections/call-to-action-sanity'

export const revalidate = 60

export default async function AboutPage() {
  const { isEnabled } = draftMode()
  const [pageData, enhancedData] = await Promise.all([
    getAboutPage('about', isEnabled),
    getAboutPageData()
  ])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden min-h-[50vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {enhancedData?.title || pageData?.title || 'About DigiPrintPlus'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl">
              {enhancedData?.subtitle || pageData?.subtitle || 'Delivering exceptional printing solutions with over 15 years of industry experience and unwavering commitment to quality.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/quote" className="bg-gradient-to-r from-[#ea088c] to-pink-500 hover:from-pink-600 hover:to-[#ea088c] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-[#ea088c]/20 hover:shadow-[#ea088c]/30 flex items-center gap-2">
                Get Your Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          
          {/* About Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-flex items-center bg-magenta-100 text-magenta-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Award className="w-4 h-4 mr-2" />
                Industry Leaders Since 2008
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                Your Trusted Printing Partner
              </h2>
              
              {/* Dynamic content from Sanity */}
              {(enhancedData?.content || pageData?.content) ? (
                <div className="prose prose-lg mb-8 text-gray-600">
                  <PortableTextRenderer content={enhancedData?.content || pageData.content} />
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    With over 15 years of experience in the printing industry, DigiPrintPlus has established itself as a trusted partner for businesses seeking high-quality printing solutions. We combine cutting-edge technology with traditional craftsmanship to deliver exceptional results.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Our commitment to excellence, attention to detail, and customer-first approach have made us the preferred choice for thousands of businesses across the country.
                  </p>
                </div>
              )}
              
              {/* Key Values - Dynamic from Sanity */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {(enhancedData?.achievements || [
                  { text: 'Quality Guaranteed', icon: 'checkCircle' },
                  { text: 'Expert Team', icon: 'checkCircle' },
                  { text: 'Fast Turnaround', icon: 'checkCircle' },
                  { text: 'Competitive Pricing', icon: 'checkCircle' }
                ]).map((achievement, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 font-medium">{achievement.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Team Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="DigiPrintPlus Team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Floating Card - Dynamic from Sanity */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-magenta-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-magenta-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{enhancedData?.badge?.title || 'Award Winning'}</div>
                    <div className="text-sm text-gray-600">{enhancedData?.badge?.subtitle || 'Industry Recognition'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic About Sections with Statistics */}
          <AboutSanity />

          {/* Mission & Vision Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-16 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Our Mission & Values</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Driving excellence in every project while building lasting relationships with our clients
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-magenta-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-8 h-8 text-magenta-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Customer First</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every decision we make is guided by what&apos;s best for our customers and their success.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Quality Promise</h3>
                <p className="text-gray-600 leading-relaxed">
                  We stand behind every project with our commitment to exceptional quality and craftsmanship.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Timely Delivery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Meeting deadlines is crucial to your success, and we take that responsibility seriously.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Call to Action Section */}
      <CallToActionSanity sectionId="contact-page-cta" />
    </div>
  )
}

// Generate metadata from Sanity content
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getAboutPage('about', false)
  
  return {
    title: pageData?.seo?.metaTitle || 'About DigiPrintPlus - Professional Printing Services',
    description: pageData?.seo?.metaDescription || 'Learn about our commitment to quality printing and exceptional customer service with over 15 years of industry experience.',
  }
}
