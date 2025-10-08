'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Edit, File } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getQuoteSettings, QuoteSettings } from '@/lib/sanity/contentFetchers'

interface ReviewStepProps {
  formData: any
  onSubmit: () => void
}

export function ReviewStep({ formData, onSubmit }: ReviewStepProps) {
  const [quoteSettings, setQuoteSettings] = useState<QuoteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuoteSettings = async () => {
      try {
        const settings = await getQuoteSettings()
        setQuoteSettings(settings)
      } catch (error) {
        console.error('Error fetching quote settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuoteSettings()
  }, [])

  // Fallback data if Sanity data is not available
  const fallbackSettings = {
    reviewStep: {
      title: 'Review Your Quote Request',
      description: 'Please review all information before submitting your quote request.',
      terms: 'I agree to the Terms of Service and Privacy Policy. I understand that this is a quote request and not a final order.'
    },
    buttonText: {
      submit: 'Submit Quote Request'
    }
  }

  const settings = quoteSettings || fallbackSettings

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{settings.reviewStep.title}</h2>
        <p className="text-gray-600">{settings.reviewStep.description}</p>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          <Edit className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Name:</span> {formData.firstName} {formData.lastName}
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span> {formData.email}
          </div>
          <div>
            <span className="font-medium text-gray-700">Phone:</span> {formData.phone}
          </div>
          {formData.company && (
            <div>
              <span className="font-medium text-gray-700">Company:</span> {formData.company}
            </div>
          )}
        </div>
      </div>

      {/* Job Specifications */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Job Specifications</h3>
          <Edit className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Product Type:</span> {formData.productType}
          </div>
          <div>
            <span className="font-medium text-gray-700">Quantity:</span> {formData.quantity}
          </div>
          {formData.size && (
            <div>
              <span className="font-medium text-gray-700">Size:</span> {formData.size}
            </div>
          )}
          {formData.paperType && (
            <div>
              <span className="font-medium text-gray-700">Paper Type:</span> {formData.paperType}
            </div>
          )}
          {formData.finish && (
            <div>
              <span className="font-medium text-gray-700">Finish:</span> {formData.finish}
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700">Turnaround:</span> {formData.turnaround}
          </div>
        </div>
        {formData.additionalNotes && (
          <div className="mt-4">
            <span className="font-medium text-gray-700">Additional Notes:</span>
            <p className="text-gray-600 mt-1">{formData.additionalNotes}</p>
          </div>
        )}
      </div>

      {/* Files */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Uploaded Files ({formData.files.length})
          </h3>
          <Edit className="w-5 h-5 text-gray-400" />
        </div>
        {formData.files.length > 0 ? (
          <div className="space-y-2">
            {formData.files.map((file: File, index: number) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <File className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{file.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No files uploaded - design assistance requested</p>
        )}
      </div>

      {/* What Happens Next */}
      <div className="bg-primary-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">What Happens Next?</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium text-primary-900">Instant Confirmation:</span>
              <span className="text-primary-800"> You&apos;ll receive an email confirmation immediately.</span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium text-primary-900">Quote Review:</span>
              <span className="text-primary-800"> Our team will review your requirements within 2 hours.</span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium text-primary-900">Detailed Quote:</span>
              <span className="text-primary-800"> You&apos;ll receive a comprehensive quote within 24 hours.</span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium text-primary-900">Personal Follow-up:</span>
              <span className="text-primary-800"> A specialist will contact you to discuss your project.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
            required
          />
          <span className="text-sm text-gray-700">
            {settings.reviewStep.terms}
          </span>
        </label>
      </div>
    </motion.div>
  )
}