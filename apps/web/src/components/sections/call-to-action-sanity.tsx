"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getCTASectionById, CTASection } from "@/lib/sanity/contentFetchers";
import { useSiteSettings } from "../../hooks/useSiteSettings";

interface CallToActionSanityProps {
  sectionId: string;
  fallbackData?: CTASection;
}

const defaultCTA: CTASection = {
  _id: "default-cta",
  title: "Ready to Get Started?",
  description:
    "Join thousands of satisfied customers who trust DigiPrintPlus for their printing needs. Get your instant quote today.",
  primaryButton: {
    text: "Get Your Free Quote",
    link: "/quote",
  },
  secondaryButton: {
    text: "Call (949) 770-5000",
    link: "tel:9497705000",
    type: "phone",
  },
  highlights: [
    "Rush Orders Available",
    "Expert Support",
    "Satisfaction Guaranteed",
  ],
  backgroundColor: "magenta",
  sectionId: "homepage-cta",
  isActive: true,
};

export function CallToActionSanity({
  sectionId,
  fallbackData,
}: CallToActionSanityProps) {
  const [ctaData, setCTAData] = useState<CTASection | null>(
    fallbackData || defaultCTA,
  );
  const [loading, setLoading] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { siteSettings } = useSiteSettings();

  // Simple animation trigger after component mounts and data is loaded
  useEffect(() => {
    if (ctaData) {
      setShouldAnimate(true);
    }
  }, [ctaData, sectionId]);

  useEffect(() => {
    if (!fallbackData) {
      const fetchCTAData = async () => {
        try {
          const data = await getCTASectionById(sectionId);
          if (data) {
            setCTAData(data);
          }
        } catch (error) {
          console.error("Error fetching CTA data:", error);
          // We already have defaultCTA, so nothing to do
        }
      };

      fetchCTAData();
    }
  }, [sectionId, fallbackData]);

  if (loading) {
    return (
      <section className="py-20 bg-magenta-500 text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded mb-6"></div>
              <div className="h-6 bg-white/20 rounded mb-8"></div>
              <div className="flex gap-4 justify-center">
                <div className="h-12 w-40 bg-white/20 rounded"></div>
                <div className="h-12 w-40 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!ctaData) {
    return null;
  }

  const backgroundColorClass =
    {
      magenta: "bg-magenta-500",
      blue: "bg-blue-600",
      gray: "bg-gray-800",
      black: "bg-black",
    }[ctaData.backgroundColor] || "bg-magenta-500";

  return (
    <section
      className={`py-20 bg-magenta-500 text-white relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative">
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-800 ${
            shouldAnimate
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-600 delay-200 ${
              shouldAnimate
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {ctaData.title}
          </h2>

          <p
            className={`text-xl text-white/80 mb-8 leading-relaxed transition-all duration-600 delay-300 ${
              shouldAnimate
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {ctaData.description}
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-600 delay-400 ${
              shouldAnimate
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href={ctaData.primaryButton.link}
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {ctaData.primaryButton.text}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            {ctaData.secondaryButton && (
              <Link
                href={
                  ctaData.secondaryButton.type === "phone" &&
                  siteSettings?.contact?.phone
                    ? `tel:${siteSettings.contact.phone.replace(/\D/g, "")}`
                    : ctaData.secondaryButton.link
                }
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                {ctaData.secondaryButton.type === "phone" && (
                  <Phone className="w-5 h-5 mr-2" />
                )}
                {ctaData.secondaryButton.type === "phone" &&
                siteSettings?.contact?.phone
                  ? `Call ${siteSettings.contact.phone}`
                  : ctaData.secondaryButton.text}
              </Link>
            )}
          </div>

          {ctaData.highlights && ctaData.highlights.length > 0 && (
            <div
              className={`mt-8 text-white/80 transition-all duration-600 delay-600 ${
                shouldAnimate
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-base">
                {ctaData.highlights.map((highlight, index) => (
                  <span key={index}>
                    <strong>{highlight}</strong>
                    {index < ctaData.highlights.length - 1 && " • "}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
