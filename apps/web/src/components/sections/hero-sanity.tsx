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
import Image from "next/image";
import { useState, useEffect } from "react";
import { getHeroSlides, type HeroSlide } from "../../lib/sanity/contentFetchers";

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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load hero slides from Sanity
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) return;

    // If we're using fallback slides, we can try to fetch real ones on the client
    setLoading(true);
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
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 800);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 800);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 800);
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
    <section className="relative min-h-[500px] h-auto sm:h-[70vh] lg:h-[80vh] overflow-hidden bg-slate-900">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-110 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-slate-900/95 via-slate-900/80 sm:via-slate-900/60 to-slate-900/70 sm:to-slate-900/40 z-10" />
          {slide.image?.asset?.url ? (
            <SanityHeroImage
              src={slide.image}
              alt={slide.image.alt || slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              priority={index === 0}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
          )}
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center h-full py-10 sm:py-12 lg:py-20">
            {/* Content Column */}
            <div
              key={currentSlide}
              className="text-white space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 transition-opacity duration-800"
            >
              {/* Subtitle */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 sm:w-12 h-0.5 bg-white" />
                <span className="text-white font-bold text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                  {slides[currentSlide].subtitle}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] sm:leading-tight tracking-tight">
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
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 leading-relaxed max-w-xl lg:max-w-2xl">
                {slides[currentSlide].description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3">
                {slides[currentSlide].features.map((feature, index) => (
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
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Link
                  href={slides[currentSlide].ctaLink}
                  className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-magenta-500 hover:bg-magenta-600 text-white font-bold text-sm sm:text-base lg:text-lg rounded-none uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {slides[currentSlide].ctaText}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Stats/Info Column */}
            <div
              key={`stats-${currentSlide}`}
              className="relative flex justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-0 transition-opacity duration-800"
            >
              {/* Large Stat Display */}
              <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-none">
                <div className="bg-white/95 backdrop-blur-sm text-slate-900 p-4 sm:p-6 lg:p-8 rounded-none shadow-2xl border-l-4 sm:border-l-8 border-magenta-500">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-magenta-500 mb-1 sm:mb-2">
                      {slides[currentSlide].stats.number}
                    </div>
                    <div className="text-base sm:text-lg lg:text-xl font-bold text-slate-700 uppercase tracking-wide">
                      {slides[currentSlide].stats.text}
                    </div>
                  </div>
                </div>

                {/* Additional Info Cards - Hidden on mobile */}
                <div className="hidden md:block absolute -bottom-16 lg:-bottom-20 -left-12 lg:-left-16 bg-slate-800 text-white p-4 lg:p-6 rounded-none shadow-xl border-t-4 border-magenta-500">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <Printer className="w-6 h-6 lg:w-8 lg:h-8 text-magenta-500" />
                    <div>
                      <div className="text-xl lg:text-2xl font-bold">50K+</div>
                      <div className="text-xs lg:text-sm text-slate-300">
                        Projects Done
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-magenta-500 w-6 sm:w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
          <div
            key={currentSlide}
            className="h-full bg-magenta-500 animate-progress"
            style={{ animation: "progressBar 7s linear" }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>

      {/* Decorative Elements - Hidden on mobile */}
      <div className="hidden lg:block absolute top-20 right-20 w-2 h-2 bg-magenta-500 transform rotate-45 z-20" />
      <div className="hidden lg:block absolute bottom-32 left-32 w-3 h-3 bg-white/30 transform rotate-45 z-20" />
      <div className="hidden lg:block absolute top-1/3 right-1/3 w-1 h-1 bg-magenta-500 rounded-full z-20" />
    </section>
  );
}
