import { Metadata } from 'next'
import { getPageBySlug } from '@/lib/sanity/fetchers'
import { PortableTextRenderer } from '@/components/portable-text'
import { ContactForm } from '@/components/contact-form'
import { ContactInfoGrid } from '@/components/sections/contact-info'
import { draftMode } from 'next/headers'

export const revalidate = 60;

export default async function ContactPage() {
  const { isEnabled } = draftMode()
  const pageData = await getPageBySlug('contact', isEnabled)

  return (
    <div className="min-h-screen bg-gray-100">
  {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden min-h-[25vh]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {pageData?.title || 'Get in Touch'}
            </h1>
            <p className="text-xl text-white leading-relaxed max-w-2xl mx-auto">
              {pageData?.subtitle || 'Ready to start your next project? We\'d love to hear from you.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-6">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="p-8">
                <div className="mb-6">
                  {pageData?.content && (
                    <div className="prose prose-slate max-w-none">
                      <PortableTextRenderer content={pageData.content} />
                    </div>
                  )}
                </div>
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contact Information from Sanity */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Contact Information</h2>
              <ContactInfoGrid layout="list" />
            </div>

            {/* Business Hours */}
            {pageData?.businessHours && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Business Hours</h3>
                <div className="prose prose-slate prose-sm max-w-none">
                  <PortableTextRenderer content={pageData.businessHours} />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-magenta-500 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust us with their printing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold">
                Get Free Quote
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors">
                View Products
              </button>
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