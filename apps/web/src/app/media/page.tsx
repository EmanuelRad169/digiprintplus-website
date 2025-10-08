import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Media - DigiPrintPlus',
  description: 'Media resources and press information.',
}

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Media Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Coming soon - Media resources and press information will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}