/**
 * Sanity Fetchers for Homepage Content
 * Centralized data fetching for homepage-specific content
 */

import { getSanityClient } from '../sanity';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export interface FeaturedProduct {
  _id: string;
  title: string;
  slug: string;
  image: SanityImageSource;
  category: string;
  href: string;
}

export interface HomepageSettings {
  _id: string;
  featuredProducts: FeaturedProduct[];
  carouselSettings?: {
    autoplaySpeed?: number;
    itemsPerView?: number;
    enableAutoplay?: boolean;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
  isHighlighted?: boolean;
}

export interface FAQCategory {
  _id: string;
  title: string;
  slug: { current: string };
  order: number;
  icon?: string;
  faqs: FAQItem[];
  isActive: boolean;
}

/**
 * Get homepage settings including featured products carousel
 */
export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  const client = getSanityClient();
  
  const query = `
    *[_type == "homepageSettings" && !(_id in path('drafts.**'))][0]{
      _id,
      featuredProducts[isActive == true]{
        "id": product->slug.current,
        "title": coalesce(customTitle, product->title),
        "slug": product->slug.current,
        "image": coalesce(customImage, product->image),
        "category": coalesce(customCategory, product->category),
        "href": "/products/" + product->slug.current,
        isActive
      },
      carouselSettings
    }
  `;

  try {
    const result = await client.fetch(query);
    return result;
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return null;
  }
}

/**
 * Get all FAQ categories with their questions
 */
export async function getFAQCategories(): Promise<FAQCategory[]> {
  const client = getSanityClient();
  
  const query = `
    *[_type == "faqCategory" && isActive == true && !(_id in path('drafts.**'))] | order(order asc) {
      _id,
      title,
      slug,
      order,
      icon,
      faqs[]{
        question,
        answer,
        isHighlighted
      },
      isActive
    }
  `;

  try {
    const categories = await client.fetch<FAQCategory[]>(query);
    return categories || [];
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    return [];
  }
}

/**
 * Get featured products with fallback to default product categories
 */
export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  const client = getSanityClient();
  
  const query = `
    *[_type == "homepageSettings" && !(_id in path('drafts.**'))][0].featuredProducts[isActive == true]{
      "id": product->slug.current,
      "title": coalesce(customTitle, product->title),
      "slug": product->slug.current,
      "image": coalesce(customImage, product->image),
      "category": coalesce(customCategory, "Product"),
      "href": "/products/" + product->slug.current,
      isActive
    }
  `;

  try {
    const products = await client.fetch<FeaturedProduct[]>(query);
    
    // If no featured products configured, fall back to first 15 product categories
    if (!products || products.length === 0) {
      const fallbackQuery = `
        *[_type == "productCategory" && !(_id in path('drafts.**'))][0...15] | order(_createdAt desc) {
          "id": slug.current,
          "title": title,
          "slug": slug.current,
          "image": image,
          "category": "Featured",
          "href": "/products/" + slug.current
        }
      `;
      
      const fallbackProducts = await client.fetch<FeaturedProduct[]>(fallbackQuery);
      return fallbackProducts || [];
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
