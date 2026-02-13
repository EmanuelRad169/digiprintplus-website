import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Package, Tag } from 'lucide-react'
import { getProductCategories } from '@/lib/sanity/fetchers'
import * as LucideIcons from 'lucide-react'
import Image from 'next/image'

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

// Updated Category type to include image
interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  icon?: string
  count: number
  image?: string // New field for category image
}

// Category card component
function CategoryCard({ category }: { category: Category }) {
  // Get icon component from Lucide
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Package

    const IconComponent = (LucideIcons as any)[iconName]
    return IconComponent || Package
  }

  const IconComponent = getIconComponent(category.icon)

  return (
    <Link href={`/products/category/${category.slug.current}`}>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-magenta-200">
        {/* Category Image or Icon */}
        <div className="bg-gradient-to-br from-magenta-50 to-magenta-100 aspect-square flex items-center justify-center group-hover:from-magenta-100 group-hover:to-magenta-200 transition-colors relative">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <IconComponent className="w-8 h-8 text-magenta-600" />
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Category Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-magenta-600 transition-colors">
            {category.title}
          </h3>

          {/* Category Description */}
          {category.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {category.description}
            </p>
          )}

          {/* Product Count & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Tag className="w-4 h-4 mr-2" />
              <span>{category.count} product{category.count !== 1 ? 's' : ''}</span>
            </div>

            <div className="flex items-center text-magenta-600 group-hover:text-magenta-700 transition-colors">
              <span className="text-sm font-medium mr-2">Explore</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Loading component
function CategoriesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
          <div className="bg-gray-300 h-32" />
          <div className="p-6">
            <div className="h-6 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Main Products Page Component
export default async function ProductsPage() {
  const categories = await getProductCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Product <span className="text-magenta-500">Categories</span>
            </h1>
            <p className="text-lg text-white max-w-3xl mx-auto">
              Explore our comprehensive range of high-quality printing products and services.
              Choose from our specialized categories to find exactly what you need for your business.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<CategoriesLoading />}>
          {categories.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  Browse {categories.length} product categor{categories.length !== 1 ? 'ies' : 'y'}
                </p>
                <div className="text-sm text-gray-500">
                  Need help choosing? <Link href="/contact" className="text-magenta-600 hover:underline">Contact us</Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category: Category) => (
                  <CategoryCard key={category._id} category={category} />
                ))}
              </div>

              {/* CTA Section */}
              <div className="mt-16 bg-magenta-500 rounded-2xl p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">
                  Looking for something specific?
                </h2>
                <p className="text-magenta-100 mb-6">
                  We offer custom printing solutions for unique requirements. Get in touch with our team for personalized assistance.
                </p>
                <Link
                  href="/quote"
                    className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span>Request Custom Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Package className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No categories available
              </h3>
              <p className="text-gray-500 mb-6">
                We&apos;re currently setting up our product categories. Please check back soon or contact us for information.
              </p>
              <Link
                href="/contact"
                className="bg-magenta-600 text-white px-6 py-3 rounded-lg hover:bg-magenta-700 transition-colors"
              >
                Contact Us for Information
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}
