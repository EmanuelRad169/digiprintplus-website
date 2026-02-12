export interface SiteSettings {
  _id: string;
  title?: string;
  description?: string;
  logo?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    businessHours?: Array<{
      day: string;
      hours: string;
    }>;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  analytics?: {
    ga4Id?: string;
    gtmId?: string;
    googleAdsId?: string;
  };
}
