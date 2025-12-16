import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { SanityProductImage } from '@/components/ui/sanity-image'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getSiteSettings } from '@/lib/sanity/fetchers'
import { PortableTextRenderer } from '@/components/portable-text'
import { Product, ProductImage, ProductTestimonial, ProductSpecification, ProductFeature } from '@/types/product'
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

      {/* Single Column Product Layout */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* 1. Product Image */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative">
              {product.image && product.image.asset && (
                <SanityProductImage
                  src={product.image}
                  alt={product.image.alt || product.title}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Image Thumbnails Overlay */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
                  {product.gallery
                    .filter((image: ProductImage) => image?.asset?.url)
                    .slice(0, 4)
                    .map((image: ProductImage, index: number) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-lg flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
                        <SanityProductImage
                          src={image}
                          alt={image.alt || `${product.title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-8">
              
              {/* 2. Tags + Status Badges */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200">
                    <Award className="w-3.5 h-3.5 mr-1.5" />
                    {product.category.title}
                  </div>
                )}
                
                {product.status && (
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                    product.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                    product.status === 'coming-soon' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                    product.status === 'discontinued' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                    {product.status === 'coming-soon' ? 'Coming Soon' : 
                      product.status === 'active' ? 'In Stock' : 
                      product.status === 'discontinued' ? 'Discontinued' : 
                      'Draft'}
                  </div>
                )}
                
                {product.newProduct && (
                  <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-magenta-100 to-purple-100 text-magenta-600 border border-magenta-200">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    New
                  </div>
                )}
              </div>
              
              {/* 3. Product Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* 4. Short Description */}
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* 5. Full Product Details / Description */}
              {(product.productDetails || product.longDescription) && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-6 h-6 text-magenta-500 mr-2" />
                    Product Details
                  </h2>
                  <div className="prose prose-base max-w-none text-gray-700">
                    {product.productDetails ? (
                      <PortableTextRenderer content={product.productDetails} />
                    ) : product.longDescription ? (
                      <PortableTextRenderer content={product.longDescription} />
                    ) : null}
                  </div>
                </div>
              )}

              {/* 6. Product Tags */}
              {hasTags && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                      <Tag className="w-3.5 h-3.5 mr-1.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 7. Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {/* Download Template Button */}
                {product.template?.hasTemplate && product.template.downloadFile?.asset?.url && (
                  <a
                    href={product.template.downloadFile.asset.url}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
                    download
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Template
                  </a>
                )}
                
                {/* Request Quote Button */}
                <Link
                  href={product.formLink || `/quote?product=${product.slug?.current}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3.5 bg-magenta-600 text-white font-semibold rounded-xl hover:bg-magenta-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Quote className="w-5 h-5 mr-2" />
                  Request Quote
                </Link>
                
                {/* Contact Sales Button */}
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Sales
                </Link>
              </div>

              {/* 8. Specifications Section */}
              {(product.detailedSpecs || (product.specifications && product.specifications.length > 0)) && (
                <div className="border-t border-gray-200 pt-8" id="specifications">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <BadgeCheck className="w-6 h-6 text-magenta-500 mr-2" />
                    Specifications
                  </h2>
                  {product.detailedSpecs ? (
                    <div className="prose prose-base max-w-none text-gray-700">
                      <PortableTextRenderer content={product.detailedSpecs} />
                    </div>
                  ) : product.specifications && product.specifications.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.specifications.map((spec: ProductSpecification, index: number) => (
                        <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900 text-sm">{spec.name}</span>
                            <span className="text-magenta-600 font-medium text-sm">
                              {spec.value} {spec.unit && <span className="text-xs text-gray-500">{spec.unit}</span>}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              {/* 9. Related Templates */}
              {product.templates && product.templates.length > 0 && (
                <div className="border-t border-gray-200 pt-8" id="templates">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-6 h-6 text-magenta-500 mr-2" />
                    Related Templates
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Download professionally designed templates for your {product.title.toLowerCase()} projects.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.templates.slice(0, 4).map((template: any) => (
                      <Link
                        key={template._id}
                        href={`/templates/${template.slug?.current}`}
                        className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all"
                      >
                        {template.previewImage?.asset?.url && (
                          <div className="aspect-video rounded-lg overflow-hidden mb-3">
                            <Image
                              src={template.previewImage.asset.url}
                              alt={template.title}
                              width={300}
                              height={200}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">{template.title}</h3>
                        <span className="inline-flex items-center text-magenta-600 hover:text-magenta-700 font-medium text-xs">
                          View Template
                          <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                        </span>
                      </Link>
                    ))}
                  </div>
                  {product.templates.length > 4 && (
                    <div className="text-center mt-6">
                      <Link
                        href="/templates"
                        className="inline-flex items-center px-6 py-3 bg-magenta-500 text-white font-medium rounded-xl hover:bg-magenta-600 transition-colors"
                      >
                        View All Templates
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* 10. Trust/Social Proof Icons */}
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {product.qualityGuarantee && (
                    <div className="text-center">
                      <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-7 h-7 text-green-600" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">Quality Guaranteed</p>
                    </div>
                  )}
                  {product.fastDelivery && (
                    <div className="text-center">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Truck className="w-7 h-7 text-blue-600" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">Fast Delivery</p>
                    </div>
                  )}
                  {product.awardWinning && (
                    <div className="text-center">
                      <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Award className="w-7 h-7 text-purple-600" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">Award Winning</p>
                    </div>
                  )}
                  {hasCertifications && product.certifications.slice(0, 1).map((cert: string, index: number) => (
                    <div key={index} className="text-center">
                      <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <BadgeCheck className="w-7 h-7 text-pink-600" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">{cert}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features (if exists) */}
              {product.features && product.features.length > 0 && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
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