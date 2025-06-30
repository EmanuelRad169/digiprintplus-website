'use client'

import { useRef } from 'react'
import { motion, cubicBezier, useInView } from 'framer-motion'
import { Award, Clock, Shield, Users, Star, CheckCircle } from 'lucide-react'
import type { AboutSection } from '@/lib/sanity/contentFetchers'
import { PortableText } from '@portabletext/react'

// Icon mapping
const iconMap = {
  award: Award,
  clock: Clock,
  shield: Shield,
  users: Users,
  star: Star,
  checkCircle: CheckCircle,
}

interface ClientAboutSectionProps {
  sections: AboutSection[]
}

export default function ClientAboutSection({ sections }: ClientAboutSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const easeOut = cubicBezier(0.33, 1, 0.68, 1)

  // Find statistics section
  const statsSection = sections.find(s => s.sectionType === 'statistics')

  if (!statsSection) {
    return null
  }

  return (
    <section className="py-14 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-300 text-black rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            {statsSection.title}
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {statsSection.subtitle?.split(' ').map((word, index) => (
              <span key={index}>
                {word.toLowerCase().includes('digiprintplus') ? (
                  <span className="text-magenta-500">{word} </span>
                ) : (
                  word + ' '
                )}
              </span>
            ))}
          </h2>
          
          <div className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed prose prose-lg">
            <PortableText value={statsSection.content} />
          </div>
        </div>

        {statsSection.statistics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {statsSection.statistics.map((stat, index) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Award
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: easeOut }}
                  className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-magenta-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-magenta-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <div className="absolute top-10 right-10 w-20 h-20 bg-magenta-100 rounded-full opacity-50" />
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-100 rounded-full opacity-50" />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-magenta-500 rounded-full" />
    </section>
  )
}
