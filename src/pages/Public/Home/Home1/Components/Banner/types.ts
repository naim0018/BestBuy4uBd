// Banner data types
export interface BannerData {
  id: string;
  type: "hero" | "product" | "feature";
  title: string;
  subtitle?: string;
  description?: string; // Added description
  brand?: string;
  price?: string;
  originalPrice?: string;
  features?: string[];
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  textColor: string;
  size: "small" | "medium" | "large";
  image?: string; // Added image
}

export interface BannerGridData {
  heroBanner: BannerData;
  productCards: BannerData[];
}
