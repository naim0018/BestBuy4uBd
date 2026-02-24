import { BannerGrid } from "./Components/Banner";
import FeaturedCategories from "./Components/Categories/FeaturedCategories";
import NewArrival from "./Components/NewArrival/NewArrival";
import RecommendedSection from "./Components/Recommended/RecommendedSection";
import PromotionalSection from "./Components/Promotional/PromotionalSection";
import TrendingNow from "@/components/TrendingNow/TrendingNow";
import FeaturedSection from "@/components/FeaturedSection/FeaturedSection";

const Home = () => {
  return (
    <>
      {/* Banner Section */}
      <BannerGrid />
      <>
        <div className="pb-12">
          {/* Shop by Category */}
          <FeaturedCategories />

          {/* Recommended For You Section */}
          <RecommendedSection />

          {/* Trending Now Section */}
          <TrendingNow />

          {/* Featured Collections Section (banner grid like the image) */}
          <FeaturedSection />

          {/* New Arrival Section */}
          <NewArrival />

          {/* Promotional Section */}
          <PromotionalSection />
        </div>
      </>
    </>
  );
};

export default Home;
