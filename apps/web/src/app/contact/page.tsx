import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getPageBySlug, getSiteSettings } from "../../lib/sanity/fetchers";
import { getContactPage } from "../../lib/sanity/contentFetchers";
import { PortableTextRenderer } from "../../components/portable-text";
import { draftMode } from "next/headers";

// Every visible string on this page is editable in the Studio under
// Contact Page. These apply only if that document is missing.
const FALLBACK = {
  title: "Contact Us",
  subtitle:
    "Get in touch with our team of experts. We're here to help bring your vision to life.",
  infoHeading: "Get in Touch",
  infoBody:
    "Whether you need business cards, brochures, banners, or custom printing solutions, we're here to bring your vision to life.",
  labels: {
    phone: "Phone",
    phoneNote: "Mon-Fri 8AM-6PM EST",
    email: "Email",
    emailNote: "We respond within 24 hours",
    address: "Address",
    businessHours: "Business Hours",
  },
  formHeading: "Send us a message",
  formIntro:
    "Fill out the form below and we'll get back to you within 24 hours.",
};

// Dynamic import for contact form (286 lines)
const ContactForm = dynamic(
  () =>
    import("../../components/contact-form").then((mod) => ({
      default: mod.ContactForm,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-96"></div>
    ),
  },
);

export const revalidate = 60;

export default async function ContactPage() {
  const { isEnabled } = await draftMode();
  const [pageData, siteSettings, contactPage] = await Promise.all([
    getPageBySlug("contact", isEnabled),
    getSiteSettings(),
    getContactPage(),
  ]);

  const contactInfo = siteSettings?.contact || {};
  const copy = { ...FALLBACK, ...(contactPage || {}) };
  const labels = { ...FALLBACK.labels, ...(contactPage?.labels || {}) };
  const businessHours = contactInfo.businessHours || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {copy.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-7xl mx-auto">
{copy.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 -mt-10 sm:-mt-12 lg:-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid lg:grid-cols-3 gap-0">
              {/* Left Side - Contact Info */}
              <div className="bg-gray-50 p-6 sm:p-8 lg:p-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {copy.infoHeading}
                    </h3>
                    {pageData?.content ? (
                      <div className="prose prose-gray max-w-none text-gray-600">
                        <PortableTextRenderer content={pageData.content} />
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        {copy.infoBody}
                      </p>
                    )}
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-6">
                    {contactInfo.phone && (
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-magenta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-magenta-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5a11 11 0 002.4 2.4l1.13-1.724a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{labels.phone}</h4>
                          <p className="text-gray-600">{contactInfo.phone}</p>
                          <p className="text-sm text-gray-500">
                            {labels.phoneNote}
                          </p>
                        </div>
                      </div>
                    )}

                    {contactInfo.email && (
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-magenta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-magenta-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.703a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{labels.email}</h4>
                          <p className="text-gray-600">{contactInfo.email}</p>
                          <p className="text-sm text-gray-500">
                            {labels.emailNote}
                          </p>
                        </div>
                      </div>
                    )}

                    {contactInfo.address && (
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-magenta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-magenta-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {labels.address}
                          </h4>
                          <div className="text-gray-600 whitespace-pre-line">
                            {contactInfo.address}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business Hours */}
                  {businessHours.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {labels.businessHours}
                      </h4>
                      <dl className="space-y-1.5 text-sm">
                        {businessHours.map(
                          (
                            entry: { day?: string; hours?: string },
                            index: number,
                          ) => (
                            <div
                              key={index}
                              className="flex justify-between gap-4"
                            >
                              <dt className="text-gray-600">{entry.day}</dt>
                              <dd className="font-medium text-gray-900">
                                {entry.hours}
                              </dd>
                            </div>
                          ),
                        )}
                      </dl>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="lg:col-span-2 p-6 sm:p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {copy.formHeading}
                  </h2>
                  <p className="text-gray-600">{copy.formIntro}</p>
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
  const [pageData, contactPage] = await Promise.all([
    getPageBySlug("contact"),
    getContactPage(),
  ]);

  return {
    title:
      contactPage?.seo?.metaTitle ||
      pageData?.seo?.metaTitle ||
      "Contact DigiPrintPlus - Get in Touch",
    description:
      contactPage?.seo?.metaDescription ||
      pageData?.seo?.metaDescription ||
      "Contact us for quotes, questions, or to discuss your printing needs.",
    alternates: {
      canonical: "/contact",
    },
  };
}
