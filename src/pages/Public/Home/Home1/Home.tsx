
import { BannerGrid } from "./Components/Banner";
import FeaturedCategories from "./Components/Categories/FeaturedCategories";
// import DealsSection from "./Components/Deals/DealsSection";

import RecommendedSection from "./Components/Recommended/RecommendedSection";

const Home = () => {
  return (
    <>
      {/* Banner Section */}
      <BannerGrid />
      <>
        <div className="py-12">
          {/* Shop by Category */}
          <FeaturedCategories />

          {/* Recommended Section */}
          <RecommendedSection />

          {/* Today's Hot Deals */}
          {/* <DealsSection /> */}
        </div>
      </>
    </>
  );
};

export default Home;
