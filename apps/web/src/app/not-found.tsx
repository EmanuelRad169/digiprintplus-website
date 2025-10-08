import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, we couldn&apos;t find the page you were looking for. The page might have been moved, deleted, or never existed.
      </p>
      <Link 
        href="/" 
        className="bg-[#ea088c] hover:bg-[#d0077e] text-white font-medium py-2 px-4 rounded-lg"
      >
        Return to homepage
      </Link>
    </div>
  )
}
