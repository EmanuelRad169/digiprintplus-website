import ProductClient from "./product-client";
import { Product } from "@/types/product";

// Generate static params for all product pages
export async function generateStaticParams() {
  try {
    const { getProducts } = await import("@/lib/sanity/fetchers");
    // Fetch all products
    const products = await getProducts();

    return products
      .filter(
        (product: any) =>
          product.slug?.current && product.category?.slug?.current,
      )
      .map((product: any) => ({
        category: product.category.slug.current,
        item: product.slug.current,
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

interface PageProps {
  params: {
    category: string;
    item: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ProductClient params={params} />;
}
