import CommonWrapper from "@/common/CommonWrapper";
import Navbar from "./Components/Navbar";
import { BannerGrid } from "./Components/Banner";
import FeaturedCategories from "./Components/FeaturedCategories";
import DealsSection from "./Components/DealsSection";

import RecommendedSection from "./Components/Recommended/RecommendedSection";

const Home = () => {
  return (
    <>
      <Navbar />
      {/* Banner Section */}
      <BannerGrid />
      <CommonWrapper>
        <div className="overflow-hidden py-12">
          {/* Shop by Category */}
          <FeaturedCategories />
          
          {/* Recommended Section */}
          <RecommendedSection />

          {/* Today's Hot Deals */}
          <DealsSection />
        </div>
      </CommonWrapper>
    </>
  );
};

export default Home;
