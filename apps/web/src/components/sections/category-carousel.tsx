"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CategorySlug = { current: string } | string;

interface ProductCategory {
  _id: string;
  title: string;
  slug: CategorySlug;
  description?: string;
  image?: string;
}

interface CategoryCarouselProps {
  categories?: ProductCategory[];
}

/**
 * Horizontal infinite category slider, sharing the same categories
 * as the mega menu / product navigation.
 */
export default function CategoryCarousel({
  categories = [],
}: CategoryCarouselProps) {
  const hasCategories = categories && categories.length > 0;

  // Duplicate categories to simulate an infinite loop when scrolling
  const loopedCategories = hasCategories ? [...categories, ...categories] : [];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState(260);

  // Measure first card width to use for scroll step
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLDivElement>(
      "[data-category-card]",
    );

    if (firstCard) {
      const style = window.getComputedStyle(firstCard);
      const marginRight = parseFloat(style.marginRight || "0");
      setCardWidth(firstCard.offsetWidth + marginRight);
    }
  }, [loopedCategories.length]);

  // Auto-scroll to the right, resetting once we reach halfway through
  useEffect(() => {
    if (!containerRef.current || loopedCategories.length === 0) return;

    const container = containerRef.current;
    const interval = window.setInterval(() => {
      if (!container) return;

      const maxScroll = container.scrollWidth / 2;
      const nextLeft = container.scrollLeft + cardWidth;

      if (nextLeft >= maxScroll) {
        container.scrollLeft = 0;
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3500);

    return () => window.clearInterval(interval);
  }, [cardWidth, loopedCategories.length]);

  const handleArrowClick = (direction: -1 | 1) => {
    const container = containerRef.current;
    if (!container || loopedCategories.length === 0) return;

    const delta = direction * cardWidth;
    const maxScroll = container.scrollWidth / 2;
    let nextLeft = container.scrollLeft + delta;

    if (nextLeft < 0) {
      nextLeft = maxScroll + nextLeft;
    }

    if (nextLeft >= maxScroll) {
      nextLeft = 0;
    }

    container.scrollTo({ left: nextLeft, behavior: "smooth" });
  };

  if (!hasCategories) return null;

  return (
    <section className="relative w-full bg-white py-8 md:py-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Explore all <span className="text-magenta-500">categories</span>
          </h2>
        </div>

        <div className="relative">
          {/* Arrows */}
          <button
            type="button"
            aria-label="Previous category"
            onClick={() => handleArrowClick(-1)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-magenta-500 hover:text-magenta-600 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Next category"
            onClick={() => handleArrowClick(1)}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-magenta-500 hover:text-magenta-600 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider track */}
          <div ref={containerRef} className="overflow-x-hidden md:mx-10">
            <div className="flex gap-4 md:gap-6 lg:gap-8 py-2">
              {loopedCategories.map((category, index) => {
                const slugValue =
                  typeof category.slug === "string"
                    ? category.slug
                    : category.slug?.current;

                const href = slugValue
                  ? `/products/category/${slugValue}`
                  : "/products";

                return (
                  <div
                    key={`${category._id}-${slugValue}-${index}`}
                    data-category-card
                    className="flex-shrink-0 w-36 md:w-40 lg:w-44 cursor-pointer"
                  >
                    <Link
                      href={href}
                      className="flex flex-col items-center text-center group"
                    >
                      <div className="mb-3 w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gray-100 overflow-hidden relative shadow-sm group-hover:shadow-lg transition-shadow">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            sizes="128px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-magenta-500 to-purple-500 text-white text-3xl font-bold">
                            {category.title.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-magenta-600 transition-colors">
                        {category.title}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
