'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle, Upload, User, FileText, Send } from 'lucide-react'
import { ContactStep } from '../../components/quote/contact-step'
import { JobSpecsStep } from '../../components/quote/job-specs-step'
import { FileUploadStep } from '../../components/quote/file-upload-step'
import { ReviewStep } from '../../components/quote/review-step'

const steps = [
  { id: 1, name: 'Contact Info', icon: User, description: 'Your contact details' },
  { id: 2, name: 'Job Specifications', icon: FileText, description: 'Project requirements' },
  { id: 3, name: 'File Upload', icon: Upload, description: 'Upload your files' },
  { id: 4, name: 'Review & Submit', icon: Send, description: 'Review and submit' },
]

export default function QuotePage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Contact Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    
    // Job Specs
    productType: '',
    quantity: '',
    size: '',
    paperType: '',
    finish: '',
    turnaround: '',
    additionalNotes: '',
    
    // Files
    files: [] as File[],
  })

  // Pre-fill product type from URL parameter
  useEffect(() => {
    const product = searchParams?.get('product')
    if (product) {
      setFormData(prev => ({
        ...prev,
        productType: product.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }))
    }
  }, [searchParams])

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleSubmit = async () => {
    try {
      // Create FormData for file uploads
      const submitData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'files') {
          // Handle file array separately
          (value as File[]).forEach(file => {
            submitData.append('files', file)
          })
        } else {
          submitData.append(key, value as string)
        }
      })

      // Submit to API
      const response = await fetch('/api/quotes', {
        method: 'POST',
        body: submitData,
      })

      const result = await response.json()
      
      if (result.success) {
        // Track conversion
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'quote_submit', {
            event_category: 'engagement',
            event_label: formData.productType,
            value: 1
          })
        }
        
        // Redirect to thank you page with quote ID
        if (typeof window !== 'undefined') {
          window.location.href = `/thank-you?quote=${result.data.requestId}`
        }
      } else {
        console.error('Failed to submit quote:', result.error)
        alert('Failed to submit quote. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('Failed to submit quote. Please try again.')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ContactStep formData={formData} updateFormData={updateFormData} />
      case 2:
        return <JobSpecsStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return <FileUploadStep formData={formData} updateFormData={updateFormData} />
      case 4:
        return <ReviewStep formData={formData} onSubmit={handleSubmit} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Your <span className="text-magenta-600">Free Quote</span>
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your project and we&#39;ll provide a detailed quote within 24 hours
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep > step.id
                      ? 'bg-green-500 border-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-magenta-600 border-magenta-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-magenta-600 text-white rounded-lg font-medium hover:bg-magenta-700 transition-colors duration-200"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-3 bg-magenta-600 text-white rounded-lg font-medium hover:bg-magenta-700 transition-colors duration-200"
              >
                Submit Quote Request
                <Send className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}