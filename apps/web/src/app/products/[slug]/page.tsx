import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { SanityProductImage } from '@/components/ui/sanity-image'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getSiteSettings } from '@/lib/sanity/fetchers'
import { PortableTextRenderer } from '@/components/portable-text'
import { Product, ProductImage, ProductTestimonial, ProductSpecification, ProductFeature } from '@/types/product'
import ProductTabs from '@/components/product-tabs'
import { generateProductSEO, generateProductSchema } from '@/lib/seo'
import { Star, Check, Download, Share2, Heart, ShoppingCart, Phone, Mail, ArrowLeft, Eye, Clock, Shield, Award, Tag, TrendingUp, AlertTriangle, Calendar, Truck, Sparkles, FileText, Video, Quote, BadgeCheck } from 'lucide-react'

export const revalidate = 60

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params
  const { isEnabled } = await draftMode()
  
  const [product, siteSettings] = await Promise.all([
    getProductBySlug(slug, isEnabled),
    getSiteSettings()
  ])

  if (!product) {
    notFound()
  }

  const contactInfo = siteSettings?.contact || { phone: '(800) 555-1234', email: 'info@digiprintplus.com' }
  const productSchema = generateProductSchema(product)

  // Format currency display
  const formatCurrency = (price: number | undefined, currency = 'USD') => {
    if (!price) return null;
    
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$'
    };
    
    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // We don't need pricing display for quote-only mode
  const getPriceDisplay = () => {
    return null;
  };

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
    );
  };
  
  const priceDisplay = getPriceDisplay();
  const hasRating = product.rating && product.rating > 0;
  const hasTestimonials = product.testimonials && product.testimonials.length > 0;
  const hasVideo = product.videoUrl && product.videoUrl.length > 0;
  const hasUseCases = product.useCases && product.useCases.length > 0;
  const hasCertifications = product.certifications && product.certifications.length > 0;
  const hasTags = product.tags && product.tags.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema)
        }}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Home</a>
            <span className="text-gray-400">/</span>
            <a href="/products" className="text-gray-500 hover:text-gray-900 transition-colors">Products</a>
            {product.category && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-500">{product.category.title}</span>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section - Enhanced Layout */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Product Images with Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
                {product.image && product.image.asset && (
                  <SanityProductImage
                    src={product.image}
                    alt={product.image.alt || product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.gallery
                    .filter((image: ProductImage) => image?.asset?.url)
                    .slice(0, 4)
                    .map((image: ProductImage, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        <SanityProductImage
                          src={image}
                          alt={image.alt || `${product.title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                </div>
              )}
              

            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Status & Category Badges */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-sky-100 text-sky-600 border border-sky-200">
                    <Award className="w-4 h-4 mr-2" />
                    {product.category.title}
                  </div>
                )}
                
                {product.status && (
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    product.status === 'active' ? 'bg-green-100 text-green-600 border border-green-200' :
                    product.status === 'coming-soon' ? 'bg-purple-100 text-purple-600 border border-purple-200' :
                    product.status === 'discontinued' ? 'bg-red-100 text-red-600 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                    {product.status === 'coming-soon' ? 'Coming Soon' : 
                      product.status === 'active' ? 'Active' : 
                      product.status === 'discontinued' ? 'Discontinued' : 
                      'Draft'}
                  </div>
                )}
                
                {product.newProduct && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-magenta-100 to-purple-100 text-magenta-500 border border-magenta-200">
                    <Sparkles className="w-4 h-4 mr-2" />
                    New
                  </div>
                )}
              </div>
              
              {/* Title and Rating */}
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                  {product.title}
                </h1>
                
              </div>

              {/* Description */}
              <p className="text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Tags */}
              {hasTags && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-sky-50 text-gray-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature: string | ProductFeature, index: number) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <div className="w-2 h-2 bg-magenta-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm">
                          {typeof feature === 'string' 
                            ? feature 
                            : feature && typeof feature === 'object' && 'feature' in feature
                              ? feature.feature
                              : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Trust Indicators */}
          <div className="grid grid-cols-3 gap-4">
            {product.qualityGuarantee && (
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Quality Guaranteed</p>
              </div>
            )}
            {product.fastDelivery && (
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Fast Delivery</p>
              </div>
            )}
            {product.awardWinning && (
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Award Winning</p>
              </div>
            )}
            {hasCertifications && product.certifications.slice(0, 3 - [product.qualityGuarantee, product.fastDelivery, product.awardWinning].filter(Boolean).length).map((cert: string, index: number) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <BadgeCheck className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-600 font-medium">{cert}</p>
              </div>
            ))}
          </div>

          {/* Right Column - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href={product.formLink || `/quote?product=${product.slug?.current}`}
              className="flex-1 bg-magenta-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <Quote className="w-5 h-5 mr-2" />
              Request a Quote
            </Link>
            <Link 
              href="/contact"
              className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
      {/* Product Details Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductTabs product={product} />
      </div>

      {/* Enhanced Gallery */}
      {product.gallery && product.gallery.length > 0 && product.gallery.some((image: ProductImage) => image?.asset?.url) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore detailed images of our {product.title} to see the quality and craftsmanship up close.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.gallery.filter((image: ProductImage) => image?.asset?.url).map((image: ProductImage, index: number) => (
              <div key={index} className="group relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <Image
                  src={image.asset.url}
                  alt={image.alt || `${product.title} gallery image ${index + 1}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative bg-magenta-500 rounded-3xl overflow-hidden">
          
          <div className="relative px-8 lg:px-16 py-12 lg:py-16">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              
              {/* Content */}
              <div className="col-span-2 text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  Ready to Order {product.title}?
                </h2>
                <p className="text-cyan-100 text-base leading-relaxed mb-8">
                  Get a custom quote tailored to your specific needs. Our expert team will help you choose the perfect options and provide competitive pricing with fast turnaround times.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a 
                    href="/quote"
                    className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Get Free Quote
                  </a>
                  <a 
                    href="/contact"
                    className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Us
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-white">
                    <Phone className="w-5 h-5 mr-3 text-cyan-200" />
                    <span>Call us: {contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Mail className="w-5 h-5 mr-3 text-cyan-200" />
                    <span>Email: {contactInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

// Generate metadata from Sanity content
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found - DigiPrintPlus',
      description: 'The requested product could not be found.',
    }
  }

  return generateProductSEO({
    product,
    category: product.category?.title,
  })
}

// Generate static params for products
export async function generateStaticParams() {
  // You can fetch all product slugs from Sanity here if needed
  // For now, return empty array to use ISR
  return []
}