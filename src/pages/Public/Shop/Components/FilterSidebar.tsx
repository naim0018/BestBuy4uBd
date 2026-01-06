import { useState, useEffect } from "react";
import { Search, X, ChevronRight, SlidersHorizontal, RotateCcw, Star } from "lucide-react";

interface FilterSidebarProps {
  categories: any[];
  brands: string[];
  filters: {
    category: string;
    brand: string;
    minPrice: number;
    maxPrice: number;
    search: string;
    stockStatus?: string;
    rating?: number;
  };
  setFilters: (filters: any) => void;
}

const FilterSidebar = ({ categories, brands, filters, setFilters }: FilterSidebarProps) => {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [priceRange, setPriceRange] = useState({ min: filters.minPrice, max: filters.maxPrice });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev: any) => ({ ...prev, search: localSearch, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters]);

  const handlePriceChange = () => {
    setFilters((prev: any) => ({ 
      ...prev, 
      minPrice: Number(priceRange.min), 
      maxPrice: Number(priceRange.max),
      page: 1 
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      brand: "",
      minPrice: 0,
      maxPrice: 1000000,
      search: "",
      page: 1,
      sort: "-createdAt",
      stockStatus: "",
      rating: 0,
    });
    setLocalSearch("");
    setPriceRange({ min: 0, max: 1000000 });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-semibold text-text-primary">Filters</h2>
        </div>
        <button 
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-danger transition-colors uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <input
          type="text"
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-bg-base border-none rounded-component text-text-primary focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-text-muted font-medium"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-secondary transition-colors" />
        {localSearch && (
          <button 
            onClick={() => setLocalSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-danger"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="h6 uppercase tracking-widest pl-1">Categories</h3>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          <button
            onClick={() => setFilters((prev: any) => ({ ...prev, category: "", page: 1 }))}
            className={`flex items-center justify-between px-4 py-2.5 rounded-component transition-all duration-300 font-medium ${
              filters.category === "" 
              ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
              : "text-text-secondary hover:bg-bg-base"
            }`}
          >
            <span className="text-sm">All Categories</span>
            {filters.category === "" && <ChevronRight className="w-4 h-4" />}
          </button>
          {categories?.map((cat: any) => (
            <button
              key={cat._id}
              onClick={() => setFilters((prev: any) => ({ ...prev, category: cat.name, page: 1 }))}
              className={`flex items-center justify-between px-4 py-2.5 rounded-component transition-all duration-300 font-medium ${
                filters.category === cat.name 
                ? "bg-secondary text-white shadow-lg shadow-secondary/20 scale-[1.02]" 
                : "text-text-secondary hover:bg-bg-base hover:translate-x-1"
              }`}
            >
              <span className="truncate text-sm">{cat.name}</span>
              {filters.category === cat.name && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-4">
        <h3 className="h6 uppercase tracking-widest pl-1">By Brands</h3>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {brands?.map((brand) => (
            <label key={brand} className="flex items-center gap-3 group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brand === brand}
                onChange={() => setFilters((prev: any) => ({ ...prev, brand: prev.brand === brand ? "" : brand, page: 1 }))}
                className="custom-checkbox"
              />
              <span className={`text-sm font-medium transition-colors ${filters.brand === brand ? "text-secondary font-semibold" : "text-text-secondary group-hover:text-text-primary"}`}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="h6 uppercase tracking-widest pl-1">By Price</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="tag text-text-muted ml-1">Min (৳)</label>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-bg-base border-none rounded-component text-text-primary text-sm font-semibold focus:ring-1 focus:ring-secondary/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="tag text-text-muted ml-1">Max (৳)</label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-bg-base border-none rounded-component text-text-primary text-sm font-semibold focus:ring-1 focus:ring-secondary/50"
            />
          </div>
        </div>
        <button
          onClick={handlePriceChange}
          className="w-full py-3 bg-text-primary hover:bg-text-primary/90 text-white rounded-component font-semibold transition-all active:scale-95 shadow-lg shadow-text-primary/10"
        >
          Go
        </button>
      </div>

      {/* Rating */}
      <div className="space-y-4">
        <h3 className="h6 uppercase tracking-widest pl-1">By Rating</h3>
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilters((prev: any) => ({ ...prev, rating: prev.rating === rating ? 0 : rating, page: 1 }))}
              className="flex items-center gap-3 group"
            >
              <div className={`w-4 h-4 rounded-inner border-2 transition-all ${filters.rating === rating ? "bg-secondary border-secondary" : "border-border-main group-hover:border-secondary"}`} />
              <div className="flex text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-current" : "text-text-muted/20"}`} />
                ))}
              </div>
              <span className="text-xs text-text-muted font-medium">({rating}.0 & Up)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div className="space-y-4">
        <h3 className="h6 uppercase tracking-widest pl-1">Stock Status</h3>
        <div className="flex flex-wrap gap-2">
            {[
                { label: 'In Stock', value: 'In Stock' },
                { label: 'Out of Stock', value: 'Out of Stock' },
                { label: 'Pre-order', value: 'Pre-order' }
            ].map((tag) => (
                <button
                    key={tag.value}
                    onClick={() => {
                        setFilters((prev: any) => ({ ...prev, stockStatus: prev.stockStatus === tag.value ? "" : tag.value, page: 1 }));
                    }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all uppercase tracking-wider ${
                        filters.stockStatus === tag.value
                        ? "bg-secondary/10 border-secondary text-secondary"
                        : "bg-transparent border-border-main text-text-muted hover:border-text-secondary"
                    }`}
                >
                    {tag.label}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
