"use client";

import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/sanity/settings";
import type { SiteSettings } from "@/lib/sanity/settings";

export function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load site settings",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { siteSettings, loading, error };
}
