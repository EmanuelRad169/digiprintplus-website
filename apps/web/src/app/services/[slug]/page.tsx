import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getServiceBySlug,
  getServices,
} from "../../../lib/sanity/contentFetchers";
import { PortableTextRenderer } from "../../../components/portable-text";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export const revalidate = 60;

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all services
export async function generateStaticParams() {
  const services = await getServices();

  return services.map((service) => ({
    slug: service.slug.current,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.seo?.metaTitle || `${service.title} | DigiPrintPlus`,
    description: service.seo?.metaDescription || service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-clip">
      {/* Hero Section */}
      <section className="w-full relative bg-slate-800 overflow-hidden min-h-[400px] flex items-center">
        {/* Background Image */}
        {service.image?.asset?.url && (
          <div className="absolute inset-0">
            <Image
              src={service.image.asset.url}
              alt={service.image.alt || service.title}
              fill
              sizes="100vw"
              quality={90}
              className="object-cover object-center"
              priority
            />
            {/* Scrim — dark enough for white text on the left, light enough
                that the photo still reads across the rest of the band. */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20"></div>
          </div>
        )}

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
          <div>
            {/* Back Link */}
            <Link
              href="/services"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8">
              {service.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/quote"
                className="w-full sm:w-auto min-h-11 bg-gradient-to-r from-[#ea088c] to-pink-500 hover:from-pink-600 hover:to-[#ea088c] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-[#ea088c]/20 hover:shadow-[#ea088c]/30 inline-flex items-center justify-center gap-2"
              >
                Get a Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto min-h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="p-0 sm:p-4 lg:p-6">
                {service.content && service.content.length > 0 ? (
                  <div className="prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700">
                    <PortableTextRenderer content={service.content} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="prose prose-lg prose-slate max-w-none">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        About This Service
                      </h2>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                      <p className="text-blue-900 font-medium mb-2">
                        📝 Content Coming Soon
                      </p>
                      <p className="text-blue-800 text-sm">
                        Full service details are being added. In the meantime,
                        please contact us for more information about this
                        service.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-28">
                  {/* Accent rule ties the card to the brand without shouting */}
                  <div className="h-1 w-full bg-gradient-to-r from-magenta-500 to-pink-400" />

                  <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-magenta-500" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Key Features
                      </h3>
                    </div>
                  </div>

                  <ul className="mt-4 divide-y divide-gray-100 border-b border-gray-100">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 px-5 py-3 sm:px-6"
                      >
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-magenta-500" />
                        <span className="text-[15px] leading-relaxed text-gray-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Quick Contact */}
                  <div className="bg-gray-50 px-5 py-6 sm:px-6">
                    <h4 className="text-base font-bold text-gray-900">
                      Need Help?
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      Our team is ready to answer your questions and help you
                      get started.
                    </p>
                    <Link
                      href="/contact"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-magenta-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-magenta-700 hover:shadow-md"
                    >
                      Contact Our Team
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto bg-magenta-500 rounded-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:20px_20px]"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Ready to start your next print project?
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Contact us today to discuss how our {service.title.toLowerCase()}{" "}
              services can help bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href="/quote"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-black text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get a Quote
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
