export type BrandConfig = {
  title: string;
  name?: string;
  logo: string;
};

export const BRAND_CONFIG: Record<string, BrandConfig> = {
  "bestbuy4ubd.com": {
    title: "BestBuy4uBd",
    // name: "Best Buy 4uBd",
    logo: "/logos/bestbuy4ubd.png",
  },
  "www.bestbuy4ubd.com": {
    title: "BestBuy4uBd",
    // name: "Best Buy 4u Bd",
    logo: "/logos/bestbuy4ubd.png",
  },
  "topdealsbd.com": {
    title: "TopDealsBd",
    // name: "Top Deals Bd",
    logo: "/logos/topdealsbd.png",
  },
  "www.topdealsbd.com": {
    title: "TopDealsBd",
    // name: "Top Deals Bd",
    logo: "/logos/topdealsbd.png",
  },
};
