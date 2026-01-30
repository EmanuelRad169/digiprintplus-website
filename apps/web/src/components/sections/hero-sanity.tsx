"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Printer,
} from "lucide-react";
import { SanityHeroImage } from "@/components/ui/sanity-image";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getHeroSlides, type HeroSlide } from "@/lib/sanity/contentFetchers";

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
  const [loading, setLoading] = useState(
    !(initialSlides && initialSlides.length > 0),
  );

  // Load hero slides from Sanity
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) return;

    async function loadSlides() {
      try {
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

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || loading) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, loading, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
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

  return (
    <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden bg-slate-900">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/40 z-10" />
          {slides[currentSlide].image?.asset?.url ? (
            <SanityHeroImage
              src={slides[currentSlide].image}
              alt={slides[currentSlide].image.alt || slides[currentSlide].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full py-8 sm:py-12 lg:py-20">
            {/* Content Column */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-white space-y-4 sm:space-y-6 lg:space-y-8"
              >
                {/* Subtitle */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex items-center space-x-2 sm:space-x-3"
                >
                  <div className="w-8 sm:w-12 h-0.5 bg-white" />
                  <span className="text-white font-bold text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                    {slides[currentSlide].subtitle}
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight sm:leading-none tracking-tight"
                >
                  {slides[currentSlide].title.split(" ").map((word, index) => (
                    <span
                      key={index}
                      className={index === 1 ? "text-magenta-500" : ""}
                    >
                      {word}
                      {index < slides[currentSlide].title.split(" ").length - 1
                        ? " "
                        : ""}
                    </span>
                  ))}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl lg:max-w-2xl"
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4"
                >
                  {slides[currentSlide].features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1.5 sm:space-x-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20"
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-magenta-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
                >
                  <Link
                    href={slides[currentSlide].ctaLink}
                    className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-magenta-500 hover:bg-magenta-600 text-white font-bold text-base sm:text-lg rounded-none uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {slides[currentSlide].ctaText}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Stats/Info Column */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
              >
                {/* Large Stat Display */}
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-sm text-slate-900 p-4 sm:p-6 lg:p-8 rounded-none shadow-2xl border-l-4 sm:border-l-8 border-magenta-500"
                  >
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-magenta-500 mb-1 sm:mb-2">
                        {slides[currentSlide].stats.number}
                      </div>
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-slate-700 uppercase tracking-wide">
                        {slides[currentSlide].stats.text}
                      </div>
                    </div>
                  </motion.div>

                  {/* Additional Info Cards - Hidden on mobile */}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="hidden md:block absolute -bottom-16 lg:-bottom-20 -left-12 lg:-left-16 bg-slate-800 text-white p-4 lg:p-6 rounded-none shadow-xl border-t-4 border-magenta-500"
                  >
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <Printer className="w-6 h-6 lg:w-8 lg:h-8 text-magenta-500" />
                      <div>
                        <div className="text-xl lg:text-2xl font-bold">
                          50K+
                        </div>
                        <div className="text-xs lg:text-sm text-slate-300">
                          Projects Done
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Arrow Controls - Hidden on mobile */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-none items-center justify-center text-white transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-none items-center justify-center text-white transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-magenta-500 w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white/20 z-30">
        <motion.div
          key={currentSlide}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 7, ease: "linear" }}
          className="h-full bg-magenta-500"
        />
      </div>

      {/* Decorative Elements - Hidden on mobile */}
      <div className="hidden lg:block absolute top-20 right-20 w-2 h-2 bg-magenta-500 transform rotate-45 z-20" />
      <div className="hidden lg:block absolute bottom-32 left-32 w-3 h-3 bg-white/30 transform rotate-45 z-20" />
      <div className="hidden lg:block absolute top-1/3 right-1/3 w-1 h-1 bg-magenta-500 rounded-full z-20" />
    </section>
  );
}
