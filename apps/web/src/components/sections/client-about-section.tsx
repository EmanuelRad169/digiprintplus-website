"use client";

import { useRef } from "react";
import { motion, cubicBezier, useInView } from "framer-motion";
import { Award, Clock, Shield, Users, Star, CheckCircle } from "lucide-react";
import LiteYouTube from "@/components/media/lite-youtube";
import type { AboutSection } from "@/lib/sanity/contentFetchers";
import { PortableText } from "@portabletext/react";

// Icon mapping
const iconMap = {
  award: Award,
  clock: Clock,
  shield: Shield,
  users: Users,
  star: Star,
  checkCircle: CheckCircle,
};

interface ClientAboutSectionProps {
  sections: AboutSection[];
}

export default function ClientAboutSection({
  sections,
}: ClientAboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const easeOut = cubicBezier(0.33, 1, 0.68, 1);

  // Find statistics section
  const statsSection = sections.find((s) => s.sectionType === "statistics");

  if (!statsSection) {
    return null;
  }

  return (
    <section className="relative pb-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-2 bg-yellow-300 text-black rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 mr-2" />
            {statsSection.title}
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            {statsSection.subtitle?.split(" ").map((word, index) => (
              <span key={index}>
                {word.toLowerCase().includes("digiprintplus") ? (
                  <span className="text-magenta-500 ">{word} </span>
                ) : (
                  word + " "
                )}
              </span>
            ))}
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed prose prose-xl"
          >
            <PortableText value={statsSection.content} />
          </motion.div>
        </motion.div>

        {/* Video Showcase with enhanced design - 2 Column Layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
          }
          transition={{ duration: 0.8, delay: 0.3, ease: easeOut }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Video */}
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-20 blur-xl"></div>

              {/* Video container */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
                  </div>

                  <LiteYouTube
                    className="relative z-10"
                    videoId="7MscwWMYfi0"
                    title="DigiPrintPlus Company Overview"
                    params="autoplay=1&mute=1&controls=1&rel=0&modestbranding=1"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Content & Stats */}
            <div className="space-y-8">
              {/* Text content */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                  Discover DigiPrintPlus in Action
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Watch our company story and see how we bring your printing
                  visions to life with cutting-edge technology and exceptional
                  service.
                </p>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">4.9/5</div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Happy Clients</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      Industry
                    </div>
                    <div className="text-sm text-gray-600">Leader</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
