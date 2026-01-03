import HeroBanner from "./HeroBanner";
import ProductCard from "./ProductCard";
import { bannerConfig } from "./bannerConfig";

const BannerGrid = () => {
  const { heroBanner, productCards } = bannerConfig;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Large Hero Banner */}
        <div className="lg:col-span-2 lg:row-span-2">
          <HeroBanner data={heroBanner} />
        </div>

        {/* Right Column - Product Cards */}
        <div className="space-y-6">
          {/* Top Right Cards */}
          {productCards.slice(0, 2).map((card, index) => (
            <ProductCard key={card.id} data={card} index={index} />
          ))}
        </div>

        {/* Bottom Row - Small Product Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {productCards.slice(2).map((card, index) => (
            <ProductCard key={card.id} data={card} index={index + 2} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerGrid;
