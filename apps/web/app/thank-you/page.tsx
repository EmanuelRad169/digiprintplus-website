'use client'

import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Phone, Mail, Clock } from 'lucide-react'

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const quoteId = searchParams?.get('quote')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6 mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Thank You!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your quote request has been successfully submitted. We&apos;re excited to help bring your printing project to life!
            </p>
            {quoteId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 font-medium">
                  Quote Request ID: <span className="font-mono">{quoteId}</span>
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Please save this ID for your records.
                </p>
              </div>
            )}
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-primary-50 rounded-xl p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-primary-900 mb-6">What Happens Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Confirmation Email</h3>
                  <p className="text-sm text-primary-700">
                    Check your inbox for an immediate confirmation with your quote request details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Expert Review</h3>
                  <p className="text-sm text-primary-700">
                    Our specialists will carefully review your requirements and prepare a detailed quote.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Personal Contact</h3>
                  <p className="text-sm text-primary-700">
                    We&apos;ll call or email you within 24 hours with your custom quote and next steps.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="border-t border-gray-200 pt-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Need Immediate Assistance?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:+15551234567"
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">(555) 123-4567</span>
              </a>
              
              <div className="hidden sm:block text-gray-300">|</div>
              
              <a
                href="mailto:sales@digiprintplus.com"
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">sales@digiprintplus.com</span>
              </a>
              
              <div className="hidden sm:block text-gray-300">|</div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Mon-Fri: 8AM-6PM</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Browse More Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Return to Home
            </Link>
          </motion.div>

          {/* Reference Number */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8 text-sm text-gray-500"
          >
            Reference #: QR-{Date.now().toString().slice(-6)}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}