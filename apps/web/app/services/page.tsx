import { Metadata } from 'next'
import { getPageBySlug } from '@/lib/sanity/fetchers'
import { PortableTextRenderer } from '@/components/portable-text'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, CheckCircle } from 'lucide-react';
import { ServicesGridServer } from '@/components/sections/services-grid-server'

export const revalidate = 60;

export default async function ServicesPage() {
  const { isEnabled } = draftMode()
  const pageData = await getPageBySlug('services', isEnabled)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden min-h-[50vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/5816293/pexels-photo-5816293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {pageData?.title || 'Full-Service Print Solutions'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl">
              {pageData?.subtitle || 'From concept to completion, our comprehensive printing services deliver quality results for businesses of all sizes.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/quote" className="bg-gradient-to-r from-[#ea088c] to-pink-500 hover:from-pink-600 hover:to-[#ea088c] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-[#ea088c]/20 hover:shadow-[#ea088c]/30 flex items-center gap-2">
                Request a Quote <ArrowRight className="w-4 h-4" />
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
          
          {/* Intro Section with Stats */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-flex items-center bg-magenta-100 text-magenta-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Award className="w-4 h-4 mr-2" />
                Award-Winning Print Solutions
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                Your Trusted Partner for Professional Printing
              </h2>
              {pageData?.content && (
                <div className="prose prose-lg mb-8 text-gray-600">
                  <PortableTextRenderer content={pageData.content} />
                </div>
              )}
              {!pageData?.content && (
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  With over 15 years of experience in the printing industry, DigiPrintPlus delivers exceptional quality and service for businesses of all sizes. From business cards to large format displays, we&apos;re your one-stop shop for all printing needs.
                </p>
              )}
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 font-medium">Same-Day Rush Service</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 font-medium">Free Design Consultation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 font-medium">Premium Materials</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 font-medium">Nationwide Delivery</span>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-magenta-600 mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Projects Completed</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-magenta-600 mb-2">24hrs</div>
                <div className="text-gray-600 font-medium">Rush Turnaround</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-magenta-600 mb-2">15+</div>
                <div className="text-gray-600 font-medium">Years Experience</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-magenta-600 mb-2">99.8%</div>
                <div className="text-gray-600 font-medium">Quality Rating</div>
              </div>
            </div>
          </div>

          {/* Services Categories */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Complete Print Solutions</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              From concept to completion, we offer comprehensive printing services with the latest technology and expertise
            </p>
          </div>

          {/* Enhanced Services Grid */}
          <ServicesGridServer featuredOnly={false} showCTA={true} />

          {/* Process Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-16 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Our Simple Process</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Getting your printing project done has never been easier
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload & Consult",
                  description: "Share your files or ideas with our design team for a free consultation"
                },
                {
                  step: "02", 
                  title: "Review & Approve",
                  description: "We'll provide a detailed quote and proof for your review and approval"
                },
                {
                  step: "03",
                  title: "Print & Quality Check", 
                  description: "Our state-of-the-art equipment produces your order with rigorous quality control"
                },
                {
                  step: "04",
                  title: "Ship & Deliver",
                  description: "Fast, secure delivery to your location with tracking information provided"
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-magenta-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">What Our Clients Say</h2>
              <p className="text-gray-600 mb-6">
                Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about our services.
              </p>
              <Link href="/testimonials" className="inline-flex items-center text-magenta-600 font-semibold hover:text-magenta-700">
                View All Reviews <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {[
                {
                  quote: "DigiPrintPlus consistently delivers exceptional quality on tight deadlines. Their attention to detail and customer service is unmatched.",
                  author: "Sarah Johnson",
                  company: "Marketing Director, TechStart Inc."
                },
                {
                  quote: "From business cards to trade show displays, they handle all our printing needs. The team is professional and the results are always outstanding.",
                  author: "Michael Chen", 
                  company: "CEO, Bright Solutions"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="text-gray-600 mb-4 italic leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-magenta-500 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 bg-[length:20px_20px]"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to start your next print project?</h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xlxl mx-auto">
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
      </div>
    </div>
  );
}

// Generate metadata from Sanity content
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageBySlug('services')
  
  return {
    title: pageData?.seo?.metaTitle || 'Our Services - DigiPrintPlus',
    description: pageData?.seo?.metaDescription || 'Explore our comprehensive printing services including digital printing, offset printing, large format, design services and more.',
  }
}
