"use client";

import { VisualEditing as SanityVisualEditing } from "@sanity/visual-editing/react";
import { useEffect, useState } from "react";

export function VisualEditing() {
  const [isDraftMode, setIsDraftMode] = useState(false);

  useEffect(() => {
    // Only enable visual editing if explicitly in draft mode via the API route
    const hasBypassCookie = document.cookie.includes("__prerender_bypass");

    console.log("🎯 Visual editing check:", {
      hasBypassCookie,
      cookies: document.cookie.includes("__prerender_bypass")
        ? "Draft mode cookie present"
        : "No draft mode cookie",
      url: window.location.href,
    });

    setIsDraftMode(hasBypassCookie);

    if (hasBypassCookie) {
      console.log("✅ Visual editing component activated (draft mode enabled)");
      // Add a visual indicator in development
      if (process.env.NODE_ENV === "development") {
        const indicator = document.createElement("div");
        indicator.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          background: #2196F3;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          z-index: 999999;
          pointer-events: none;
        `;
        indicator.textContent = "👁️ Draft Mode Active";
        document.body.appendChild(indicator);

        // Remove after 3 seconds
        setTimeout(() => {
          if (document.body.contains(indicator)) {
            document.body.removeChild(indicator);
          }
        }, 3000);
      }
    }
  }, []);

  // Only render the Sanity Visual Editing component when explicitly in draft mode
  return isDraftMode ? <SanityVisualEditing portal={true} /> : null;
}
