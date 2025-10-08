export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="h-12 bg-slate-200 animate-pulse rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-6 bg-slate-200 animate-pulse rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-8 bg-slate-200 animate-pulse rounded w-64 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="aspect-square bg-slate-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-6 bg-slate-200 animate-pulse rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 animate-pulse rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 animate-pulse rounded w-2/3 mb-4"></div>
                <div className="flex gap-2 mt-4">
                  <div className="h-10 bg-slate-200 animate-pulse rounded flex-1"></div>
                  <div className="h-10 bg-slate-200 animate-pulse rounded flex-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
