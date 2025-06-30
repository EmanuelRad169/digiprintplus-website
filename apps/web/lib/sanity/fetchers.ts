import { sanityClient, getSanityClient } from '../sanity';
import type { SiteSettings } from '@/types/siteSettings';

// Template Types
export interface TemplateCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  order: number;
}

export interface Template {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  category: TemplateCategory;
  fileType: string;
  size: string;
  tags?: string[];
  isPremium: boolean;
  price?: number;
  rating: number;
  downloadCount: number;
  previewImage: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  additionalImages?: Array<{
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
    caption?: string;
  }>;
  downloadFile: {
    asset: {
      _id: string;
      url: string;
      originalFilename: string;
    };
  };
  fileSize?: string;
  instructions?: string;
  requiredSoftware?: string[];
  publishedAt: string;
}

// Template Fetchers
export async function getAllTemplateCategories(): Promise<TemplateCategory[]> {
  try {
    // Use the appropriate client based on environment
    const client = getSanityClient()
    const query = `*[_type == "templateCategory" && status == "published"] | order(order asc, title asc) {
      _id,
      title,
      slug,
      description,
      order
    }`;

    const categories = await client.fetch(query);
    return categories || [];
  } catch (error) {
    console.error('Error fetching template categories:', error);
    return [];
  }
}

export async function getAllTemplates(): Promise<Template[]> {
  try {
    // Use the appropriate client based on environment
    const client = getSanityClient()
    const query = `*[_type == "template" && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      category->{
        _id,
        title,
        slug,
        description,
        order
      },
      fileType,
      size,
      tags,
      isPremium,
      price,
      rating,
      downloadCount,
      previewImage {
        asset->{
          _id,
          url
        },
        alt
      },
      additionalImages[] {
        asset->{
          _id,
          url
        },
        alt,
        caption
      },
      downloadFile {
        asset->{
          _id,
          url,
          originalFilename
        }
      },
      fileSize,
      instructions,
      requiredSoftware,
      publishedAt
    }`;

    const templates = await client.fetch(query);
    return templates || [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

export async function getTemplatesByCategory(categorySlug: string): Promise<Template[]> {
  try {
    const client = getSanityClient()
    const query = `*[_type == "template" && status == "published" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      category->{
        _id,
        title,
        slug,
        description,
        order
      },
      fileType,
      size,
      tags,
      isPremium,
      price,
      rating,
      downloadCount,
      previewImage {
        asset->{
          _id,
          url
        },
        alt
      },
      additionalImages[] {
        asset->{
          _id,
          url
        },
        alt,
        caption
      },
      downloadFile {
        asset->{
          _id,
          url,
          originalFilename
        }
      },
      fileSize,
      instructions,
      requiredSoftware,
      publishedAt
    }`;

    const templates = await client.fetch(query, { categorySlug });
    return templates || [];
  } catch (error) {
    console.error('Error fetching templates by category:', error);
    return [];
  }
}

export async function getTemplateBySlug(slug: string): Promise<Template | null> {
  try {
    const client = getSanityClient()
    const query = `*[_type == "template" && status == "published" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      category->{
        _id,
        title,
        slug,
        description,
        order
      },
      fileType,
      size,
      tags,
      isPremium,
      price,
      rating,
      downloadCount,
      previewImage {
        asset->{
          _id,
          url
        },
        alt
      },
      additionalImages[] {
        asset->{
          _id,
          url
        },
        alt,
        caption
      },
      downloadFile {
        asset->{
          _id,
          url,
          originalFilename
        }
      },
      fileSize,
      instructions,
      requiredSoftware,
      publishedAt
    }`;

    const template = await client.fetch(query, { slug });
    return template;
  } catch (error) {
    console.error('Error fetching template by slug:', error);
    return null;
  }
}

export async function incrementTemplateDownload(templateId: string): Promise<void> {
  try {
    const client = getSanityClient()
    await client
      .patch(templateId)
      .inc({ downloadCount: 1 })
      .commit();
  } catch (error) {
    console.error('Error incrementing download count:', error);
  }
}

export async function getContactPage(isPreview = false) {
  try {
    const query = isPreview
      ? `*[_type == "page" && slug.current == "contact"] | order(_updatedAt desc)[0] {
          _id,
          title,
          slug,
          content,
          seo {
            metaTitle,
            metaDescription
          }
        }`
      : `*[_type == "page" && slug.current == "contact" && !(_id in path('drafts.**'))][0] {
          _id,
          title,
          slug,
          content,
          seo {
            metaTitle,
            metaDescription
          }
        }`;

    const contactPage = await sanityClient.fetch(query);
    return contactPage;
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return null;
  }
}

export async function getPageBySlug(slug: string, isPreview = false) {
  try {
    const query = isPreview
      ? `*[_type == "page" && slug.current == $slug] | order(_updatedAt desc)[0] {
          _id,
          title,
          subtitle,
          slug,
          content,
          seo {
            metaTitle,
            metaDescription,
            ogImage {
              asset->{
                _id,
                url
              }
            }
          },
          publishedAt
        }`
      : `*[_type == "page" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
          _id,
          title,
          subtitle,
          slug,
          content,
          seo {
            metaTitle,
            metaDescription,
            ogImage {
              asset->{
                _id,
                url
              }
            }
          },
          publishedAt
        }`;

    const page = await sanityClient.fetch(query, { slug });
    return page;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export async function getAboutPage(slug: string, isPreview = false) {
  try {
    const query = isPreview
      ? `*[_type == "about" && slug.current == $slug] | order(_updatedAt desc)[0] {
          _id,
          title,
          subtitle,
          slug,
          heroImage {
            asset->{
              _id,
              url
            },
            alt
          },
          content,
          services {
            title,
            items[] {
              title,
              description,
              icon
            }
          },
          whyChooseUs {
            title,
            items[] {
              title,
              description
            }
          },
          stats {
            title,
            items[] {
              number,
              label
            }
          },
          teamSection {
            title,
            description,
            members[] {
              name,
              role,
              image {
                asset->{
                  _id,
                  url
                },
                alt
              },
              bio
            }
          },
          cta {
            title,
            description,
            primaryButton {
              text,
              url
            },
            secondaryButton {
              text,
              url
            }
          },
          seo {
            metaTitle,
            metaDescription,
            ogImage {
              asset->{
                _id,
                url
              }
            }
          },
          publishedAt
        }`
      : `*[_type == "about" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
          _id,
          title,
          subtitle,
          slug,
          heroImage {
            asset->{
              _id,
              url
            },
            alt
          },
          content,
          services {
            title,
            items[] {
              title,
              description,
              icon
            }
          },
          whyChooseUs {
            title,
            items[] {
              title,
              description
            }
          },
          stats {
            title,
            items[] {
              number,
              label
            }
          },
          teamSection {
            title,
            description,
            members[] {
              name,
              role,
              image {
                asset->{
                  _id,
                  url
                },
                alt
              },
              bio
            }
          },
          cta {
            title,
            description,
            primaryButton {
              text,
              url
            },
            secondaryButton {
              text,
              url
            }
          },
          seo {
            metaTitle,
            metaDescription,
            ogImage {
              asset->{
                _id,
                url
              }
            }
          },
          publishedAt
        }`;

    const aboutPage = await sanityClient.fetch(query, { slug });
    return aboutPage;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string, isPreview = false) {
  try {
    const query = isPreview
      ? `*[_type == "product" && slug.current == $slug] | order(_updatedAt desc)[0] {
          _id,
          title,
          slug,
          status,
          category->{
            _id,
            title,
            slug
          },
          tags,
          description,
          longDescription,
          specifications[] {
            name,
            value,
            unit
          },
          features,
          useCases,
          image {
            asset->{
              _id,
              url
            },
            alt
          },
          gallery[] {
            asset->{
              _id,
              url
            },
            alt,
            caption
          },
          videoUrl,
          basePrice,
          priceRange,
          currency,
          inStock,
          leadTime,
          rating,
          reviewCount,
          testimonials[] {
            quote,
            author,
            company,
            rating
          },
          qualityGuarantee,
          fastDelivery,
          awardWinning,
          certifications,
          popular,
          featured,
          newProduct,
          seo {
            metaTitle,
            metaDescription,
            keywords
          },
          template {
            hasTemplate,
            description,
            htmlEmbed,
            downloadFile {
              asset->{
                url,
                originalFilename
              }
            },
            previewImage {
              asset->{
                url
              },
              alt
            }
          },
          detailedSpecs,
          productDetails,
          faq[] {
            question,
            answer
          },
          templates[]->{
            _id,
            title,
            slug,
            description,
            fileType,
            size,
            tags,
            isPremium,
            price,
            rating,
            downloadCount,
            previewImage {
              asset->{
                _id,
                url
              },
              alt
            },
            downloadFile {
              asset->{
                _id,
                url,
                originalFilename
              }
            },
            category->{
              _id,
              title,
              slug
            }
          }
        }`
      : `*[_type == "product" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
          _id,
          title,
          slug,
          status,
          category->{
            _id,
            title,
            slug
          },
          tags,
          description,
          longDescription,
          specifications[] {
            name,
            value,
            unit
          },
          features,
          useCases,
          image {
            asset->{
              _id,
              url
            },
            alt
          },
          gallery[] {
            asset->{
              _id,
              url
            },
            alt,
            caption
          },
          videoUrl,
          basePrice,
          priceRange,
          currency,
          inStock,
          leadTime,
          rating,
          reviewCount,
          testimonials[] {
            quote,
            author,
            company,
            rating
          },
          qualityGuarantee,
          fastDelivery,
          awardWinning,
          certifications,
          popular,
          featured,
          newProduct,
          seo {
            metaTitle,
            metaDescription,
            keywords
          },
          template {
            hasTemplate,
            description,
            htmlEmbed,
            downloadFile {
              asset->{
                url,
                originalFilename
              }
            },
            previewImage {
              asset->{
                url
              },
              alt
            }
          },
          detailedSpecs,
          productDetails,
          faq[] {
            question,
            answer
          },
          templates[]->{
            _id,
            title,
            slug,
            description,
            fileType,
            size,
            tags,
            isPremium,
            price,
            rating,
            downloadCount,
            previewImage {
              asset->{
                _id,
                url
              },
              alt
            },
            downloadFile {
              asset->{
                _id,
                url,
                originalFilename
              }
            },
            category->{
              _id,
              title,
              slug
            }
          }
        }`;

    const product = await sanityClient.fetch(query, { slug });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProducts(category?: string, isPreview = false) {
  try {
    let filter = '';
    
    // Add category filter if provided
    if (category && category !== 'all') {
      filter = '&& category->slug.current == $category';
    }

    const query = isPreview
      ? `*[_type == "product" ${filter}] | order(title asc) {
          _id,
          title,
          slug,
          category->{
            _id,
            title,
            slug
          },
          description,
          status,
          inStock,
          featured,
          popular,
          newProduct,
          tags,
          basePrice,
          priceRange,
          currency,
          rating,
          reviewCount,
          leadTime,
          image {
            asset->{
              _id,
              url
            },
            alt
          }
        }`
      : `*[_type == "product" && status == "active" ${filter} && !(_id in path('drafts.**'))] | order(title asc) {
          _id,
          title,
          slug,
          category->{
            _id,
            title,
            slug
          },
          description,
          status,
          inStock,
          featured,
          popular,
          newProduct,
          tags,
          basePrice,
          priceRange,
          currency,
          rating,
          reviewCount,
          leadTime,
          image {
            asset->{
              _id,
              url
            },
            alt
          }
        }`;

    const products = await sanityClient.fetch(query, { category });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductCategories(isPreview = false) {
  try {
    const query = isPreview
      ? `*[_type == "productCategory"] | order(title asc) {
          _id,
          title,
          slug,
          description,
          "count": count(*[_type == "product" && references(^._id)])
        }`
      : `*[_type == "productCategory" && !(_id in path('drafts.**'))] | order(title asc) {
          _id,
          title,
          slug,
          description,
          "count": count(*[_type == "product" && references(^._id) && status == "active"])
        }`;

    const categories = await sanityClient.fetch(query);
    return categories;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
}

export async function getFeaturedProducts(isPreview = false) {
  try {
    const query = isPreview
      ? `*[_type == "product" && featured == true] | order(title asc) {
          _id,
          title,
          slug,
          description,
          category->{
            _id,
            title,
            slug
          },
          image {
            asset->{
              _id,
              url
            },
            alt
          },
          specifications[] {
            name,
            value
          }
        }`
      : `*[_type == "product" && featured == true && !(_id in path('drafts.**'))] | order(title asc) {
          _id,
          title,
          slug,
          description,
          category->{
            _id,
            title,
            slug
          },
          image {
            asset->{
              _id,
              url
            },
            alt
          },
          specifications[] {
            name,
            value
          }
        }`;

    const products = await sanityClient.fetch(query);
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getProductsByCategory(categorySlug: string, isPreview = false) {
  try {
    const query = isPreview
      ? `*[_type == "product" && category->slug.current == $categorySlug] | order(title asc) {
          _id,
          title,
          slug,
          status,
          category->{
            _id,
            title,
            slug
          },
          tags,
          description,
          specifications[] {
            name,
            value,
            unit
          },
          features,
          image {
            asset->{
              _id,
              url
            },
            alt
          },
          basePrice,
          priceRange,
          currency,
          featured,
          popular,
          newProduct,
          rating,
          reviewCount
        }`
      : `*[_type == "product" && category->slug.current == $categorySlug && !(_id in path('drafts.**')) && status == "active"] | order(title asc) {
          _id,
          title,
          slug,
          status,
          category->{
            _id,
            title,
            slug
          },
          tags,
          description,
          specifications[] {
            name,
            value,
            unit
          },
          features,
          image {
            asset->{
              _id,
              url
            },
            alt
          },
          basePrice,
          priceRange,
          currency,
          featured,
          popular,
          newProduct,
          rating,
          reviewCount
        }`;

    const products = await sanityClient.fetch(query, { categorySlug });
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function getCategoryBySlug(categorySlug: string, isPreview = false) {
  try {
    const query = isPreview
      ? `*[_type == "productCategory" && slug.current == $categorySlug] | order(_updatedAt desc)[0] {
          _id,
          title,
          slug,
          description,
          icon,
          image {
            asset->{
              _id,
              url
            },
            alt
          },
          featured,
          order,
          seo {
            metaTitle,
            metaDescription
          }
        }`
      : `*[_type == "productCategory" && slug.current == $categorySlug && !(_id in path('drafts.**'))][0] {
          _id,
          title,
          slug,
          description,
          icon,
          image {
            asset->{
              _id,
              url
            },
            alt
          },
          featured,
          order,
          seo {
            metaTitle,
            metaDescription
          }
        }`;

    const category = await sanityClient.fetch(query, { categorySlug });
    return category;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

export async function getNavigationMenu(isPreview = false) {
  try {
    const query = isPreview
      ? `*[_type == "navigationMenu"] | order(_updatedAt desc)[0] {
          _id,
          title,
          items[] {
            name,
            href,
            order,
            isVisible,
            openInNewTab,
            submenu[] {
              name,
              href,
              description,
              isVisible,
              openInNewTab
            },
            megaMenu[] {
              sectionTitle,
              sectionDescription,
              links[] {
                name,
                href,
                description,
                isVisible,
                isHighlighted,
                openInNewTab
              }
            }
          }
        }`
      : `*[_type == "navigationMenu" && !(_id in path('drafts.**'))][0] {
          _id,
          title,
          items[] {
            name,
            href,
            order,
            isVisible,
            openInNewTab,
            submenu[] {
              name,
              href,
              description,
              isVisible,
              openInNewTab
            },
            megaMenu[] {
              sectionTitle,
              sectionDescription,
              links[] {
                name,
                href,
                description,
                isVisible,
                isHighlighted,
                openInNewTab
              }
            }
          }
        }`;

    const navigationMenu = await sanityClient.fetch(query);
    return navigationMenu;
  } catch (error) {
    console.error('Error fetching navigation menu:', error);
    return null;
  }
}

// Site Settings Fetcher
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings"][0] {
      _id,
      title,
      description,
      logo {
        asset->{
          _id,
          url
        },
        alt
      },
      contact {
        phone,
        email,
        address,
        businessHours[] {
          day,
          hours
        }
      },
      social {
        facebook,
        twitter,
        instagram,
        linkedin
      },
      seo {
        metaTitle,
        metaDescription,
        keywords
      },
      analytics {
        ga4Id,
        gtmId,
        googleAdsId
      }
    }`;

    const settings = await sanityClient.fetch(query);
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}
