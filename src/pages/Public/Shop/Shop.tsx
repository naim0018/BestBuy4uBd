import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";
import { useTracking } from "@/hooks/useTracking";
import { useGetAllCategoriesQuery } from "@/store/Api/CategoriesApi";
import CommonWrapper from "@/common/CommonWrapper";
import ProductCard from "./Components/ProductCard";
import FilterSidebar from "./Components/FilterSidebar";
import Pagination from "./Components/Pagination";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Shop = () => {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 12,
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      minPrice: Number(searchParams.get("minPrice")) || 0,
      maxPrice: Number(searchParams.get("maxPrice")) || 100000,
      sort: searchParams.get("sort") || "-createdAt",
      stockStatus: searchParams.get("stockStatus") || "",
      rating: Number(searchParams.get("rating")) || 0,
    }),
    [searchParams],
  );

  const [filters, setFilters] = useState(initialFilters);

  // Sync state with URL when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== 0 &&
        value !== undefined &&
        value !== null
      ) {
        // Special case for limit if it's default
        if (key === "limit" && value === 12) return;
        // Special case for search (don't put empty string in URL)
        if (key === "search" && !value) return;

        params[key] = String(value);
      }
    });

    // Only update if params actually changed to avoid infinite cycles
    const currentParams = Object.fromEntries(searchParams.entries());
    const hasChanged = JSON.stringify(params) !== JSON.stringify(currentParams);

    if (hasChanged) {
      setSearchParams(params, { replace: true });
    }
  }, [filters, setSearchParams, searchParams]);

  // Sync state FROM URL when user navigates back/forward
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery(filters);
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
  const { trackViewItemList, trackSortChange } = useTracking();

  useEffect(() => {
    if (productsData?.data) {
      trackViewItemList(
        productsData.data.map((product) => ({
          id: product._id,
          name: product.basicInfo.title,
          price: product.price.discounted || product.price.regular,
          category: product.basicInfo.category,
          list_name: "Shop Page",
          list_id: "shop_page",
        })),
      );
    }
  }, [productsData, trackViewItemList]);

  const sortOptions = [
    { label: "Latest Arrivals", value: "-createdAt" },
    { label: "Oldest First", value: "createdAt" },
    { label: "Price: Low to High", value: "price.regular" },
    { label: "Price: High to Low", value: "-price.regular" },
    { label: "Most Sales", value: "-sold" },
    { label: "Best Discount", value: "-price.savingsPercentage" },
  ];

  const handleSortChange = (value: string) => {
    trackSortChange(value);
    setFilters((prev) => ({ ...prev, sort: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-bg-base py-10 font-nunito">
      <CommonWrapper>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-bg-surface rounded-component shadow-sm border border-border-main font-semibold text-xs uppercase tracking-widest text-text-primary"
            >
              <SlidersHorizontal className="w-4 h-4 text-secondary" />
              Filters
            </button>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              {productsData?.meta?.total || 0} Products
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-28 bg-bg-surface p-8 rounded-container border border-border-main shadow-sm">
              <FilterSidebar
                categories={categoriesData?.data || []}
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </aside>

          {/* Mobile Sidebar Slider */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] lg:hidden"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 250 }}
                  className="fixed top-0 left-0 h-full w-full max-w-md bg-bg-surface z-[101] p-8 overflow-y-auto lg:hidden rounded-r-container"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-text-primary uppercase tracking-tighter">
                      FILTERS
                    </h2>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-3 bg-bg-base rounded-full"
                    >
                      <X className="w-6 h-6 text-text-muted" />
                    </button>
                  </div>
                  <FilterSidebar
                    categories={categoriesData?.data || []}
                    filters={filters}
                    setFilters={setFilters}
                  />
                  <div className="sticky bottom-0 left-0 right-0 pt-8 pb-4 bg-gradient-to-t from-bg-surface via-bg-surface to-transparent">
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="w-full py-5 bg-secondary text-white rounded-component font-semibold shadow-xl shadow-secondary/20 text-xs uppercase tracking-widest transition-transform active:scale-95"
                    >
                      Show Results
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="bg-bg-surface px-8 py-6 rounded-container border border-border-main shadow-sm flex flex-wrap items-center justify-between gap-6 transition-all">
              <div className="flex items-center gap-10">
                <div className="hidden md:block">
                  <h1 className="text-2xl font-black text-brand-700 mb-1 uppercase tracking-tighter">
                    <span className="text-secondary">Shop</span> Products
                  </h1>
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em]">
                    {(filters.page - 1) * filters.limit + 1}-
                    {Math.min(
                      filters.page * filters.limit,
                      productsData?.meta?.total || 0,
                    )}{" "}
                    of {productsData?.meta?.total || 0} ITEMS
                  </p>
                </div>

                {/* View Toggles */}
                <div className="flex items-center bg-bg-base p-1.5 rounded-component border border-border-main">
                  <button
                    onClick={() => setViewType("grid")}
                    className={`p-2.5 rounded-inner transition-all duration-300 ${
                      viewType === "grid"
                        ? "bg-bg-surface text-secondary shadow-sm scale-110"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewType("list")}
                    className={`p-2.5 rounded-inner transition-all duration-300 ${
                      viewType === "list"
                        ? "bg-bg-surface text-secondary shadow-sm scale-110"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-1 sm:flex-initial">
                <div className="relative flex-1 sm:w-72">
                  <select
                    value={filters.sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full appearance-none bg-bg-base border border-border-main rounded-component px-6 py-4 text-xs font-semibold text-text-primary uppercase tracking-widest focus:ring-4 focus:ring-secondary/10 cursor-pointer transition-all outline-none"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Top Pagination Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 h-24">
              <div className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em]">
                PAGES{" "}
                <span className="text-secondary mx-2 font-semibold">
                  {filters.page}
                </span>{" "}
                / {productsData?.meta?.totalPage || 1}
              </div>
              <Pagination
                currentPage={filters.page}
                totalPage={productsData?.meta?.totalPage || 1}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Product Grid */}
            <div
              className={`relative ${
                isFetching ? "opacity-60 grayscale-[0.5]" : "opacity-100"
              } transition-all duration-500`}
            >
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[500px] bg-bg-surface rounded-container animate-pulse border border-border-main"
                    />
                  ))}
                </div>
              ) : productsData?.data && productsData.data.length > 0 ? (
                <div
                  className={
                    viewType === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                      : "flex flex-col gap-8"
                  }
                >
                  {productsData.data.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-32 bg-bg-surface rounded-container border-2 border-dashed border-border-main"
                >
                  <div className="w-24 h-24 bg-bg-base rounded-full flex items-center justify-center mb-8 shadow-sm">
                    <Search className="w-12 h-12 text-text-muted/30" />
                  </div>
                  <h2 className="text-3xl font-semibold text-text-primary mb-3 tracking-tighter uppercase">
                    EMPTY SEARCH
                  </h2>
                  <p className="text-text-muted font-medium uppercase tracking-widest text-[10px] mb-10">
                    We couldn't find any items matching your filters
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        search: "",
                        category: "",
                        minPrice: 0,
                        maxPrice: 100000,
                        stockStatus: "",
                        rating: 0,
                      })
                    }
                    className="px-12 py-5 bg-text-primary text-white rounded-component font-semibold shadow-xl shadow-text-primary/20 transition-transform active:scale-95 uppercase tracking-widest text-xs"
                  >
                    Clear Selection
                  </button>
                </motion.div>
              )}
            </div>

            {/* Bottom Pagination */}
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border-main to-transparent" />
              <Pagination
                currentPage={filters.page}
                totalPage={productsData?.meta?.totalPage || 1}
                onPageChange={handlePageChange}
              />
              <p className="text-[10px] font-semibold text-text-muted italic uppercase tracking-[0.2em]">
                Displaying of {productsData?.data?.length || 0} items
              </p>
            </div>
          </main>
        </div>
      </CommonWrapper>
    </div>
  );
};

export default Shop;
