import CommonWrapper from "@/common/CommonWrapper";
import Navbar from "./Components/Navbar";
import { BannerGrid } from "./Components/Banner";
import FeaturedCategories from "./Components/FeaturedCategories";
import DealsSection from "./Components/DealsSection";

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

          {/* Today's Hot Deals */}
          <DealsSection />
        </div>
      </CommonWrapper>
    </>
  );
};

export default Home;
