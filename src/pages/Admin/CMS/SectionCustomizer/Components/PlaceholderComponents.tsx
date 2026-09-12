import React from "react";
import {
  Zap,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  ChevronRight,
  ChevronLeft,
  Heart,
} from "lucide-react";

export interface SectionBlockConfig {
  id: string;
  type:
    | "hero_slider"
    | "flash_deals"
    | "category_grid"
    | "product_grid"
    | "banner_row"
    | "tabbed_showcase"
    | "brand_spotlight"
    | "features_bar"
    | "newsletter_bar"
    | "hero_split_banner"
    | "category_cards_row"
    | "new_arrival_showcase"
    | "home_appliance_grid"
    | "kitchen_appliance_grid"
    | "gifts_grid"
    | "electronics_grid"
    | "storefront_trust_bar"
    | "custom_code";
  title: string;
  subtitle?: string;
  isActive: boolean;
  itemLimit?: number;
  customCode?: string;
}

export const DEFAULT_CUSTOM_CODE_TEMPLATE = `<div class="w-full p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-900 to-blue-950 text-white shadow-2xl border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
  <div class="space-y-3 max-w-xl">
    <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
      ⚡ EXCLUSIVE CUSTOM PROMO SECTION
    </div>
    <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
      Custom Tailored Storefront Component
    </h2>
    <p class="text-xs sm:text-sm text-slate-300">
      Edit this HTML & Tailwind code directly from the live Code Editor studio! Add custom grids, banners, call-to-actions, or embedded widgets.
    </p>
  </div>
  <div class="flex items-center gap-3 shrink-0">
    <button class="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all transform hover:scale-105 cursor-pointer">
      Shop Exclusive Deals →
    </button>
  </div>
</div>`;

// =========================================================================
// PREMADE SECTION: CUSTOM CODE SECTION
// =========================================================================
export const CustomCodeSection: React.FC<{ config: SectionBlockConfig }> = ({ config }) => {
  const rawCode = config.customCode || DEFAULT_CUSTOM_CODE_TEMPLATE;
  const processedHtml = rawCode.replace(/className=/g, "class=");

  return (
    <div className="w-full overflow-hidden">
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </div>
  );
};

// =========================================================================
// PREMADE SECTION 1: HERO SPLIT BANNER (Exact Image 1 Top Banners)
// Left: Dark Flash Sale Banner | Right: Orange Pressure Cooker Banner
// =========================================================================
export const HeroSplitBannerSection: React.FC<{ config: SectionBlockConfig }> = ({ config: _config }) => {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left Large Dark Flash Sale Banner */}
      <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-900/40 shadow-lg min-h-[220px] flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>FLASH SALE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight uppercase">
            UP TO <span className="text-red-500">70% OFF</span>
          </h2>
          <p className="text-xs text-slate-300">
            Exclusive deals on smartwatches, wireless audio, and home gadgets.
          </p>
        </div>

        <div className="relative z-10 pt-2 flex items-center justify-between">
          <button className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer">
            SHOP NOW
          </button>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Live Sale Active
          </div>
        </div>
      </div>

      {/* Right Square Orange/Red BestBuy4UBd Pressure Cooker Banner */}
      <div className="lg:col-span-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white p-6 border border-orange-500/40 shadow-lg min-h-[220px] flex flex-col justify-between">
        <div className="space-y-1">
          <div className="text-xs font-black tracking-widest text-amber-200 uppercase">
            BestBuy4UBd
          </div>
          <p className="text-[11px] font-bold text-amber-100">Quality & Modern Kitchen Goods</p>
          <div className="pt-2">
            <span className="px-2.5 py-0.5 rounded-md bg-white text-red-700 text-[10px] font-black uppercase">
              NEW ARRIVAL
            </span>
            <h3 className="text-xl font-black text-white tracking-tight mt-1 leading-tight">
              Pressure Cooker
            </h3>
            <p className="text-[10px] text-amber-100">Durable & Safe | Affordable Price</p>
          </div>
        </div>

        <button className="w-fit px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold uppercase shadow-md transition-all cursor-pointer">
          Shop Now →
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// PREMADE SECTION 2: CATEGORY CARD BUBBLES ROW (Exact Image 1)
// Home Appliance, Kitchen Appliance, Gifts, Motorcycle, Beauty, Uncommon
// =========================================================================
export const CategoryCardsRowSection: React.FC<{ config: SectionBlockConfig }> = ({ config: _config }) => {
  const categoryCards = [
    {
      title: "Home Appliance",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
    },
    {
      title: "Kitchen Appliance",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80",
    },
    {
      title: "Gifts",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
    },
    {
      title: "Motorcycle",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80",
    },
    {
      title: "Beauty & Personal Care",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
    },
    {
      title: "Uncommon Stuff",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
    },
  ];

  return (
    <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {categoryCards.map((cat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-xl aspect-4/3 border border-slate-200 dark:border-slate-800 bg-slate-900 text-white cursor-pointer shadow-xs"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
              <h4 className="text-xs font-extrabold text-white leading-tight drop-shadow-sm">
                {cat.title}
              </h4>
              <span className="text-[10px] text-slate-300 font-semibold group-hover:text-blue-400 transition-colors flex items-center gap-0.5 mt-0.5">
                Explore <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// PREMADE SECTION 3: NEW ARRIVAL SHOWCASE (Exact Image 1)
// =========================================================================
export const NewArrivalShowcaseSection: React.FC<{ config: SectionBlockConfig }> = ({ config }) => {
  const newArrivals = [
    {
      title: "Silicone Facial Cleansing Brush | Soft Face Scrubber",
      price: "৳150",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
      badge: "-30%",
    },
    {
      title: "4-in-1 Hanging Wardrobe Bag Organizer",
      price: "৳350",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
      badge: null,
    },
    {
      title: "Desktop Mini Air Conditioning Fan Cooler",
      price: "৳490",
      image: "https://images.unsplash.com/photo-1617625802912-cde588faf581?w=400&q=80",
      badge: "-15%",
    },
  ];

  return (
    <div className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <h3 className="text-base font-black text-indigo-700 dark:text-indigo-400">
          {config.title || "New Arrival"}
        </h3>
        <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1">
          See All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {newArrivals.map((item, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-amber-50/20 dark:bg-slate-800/30 flex items-center gap-3"
          >
            <div className="relative w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              {item.badge && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-black">
                  {item.badge}
                </span>
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                {item.title}
              </h4>
              <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                {item.price}
              </div>
              <button className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase cursor-pointer">
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- HELPER FUNCTION FOR 6-COLUMN PRODUCT GRID SECTIONS ---
const RenderBestBuyProductGrid = ({
  sectionTitle,
  products,
}: {
  sectionTitle: string;
  products: { title: string; price: string; oldPrice?: string; image: string; badge?: string }[];
}) => {
  return (
    <div className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <h3 className="text-base font-black text-indigo-700 dark:text-indigo-400">
          {sectionTitle}
        </h3>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
        {products.map((item, idx) => (
          <div
            key={idx}
            className="group relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-square rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden mb-2">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.badge && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-black uppercase shadow-xs">
                  {item.badge}
                </span>
              )}
              <button className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-red-500 transition-colors">
                <Heart className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-center">
              <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[30px] leading-snug">
                {item.title}
              </h4>

              <div className="flex items-center justify-center gap-1.5 text-xs">
                {item.oldPrice && (
                  <span className="text-slate-400 line-through text-[10px]">
                    {item.oldPrice}
                  </span>
                )}
                <span className="font-extrabold text-indigo-700 dark:text-indigo-400">
                  {item.price}
                </span>
              </div>

              <button className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase shadow-xs transition-all cursor-pointer">
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// PREMADE SECTION 4: HOME APPLIANCE PRODUCT GRID
// =========================================================================
export const HomeApplianceGridSection: React.FC<{ config: SectionBlockConfig }> = ({ config }) => {
  const products = [
    {
      title: "Electric Water Kettle 2.0L Stainless",
      price: "৳450",
      oldPrice: "৳650",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
    },
    {
      title: "Foldable Wardrobe Storage Bed Sheet Cover",
      price: "৳275",
      oldPrice: "৳395",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
    },
    {
      title: "Stainless Steel Kitchen Rack Dish Drainer",
      price: "৳870",
      oldPrice: "৳1,150",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80",
    },
    {
      title: "Portable Handheld Garment Steamer Iron",
      price: "৳895",
      oldPrice: "৳1,250",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80",
    },
    {
      title: "Pro Portable Hair Dryer Quick Dry",
      price: "৳650",
      oldPrice: "৳890",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
    },
    {
      title: "Multipurpose Fabric Storage Box Set",
      price: "৳450",
      oldPrice: "৳650",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
    },
  ];

  return <RenderBestBuyProductGrid sectionTitle={config.title || "Home Appliance"} products={products} />;
};

// =========================================================================
// PREMADE SECTION 5: KITCHEN APPLIANCE PRODUCT GRID
// =========================================================================
export const KitchenApplianceGridSection: React.FC<{ config: SectionBlockConfig }> = ({ config }) => {
  const products = [
    {
      title: "4-in-1 Vegetable Chopper Slicer Cutter",
      price: "৳450",
      oldPrice: "৳620",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80",
    },
    {
      title: "Over the Sink Dish Drying Rack Organizer",
      price: "৳1,250",
      oldPrice: "৳1,650",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
    },
    {
      title: "Wall Mounted Spice Container Box Set",
      price: "৳340",
      oldPrice: "৳490",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
    },
    {
      title: "Non-Stick Frying Pan Heavy Gauge Base",
      price: "৳1,150",
      oldPrice: "৳1,450",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
    },
    {
      title: "Multi-functional Electric Breakfast Maker",
      price: "৳1,350",
      oldPrice: "৳1,850",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80",
    },
    {
      title: "Heavy Stainless Steel Dish Drying Rack",
      price: "৳1,750",
      oldPrice: "৳2,250",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
    },
  ];

  return <RenderBestBuyProductGrid sectionTitle={config.title || "Kitchen Appliance"} products={products} />;
};

// =========================================================================
// PREMADE SECTION 6: GIFTS PRODUCT GRID
// =========================================================================
export const GiftsGridSection: React.FC<{ config: SectionBlockConfig }> = ({ config }) => {
  const products = [
    {
      title: "Rotatable Makeup Organizer Storage Box",
      price: "৳790",
      oldPrice: "৳1,150",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
    },
    {
      title: "Luxury Stainless Steel Cutlery Set 24pcs",
      price: "৳970",
      oldPrice: "৳1,350",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
    },
    {
      title: "6-Piece Pastry Glass Tea Cup Set",
      price: "৳870",
      oldPrice: "৳1,200",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    },
    {
      title: "Romantic Crystal Ambient Table Lamp",
      price: "৳650",
      oldPrice: "৳890",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    },
  ];

  return <RenderBestBuyProductGrid sectionTitle={config.title || "Gifts"} products={products} />;
};

// =========================================================================
// PREMADE SECTION 7: ELECTRONICS PRODUCT GRID
// =========================================================================
export const ElectronicsGridSection: React.FC<{ config: SectionBlockConfig }> = ({ config }) => {
  const products = [
    {
      title: "Mini Pocket Handheld Thermal Printer",
      price: "৳920",
      oldPrice: "৳1,350",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
    },
    {
      title: "Safe Smart Extension Socket Power Strip",
      price: "৳520",
      oldPrice: "৳750",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    },
    {
      title: "TWS Wireless Gaming Earbuds Low Latency",
      price: "৳1,450",
      oldPrice: "৳1,950",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    },
    {
      title: "High Bass TWS Wireless Earphone Case",
      price: "৳1,150",
      oldPrice: "৳1,650",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    },
    {
      title: "Ultra Bass Wireless ANC Earbuds",
      price: "৳1,250",
      oldPrice: "৳1,750",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    },
    {
      title: "Portable Electronic Weight Scale 50kg",
      price: "৳450",
      oldPrice: "৳650",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80",
    },
  ];

  return <RenderBestBuyProductGrid sectionTitle={config.title || "Electronics"} products={products} />;
};

// =========================================================================
// PREMADE SECTION 8: STOREFRONT TRUST GUARANTEES BAR
// =========================================================================
export const StorefrontTrustBarSection: React.FC<{ config: SectionBlockConfig }> = ({ config: _config }) => {
  const items = [
    { title: "100+", desc: "Happy Customers", icon: ShoppingBag, color: "text-indigo-600 bg-indigo-50" },
    { title: "500+", desc: "Genuine Products", icon: Truck, color: "text-blue-600 bg-blue-50" },
    { title: "100%", desc: "Instant Warranty", icon: ShieldCheck, color: "text-purple-600 bg-purple-50" },
    { title: "24/7", desc: "Dedicated Support", icon: Headphones, color: "text-pink-600 bg-pink-50" },
  ];

  return (
    <div className="w-full p-5 rounded-2xl bg-indigo-50/40 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-xs">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it, idx) => {
          const IconComp = it.icon;
          return (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className={`p-2.5 rounded-xl ${it.color}`}>
                <IconComp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">{it.title}</h4>
                <p className="text-[11px] font-bold text-slate-400">{it.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// DYNAMIC PREMADE SECTION RENDERER
// =========================================================================
export const RenderSectionPlaceholder: React.FC<{ config: SectionBlockConfig }> = ({ config }) => {
  if (!config.isActive) return null;

  switch (config.type) {
    case "custom_code":
      return <CustomCodeSection config={config} />;
    case "hero_split_banner":
      return <HeroSplitBannerSection config={config} />;
    case "category_cards_row":
      return <CategoryCardsRowSection config={config} />;
    case "new_arrival_showcase":
      return <NewArrivalShowcaseSection config={config} />;
    case "home_appliance_grid":
      return <HomeApplianceGridSection config={config} />;
    case "kitchen_appliance_grid":
      return <KitchenApplianceGridSection config={config} />;
    case "gifts_grid":
      return <GiftsGridSection config={config} />;
    case "electronics_grid":
      return <ElectronicsGridSection config={config} />;
    case "storefront_trust_bar":
      return <StorefrontTrustBarSection config={config} />;
    default:
      return null;
  }
};
