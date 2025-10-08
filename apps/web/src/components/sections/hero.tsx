'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, ChevronLeft, ChevronRight, Play, Printer, Palette, Truck } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

// Sample slide data - replace with your actual print product data
const slides = [
  {
    id: 1,
    title: "Premium Business Cards",
    subtitle: "PROFESSIONAL PRINTING",
    description: "Make a lasting impression with our premium business cards. Choose from over 50 paper stocks and finishes.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ctaText: "Get Quote",
    ctaLink: "/quote",
    stats: { number: "24hrs", text: "Rush Service" },
    features: ["Premium Materials", "Free Design", "Fast Delivery"]
  },
  {
    id: 2,
    title: "Large Format Banners",
    subtitle: "BIG IMPACT PRINTING",
    description: "Eye-catching banners and signage that demand attention. Weather-resistant materials for indoor and outdoor use.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ctaText: "Get Quote",
    ctaLink: "/quote",
    stats: { number: "10ft+", text: "Max Width" },
    features: ["Weather Resistant", "Vibrant Colors", "Custom Sizes"]
  },
  {
    id: 3,
    title: "Marketing Materials",
    subtitle: "COMPLETE BRAND SOLUTIONS",
    description: "From brochures to flyers, we help your brand stand out with professional marketing materials.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
    ctaText: "Get Quote",
    ctaLink: "/quote",
    stats: { number: "500+", text: "Design Templates" },
    features: ["Full Color", "Multiple Formats", "Bulk Pricing"]
  }
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative h-[80vh] sm:h-[90vh] lg:h-[80vh] overflow-hidden bg-slate-900">
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
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
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
                  {slides[currentSlide].title.split(' ').map((word, index) => (
                    <span key={index} className={index === 1 ? 'text-magenta-500' : ''}>
                      {word}{index < slides[currentSlide].title.split(' ').length - 1 ? ' ' : ''}
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
                    <div key={index} className="flex items-center space-x-1.5 sm:space-x-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-magenta-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">{feature}</span>
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
                        <div className="text-xl lg:text-2xl font-bold">50K+</div>
                        <div className="text-xs lg:text-sm text-slate-300">Projects Done</div>
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
  )
}