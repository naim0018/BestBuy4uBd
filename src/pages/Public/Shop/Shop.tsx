import { useState, useMemo } from "react";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";
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
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    category: "",
    brand: "",
    minPrice: 0,
    maxPrice: 1000000,
    sort: "-createdAt",
    stockStatus: "",
    rating: 0,
  });

  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery({ page: filters.page, limit: filters.limit });
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);

  // Extract unique brands from current products as a starting point
  // In a real app, you might have a dedicated API for brands
  const brands = useMemo(() => {
    if (!productsData?.data) return [];
    const uniqueBrands = new Set<string>();
    productsData.data.forEach((p) => {
      if (p.basicInfo?.brand) uniqueBrands.add(p.basicInfo.brand);
    });
    // Add some default brands if list is small to make it look good
    ["Samsung", "Apple", "Xiaomi", "X-Lab", "Envato", "Photodune"].forEach(
      (b) => uniqueBrands.add(b)
    );
    return Array.from(uniqueBrands).sort();
  }, [productsData?.data]);

  const sortOptions = [
    { label: "Latest Arrivals", value: "-createdAt" },
    { label: "Oldest First", value: "createdAt" },
    { label: "Price: Low to High", value: "price.regular" },
    { label: "Price: High to Low", value: "-price.regular" },
    { label: "Most Sales", value: "-sold" },
    { label: "Best Discount", value: "-price.savingsPercentage" },
  ];

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sort: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 py-10 font-montserrat">
      <CommonWrapper>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 font-bold text-sm text-dark-blue dark:text-white"
            >
              <SlidersHorizontal className="w-5 h-5 text-primary-green" />
              Filters & Sidebar
            </button>
            <div className="text-sm font-bold text-slate-400">
              {productsData?.meta?.total || 0} Products
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-28 bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
              <FilterSidebar
                categories={categoriesData?.data || []}
                brands={brands}
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
                  className="fixed top-0 left-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-[101] p-8 overflow-y-auto lg:hidden rounded-r-[40px]"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                      FILTERS
                    </h2>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"
                    >
                      <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                  <FilterSidebar
                    categories={categoriesData?.data || []}
                    brands={brands}
                    filters={filters}
                    setFilters={setFilters}
                  />
                  <div className="sticky bottom-0 left-0 right-0 pt-8 pb-4 bg-gradient-to-t from-white dark:from-slate-900 via-white dark:via-slate-900 to-transparent">
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="w-full py-5 bg-primary-green text-white rounded-3xl font-black shadow-2xl shadow-primary-green/30 text-lg uppercase tracking-widest transition-transform active:scale-95"
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
            <div className="bg-white dark:bg-slate-900 px-8 py-6 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none mb-10 flex flex-wrap items-center justify-between gap-6 transition-all">
              <div className="flex items-center gap-10">
                <div className="hidden md:block">
                  <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1 uppercase tracking-tighter">
                    Shop Products
                  </h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {(filters.page - 1) * filters.limit + 1}-
                    {Math.min(
                      filters.page * filters.limit,
                      productsData?.meta?.total || 0
                    )}{" "}
                    of {productsData?.meta?.total || 0} ITEMS
                  </p>
                </div>

                {/* View Toggles */}
                <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setViewType("grid")}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      viewType === "grid"
                        ? "bg-white dark:bg-slate-700 text-primary-green shadow-xl scale-110"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewType("list")}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      viewType === "list"
                        ? "bg-white dark:bg-slate-700 text-primary-green shadow-xl scale-110"
                        : "text-slate-400 hover:text-slate-600"
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
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-slate-700 dark:text-slate-100 focus:ring-4 focus:ring-primary-green/10 cursor-pointer transition-all outline-none"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Top Pagination Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-2">
              <div className="text-sm font-black text-slate-400 uppercase tracking-widest">
                PAGES{" "}
                <span className="text-primary-green mx-2">{filters.page}</span>{" "}
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
                      className="h-[500px] bg-white dark:bg-slate-900 rounded-[40px] animate-pulse border border-slate-100 dark:border-slate-800 shadow-sm"
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
                  className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[60px] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner"
                >
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-xl">
                    <Search className="w-12 h-12 text-slate-300" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter">
                    EMPTY SEARCH
                  </h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">
                    We couldn't find any items matching your filters
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        search: "",
                        category: "",
                        brand: "",
                        minPrice: 0,
                        maxPrice: 1000000,
                        stockStatus: "",
                        rating: 0,
                      })
                    }
                    className="px-12 py-5 bg-dark-blue text-white rounded-3xl font-black shadow-2xl shadow-slate-300 dark:shadow-none transition-transform active:scale-95 uppercase tracking-widest text-sm"
                  >
                    Clear Selection
                  </button>
                </motion.div>
              )}
            </div>

            {/* Bottom Pagination */}
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
              <Pagination
                currentPage={filters.page}
                totalPage={productsData?.meta?.totalPage || 1}
                onPageChange={handlePageChange}
              />
              <p className="text-[10px] font-black text-slate-400 italic uppercase tracking-[0.2em]">
                Displaying experimental selection of{" "}
                {productsData?.data?.length || 0} items
              </p>
            </div>
          </main>
        </div>
      </CommonWrapper>
    </div>
  );
};

export default Shop;
