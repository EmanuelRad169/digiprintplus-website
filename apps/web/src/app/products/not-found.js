import Link from 'next/link'

export default function ProductsNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="border border-slate-300 text-slate-700 hover:border-slate-400 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
