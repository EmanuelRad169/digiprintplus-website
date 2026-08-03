import { sanityClient } from "@/lib/sanity";
import { DEFAULT_FOOTER, type Footer } from "./footer-defaults";

export * from "./footer-defaults";

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
export const subscribeToFooterUpdates = (
  callback: () => void,
): { unsubscribe: () => void } => {
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
