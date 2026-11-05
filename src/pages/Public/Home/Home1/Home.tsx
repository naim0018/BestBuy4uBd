import { lazy, Suspense } from "react";
import { BannerGrid } from "./Components/Banner";
import FeaturedCategories from "./Components/Categories/FeaturedCategories";
import NewArrival from "./Components/NewArrival/NewArrival";

const RecommendedSection = lazy(() => import("./Components/Recommended/RecommendedSection"));
const PromotionalSection = lazy(() => import("./Components/Promotional/PromotionalSection"));
const StatsBanner = lazy(() => import("./Components/StatsBanner"));

const Home = () => {
  return (
    <>
      {/* Banner Section */}
      <BannerGrid />
      <>
        <div className="pb-6 sm:pb-12 flex flex-col gap-10 sm:gap-20">
          {/* Shop by Category */}
          <FeaturedCategories />

          {/* New Arrival Section */}
          <NewArrival />

          {/* Recommended Section */}
          <Suspense fallback={<div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-800/30 rounded-xl" />}>
            <RecommendedSection />
          </Suspense>

          {/* Promotional Section */}
          <Suspense fallback={<div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800/30 rounded-xl" />}>
            <PromotionalSection />
          </Suspense>

          {/* Stats Banner */}
          <div className="container mx-auto px-4">
            <Suspense fallback={null}>
              <StatsBanner />
            </Suspense>
          </div>

          {/* Today's Hot Deals */}
          {/* <DealsSection /> */}
        </div>
      </>
    </>
  );
};

export default Home;
