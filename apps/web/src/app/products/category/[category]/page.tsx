import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  getProductsByCategory,
  getCategoryBySlug,
  getProductCategories,
} from "../../../../lib/sanity/fetchers";
import { Product, ProductCategory } from "../../../../types/product";
import { generateCategorySEO } from "../../../../lib/seo";
import {
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Tag,
  Package,
  Sparkles,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

export const revalidate = 60;
export const dynamicParams = true;

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug?.current}`}
      className="group block overflow-hidden border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:border-magenta-200 hover:shadow-xl outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-500"
    >
      {/* Product Image — matches CategoryCard */}
      <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-magenta-50 to-magenta-100 transition-colors group-hover:from-magenta-100 group-hover:to-magenta-200">
        {product.image?.asset?.url ? (
          <Image
            src={product.image.asset.url}
            alt={product.image.alt || product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white shadow-md transition-shadow group-hover:shadow-lg">
            <Package className="h-8 w-8 text-magenta-600" />
          </div>
        )}
      </div>

      <div className="p-3">
        {/* Product Title */}
        <h3 className="mb-2 text-base font-bold text-gray-900 transition-colors group-hover:text-magenta-600">
          {product.title}
        </h3>

        {/* Product Description */}
        {product.description && (
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>
        )}

        {/* CTA — same row treatment as CategoryCard. Products have no count or
            price in the schema, so the left meta slot is intentionally omitted
            rather than filled with a placeholder. */}
        <div className="flex items-center justify-end">
          <div className="flex items-center text-magenta-600 transition-colors group-hover:text-magenta-700">
            <span className="mr-2 text-sm font-medium">View Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const { isEnabled } = await draftMode();

  // Get category info and products
  const currentCategory = await getCategoryBySlug(category, isEnabled);
  const products = await getProductsByCategory(category, isEnabled);
  const categories = await getProductCategories(isEnabled);

  if (!currentCategory) {
    notFound();
  }

  // Get icon component from Lucide
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Package;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || Package;
  };

  const IconComponent = getIconComponent(currentCategory.icon);

  // Hero banner prefers the dedicated landscape image, and falls back to the
  // square card image so categories without a hero still render an image.
  const heroImage = currentCategory.heroImage?.asset?.url
    ? currentCategory.heroImage
    : currentCategory.image;
  const heroImageUrl = heroImage?.asset?.url;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200">
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
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {currentCategory.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section with Full-Width Image */}
      <div className="relative">
        {heroImageUrl ? (
          <div className="relative h-64 sm:h-80 lg:h-[340px] overflow-hidden">
            <Image
              src={heroImageUrl}
              alt={heroImage?.alt || currentCategory.title}
              fill
              sizes="100vw"
              quality={90}
              className="object-cover object-center"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-7xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                  {currentCategory.title}
                </h1>
                {currentCategory.description && (
                  <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-2xl mx-auto">
                    {currentCategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-magenta-600 to-magenta-800 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-white max-w-7xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                  {currentCategory.title}
                </h1>
                {currentCategory.description && (
                  <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-2xl mx-auto">
                    {currentCategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid Section */}
      <div className="bg-gray-50 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                  We&apos;re currently adding products to this category. In the
                  meantime, contact us for custom solutions.
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
                Our expert team specializes in creating custom{" "}
                {currentCategory.title.toLowerCase()} solutions tailored to your
                unique requirements. Get professional results with personalized
                service.
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
  );
}

// Generate metadata
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const [currentCategory, products] = await Promise.all([
    getCategoryBySlug(category),
    getProductsByCategory(category),
  ]);

  if (!currentCategory) {
    return {
      title: "Category Not Found - DigiPrintPlus",
      description: "The requested product category could not be found.",
    };
  }

  return generateCategorySEO({
    category: currentCategory,
    products,
  });
}

// Generate static params for categories
export async function generateStaticParams() {
  const categories = await getProductCategories();

  return categories
    .filter((category: ProductCategory) => category.slug?.current)
    .map((category: ProductCategory) => ({
      category: category.slug!.current,
    }));
}
