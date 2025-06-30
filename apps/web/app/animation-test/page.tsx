'use client'

import { useState } from 'react'

export default function AnimationTest() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎨 tailwindcss-animate Test</h1>
      
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Toggle Animation
      </button>

      {/* Test animate-in and fade-in classes */}
      {isVisible && (
        <div className="animate-in fade-in duration-500 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ✅ Success!
          </h2>
          <p className="text-gray-700">
            The <code className="bg-gray-200 px-2 py-1 rounded text-sm">animate-in fade-in</code> classes are working perfectly!
          </p>
          <div className="mt-4 text-sm text-gray-600">
            • <code>animate-in</code> - Base animation class<br/>
            • <code>fade-in</code> - Fade in animation<br/>
            • <code>duration-500</code> - 500ms duration
          </div>
        </div>
      )}

      {/* Additional animation examples */}
      <div className="mt-6 space-y-3">
        <div className="animate-in slide-in-from-left duration-700 delay-100 bg-green-50 p-4 rounded border-l-4 border-green-400">
          <span className="text-green-800">animate-in slide-in-from-left</span>
        </div>
        
        <div className="animate-in slide-in-from-right duration-700 delay-200 bg-purple-50 p-4 rounded border-l-4 border-purple-400">
          <span className="text-purple-800">animate-in slide-in-from-right</span>
        </div>
        
        <div className="animate-in zoom-in duration-700 delay-300 bg-orange-50 p-4 rounded border-l-4 border-orange-400">
          <span className="text-orange-800">animate-in zoom-in</span>
        </div>
      </div>
    </div>
  )
}
