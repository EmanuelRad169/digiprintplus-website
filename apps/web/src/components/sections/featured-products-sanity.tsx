"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  Quote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import type { FeaturedProduct } from "@/lib/sanity/homepageFetchers";

interface ProductCarouselProps {
  products?: FeaturedProduct[];
  carouselSettings?: {
    autoplaySpeed?: number;
    itemsPerView?: number;
    enableAutoplay?: boolean;
  };
}

/**
 * Featured Products Carousel - Now CMS-Driven via Sanity
 *
 * ✅ Migrated from hardcoded array to Sanity CMS
 *
 * Data flows from:
 * - Sanity Studio → homepageSettings document → featuredProducts array
 * - Falls back to default product categories if no featured products configured
 * - Editors can customize: title, image, category tag, and order
 *
 * @param products - Featured products from Sanity CMS
 * @param carouselSettings - Carousel behavior settings (autoplay, speed, etc.)
 */
export default function ProductCarousel({
  products = [],
  carouselSettings = {
    autoplaySpeed: 4,
    itemsPerView: 5,
    enableAutoplay: true,
  },
}: ProductCarouselProps) {
  // Create infinite scroll array by tripling the products
  const infiniteProducts =
    products.length > 0 ? [...products, ...products, ...products] : [];

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(products.length);
  const [isAutoScrolling, setIsAutoScrolling] = useState(
    carouselSettings.enableAutoplay ?? true,
  );
  const [direction, setDirection] = useState(1);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  const carouselRef = useRef(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setHasHydrated(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVisibleItems = () => {
    if (!hasHydrated) return carouselSettings.itemsPerView ?? 5;

    if (windowWidth < 640) return 2;
    if (windowWidth < 768) return 2.5;
    if (windowWidth < 1024) return 3;
    if (windowWidth < 1280) return 4;
    return carouselSettings.itemsPerView ?? 5;
  };

  const visibleItems = getVisibleItems();

  useEffect(() => {
    if (!carouselSettings.enableAutoplay || products.length === 0) return;

    const startAutoScroll = () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);

      autoScrollTimerRef.current = setInterval(
        () => {
          if (isAutoScrolling) {
            setStartIndex((prev) => {
              const newIndex = prev + direction;
              if (newIndex >= infiniteProducts.length - visibleItems)
                return products.length;
              if (newIndex < 0)
                return infiniteProducts.length - products.length - visibleItems;
              return newIndex;
            });
          }
        },
        (carouselSettings.autoplaySpeed ?? 4) * 1000,
      );
    };

    startAutoScroll();
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [
    isAutoScrolling,
    direction,
    visibleItems,
    products.length,
    infiniteProducts.length,
    carouselSettings.autoplaySpeed,
    carouselSettings.enableAutoplay,
  ]);

  const handlePrevious = () => {
    setIsAutoScrolling(false);
    setStartIndex((prev) => {
      const newIndex = prev - 1;
      if (newIndex < 0)
        return infiniteProducts.length - products.length - visibleItems;
      return newIndex;
    });
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleNext = () => {
    setIsAutoScrolling(false);
    setStartIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex >= infiniteProducts.length - visibleItems)
        return products.length;
      return newIndex;
    });
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  // Show loading state if no products
  if (!hasHydrated || products.length === 0) {
    return (
      <section className="relative w-full bg-gray-50 py-8 md:py-14 overflow-hidden">
        <div className="container mx-auto relative z-10 px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6 tracking-tight">
              Print <span className="text-magenta-500">Products</span>
            </h2>
            <p className="text-base md:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed px-4">
              {products.length === 0
                ? "Loading our amazing products..."
                : "Discover our cutting-edge printing solutions designed for modern businesses"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const visibleProducts = infiniteProducts.slice(
    startIndex,
    startIndex + visibleItems + 2,
  );
  const itemWidth = `calc(${100 / visibleItems}% - 1rem)`;

  return (
    <section className="relative w-full bg-gray-50 py-8 md:py-14 overflow-hidden">
      <div className="container mx-auto relative z-10 px-4">
        <div className="text-center mb-8 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6 tracking-tight"
          >
            Print <span className="text-magenta-500">Products</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-base md:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Discover our cutting-edge printing solutions designed for modern
            businesses
          </motion.p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 bg-white border-2 border-gray-200 rounded-2xl items-center justify-center text-gray-800 hover:bg-gray-50 hover:border-magenta-500 hover:text-magenta-600 transition-all duration-300 shadow-lg"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>

          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 bg-white border-2 border-gray-200 rounded-2xl items-center justify-center text-gray-800 hover:bg-gray-50 hover:border-magenta-500 hover:text-magenta-600 transition-all duration-300 shadow-lg"
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>

          {/* Product Carousel */}
          <div
            className="overflow-hidden px-4 md:px-16 flex items-center"
            ref={carouselRef}
          >
            <motion.div
              className="flex gap-4 md:gap-6 lg:gap-8"
              key={startIndex}
              initial={{
                x: direction === 1 ? 40 : -40,
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            >
              {visibleProducts.map((product, index) => {
                const imageUrl = product.image
                  ? urlFor(product.image).width(400).height(400).url()
                  : "/placeholder-product.png";

                return (
                  <motion.div
                    key={`${product._id || product.slug}-${startIndex}-${index}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    style={{ width: itemWidth, flexShrink: 0 }}
                  >
                    <Link
                      href={product.href || `/products/${product.slug}`}
                      className="group relative w-full aspect-square min-h-[180px] sm:min-h-[200px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-black/30 block"
                      onMouseEnter={() =>
                        setHoveredItem(product._id || product.slug)
                      }
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-cyan-500 opacity-90"></div>

                      {/* Product image */}
                      <div className="absolute inset-1 md:inset-2 rounded-xl md:rounded-2xl overflow-hidden aspect-square">
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Product info overlay */}
                      <AnimatePresence>
                        {hoveredItem === (product._id || product.slug) && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                          >
                            <h3 className="text-white text-lg md:text-xl font-bold mb-2 text-center">
                              {product.title}
                            </h3>
                            <span className="text-magenta-400 text-sm font-medium">
                              {product.category}
                            </span>
                            <ArrowRight className="w-5 h-5 text-white mt-2" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
