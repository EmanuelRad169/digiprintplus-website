'use client'

export default function EnvTestPage() {
  const envVars = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NODE_ENV: process.env.NODE_ENV,
    isBrowser: typeof window !== 'undefined'
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Environment Variables Test</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(envVars, null, 2)}
      </pre>
    </div>
  )
}
