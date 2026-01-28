/**
 * Phone number utilities for DigiPrintPlus
 * Centralized phone number management through site settings
 */

import { getSiteSettings } from "@/lib/sanity/settings";

/**
 * Get the main business phone number from site settings
 */
export async function getBusinessPhone(): Promise<{
  display: string;
  tel: string;
}> {
  try {
    const siteSettings = await getSiteSettings();
    const phone = siteSettings?.contact?.phone;

    if (!phone) {
      console.warn("No phone number found in site settings");
      return {
        display: "",
        tel: "",
      };
    }

    return {
      display: phone,
      tel: phone.replace(/\D/g, ""),
    };
  } catch (error) {
    console.error("Error fetching business phone:", error);
    return {
      display: "",
      tel: "",
    };
  }
}

/**
 * Client-side hook version for components
 */
export function useBusinessPhone(siteSettings?: {
  contact?: { phone?: string };
}) {
  const phone = siteSettings?.contact?.phone;

  if (!phone) {
    return {
      display: "",
      tel: "",
    };
  }

  return {
    display: phone,
    tel: phone.replace(/\D/g, ""),
  };
}

/**
 * Format phone number for tel: links
 */
export function formatPhoneForTel(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Format phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone; // Return original if can't format
}
