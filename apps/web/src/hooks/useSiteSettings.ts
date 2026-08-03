"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/sanity/settings";

export function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Loaded on demand rather than imported at module scope: a static
        // import pulls @sanity/client (and get-it, and rxjs) into the initial
        // client bundle on every page that renders this, where it costs seconds
        // of script evaluation. This path usually never runs.
        const { getSiteSettings } = await import("@/lib/sanity/settings");
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
