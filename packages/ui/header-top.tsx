"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/sanity/fetchers";
import type { SiteSettings } from "@/types/siteSettings";

export function HeaderTop() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error("Error loading site settings:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="bg-yellow-300 py-1 text-black relative z-50 border-b border-white/10">
      {isMobile && (
        <button
          onClick={toggleVisibility}
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-[#ea088c] to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
          aria-label={isVisible ? "Hide top header" : "Show top header"}
        >
          {isVisible ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}

      {(isVisible || !isMobile) && (
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row md:justify-end items-center w-full font-bold">
            {/* Contact Information */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 justify-evenly md:justify-between w-full md:w-auto mb-2 md:mb-0">
              {siteSettings?.contact?.phone && (
                <a
                  href={`tel:${siteSettings.contact.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-1 text-sm hover:text-white/80 transition-colors md:flex-1 md:justify-center"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{siteSettings.contact.phone}</span>
                </a>
              )}

              {siteSettings?.contact?.email && (
                <a
                  href={`mailto:${siteSettings.contact.email}`}
                  className="flex items-center gap-1 text-sm hover:text-white/80 transition-colors md:flex-1 md:justify-center"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{siteSettings.contact.email}</span>
                </a>
              )}

              {siteSettings?.contact?.address && (
                <div className="flex items-center gap-1 text-sm md:flex-1 md:justify-center">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {siteSettings.contact.address}
                  </span>
                </div>
              )}

              {/* Show fallback contact information if loading or no data */}
              {(loading || !siteSettings?.contact) && (
                <>
                  <a
                    href="tel:9497705000"
                    className="flex items-center gap-1 text-sm hover:text-white/80 transition-colors md:flex-1 md:justify-center"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>(949) 770-5000</span>
                  </a>
                  <a
                    href="mailto:orders@digiprintplus.com"
                    className="flex items-center gap-1 text-sm hover:text-white/80 transition-colors md:flex-1 md:justify-center"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">orders@digiprintplus.com</span>
                  </a>
                  <div className="flex items-center gap-1 text-sm md:flex-1 md:justify-center">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">670 Research Dr, Irvine, CA 92618</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
