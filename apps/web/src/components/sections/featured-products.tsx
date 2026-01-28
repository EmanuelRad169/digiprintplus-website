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

const products = [
  {
    id: "business-cards",
    name: "Business Cards",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/26f8045c9387fc2b8d55476be4a7ef620a6600e5-1024x1024.png",
    href: "/products/business-cards",
    category: "Essential",
  },
  {
    id: "flyers-brochures",
    name: "Flyers & Brochures",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/6cb7571354285c41e5a67e884984768444f06730-1024x1024.png",
    href: "/products/flyers-brochures",
    category: "Marketing",
  },
  {
    id: "postcards",
    name: "Postcards",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/c61307aa14a65c3847d8de406f21e11b80e09917-1338x1338.png",
    href: "/products/postcards",
    category: "Direct Mail",
  },
  {
    id: "announcement-cards",
    name: "Announcement Cards",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/04d82f7177844547a3d7da734ccd80af746d5af2-1024x1024.png",
    href: "/products/announcement-cards",
    category: "Events",
  },
  {
    id: "booklets",
    name: "Booklets",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/b15e89be466e8a8346a59f6f435d1cbe97407318-1024x1024.png",
    href: "/products/booklets",
    category: "Publications",
  },
  {
    id: "catalogs",
    name: "Catalogs",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/09d4d830b24dc9784d45d9b98e8fc8d8be7706b9-1024x1024.png",
    href: "/products/catalogs",
    category: "Publications",
  },
  {
    id: "bookmarks",
    name: "Bookmarks",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/0bbf00f46ac15414ca2acc1c1783ee14f7e7d8cf-1024x1024.png",
    href: "/products/bookmarks",
    category: "Specialty",
  },
  {
    id: "calendars",
    name: "Calendars",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/3fd42aa008bb8a08efbce9133e05c8244270ba39-1024x1024.png",
    href: "/products/calendars",
    category: "Promotional",
  },
  {
    id: "door-hangers",
    name: "Door Hangers",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/fbc55f17fd8bcf73bc09b230f8ff6138436392d3-1024x1024.png",
    href: "/products/door-hangers",
    category: "Direct Marketing",
  },
  {
    id: "envelopes",
    name: "Envelopes",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/e4994afafb1daa3684442d61bbeacd9e45769e1d-1024x1024.png",
    href: "/products/envelopes",
    category: "Business",
  },
  {
    id: "letterhead",
    name: "Letterhead",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/8631bbad5f1e8e161deb64a262f230df1f69c592-1024x1024.png",
    href: "/products/letterhead",
    category: "Business",
  },
  {
    id: "ncr-forms",
    name: "NCR Forms",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/039d46eacea804ff55e4e62676b7fae0e8b145c5-1024x1024.png",
    href: "/products/ncr-forms",
    category: "Forms",
  },
  {
    id: "notepads",
    name: "Notepads",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/ba111c9451059c12230314e96e961d786b35ed31-1024x1024.png",
    href: "/products/notepads",
    category: "Office",
  },
  {
    id: "table-tents",
    name: "Table Tents",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/2a5d57e7b57d48d76b6508fae16593d0329d0c49-1024x1024.png",
    href: "/products/table-tents",
    category: "Display",
  },
  {
    id: "counter-display-cards",
    name: "Counter Display Cards",
    image:
      "https://cdn.sanity.io/images/as5tildt/development/ce4ac11d1f14ad7b3da6c7fb456bb541d479a285-1024x1024.png",
    href: "/products/counter-display-cards",
    category: "Display",
  },
];

const infiniteProducts = [...products, ...products, ...products];

export default function ProductCarousel() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(products.length);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [direction, setDirection] = useState(1);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200); // Default to large desktop size

  const carouselRef = useRef(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set hydrated flag and initial window width
    setHasHydrated(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVisibleItems = () => {
    // During SSR or before hydration, always return the default large desktop value
    if (!hasHydrated) return 5; // Consistent with SSR default

    if (windowWidth < 640) return 2; // Mobile: 2 items
    if (windowWidth < 768) return 2.5; // Small mobile: 2.5 items
    if (windowWidth < 1024) return 3; // Tablet: 3 items
    if (windowWidth < 1280) return 4; // Small desktop: 4 items
    return 5; // Large desktop: 5 items
  };

  const visibleItems = getVisibleItems();

  useEffect(() => {
    const startAutoScroll = () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);

      autoScrollTimerRef.current = setInterval(() => {
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
      }, 4000);
    };

    startAutoScroll();
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [isAutoScrolling, direction, visibleItems]);

  const scroll = (dir: number) => {
    setDirection(dir);
    setStartIndex((prev) => {
      const newIndex = prev + dir * Math.ceil(visibleItems / 2);
      if (newIndex >= infiniteProducts.length - visibleItems)
        return products.length;
      if (newIndex < 0)
        return infiniteProducts.length - products.length - visibleItems;
      return newIndex;
    });
  };

  // Responsive item sizing - use consistent values for SSR/CSR
  const getItemWidth = () => {
    // During SSR or before hydration, always return the default large desktop size
    if (!hasHydrated) return "calc(20% - 1rem)"; // 5 items for consistent SSR

    if (windowWidth < 640) return "calc(40% - 1rem)"; // Mobile: Smaller slides
    if (windowWidth < 768) return "calc(33.333% - 1rem)"; // Small mobile: Smaller slides
    if (windowWidth < 1024) return "calc(25% - 1rem)"; // Tablet: Smaller slides
    if (windowWidth < 1280) return "calc(20% - 1rem)"; // Small desktop: Smaller slides
    return "calc(16.666% - 1rem)"; // Large desktop: Smaller slides
  };

  const itemWidth = getItemWidth();

  return (
    <div className="relative w-full bg-gray-50 py-8 md:py-14 overflow-hidden">
      <div className="container mx-auto relative z-10 px-4">
        {/* Modern Header with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6 tracking-tight">
            Print <span className="text-magenta-500">Products</span>
          </h2>

          <p className="text-base md:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed px-4">
            Discover our cutting-edge printing solutions designed for modern
            businesses
          </p>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
        >
          {/* Futuristic Navigation - Hide on mobile */}
          <motion.button
            onClick={() => scroll(-1)}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
          </motion.button>

          <motion.button
            onClick={() => scroll(1)}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
          </motion.button>

          {/* Carousel Container with Glass Effect */}
          <div className="overflow-hidden px-4 md:px-16 flex items-center">
            <motion.div
              className="flex gap-4 md:gap-6 lg:gap-8"
              animate={{ x: `-${startIndex * (100 / visibleItems)}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {infiniteProducts.map((product, index) => (
                <motion.div
                  key={`${product.id}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: itemWidth }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="group relative w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-black/30"
                    whileHover={{
                      y: windowWidth >= 768 ? -15 : -5,
                      rotateY: windowWidth >= 768 ? 5 : 0,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onHoverStart={() => setHoveredItem(product.id + index)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    {/* Gradient Background Card */}
                    <div
                      className={`absolute inset-0 bg-cyan-500 opacity-90`}
                    />

                    {/* Product Image */}
                    <div className="absolute inset-1 md:inset-2 rounded-xl md:rounded-2xl overflow-hidden aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                      />

                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Hover Content */}
                    <AnimatePresence>
                      {hoveredItem === product.id + index && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-10"
                        >
                          <div className="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 border border-white/20">
                            <h3 className="text-white font-bold text-xs md:text-base mb-2 md:mb-3 leading-tight text-center">
                              {product.name}
                            </h3>

                            <div className="flex gap-1 md:gap-2">
                              <motion.a
                                href="/quote"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 bg-magenta-500 text-white py-1.5 md:py-2 px-2 md:px-4 rounded-lg md:rounded-xl text-xs md:text-sm font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 shadow-lg"
                              >
                                Get Quote
                              </motion.a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
