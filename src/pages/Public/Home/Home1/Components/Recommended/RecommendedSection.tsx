import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import VerticalPagination from "./VerticalPagination";
import { ProductData } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllCategoriesQuery } from "../../../../../../store/Api/CategoriesApi";
import { useGetAllProductsQuery } from "../../../../../../store/Api/ProductApi";

const FETCH_LIMIT = 12;
const ITEMS_PER_VIEW = 4;

const RecommendedSection = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Categories for Tabs
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery({});
  
  const tabs = useMemo(() => {
     const fetchedTabs = categoriesData?.data?.map((cat: any) => ({
       id: cat.name, 
       label: cat.name,
       value: cat.name
     })) || [];
     
     return [
       { id: "all", label: "All Products", value: "all" },
       ...fetchedTabs
     ];
  }, [categoriesData]);

  // 2. Fetch Products
  const queryOptions = useMemo(() => {
    const options: any = {
      page: 1, // Always fetch page 1
      limit: FETCH_LIMIT, // Fetch 12 items
    };
    if (activeTab !== "all") {
      options.category = activeTab;
    }
    return options;
  }, [activeTab]);

  const { data: productsData, isLoading: isProductsLoading, isFetching } = useGetAllProductsQuery(queryOptions);

  const products: ProductData[] = useMemo(() => {
    if (!productsData?.data) return [];
    
    return productsData.data.map((item: any) => ({
      id: item._id,
      category: item.basicInfo.category,
      title: item.basicInfo.title,
      brand: item.basicInfo.brand,
      price: item.price.discounted || item.price.regular,
      oldPrice: item.price.discounted ? item.price.regular : undefined,
      discount: item.price.discounted ? Math.round(((item.price.regular - item.price.discounted) / item.price.regular) * 100) : undefined,
      rating: item.rating?.average || 0,
      reviews: item.rating?.count || 0,
      image: item.images?.[0]?.url || "https://placehold.co/400",
      colors: item.variants?.flatMap((v: any) => v.items.map((i: any) => i.value)) || [],
      tag: item.stockStatus === "Out of Stock" ? "SALE" : (item.additionalInfo?.isFeatured ? "HOT" : undefined),
      description: item.basicInfo.description,
      purchases: item.sold || 0
    }));
  }, [productsData]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_VIEW) || 1;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(0);
  };

  const handleOpenModal = (product: ProductData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  const currentProducts = products.slice(
    currentPage * ITEMS_PER_VIEW,
    (currentPage + 1) * ITEMS_PER_VIEW
  );

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-2">
            Recommended <span className="font-normal text-gray-500">by Swatbabymall</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {isCategoriesLoading ? (
             // Simple Skeleton for tabs
             Array.from({length: 4}).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
             ))
          ) : (
             tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary-green text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-dark-blue hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))
          )}
        </div>

        {/* Carousel Content */}
        <div className="relative flex items-center gap-4">
          
          {/* Left Controls */}
           <div className="hidden md:flex flex-col items-center gap-4 bg-gray-50 p-2 rounded-xl">
             <button 
               onClick={prevPage}
               className="p-1 rounded-full hover:bg-gray-200 transition-colors"
               disabled={totalPages <= 1}
             >
               <ChevronLeft className="w-5 h-5 text-gray-500" />
             </button>
             <VerticalPagination
                total={totalPages > 0 ? totalPages : 1}
                current={currentPage}
                onChange={setCurrentPage}
              />
              <button 
               onClick={nextPage}
               className="p-1 rounded-full hover:bg-gray-200 transition-colors"
               disabled={totalPages <= 1}
             >
               <ChevronRight className="w-5 h-5 text-gray-500" />
             </button>
           </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-hidden min-h-[420px]">
            <AnimatePresence mode="wait">
               {isProductsLoading || isFetching ? (
                   // Product Grid Skeleton
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                       {Array.from({length: ITEMS_PER_VIEW}).map((_, i) => (
                           <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse h-[380px]">
                               <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
                               <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                               <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
                               <div className="flex justify-between mt-auto">
                                   <div className="h-6 w-20 bg-gray-200 rounded" />
                                   <div className="h-8 w-8 bg-gray-200 rounded-full" />
                               </div>
                           </div>
                       ))}
                   </div>
               ) : (
                <motion.div
                    key={`${activeTab}-${currentPage}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full"
                >
                    {currentProducts.length > 0 ? currentProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onOpen={handleOpenModal}
                    />
                    )) : (
                        <div className="col-span-full flex flex-col items-center justify-center text-gray-400 h-64">
                             <p className="text-lg">No products found in this category.</p>
                        </div>
                    )}
                </motion.div>
               )}
            </AnimatePresence>
          </div>

           {/* Right Controls */}
           <div className="hidden md:flex flex-col items-center gap-4 bg-gray-50 p-2 rounded-xl">
               <button 
               onClick={prevPage}
               className="p-1 rounded-full hover:bg-gray-200 transition-colors"
               disabled={totalPages <= 1}
             >
               <ChevronLeft className="w-5 h-5 text-gray-500" />
             </button>
             <VerticalPagination
                total={totalPages > 0 ? totalPages : 1}
                current={currentPage}
                onChange={setCurrentPage}
              />
              <button 
               onClick={nextPage}
               className="p-1 rounded-full hover:bg-gray-200 transition-colors"
               disabled={totalPages <= 1}
             >
               <ChevronRight className="w-5 h-5 text-gray-500" />
             </button>
           </div>

        </div>
        
        {/* Mobile controls */}
        <div className="md:hidden flex justify-center gap-4 mt-8">
             <button onClick={prevPage} className="p-2 bg-gray-100 rounded-full"><ChevronLeft/></button>
             <span className="font-semibold text-gray-500">{currentPage + 1} / {totalPages || 1}</span>
             <button onClick={nextPage} className="p-2 bg-gray-100 rounded-full"><ChevronRight/></button>
        </div>

      </div>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default RecommendedSection;
