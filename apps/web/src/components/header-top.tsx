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
import type { SiteSettings } from "@/types/siteSettings";

interface HeaderTopProps {
  siteSettings?: SiteSettings | null;
}

export function HeaderTop({ siteSettings }: HeaderTopProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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



  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="hidden md:block bg-yellow-300 text-black relative z-50 border-b border-white/10">
      <div className="container mx-auto px-3 py-2">
        <div className="flex flex-row justify-end items-center w-full font-bold">
          {/* Contact Information */}
          <div className="flex flex-row gap-x-6 lg:gap-x-8 w-auto">
            {siteSettings?.contact?.phone && (
              <a
                href={`tel:${siteSettings.contact.phone.replace(/\D/g, "")}`}
                className="flex items-center justify-start gap-2 text-xs lg:text-sm hover:text-white/80 transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">
                  {siteSettings.contact.phone}
                </span>
              </a>
            )}

            {siteSettings?.contact?.email && (
              <a
                href={`mailto:${siteSettings.contact.email}`}
                className="flex items-center justify-start gap-2 text-xs lg:text-sm hover:text-white/80 transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate font-semibold">
                  {siteSettings.contact.email}
                </span>
              </a>
            )}

            {siteSettings?.contact?.address && (
              <div className="flex items-center justify-start gap-2 text-xs lg:text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate font-semibold">
                  {siteSettings.contact.address}
                </span>
              </div>
            )}

            {/* Show fallback contact information if loading or no data */}
            {!siteSettings?.contact && (
              <>
                <a
                  href="tel:9497705000"
                  className="flex items-center justify-start gap-2 text-xs lg:text-sm hover:text-white/80 transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">(949) 770-5000</span>
                </a>
                <a
                  href="mailto:orders@digiprintplus.com"
                  className="flex items-center justify-start gap-2 text-xs lg:text-sm hover:text-white/80 transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate font-semibold">
                    orders@digiprintplus.com
                  </span>
                </a>
                <div className="flex items-center justify-start gap-2 text-xs lg:text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate font-semibold">
                    670 Research Dr, Irvine, CA 92618
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
