"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Printer,
  Clock,
} from "lucide-react";
import { type Footer as FooterType, DEFAULT_FOOTER } from "@/lib/sanity/footer";
import { urlForImage } from "@/lib/sanity/settings";
import type { SiteSettings } from "@/types/siteSettings";

interface FooterProps {
  footerData: FooterType | null;
  siteSettings: SiteSettings | null;
}

export function Footer({
  footerData: initialFooterData,
  siteSettings: initialSiteSettings,
}: FooterProps) {
  const [footerData] = useState<FooterType>(
    initialFooterData || DEFAULT_FOOTER,
  );
  const [siteSettings] = useState<SiteSettings | null>(initialSiteSettings);

  // Helper to render social media icons
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "twitter":
      case "x":
        return <Twitter className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      case "pinterest":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
        );
      case "tiktok":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.9 2.9 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          </svg>
        );
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <footer className="bg-gray-50 text-black">
      <div className="container py-16">
        {/* Company Info - Full Width on Mobile */}
        <div className="mb-8 md:mb-12">
          <div className="space-y-5 max-w-md md:max-w-none">
            <Link href="/" className="group inline-block">
              {siteSettings?.logo?.asset ? (
                <div className="h-[60px] sm:h-[70px] md:h-[50px]">
                  <Image
                    src={urlForImage(siteSettings.logo)?.url() || ""}
                    alt={
                      siteSettings.logo.alt ||
                      siteSettings.title ||
                      "Company Logo"
                    }
                    width={200}
                    height={70}
                    className="h-full w-auto object-contain transition-all duration-300 group-hover:opacity-90"
                  />
                </div>
              ) : (
                <span className="text-xl font-medium tracking-wide">
                  {siteSettings?.title || footerData.title}
                </span>
              )}
            </Link>
            <p className="text-gray-800 text-sm leading-relaxed">
              {siteSettings?.description || footerData.description}
            </p>

            <div className="flex flex-wrap space-x-3">
              {siteSettings?.social &&
                Object.entries(siteSettings.social)
                  .filter(([_, url]) => url)
                  .map(([platform, url], index) => (
                    <a
                      key={`${platform}-${index}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-white hover:bg-magenta-600 p-2 rounded-full transition-colors"
                      aria-label={`Visit our ${platform} page`}
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
            </div>
          </div>
        </div>

        {/* Footer Links - 2 Columns on Mobile, 4 Columns on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Services */}
          <div className="space-y-3">
            <ul className="space-y-3 text-sm">
              {footerData.services
                ?.filter((service) => service.isVisible !== false)
                .map((service, index) => (
                  <li key={`service-${index}`}>
                    <Link
                      href={service.slug}
                      className="text-gray-800 hover:text-magenta-500"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <ul className="space-y-3 text-sm">
              {footerData.quickLinks
                ?.filter((link) => link.isVisible !== false)
                .map((link, index) => (
                  <li key={`quicklink-${index}`}>
                    <Link
                      href={link.slug}
                      className="text-gray-800 hover:text-magenta-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="space-y-2 text-sm">
              {siteSettings?.contact?.address && (
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 rounded-full bg-magenta-500 group-hover:bg-magenta-600 transition-all duration-300">
                    <MapPin className="w-3 h-3 text-white flex-shrink-0" />
                  </div>
                  <span className="text-gray-800">
                    {siteSettings.contact.address}
                  </span>
                </div>
              )}

              {siteSettings?.contact?.phone && (
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 rounded-full bg-magenta-500 group-hover:bg-magenta-600 transition-all duration-300">
                    <Phone className="w-3 h-3 text-white flex-shrink-0" />
                  </div>
                  <a
                    href={`tel:${siteSettings.contact.phone.replace(/\D/g, "")}`}
                    className="text-gray-800 hover:text-magenta-500"
                  >
                    {siteSettings.contact.phone}
                  </a>
                </div>
              )}

              {siteSettings?.contact?.email && (
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 rounded-full bg-magenta-500 group-hover:bg-magenta-600 transition-all duration-300">
                    <Mail className="w-3 h-3 text-white flex-shrink-0" />
                  </div>
                  <a
                    href={`mailto:${siteSettings.contact.email}`}
                    className="text-gray-800 hover:text-magenta-500"
                  >
                    {siteSettings.contact.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center">
              <div className="p-2 mr-2 rounded-full bg-magenta-500">
                <Clock className="w-3 h-3 text-white flex-shrink-0" />
              </div>
              Business Hours
            </h4>
            <div className="text-sm text-gray-800 space-y-2">
              {siteSettings?.contact?.businessHours &&
              siteSettings.contact.businessHours.length > 0 ? (
                siteSettings.contact.businessHours.map((schedule, index) => (
                  <p key={`hours-${index}`} className="flex justify-between">
                    <span className="font-medium">{schedule.day}:</span>
                    <span>{schedule.hours}</span>
                  </p>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-magenta-500 mt-12 pt-8">
          {/* Legal Links */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-magenta-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="hidden sm:inline text-gray-400">|</span>
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-magenta-500 transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-800">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              {siteSettings?.title || footerData.copyright} | All Rights
              Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
