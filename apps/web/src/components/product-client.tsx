'use client'

import { useLiveQuery } from '@sanity/preview-kit'
import { Product } from '@/types/product'
import ProductTabs from '@/components/product-tabs'
import { SanityProductImage } from '@/components/ui/sanity-image'
import { PortableTextRenderer } from '@/components/portable-text'
import { Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ProductClientProps {
  initialProduct: Product
  isDraftMode: boolean
}

export default function ProductClient({ initialProduct, isDraftMode }: ProductClientProps) {
  // Setup live mode for real-time updates when in draft mode
  const [product] = useLiveQuery(
    initialProduct,
    `*[_type == "product" && _id == $id][0]`,
    { id: initialProduct._id }
  )

  // Format stars display for ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        {rating % 1 !== 0 && (
          <span className="text-xs font-medium ml-1 text-gray-600">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Product Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-8 border-b">
        <div className="container px-4 mx-auto">
          <div className="flex items-center mb-4">
            <Link href="/products" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Products
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
          
          {product.longDescription && (
            <div className="text-xl text-gray-600 mb-4">
              <PortableTextRenderer content={product.longDescription} />
            </div>
          )}
          
          {product.rating && (
            <div className="flex items-center mb-4">
              {renderStars(product.rating)}
              <span className="ml-2 text-sm text-gray-500">
                {product.reviewCount || 0} reviews
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Hero Section */}
      <div className="container px-4 mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative rounded-xl overflow-hidden bg-white border shadow-sm">
            {product.image && (
              <SanityProductImage
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover"
              />
            )}
          </div>
          
          {/* Product Info */}
          <div>
            {product.longDescription && (
              <div className="prose max-w-none mb-8">
                <PortableTextRenderer content={product.longDescription} />
              </div>
            )}
            
            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index: number) => {
                    const featureText = typeof feature === 'string' ? feature : feature.feature || '';
                    return (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>{featureText}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="container px-4 mx-auto py-8">
        <ProductTabs product={product} />
      </div>
    </>
  )
}
