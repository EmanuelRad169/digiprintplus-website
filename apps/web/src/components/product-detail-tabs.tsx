"use client";

import { useState } from "react";

export interface ProductTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

/**
 * Tabbed container for the product detail page.
 *
 * Replaces the previous stack of full-height sections (Product Details,
 * Specifications, Download Template) so the page stays compact without losing
 * any content — every panel is still rendered in the DOM, just hidden, so it
 * remains crawlable by search engines and reachable via in-page search.
 */
export default function ProductDetailTabs({ tabs }: { tabs: ProductTab[] }) {
  const available = tabs.filter((t) => t.content);
  const [active, setActive] = useState(available[0]?.id);

  if (available.length === 0) return null;

  return (
    <div>
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Product information"
        className="-mx-1 flex gap-6 overflow-x-auto border-b border-gray-200 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {available.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`relative whitespace-nowrap px-1 pb-3 pt-1 text-sm font-semibold transition-colors sm:text-base ${
                isActive
                  ? "text-magenta-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-colors ${
                  isActive ? "bg-magenta-600" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Panels — all kept mounted so no content is lost to crawlers */}
      {available.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          className="pt-6"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
