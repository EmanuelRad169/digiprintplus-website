"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Printer,
} from "lucide-react";
import { SanityHeroImage } from "../ui/sanity-image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import type { HeroSlide } from "../../lib/sanity/contentFetchers";

// Fallback slides for when Sanity data is not available
const fallbackSlides: HeroSlide[] = [
  {
    _id: "fallback-1",
    title: "Premium Business Cards",
    subtitle: "PROFESSIONAL PRINTING",
    description:
      "Make a lasting impression with our premium business cards. Choose from over 50 paper stocks and finishes.",
    // Placeholder image
    image: {
      asset: {
        url: "https://cdn.sanity.io/images/as5tildt/production/04d82f7177844547a3d7da734ccd80af746d5af2-1024x1024.png", // Using a known image from our sanity dataset
        metadata: {
          dimensions: {
            width: 1024,
            height: 1024,
          },
        },
      },
      alt: "Premium Business Cards",
    },
    ctaText: "Get Quote",
    ctaLink: "/quote",
    stats: { number: "24hrs", text: "Rush Service" },
    features: ["Premium Materials", "Free Design", "Fast Delivery"],
    order: 1,
    isActive: true,
  },
];

interface HeroSanityProps {
  initialSlides?: HeroSlide[];
}

export function HeroSanity({ initialSlides }: HeroSanityProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(
    initialSlides && initialSlides.length > 0 ? initialSlides : fallbackSlides,
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(0);

  // Load hero slides from Sanity
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) return;

    // If we're using fallback slides, we can try to fetch real ones on the client
    setLoading(true);
    async function loadSlides() {
      try {
        // Loaded on demand rather than imported at module scope: a static
        // import pulls @sanity/client (and get-it, and rxjs) into the initial
        // client bundle on every page that renders this, where it costs seconds
        // of script evaluation. This path usually never runs.
        const { getHeroSlides } = await import(
          "../../lib/sanity/contentFetchers"
        );
        const sanitySlides = await getHeroSlides();
        if (sanitySlides && sanitySlides.length > 0) {
          setSlides(sanitySlides);
        }
      } catch (error) {
        console.error("Failed to load hero slides:", error);
        // Keep fallback slides
      } finally {
        setLoading(false);
      }
    }

    loadSlides();
  }, [initialSlides]);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentSlide((prev) => {
        let next = prev + newDirection;
        if (next < 0) next = slides.length - 1;
        if (next >= slides.length) next = 0;
        return next;
      });
      setIsAutoPlaying(false);
    },
    [slides.length],
  );

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || loading) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, loading, paginate]);

  // Swipe handling
  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    // Threshold for swipe
    if (info.offset.x < -50) {
      paginate(1);
    } else if (info.offset.x > 50) {
      paginate(-1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      zIndex: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[500px] h-auto sm:h-[70vh] lg:h-[80vh] overflow-hidden bg-slate-900 group">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-slate-900/95 via-slate-900/80 sm:via-slate-900/60 to-slate-900/70 sm:to-slate-900/40 z-10" />
            {slide.image?.asset?.url ? (
              <SanityHeroImage
                src={slide.image}
                alt={slide.image.alt || slide.title}
                className="absolute inset-0 w-full h-full object-cover"
                priority={true}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe Layer (Transparent) */}
      <motion.div
        className="absolute inset-0 z-10"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDragEnd={onDragEnd}
        style={{ touchAction: "pan-y" }}
      />

      {/* Main Content */}
      <div className="relative z-20 h-full flex items-center pointer-events-none w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center h-full py-10 sm:py-12 lg:py-20">
            {/* Content Column */}
            <div className="text-white space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 pointer-events-auto">
              {/* Subtitle */}
              <motion.div
                key={`sub-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 sm:space-x-3"
              >
                <div className="w-8 sm:w-12 h-0.5 bg-white" />
                <span className="text-white font-bold text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                  {slide.subtitle}
                </span>
              </motion.div>

              {/* Main Title - Optimized for mobile */}
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] sm:leading-tight tracking-tight"
              >
                {slide.title.split(" ").map((word, index) => (
                  <span
                    key={index}
                    className={index === 1 ? "text-magenta-500" : ""}
                  >
                    {word}
                    {index < slide.title.split(" ").length - 1 ? " " : ""}
                  </span>
                ))}
              </motion.h1>

              {/* Description */}
              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 leading-relaxed max-w-xl lg:max-w-2xl"
              >
                {slide.description}
              </motion.p>

              {/* Features */}
              <motion.div
                key={`feat-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3"
              >
                {slide.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 sm:space-x-1.5 bg-white/10 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20"
                  >
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-magenta-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      {feature}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                key={`cta-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 sm:pt-2 w-full"
              >
                <Link
                  href={slide.ctaLink}
                  className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-magenta-600 hover:bg-magenta-700 text-white font-bold text-sm sm:text-base lg:text-lg rounded-none uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  {slide.ctaText}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Stats/Info Column */}
            <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0 pointer-events-auto w-full">
              {/* Large Stat Display */}
              <motion.div
                key={`stat-${currentSlide}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="relative w-full lg:max-w-md"
              >
                <div className="bg-white/95 backdrop-blur-sm text-slate-900 p-6 sm:p-8 rounded-none shadow-2xl border-l-4 sm:border-l-8 border-magenta-500 w-full">
                  <div className="text-center">
                    <div className="text-5xl sm:text-6xl font-bold text-magenta-500 mb-2">
                      {slide.stats.number}
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-slate-700 uppercase tracking-wide">
                      {slide.stats.text}
                    </div>
                  </div>
                </div>

                {/* Additional Info Cards - Mobile Optimized */}
                <div className="mt-4 md:absolute md:mt-0 md:-bottom-10 md:left-0 lg:-bottom-16 lg:-left-16 bg-slate-800 text-white p-5 lg:p-6 rounded-none shadow-xl border-t-4 border-magenta-500 w-full md:w-auto">
                  <div className="flex items-center space-x-4 justify-center md:justify-start">
                    <Printer className="w-8 h-8 text-magenta-500" />
                    <div>
                      <div className="text-2xl font-bold">50K+</div>
                      <div className="text-sm text-slate-300">
                        Projects Done
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow Controls - Visible on larger screens, larger touch targets if on mobile but typically hidden */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full items-center justify-center text-white transition-all duration-300 group pointer-events-auto"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full items-center justify-center text-white transition-all duration-300 group pointer-events-auto"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 pointer-events-auto">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="group flex h-11 items-center justify-center px-1.5"
            >
              <span
                aria-hidden
                className={`block h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-magenta-500 w-8"
                    : "bg-white/50 w-2 group-hover:bg-white/75"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
          <motion.div
            key={currentSlide}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 7, ease: "linear" }}
            className="h-full bg-magenta-500"
          />
        </div>
      )}
    </section>
  );
}
