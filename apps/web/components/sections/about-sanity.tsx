'use client'

import { motion, cubicBezier } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Award, Clock, Shield, Users, Star, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { getAboutSections, type AboutSection } from '@/lib/sanity/contentFetchers'
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

// Fallback data
const fallbackSections: AboutSection[] = [
  {
    _id: 'fallback-stats',
    sectionType: 'statistics',
    title: 'Trusted by 10,000+ businesses',
    subtitle: 'Why Choose DigiPrintPlus?',
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: "We've revolutionized printing with cutting-edge technology, unmatched quality, and customer service that goes above and beyond expectations."
          }
        ]
      }
    ],
    statistics: [
      { number: '15+', label: 'Years Experience', icon: 'award' },
      { number: '10K+', label: 'Happy Clients', icon: 'users' },
      { number: '50K+', label: 'Projects Completed', icon: 'checkCircle' },
      { number: '99%', label: 'Satisfaction Rate', icon: 'star' }
    ],
    order: 1,
    isActive: true
  }
]

export function AboutSanity() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [sections, setSections] = useState<AboutSection[]>(fallbackSections)
  const [loading, setLoading] = useState(true)
  
  // Define easing functions
  const easeOut = cubicBezier(0.33, 1, 0.68, 1)

  // Load about sections from Sanity
  useEffect(() => {
    async function loadSections() {
      try {
        const sanitySections = await getAboutSections()
        if (sanitySections && sanitySections.length > 0) {
          setSections(sanitySections)
        }
      } catch (error) {
        console.error('Failed to load about sections:', error)
        // Keep fallback sections
      } finally {
        setLoading(false)
      }
    }

    loadSections()
  }, [])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: easeOut }
    }
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Award
    return IconComponent
  }

  if (loading) {
    return (
      <section className="py-14 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  // Find statistics and features sections
  const statsSection = sections.find(s => s.sectionType === 'statistics')
  const featuresSection = sections.find(s => s.sectionType === 'features')

  return (
    <section ref={ref} className="py-14 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Statistics Section */}
        {statsSection && (
          <>
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center px-4 py-2 bg-yellow-300 text-black rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                {statsSection.title}
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {statsSection.subtitle?.split(' ').map((word, index) => {
                  if (word.toLowerCase().includes('digiprintplus')) {
                    return <span key={index} className="text-magenta-500"> {word}</span>
                  }
                  return word + ' '
                })}
              </h2>
              
              {statsSection.content && (
                <div className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed prose prose-lg">
                  <PortableText value={statsSection.content} />
                </div>
              )}
            </motion.div>

            {/* Statistics Grid */}
            {statsSection.statistics && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
              >
                {statsSection.statistics.map((stat, index) => {
                  const IconComponent = getIcon(stat.icon)
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.6, ease: easeOut, delay: 0.3 + index * 0.1 }}
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
              </motion.div>
            )}
          </>
        )}

        {/* Features Section */}
        {featuresSection && featuresSection.features && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Features */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-8"
            >
              {featuresSection.features.map((feature, index) => {
                const IconComponent = getIcon(feature.icon)
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group relative"
                  >
                    <div className="flex items-start space-x-4 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-magenta-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-magenta-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-3">
                          {feature.description}
                        </p>
                        {feature.highlight && (
                          <span className="inline-block px-3 py-1 bg-magenta-100 text-magenta-700 text-sm font-medium rounded-full">
                            {feature.highlight}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Image/Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }}
              className="relative"
            >
              {featuresSection.image?.asset?.url ? (
                <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={featuresSection.image.asset.url}
                    alt={featuresSection.image.alt || featuresSection.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-magenta-500 to-pink-600 rounded-xl p-8 lg:p-12 text-white">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-6">
                    {featuresSection.title}
                  </h3>
                  {featuresSection.content && (
                    <div className="prose prose-lg prose-invert">
                      <PortableText value={featuresSection.content} />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-magenta-100 rounded-full opacity-50" />
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-100 rounded-full opacity-50" />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-magenta-500 rounded-full" />
    </section>
  )
}
