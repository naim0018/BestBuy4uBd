import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tabs, products } from "./data";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import VerticalPagination from "./VerticalPagination";
import { ProductData } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const RecommendedSection = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter products based on active tab
  const filteredProducts = useMemo(() => {
    // For demo purposes, we do some simple filtering.
    // In a real app this would query a backend or filter a larger list.
    const filtered = products.filter((p) => {
        const tabValue = tabs.find(t => t.id === activeTab)?.value;
        return p.category === tabValue || (activeTab === tabs[0].id); 
    });
    // If filtered is empty (e.g. no products for that category in mock), show all for demo
    return filtered.length > 0 ? filtered : products.slice(0, 3); 
  }, [activeTab]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(0);
  };

  const handleOpenModal = (product: ProductData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % (totalPages || 1));
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + (totalPages || 1)) % (totalPages || 1));

  // Get current page items
  const currentItems = filteredProducts.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
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
          {tabs.map((tab) => (
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
          ))}
        </div>

        {/* Carousel Content */}
        <div className="relative flex items-center gap-4">
          
          {/* Left Vertical Pagination / Controls */}
           <div className="hidden md:flex flex-col items-center gap-4 bg-gray-50 p-2 rounded-xl">
             <button 
               onClick={prevPage}
               className="p-1 rounded-full hover:bg-gray-200 transition-colors"
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
             >
               <ChevronRight className="w-5 h-5 text-gray-500" />
             </button>
           </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-hidden min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${currentPage}`} // Key change triggers animation
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 h-full"
              >
                {currentItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={handleOpenModal}
                  />
                ))}
                {currentItems.length === 0 && (
                     <div className="col-span-full flex items-center justify-center text-gray-400 h-64">
                         No products found.
                     </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

           {/* Right Spacer (for visual balance if needed, or we can duplicate controls) */}
           <div className="hidden md:flex flex-col items-center gap-4 w-12 p-2">
                {/* Optional: Add same controls here if "vertical dot pagination" implies checking both sides 
                    The image showed pagination bars on left and right possibly. 
                    I'll implement dual controls if requested, but for now single left side is safer UX unless specified.
                    Actually, looking at the image, there are gray bars on BOTH sides.
                    I will replicate the Right side bar too.
                */}
                <button 
               onClick={prevPage}
               className="p-1 rounded-full hover:bg-gray-200 transition-colors"
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
