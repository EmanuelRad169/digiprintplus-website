'use client'

import { useState, useEffect } from 'react'
import { getSanityClient } from '@/lib/sanity'

export default function TestCorsPage() {
  const [status, setStatus] = useState<string>('Testing...')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testSanityConnection() {
      try {
        setStatus('🔍 Testing Sanity connection from browser...')
        
        const client = getSanityClient()
        const result = await client.fetch('*[_type == "siteSettings"][0]')
        
        setStatus('✅ CORS working! Sanity connection successful')
        setData(result)
        setError(null)
      } catch (err: any) {
        setError(err.message)
        if (err.message.includes('CORS') || err.message.includes('cors')) {
          setStatus('❌ CORS Error: Need to add localhost:3000 to Sanity CORS origins')
        } else {
          setStatus('❌ Connection Error: ' + err.message)
        }
      }
    }

    testSanityConnection()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🧪 Sanity CORS Test</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Status:</h2>
        <p className={`${error ? 'text-red-600' : 'text-green-600'}`}>
          {status}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
          <h2 className="font-semibold text-red-800 mb-2">Error Details:</h2>
          <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          
          {error.includes('CORS') && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-semibold text-yellow-800">🔧 Fix Required:</h3>
              <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2">
                <li>Go to <a href="https://www.sanity.io/manage" target="_blank" className="underline">Sanity Manage</a></li>
                <li>Select project: <code>as5tildt</code></li>
                <li>Navigate to: Project → API → CORS Origins</li>
                <li>Add: <code>http://localhost:3000</code></li>
                <li>Uncheck &quot;Allow credentials&quot;</li>
                <li>Save changes</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {data && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h2 className="font-semibold text-green-800 mb-2">✅ Success! Sample Data:</h2>
          <pre className="text-sm text-green-700 whitespace-pre-wrap overflow-auto max-h-64">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Project ID:</strong> as5tildt</p>
        <p><strong>Dataset:</strong> development</p>
        <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
      </div>
    </div>
  )
}
