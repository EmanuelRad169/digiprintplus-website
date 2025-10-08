export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ea088c] rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading content...</p>
    </div>
  )
}
