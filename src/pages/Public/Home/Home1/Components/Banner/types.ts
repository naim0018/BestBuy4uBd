// Banner data types
export interface BannerData {
  id: string;
  type: "hero" | "product" | "feature";
  title: string;
  subtitle?: string;
  brand?: string;
  price?: string;
  originalPrice?: string;
  features?: string[];
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
  bgColor: string;
  textColor: string;
  size: "large" | "medium" | "small";
}

export interface BannerGridData {
  heroBanner: BannerData;
  productCards: BannerData[];
}
