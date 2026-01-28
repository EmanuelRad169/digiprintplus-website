import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { SanityProductImage } from "@/components/ui/sanity-image";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getSiteSettings } from "@/lib/sanity/fetchers";
import { PortableTextRenderer } from "@/components/portable-text";
import {
  Product,
  ProductImage,
  ProductTestimonial,
  ProductSpecification,
  ProductFeature,
  ProductFAQItem,
} from "@/types/product";
import { generateProductSEO, generateProductSchema } from "@/lib/seo";
import {
  Star,
  Check,
  Download,
  Share2,
  Heart,
  ShoppingCart,
  Phone,
  Mail,
  ArrowLeft,
  Eye,
  Clock,
  Shield,
  Award,
  Tag,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Truck,
  Sparkles,
  FileText,
  Video,
  Quote,
  BadgeCheck,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

export const revalidate = 60;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const { isEnabled } = await draftMode();

  const [product, siteSettings] = await Promise.all([
    getProductBySlug(slug, isEnabled),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const contactInfo = siteSettings?.contact || {
    phone: "(800) 555-1234",
    email: "info@digiprintplus.com",
  };
  const productSchema = generateProductSchema(product);

  // Format currency display
  const formatCurrency = (price: number | undefined, currency = "USD") => {
    if (!price) return null;

    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "C$",
    };

    const symbol = currencySymbols[currency] || "$";
    return `${symbol}${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
            className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
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
  const hasTestimonials =
    product.testimonials && product.testimonials.length > 0;
  const hasVideo = product.videoUrl && product.videoUrl.length > 0;
  const hasUseCases = product.useCases && product.useCases.length > 0;
  const hasCertifications =
    product.certifications && product.certifications.length > 0;
  const hasTags = product.tags && product.tags.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <a
              href="/"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Home
            </a>
            <span className="text-gray-400">/</span>
            <a
              href="/products"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Products
            </a>
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

      {/* Modern Two-Column Product Layout */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT: Product Image Gallery - Sticky on Desktop */}
            <div className="lg:sticky lg:top-8 lg:self-start space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl relative group">
                {product.image && product.image.asset && (
                  <SanityProductImage
                    src={product.image}
                    alt={product.image.alt || product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                {/* Zoom Icon Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <Eye className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.gallery
                    .filter((image: ProductImage) => image?.asset?.url)
                    .slice(0, 4)
                    .map((image: ProductImage, index: number) => (
                      <div
                        key={index}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-magenta-500"
                      >
                        <SanityProductImage
                          src={image}
                          alt={
                            image.alt || `${product.title} view ${index + 1}`
                          }
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                </div>
              )}

              {/* Trust Badges - Compact */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                <div className="grid grid-cols-3 gap-3">
                  {product.qualityGuarantee && (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-700">
                        Quality
                      </p>
                    </div>
                  )}
                  {product.fastDelivery && (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-700">
                        Fast Ship
                      </p>
                    </div>
                  )}
                  {product.awardWinning && (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-700">
                        Awarded
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Product Information - Scrollable Content */}
            <div className="space-y-6">
              {/* Status Badges Row */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200">
                    {product.category.title}
                  </span>
                )}
                {product.status && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : product.status === "coming-soon"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : product.status === "discontinued"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                    {product.status === "coming-soon"
                      ? "Coming Soon"
                      : product.status === "active"
                        ? "In Stock"
                        : product.status === "discontinued"
                          ? "Discontinued"
                          : "Draft"}
                  </span>
                )}
                {product.newProduct && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-magenta-100 to-purple-100 text-magenta-600 border border-magenta-200">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    New
                  </span>
                )}
                {product.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border border-orange-200">
                    <Star className="w-3.5 h-3.5 mr-1.5" />
                    Featured
                  </span>
                )}
                {product.popular && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200">
                    🔥 Popular
                  </span>
                )}
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
                {/* Rating & Reviews */}
                {hasRating && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating!)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {product.rating?.toFixed(1)}
                    </span>
                    {product.reviewCount && product.reviewCount > 0 && (
                      <span className="text-sm text-gray-500">
                        ({product.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Short Description */}
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Lead Time & Availability */}
              {(product.leadTime || product.inStock !== undefined) && (
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {product.leadTime && (
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 mr-1.5 text-blue-600" />
                      <span className="font-medium">Lead Time:</span>
                      <span className="ml-1">{product.leadTime}</span>
                    </div>
                  )}
                  {product.inStock !== undefined && (
                    <div
                      className={`flex items-center ${
                        product.inStock ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-1.5 ${
                          product.inStock ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span className="font-medium">
                        {product.inStock
                          ? "Available for Quote"
                          : "Currently Unavailable"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Key Features Highlights */}
              {product.features && product.features.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-1.5" />
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features
                      .slice(0, 6)
                      .map(
                        (feature: string | ProductFeature, index: number) => (
                          <li
                            key={index}
                            className="flex items-start text-sm text-gray-700"
                          >
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>
                              {typeof feature === "string"
                                ? feature
                                : feature &&
                                    typeof feature === "object" &&
                                    "feature" in feature
                                  ? feature.feature
                                  : ""}
                            </span>
                          </li>
                        ),
                      )}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {hasTags && (
                <div className="flex flex-wrap gap-2">
                  {product.tags
                    .slice(0, 8)
                    .map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              )}

              {/* Primary CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={
                    product.formLink ||
                    `/quote?product=${product.slug?.current}`
                  }
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-magenta-600 text-white font-bold rounded-xl hover:bg-magenta-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Quote className="w-5 h-5 mr-2" />
                  Request Quote
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-magenta-500 hover:text-magenta-600 transition-all"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Sales
                </Link>
              </div>

              {/* Download Template (if available) */}
              {product.template?.hasTemplate &&
                product.template.downloadFile?.asset?.url && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">
                          Free Template Available
                        </h3>
                        <p className="text-xs text-gray-600">
                          Download our professional design template
                        </p>
                      </div>
                      <a
                        href={product.template.downloadFile.asset.url}
                        className="inline-flex items-center px-5 py-2.5 bg-purple-600 text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
                        download
                      >
                        <Download className="w-4 h-4 mr-1.5" />
                        Download
                      </a>
                    </div>
                  </div>
                )}

              {/* Detailed Product Information */}
              {(product.productDetails || product.longDescription) && (
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 text-magenta-500 mr-2" />
                    Product Details
                  </h2>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {product.productDetails ? (
                      <PortableTextRenderer content={product.productDetails} />
                    ) : product.longDescription ? (
                      <PortableTextRenderer content={product.longDescription} />
                    ) : null}
                  </div>
                </div>
              )}

              {/* Specifications Grid */}
              {(product.detailedSpecs ||
                (product.specifications &&
                  product.specifications.length > 0)) && (
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <BadgeCheck className="w-5 h-5 text-magenta-500 mr-2" />
                    Specifications
                  </h2>
                  {product.detailedSpecs ? (
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <PortableTextRenderer content={product.detailedSpecs} />
                    </div>
                  ) : product.specifications &&
                    product.specifications.length > 0 ? (
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                      {product.specifications.map(
                        (spec: ProductSpecification, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {spec.name}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {spec.value}{" "}
                              {spec.unit && (
                                <span className="text-xs text-gray-500 font-normal">
                                  {spec.unit}
                                </span>
                              )}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Quote Options */}
              {product.quoteOptions && product.quoteOptions.length > 0 && (
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <BadgeCheck className="w-5 h-5 text-magenta-500 mr-2" />
                    Available Options
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.quoteOptions.map((option: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {option.name}
                            </h3>
                            {option.description && (
                              <p className="text-xs text-gray-600 mt-1">
                                {option.description}
                              </p>
                            )}
                          </div>
                          {option.required && (
                            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Templates */}
              {product.templates && product.templates.length > 0 && (
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 text-magenta-500 mr-2" />
                    Related Templates
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {product.templates.slice(0, 4).map((template: any) => (
                      <Link
                        key={template._id}
                        href={`/templates/${template.slug?.current}`}
                        className="group bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all hover:border-magenta-200"
                      >
                        {template.previewImage?.asset?.url && (
                          <div className="aspect-video rounded-md overflow-hidden mb-2 bg-gray-100">
                            <Image
                              src={template.previewImage.asset.url}
                              alt={template.title}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900 text-xs line-clamp-1">
                          {template.title}
                        </h3>
                        <span className="text-magenta-600 text-xs font-medium group-hover:underline">
                          View →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {product.faq && product.faq.length > 0 && (
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <HelpCircle className="w-5 h-5 text-magenta-500 mr-2" />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {product.faq.map((item: ProductFAQItem, index: number) => (
                      <details
                        key={index}
                        className="group border border-gray-200 rounded-lg bg-white hover:border-magenta-200 transition-colors"
                      >
                        <summary className="cursor-pointer p-4 font-semibold text-gray-900 text-sm flex items-center justify-between list-none">
                          {item.question}
                          <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="px-4 pb-4 text-sm text-gray-700">
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Indicators Row */}
              {(product.qualityGuarantee ||
                product.fastDelivery ||
                product.awardWinning ||
                hasCertifications) && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {product.qualityGuarantee && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Shield className="w-8 h-8 text-green-600 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-gray-700">
                          Quality Guaranteed
                        </p>
                      </div>
                    )}
                    {product.fastDelivery && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Truck className="w-8 h-8 text-blue-600 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-gray-700">
                          Fast Delivery
                        </p>
                      </div>
                    )}
                    {product.awardWinning && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Award className="w-8 h-8 text-purple-600 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-gray-700">
                          Award Winning
                        </p>
                      </div>
                    )}
                    {hasCertifications &&
                      product.certifications
                        .slice(0, 1)
                        .map((cert: string, index: number) => (
                          <div
                            key={index}
                            className="text-center p-3 bg-pink-50 rounded-lg"
                          >
                            <BadgeCheck className="w-8 h-8 text-pink-600 mx-auto mb-1.5" />
                            <p className="text-xs font-semibold text-gray-700">
                              {cert}
                            </p>
                          </div>
                        ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Video Section */}
      {hasVideo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <Video className="w-6 h-6 text-magenta-500 mr-2" />
                Product Video
              </h2>
              <p className="text-gray-600">
                Watch our detailed product demonstration
              </p>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              {product.videoUrl?.includes("youtube.com") ||
              product.videoUrl?.includes("youtu.be") ? (
                <iframe
                  title={`${product.title} Product Video`}
                  src={product.videoUrl
                    .replace("watch?v=", "embed/")
                    .replace("youtu.be/", "youtube.com/embed/")}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : product.videoUrl?.includes("vimeo.com") ? (
                <iframe
                  title={`${product.title} Product Video`}
                  src={product.videoUrl.replace(
                    "vimeo.com/",
                    "player.vimeo.com/video/",
                  )}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video controls className="w-full h-full">
                  <source src={product.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Testimonials */}
      {hasTestimonials && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real feedback from businesses who trust our {product.title}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.testimonials?.map((testimonial: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {testimonial.rating && (
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-gray-700 italic mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  {testimonial.company && (
                    <p className="text-sm text-gray-500">
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Gallery */}
      {product.gallery &&
        product.gallery.length > 0 &&
        product.gallery.some((image: ProductImage) => image?.asset?.url) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Product Gallery
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore detailed images of our {product.title} to see the
                quality and craftsmanship up close.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.gallery
                .filter((image: ProductImage) => image?.asset?.url)
                .map((image: ProductImage, index: number) => (
                  <div
                    key={index}
                    className="group relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <Image
                      src={image.asset.url}
                      alt={
                        image.alt ||
                        `${product.title} gallery image ${index + 1}`
                      }
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
                  Get a custom quote tailored to your specific needs. Our expert
                  team will help you choose the perfect options and provide
                  competitive pricing with fast turnaround times.
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
                <h3 className="text-xl font-semibold text-white mb-4">
                  Need Help?
                </h3>
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
  );
}

// Generate metadata from Sanity content
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found - DigiPrintPlus",
      description: "The requested product could not be found.",
    };
  }

  return generateProductSEO({
    product,
    category: product.category?.title,
  });
}

// Generate static params for products
export async function generateStaticParams() {
  // You can fetch all product slugs from Sanity here if needed
  // For now, return empty array to use ISR
  return [];
}
