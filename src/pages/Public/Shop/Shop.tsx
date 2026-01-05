import { useState } from "react";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";
import { useGetAllCategoriesQuery } from "@/store/Api/CategoriesApi";
import CommonWrapper from "@/common/CommonWrapper";
import ProductCard from "./Components/ProductCard";
import FilterSidebar from "./Components/FilterSidebar";
import Pagination from "./Components/Pagination";
import { LayoutGrid, List, SlidersHorizontal, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Shop = () => {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 1000000,
    sort: "-createdAt",
    stockStatus: "",
  });

  const { data: productsData, isLoading, isFetching } = useGetAllProductsQuery(filters);
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 py-10">
      <CommonWrapper>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
               <button 
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 font-bold text-sm"
               >
                 <SlidersHorizontal className="w-4 h-4 text-primary-green" />
                 Show Filters
               </button>
               <div className="text-xs font-bold text-slate-400">
                  {productsData?.meta?.total || 0} Products found
               </div>
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
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
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                />
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-900 z-[101] p-6 overflow-y-auto lg:hidden"
                >
                  <FilterSidebar 
                    categories={categoriesData?.data || []} 
                    filters={filters} 
                    setFilters={setFilters} 
                  />
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="mt-8 w-full py-4 bg-primary-green text-white rounded-2xl font-bold shadow-lg shadow-primary-green/20"
                  >
                    View Results
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-0">Our Shop</h1>
                  <p className="text-xs font-medium text-slate-400">
                    Showing {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, productsData?.meta?.total || 0)} of {productsData?.meta?.total || 0} products
                  </p>
                </div>
                
                {/* View Toggles */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button 
                      onClick={() => setViewType("grid")}
                      className={`p-2 rounded-lg transition-all ${viewType === "grid" ? "bg-white dark:bg-slate-700 text-primary-green shadow-sm" : "text-slate-400"}`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setViewType("list")}
                      className={`p-2 rounded-lg transition-all ${viewType === "list" ? "bg-white dark:bg-slate-700 text-primary-green shadow-sm" : "text-slate-400"}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1 sm:flex-initial">
                 <div className="relative flex-1 sm:w-64">
                    <select 
                      value={filters.sort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-green/50 cursor-pointer"
                    >
                       {sortOptions.map((opt) => (
                         <option key={opt.value} value={opt.value}>{opt.label}</option>
                       ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
              </div>
            </div>

            {/* Top Pagination */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-sm font-bold text-slate-500">
                    Page {filters.page} of {productsData?.meta?.totalPage || 1}
                </div>
                <Pagination 
                   currentPage={filters.page} 
                   totalPage={productsData?.meta?.totalPage || 1} 
                   onPageChange={handlePageChange} 
                />
            </div>

            {/* Product Grid */}
            <div className={`relative ${isFetching ? "opacity-60" : "opacity-100"} transition-opacity duration-300`}>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-[450px] bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800" />
                    ))}
                  </div>
                ) : productsData?.data && productsData.data.length > 0 ? (
                  <div className={viewType === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
                    : "flex flex-col gap-6"
                  }>
                    {productsData.data.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                      <Search className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No products found</h2>
                    <p className="text-slate-400 font-medium">Try adjusting your filters or search terms</p>
                    <button 
                      onClick={() => setFilters({ ...filters, search: "", category: "", minPrice: 0, maxPrice: 1000000, stockStatus: "" })}
                      className="mt-6 px-8 py-3 bg-primary-green text-white rounded-2xl font-bold shadow-lg shadow-primary-green/20"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
            </div>

            {/* Bottom Pagination */}
            <div className="mt-12 flex flex-col items-center gap-4">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
                <Pagination 
                   currentPage={filters.page} 
                   totalPage={productsData?.meta?.totalPage || 1} 
                   onPageChange={handlePageChange} 
                />
                <p className="text-sm font-medium text-slate-400 italic">
                    Showing {productsData?.data?.length || 0} items on this page
                </p>
            </div>
          </main>
        </div>
      </CommonWrapper>
    </div>
  );
};

export default Shop;
