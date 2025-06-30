import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { getProductsByCategory, getCategoryBySlug, getProductCategories } from '@/lib/sanity/fetchers'
import { Product, ProductCategory } from '@/types/product'
import { ShoppingCart, Eye, ArrowLeft, Tag, Package, Sparkles } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

export const revalidate = 60

interface CategoryPageProps {
  params: {
    category: string
  }
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Product Image */}
      <div className="aspect-[4/3] bg-gradient-to-br from-magenta-50 to-magenta-100 relative overflow-hidden">
        {product.image?.asset?.url ? (
          <Image
            src={product.image.asset.url}
            alt={product.image.alt || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-magenta-600 text-center">
              <Package className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Product Image</p>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-cyan-300 text-black text-xs font-semibold px-2 py-1 rounded-full flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
          {product.popular && (
            <span className="bg-yellow-300 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Title & Description */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-magenta-600 transition-colors">
            {product.title}
          </h3>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed pb-6">
          {product.description}
        </p>
    

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/products/${product.slug?.current}`}
            className="flex-1 bg-black text-white px-4 py-2.5 rounded-lg font-medium  text-center text-sm flex items-center justify-center transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Link>
          <Link
            href={product.formLink || `/quote?product=${product.slug?.current}`}
            className="flex-1 bg-magenta-500 text-white px-4 py-2.5 rounded-lg font-medium text-center text-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Get Quote
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params
  const { isEnabled } = draftMode()
  
  // Get category info and products
  const currentCategory = await getCategoryBySlug(category, isEnabled)
  const products = await getProductsByCategory(category, isEnabled)
  const categories = await getProductCategories(isEnabled)

  if (!currentCategory) {
    notFound()
  }

  // Get icon component from Lucide
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Package
    const IconComponent = (LucideIcons as any)[iconName]
    return IconComponent || Package
  }

  const IconComponent = getIconComponent(currentCategory.icon)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-900 transition-colors">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{currentCategory.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section with Full-Width Image */}
      <div className="relative">
        {currentCategory.image?.asset?.url ? (
          <div className="relative h-96 lg:h-[500px] overflow-hidden">
            <Image
              src={currentCategory.image.asset.url}
              alt={currentCategory.image.alt || currentCategory.title}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                  {currentCategory.title}
                </h1>
                {currentCategory.description && (
                  <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
                    {currentCategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-magenta-600 to-magenta-800 py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-white max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                  {currentCategory.title}
                </h1>
                {currentCategory.description && (
                  <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
                    {currentCategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Content Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Professional {currentCategory.title} Solutions
            </h2>
            <div className="prose prose-lg prose-gray mx-auto">
              <p className="text-gray-600 leading-relaxed">
                {currentCategory.description ? (
                  `Discover our comprehensive range of ${currentCategory.title.toLowerCase()} solutions designed to meet your business needs. 
                  Each product is crafted with precision and attention to detail, ensuring professional results that make a lasting impression.`
                ) : (
                  `Explore our professional ${currentCategory.title.toLowerCase()} collection with a variety of options to suit different requirements and budgets.`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Products Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  We&apos;re currently adding products to this category. 
                  In the meantime, contact us for custom solutions.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-magenta-600 text-white font-medium rounded-lg hover:bg-magenta-700 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-magenta-500 rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="relative">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Need Custom {currentCategory.title}?
              </h2>
              <p className="text-magenta-100 mb-8 max-w-3xl mx-auto text-base">
                Our expert team specializes in creating custom {currentCategory.title.toLowerCase()} solutions 
                tailored to your unique requirements. Get professional results with personalized service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/quote"
                    className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Get Custom Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate metadata
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = params
  const currentCategory = await getCategoryBySlug(category)
  
  if (!currentCategory) {
    return {
      title: 'Category Not Found - DigiPrintPlus',
      description: 'The requested product category could not be found.',
    }
  }

  return {
    title: currentCategory.seo?.metaTitle || `${currentCategory.title} - Professional Printing Services | DigiPrintPlus`,
    description: currentCategory.seo?.metaDescription || currentCategory.description || `High-quality ${currentCategory.title.toLowerCase()} printing services. Professional results, competitive pricing, fast turnaround.`,
    openGraph: {
      title: `${currentCategory.title} - DigiPrintPlus`,
      description: currentCategory.description || `Professional ${currentCategory.title.toLowerCase()} printing services`,
      images: currentCategory.image?.asset?.url ? [
        {
          url: currentCategory.image.asset.url,
          width: 1200,
          height: 630,
          alt: currentCategory.title,
        }
      ] : [],
    },
  }
}

// Generate static params for categories
export async function generateStaticParams() {
  const categories = await getProductCategories()
  
  return categories
    .filter((category: ProductCategory) => category.slug?.current)
    .map((category: ProductCategory) => ({
      category: category.slug!.current,
    }))
}
