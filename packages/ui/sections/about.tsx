'use client'

import { motion, cubicBezier } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, Clock, Shield, Users, Star, ArrowRight, CheckCircle } from 'lucide-react'
import Image from 'next/image'

const stats = [
  { number: '15+', label: 'Years Experience', icon: Award },
  { number: '10K+', label: 'Happy Clients', icon: Users },
  { number: '50K+', label: 'Projects Completed', icon: CheckCircle },
  { number: '99%', label: 'Satisfaction Rate', icon: Star }
]

const features = [
  {
    icon: Award,
    title: 'Premium Quality Materials',
    description: 'We use only the finest papers, inks, and materials sourced from trusted suppliers to ensure exceptional results.',
    highlight: 'Industry-leading standards'
  },
  {
    icon: Clock,
    title: 'Lightning Fast Delivery',
    description: 'Same-day rush orders available. Most standard orders completed within 24-48 hours with free shipping.',
    highlight: '24hr turnaround'
  },
  {
    icon: Shield,
    title: '100% Satisfaction Promise',
    description: 'Not completely satisfied? We\'ll reprint your order for free or provide a full refund. Your success is our priority.',
    highlight: 'Risk-free guarantee'
  },
  {
    icon: Users,
    title: 'Dedicated Print Experts',
    description: 'Our certified printing specialists provide personalized guidance and support throughout your entire project.',
    highlight: 'Expert consultation'
  }
]

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  // Define easing functions
  const easeOut = cubicBezier(0.33, 1, 0.68, 1)

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

  return (
    <section ref={ref} className="py-14 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-yellow-300 text-black rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 10,000+ businesses
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Why Choose 
            <span className="text-magenta-500"> DigiPrintPlus</span>?
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We&#39;ve revolutionized printing with cutting-edge technology, unmatched quality, and customer service that goes above and beyond expectations.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                What Sets Us Apart
              </h3>
              <p className="text-gray-600 leading-relaxed">
                From small startups to Fortune 500 companies, we&apos;ve earned our reputation through consistent excellence, innovative solutions, and unwavering commitment to customer success.
              </p>
            </motion.div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className=""
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-magenta-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{feature.title}</h4>
                        <span className="text-xs font-medium text-white bg-cyan-500 px-2 py-1 rounded-full">
                          {feature.highlight}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>

          {/* Visual Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOut }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.5, duration: 0.8, ease: easeOut }}
                className=" overflow-hidden rounded-3xl"
              >
                <Image
                  src="https://images.pexels.com/photos/3631430/pexels-photo-3631430.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Modern printing facility"
                  width={600}
                  height={384}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0"></div>
              </motion.div>

            </div>

            {/* Secondary Images Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: easeOut }}
              className="grid grid-cols-2 gap-4 mt-6"
            >
              <Image
                src="https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Printing samples"
                width={300}
                height={160}
                className="h-40 object-cover rounded-3xl"
              />
              <Image
                src="https://images.pexels.com/photos/7947663/pexels-photo-7947663.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Quality materials"
                width={300}
                height={160}
                className="h-40 object-cover rounded-3xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}