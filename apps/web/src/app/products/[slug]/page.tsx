import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { SanityProductImage } from "../../../components/ui/sanity-image";
import Image from "next/image";
import Link from "next/link";
import {
  getProductBySlug,
  getSiteSettings,
  getProducts,
} from "../../../lib/sanity/fetchers";
import { PortableTextRenderer } from "../../../components/portable-text";
import ProductDetailTabs from "../../../components/product-detail-tabs";
import ProductTagList from "../../../components/product-tag-list";
import AddToQuoteButton from "../../../components/add-to-quote-button";
import {
  Product,
  ProductImage,
  ProductTestimonial,
  ProductSpecification,
  ProductFeature,
} from "../../../types/product";
import { generateProductSEO, generateProductSchema } from "../../../lib/seo";
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
} from "lucide-react";

export const revalidate = 60;
export const dynamicParams = false;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Pull the first substantive paragraph out of a Portable Text array so the hero
 * can carry real product copy instead of empty space. Purely a read of existing
 * content — the full text still renders in the Product Details tab.
 */
/**
 * Pull the opening prose out of Product Details for the hero.
 *
 * Returns whole paragraphs rather than a hard character slice — a single
 * 240-char cut left every product ending mid-sentence on an ellipsis, which
 * reads as broken content rather than a teaser.
 *
 * The budget is checked BEFORE adding, so a product whose opening paragraph
 * already exceeds it shows that one paragraph in full and stops, while a
 * product with a short opener gets a second. The rest stays in the Product
 * Details tab — the hero should invite the read, not be the read.
 */
function extractIntro(
  blocks: any,
  { budget = 350, maxParagraphs = 2 } = {},
): string[] {
  if (!Array.isArray(blocks)) return [];

  const paragraphs: string[] = [];
  let used = 0;

  for (const b of blocks) {
    if (paragraphs.length >= maxParagraphs || used >= budget) break;
    if (b?._type !== "block") continue;
    if (b.style && b.style !== "normal") continue;

    const text = (b.children || [])
      .map((c: any) => c?.text || "")
      .join("")
      .trim();

    if (text.length < 40) continue; // skip stubs and stray one-liners

    paragraphs.push(text);
    used += text.length;
  }

  return paragraphs;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
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
  const productIntro = extractIntro(
    product.productDetails || product.longDescription,
  );
  const hasIntro = productIntro.length > 0;

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
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/products"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Products
            </Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-16 lg:pb-10">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:grid-rows-[auto_auto]">
            {/* Product Images with Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
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
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <SanityProductImage
                          src={image}
                          alt={
                            image.alt ||
                            `${product.title} thumbnail ${index + 1}`
                          }
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              {/* Status & Category Badges */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-sky-100 text-sky-600 border border-sky-200">
                    <Award className="w-4 h-4 mr-2" />
                    {product.category.title}
                  </div>
                )}

                {product.status && (
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      product.status === "active"
                        ? "bg-green-100 text-green-600 border border-green-200"
                        : product.status === "coming-soon"
                          ? "bg-purple-100 text-purple-600 border border-purple-200"
                          : product.status === "discontinued"
                            ? "bg-red-100 text-red-600 border border-red-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                    {product.status === "coming-soon"
                      ? "Coming Soon"
                      : product.status === "active"
                        ? "Active"
                        : product.status === "discontinued"
                          ? "Discontinued"
                          : "Draft"}
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

              {/* Intro lifted from Product Details — fills the hero with real
                  copy. Full text still lives in the Product Details tab. */}
              {hasIntro && (
                <div className="space-y-3">
                  {productIntro.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-gray-600"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Tags moved out of the hero — rendered compactly further down
                  (see ProductTagList) so the hero stays readable. */}

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map(
                      (feature: string | ProductFeature, index: number) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-700"
                        >
                          <div className="w-2 h-2 bg-magenta-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm">
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

              {/* Primary CTA — kept inside the hero column so the main
                  action sits above the fold beside the product image. */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={
                    product.formLink ||
                    `/quote?product=${product.slug?.current}`
                  }
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

              {/* Secondary action on its own row: collecting a product for a
                  multi-product quote should not crowd the primary CTAs. */}
              <div className="mt-3">
                <AddToQuoteButton
                  slug={product.slug?.current || ""}
                  title={product.title}
                  categoryTitle={product.category?.title}
                  imageUrl={product.mainImage?.asset?.url}
                />
              </div>

              {/* At a glance — top specs surfaced from the Specifications tab */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-2 border-t border-gray-200 pt-8">
                  <h3 className="mb-5 text-sm font-semibold text-gray-900">
                    At a glance
                  </h3>
                  <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                    {product.specifications
                      .slice(0, 6)
                      .map((spec: ProductSpecification, index: number) => (
                        <div
                          key={index}
                          // Odd indexes land in the right-hand column, so the
                          // left border reads as a single rule down the middle
                          // rather than a box around every cell.
                          className={`flex items-baseline justify-between gap-3 border-b border-gray-100 pb-2.5 text-sm ${
                            index % 2 === 1
                              ? "lg:border-l lg:border-l-gray-200 lg:pl-8"
                              : ""
                          }`}
                        >
                          <dt className="shrink-0 text-gray-500">
                            {spec.name}
                          </dt>
                          <dd className="line-clamp-1 text-right font-medium text-gray-900">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}
            </div>
            {/* Trust indicators.
                Source order is image → info → badges, which is the correct
                MOBILE reading order: picture, then what it is and how to buy,
                then reassurance. Previously these lived inside the image
                column, so on a phone they stacked ABOVE the product title.
                On lg they are placed back under the image via explicit grid
                coordinates — no duplicated markup, one source of truth. */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-6 sm:grid-cols-3 lg:col-start-1 lg:row-start-2 lg:border-t-0 lg:pt-0">
              {product.qualityGuarantee && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-0 sm:mb-2">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <p className="sr-only text-xs font-medium text-gray-600 sm:not-sr-only sm:block">
                    Quality Guaranteed
                  </p>
                </div>
              )}
              {product.fastDelivery && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-0 sm:mb-2">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <p className="sr-only text-xs font-medium text-gray-600 sm:not-sr-only sm:block">
                    Fast Delivery
                  </p>
                </div>
              )}
              {product.awardWinning && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-0 sm:mb-2">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="sr-only text-xs font-medium text-gray-600 sm:not-sr-only sm:block">
                    Award Winning
                  </p>
                </div>
              )}
              {hasCertifications &&
                product.certifications
                  .slice(
                    0,
                    3 -
                      [
                        product.qualityGuarantee,
                        product.fastDelivery,
                        product.awardWinning,
                      ].filter(Boolean).length,
                  )
                  .map((cert: string, index: number) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-0 sm:mb-2">
                        <BadgeCheck className="w-6 h-6 text-white" />
                      </div>
                      <p className="sr-only text-xs font-medium text-gray-600 sm:not-sr-only sm:block">
                        {cert}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Content Sections - Vertical Flow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4 space-y-12">
        {/* Tabbed detail — Product Details / Specifications / Template.
            Replaces three stacked full-height sections. No data removed. */}
        <ProductDetailTabs
          tabs={[
            {
              id: "details",
              label: "Product Details",
              content: product.productDetails ? (
                <div className="prose prose-lg max-w-none">
                  <PortableTextRenderer content={product.productDetails} />
                </div>
              ) : product.longDescription ? (
                <div className="prose prose-lg max-w-none">
                  <PortableTextRenderer content={product.longDescription} />
                </div>
              ) : null,
            },
            {
              id: "specs",
              label: "Specifications",
              content: product.detailedSpecs ? (
                <div className="prose prose-lg max-w-none">
                  <PortableTextRenderer content={product.detailedSpecs} />
                </div>
              ) : product.specifications &&
                product.specifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map(
                    (spec: ProductSpecification, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="font-semibold text-gray-900">
                            {spec.name}
                          </span>
                          <span className="text-right font-medium text-magenta-600">
                            {spec.value}{" "}
                            {spec.unit && (
                              <span className="text-sm text-gray-500">
                                {spec.unit}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : null,
            },
            {
              id: "template",
              label: "Download Template",
              content: product.template?.hasTemplate ? (
                <div>
                  {product.template.description && (
                    <p className="mb-6 leading-relaxed text-gray-700">
                      {product.template.description}
                    </p>
                  )}
                  <div className="grid gap-6 md:grid-cols-2">
                    {product.template.previewImage?.asset?.url && (
                      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-md">
                        <Image
                          src={product.template.previewImage.asset.url}
                          alt={
                            product.template.previewImage.alt ||
                            "Template preview"
                          }
                          width={500}
                          height={400}
                          className="h-auto w-full"
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-center space-y-4">
                      {product.template.downloadFile?.asset?.url && (
                        <a
                          href={product.template.downloadFile.asset.url}
                          className="inline-flex items-center justify-center rounded-xl bg-magenta-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-magenta-700 hover:shadow-xl"
                          download
                        >
                          <Download className="mr-2 h-5 w-5" />
                          Download Template File
                        </a>
                      )}
                      <p className="text-center text-sm text-gray-600">
                        Professional template ready for customization
                      </p>
                    </div>
                  </div>
                </div>
              ) : null,
            },
            {
              id: "templates",
              label: "Related Templates",
              content:
                product.templates && product.templates.length > 0 ? (
                  <div>
                    <p className="mb-6 text-gray-600">
                      Download these professionally designed templates for your{" "}
                      {product.title.toLowerCase()} projects.
                    </p>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {product.templates.slice(0, 6).map((template: any) => (
                        <div
                          key={template._id}
                          className="group rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-lg"
                        >
                          <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={
                                template.previewImage?.asset?.url ||
                                "/template-placeholder.png"
                              }
                              alt={template.title}
                              width={300}
                              height={200}
                              className={`h-full w-full transition-transform group-hover:scale-105 ${
                                template.previewImage?.asset?.url
                                  ? "object-cover"
                                  : "object-contain p-4"
                              }`}
                            />
                          </div>
                          <h3 className="mb-2 font-semibold text-gray-900">
                            {template.title}
                          </h3>
                          <Link
                            href={`/templates/${template.slug?.current}`}
                            className="inline-flex items-center text-sm font-medium text-magenta-600 hover:text-magenta-700"
                          >
                            View Template
                            <ArrowLeft className="ml-1 h-4 w-4 rotate-180" />
                          </Link>
                        </div>
                      ))}
                    </div>
                    {product.templates.length > 6 && (
                      <div className="mt-8 text-center">
                        <Link
                          href="/templates"
                          className="inline-flex items-center rounded-xl bg-magenta-500 px-6 py-3 font-medium text-white transition-colors hover:bg-magenta-600"
                        >
                          View All Templates
                        </Link>
                      </div>
                    )}
                  </div>
                ) : null,
            },
            {
              id: "gallery",
              label: "Gallery",
              content:
                product.gallery &&
                product.gallery.length > 0 &&
                product.gallery.some(
                  (image: ProductImage) => image?.asset?.url,
                ) ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {product.gallery
                      .filter((image: ProductImage) => image?.asset?.url)
                      .map((image: ProductImage, index: number) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-xl"
                        >
                          <Image
                            src={image.asset.url}
                            alt={
                              image.alt ||
                              `${product.title} gallery image ${index + 1}`
                            }
                            width={400}
                            height={400}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {image.caption && (
                            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/70 p-3 text-white transition-transform duration-300 group-hover:translate-y-0">
                              <p className="text-sm">{image.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : null,
            },
          ]}
        />
      </div>

      {/* Keywords — end of page, no card */}
      {hasTags && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <ProductTagList tags={product.tags} />
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
                  <Link
                    href="/quote"
                    className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Get Free Quote
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Us
                  </Link>
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
  const { slug } = await params;
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
  const products = await getProducts();

  return products
    .filter((product: Product) => product?.slug?.current)
    .map((product: Product) => ({
      slug: product.slug!.current,
    }));
}
