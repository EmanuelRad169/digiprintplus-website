import { Metadata } from "next";
import { getAboutPage } from "../../lib/sanity/fetchers";
import { getAboutPageData } from "@/lib/sanity/contentFetchers";
import { PortableTextRenderer } from "../../components/portable-text";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Users,
  Clock,
  Shield,
  Star,
} from "lucide-react";
import { AboutSanity } from "../../components/sections/about-sanity";
import { CallToActionSanity } from "../../components/sections/call-to-action-sanity";

export const revalidate = 60;

// Maps the icon/colour option lists defined on the aboutPage schema to actual
// components and classes. Anything unrecognised falls back to a sane default
// rather than rendering nothing.
const ICONS = {
  award: Award,
  star: Star,
  shield: Shield,
  checkCircle: CheckCircle,
  users: Users,
  clock: Clock,
} as const;

const VALUE_COLORS = {
  magenta: { wrap: "bg-magenta-100", icon: "text-magenta-600" },
  blue: { wrap: "bg-blue-100", icon: "text-blue-600" },
  green: { wrap: "bg-green-100", icon: "text-green-600" },
  purple: { wrap: "bg-purple-100", icon: "text-purple-600" },
} as const;

const FALLBACK = {
  heroButtons: {
    primaryLabel: "Get Your Quote",
    primaryHref: "/quote",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
  },
  storyHeading: "Your Trusted Printing Partner",
  valuesSection: {
    heading: "Our Mission &",
    headingAccent: "Values",
    intro:
      "Driving excellence in every project while building lasting relationships with our clients",
  },
};

const DEFAULT_VALUES = [
  {
    title: "Customer First",
    description:
      "Every decision we make is guided by what's best for our customers and their success.",
    icon: "users",
    color: "magenta",
  },
  {
    title: "Quality Promise",
    description:
      "We stand behind every project with our commitment to exceptional quality and craftsmanship.",
    icon: "shield",
    color: "blue",
  },
  {
    title: "Timely Delivery",
    description:
      "Meeting deadlines is crucial to your success, and we take that responsibility seriously.",
    icon: "clock",
    color: "green",
  },
];

export default async function AboutPage() {
  const { isEnabled } = await draftMode();
  const [pageData, enhancedData] = await Promise.all([
    getAboutPage("about", isEnabled),
    getAboutPageData(),
  ]);

  const heroButtons = {
    ...FALLBACK.heroButtons,
    ...(enhancedData?.heroButtons || {}),
  };
  const storyHeading = enhancedData?.storyHeading || FALLBACK.storyHeading;
  const valuesSection = {
    ...FALLBACK.valuesSection,
    ...(enhancedData?.valuesSection || {}),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative w-full bg-slate-800 overflow-hidden min-h-[400px] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: enhancedData?.heroImage?.asset?.url
              ? `url('${enhancedData.heroImage.asset.url}')`
              : pageData?.heroImage?.asset?.url
                ? `url('${pageData.heroImage.asset.url}')`
                : "url('https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        >
          {/* Scrim — dark enough for white text on the left, light enough
              that the photo still reads across the rest of the band. */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20"></div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 relative z-10 pt-10 sm:pt-12">
          <div className="max-w-7xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {enhancedData?.title || pageData?.title || "About DigiPrintPlus"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl">
              {enhancedData?.subtitle ||
                pageData?.subtitle ||
                "Delivering exceptional printing solutions with over 15 years of industry experience and unwavering commitment to quality."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={heroButtons.primaryHref}
                className="w-full sm:w-auto bg-gradient-to-r from-magenta-500 to-magenta-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                {heroButtons.primaryLabel} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={heroButtons.secondaryHref}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
              >
                {heroButtons.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center py-14">
            <div>
              {(() => {
                const badge = enhancedData?.badge;
                const BadgeIcon =
                  ICONS[badge?.icon as keyof typeof ICONS] || Award;
                return (
                  <div className="inline-flex items-center bg-yellow-300 text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
                    <BadgeIcon className="w-4 h-4 mr-2 shrink-0" />
                    <span>{badge?.title || "Trusted Since 2008"}</span>
                    {badge?.subtitle && (
                      <span className="ml-2 border-l border-black/25 pl-2 font-medium">
                        {badge.subtitle}
                      </span>
                    )}
                  </div>
                );
              })()}
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                {storyHeading}
              </h2>

              {/* Dynamic content from Sanity */}
              {enhancedData?.content || pageData?.content ? (
                <div className="prose prose-lg mb-8 text-gray-600">
                  <PortableTextRenderer
                    content={enhancedData?.content || pageData.content}
                  />
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    With over 15 years of experience in the printing industry,
                    DigiPrintPlus has established itself as a trusted partner
                    for businesses seeking high-quality printing solutions. We
                    combine cutting-edge technology with traditional
                    craftsmanship to deliver exceptional results.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Our commitment to excellence, attention to detail, and
                    customer-first approach have made us the preferred choice
                    for thousands of businesses across the country.
                  </p>
                </div>
              )}

              {/* Key Values - Dynamic from Sanity */}
              <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
                {(
                  enhancedData?.achievements || [
                    { text: "Quality Guaranteed", icon: "checkCircle" },
                    { text: "Expert Team", icon: "checkCircle" },
                    { text: "Fast Turnaround", icon: "checkCircle" },
                    { text: "Competitive Pricing", icon: "checkCircle" },
                  ]
                ).map((achievement, index) => {
                  const Icon =
                    ICONS[achievement.icon as keyof typeof ICONS] ||
                    CheckCircle;
                  return (
                    <div key={index} className="flex items-center">
                      <Icon className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                      <span className="text-gray-700 font-medium">
                        {achievement.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image
                  src={
                    enhancedData?.teamImage?.asset?.url ||
                    pageData?.teamSection?.members?.[0]?.image?.asset?.url ||
                    "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  }
                  alt={
                    enhancedData?.teamImage?.alt ||
                    pageData?.teamSection?.members?.[0]?.image?.alt ||
                    "DigiPrintPlus Team"
                  }
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Dynamic About Sections with Statistics */}
          <AboutSanity />

          {/* Mission & Vision Section */}
          <div className="py-8 lg:py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                {valuesSection.heading}{" "}
                <span className="text-magenta-500">
                  {valuesSection.headingAccent}
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-5xl mx-auto">
                {valuesSection.intro}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {(enhancedData?.values?.length
                ? enhancedData.values
                : DEFAULT_VALUES
              ).map((value, index) => {
                const Icon = ICONS[value.icon as keyof typeof ICONS] || Award;
                const theme =
                  VALUE_COLORS[value.color as keyof typeof VALUE_COLORS] ||
                  VALUE_COLORS.magenta;
                return (
                  <div key={index} className="text-center">
                    <div
                      className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${theme.wrap}`}
                    >
                      <Icon className={`h-8 w-8 ${theme.icon}`} />
                    </div>
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      {value.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <CallToActionSanity sectionId="contact-page-cta" />
    </div>
  );
}

// Generate metadata from Sanity content
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getAboutPage("about", false);

  return {
    title:
      pageData?.seo?.metaTitle ||
      "About DigiPrintPlus - Professional Printing Services",
    description:
      pageData?.seo?.metaDescription ||
      "Learn about our commitment to quality printing and exceptional customer service with over 15 years of industry experience.",
    alternates: {
      canonical: "/about",
    },
  };
}
