import { sanityClient } from "@/lib/sanity";

export interface FooterSocialLink {
  platform: string;
  url: string;
  isVisible?: boolean;
}

export interface FooterService {
  label: string;
  slug: string;
  isVisible?: boolean;
}

export interface FooterQuickLink {
  label: string;
  slug: string;
  isVisible?: boolean;
}

export interface FooterContactInfo {
  address?: string;
  phone?: string;
  email?: string;
}

export interface FooterBusinessHours {
  day: string;
  hours: string;
}

export interface Footer {
  _id: string;
  title: string;
  description: string;
  socialLinks?: FooterSocialLink[];
  services?: FooterService[];
  quickLinks?: FooterQuickLink[];
  contactInfo?: FooterContactInfo;
  businessHours?: FooterBusinessHours[];
  copyright?: string;
}

// Default footer data to use as fallback
export const DEFAULT_FOOTER: Footer = {
  _id: "default-footer",
  title: "DigiPrintPlus",
  description:
    "Your trusted partner for professional printing solutions. We deliver high-quality prints with exceptional service and competitive pricing.",
  socialLinks: [
    { platform: "facebook", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
  ],
  services: [
    { label: "Business Cards", slug: "/products/category/business-cards" },
    {
      label: "Flyers & Brochures",
      slug: "/products/category/flyers-brochures",
    },
    { label: "Postcards", slug: "/products/category/postcards" },
    { label: "Booklets", slug: "/products/category/booklets" },
    { label: "Letterhead", slug: "/products/category/letterhead" },
    { label: "Envelopes", slug: "/products/category/envelopes" },
  ],
  quickLinks: [
    { label: "About Us", slug: "/about" },
    { label: "Get Quote", slug: "/quote" },
    { label: "Contact", slug: "/contact" },
    { label: "FAQ", slug: "/faq" },
    { label: "Privacy Policy", slug: "/privacy" },
    { label: "Terms of Service", slug: "/terms" },
  ],
  contactInfo: {
    address: "123 Print Street, Business District, NY 10001",
    email: "sales@digiprintplus.com",
  },
  businessHours: [
    { day: "Mon - Fri", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  copyright:
    "DigiPrintPlus. All rights reserved. Built with modern technology for superior printing solutions.",
};

/**
 * Fetch the footer data from Sanity CMS
 */
export const getFooter = async (): Promise<Footer> => {
  try {
    const footer = await sanityClient.fetch(
      `*[_type == "footer"][0] {
        _id,
        title,
        description,
        "socialLinks": socialLinks[] {
          platform,
          url,
          isVisible
        },
        "services": services[] {
          label,
          slug,
          isVisible
        },
        "quickLinks": quickLinks[] {
          label,
          slug,
          isVisible
        },
        contactInfo {
          address,
          phone,
          email
        },
        "businessHours": businessHours[] {
          day,
          hours
        },
        copyright
      }`,
      {},
      {
        // Enable ISR with 5 minute revalidation
        next: { revalidate: 300 },
      },
    );

    return footer || DEFAULT_FOOTER;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return DEFAULT_FOOTER;
  }
};

/**
 * Subscribe to real-time updates to the footer
 */
export const subscribeToFooterUpdates = (callback: () => void) => {
  return sanityClient.listen('*[_type == "footer"]').subscribe({
    next: () => {
      console.log("Footer updated, refreshing...");
      callback();
    },
    error: (error) => {
      console.error("Footer subscription error:", error);
    },
  });
};
