import { useState, useEffect } from "react";
import { Search, X, ChevronRight, SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  categories: any[];
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    search: string;
    stockStatus?: string;
  };
  setFilters: (filters: any) => void;
}

const FilterSidebar = ({ categories, filters, setFilters }: FilterSidebarProps) => {
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
      minPrice: 0,
      maxPrice: 1000000,
      search: "",
      page: 1,
      sort: "-createdAt"
    });
    setLocalSearch("");
    setPriceRange({ min: 0, max: 1000000 });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-green" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Filters</h2>
        </div>
        <button 
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-red transition-colors uppercase tracking-wider"
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
          className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-green/50 transition-all placeholder:text-slate-400 font-medium"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-green transition-colors" />
        {localSearch && (
          <button 
            onClick={() => setLocalSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-red"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Categories</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setFilters((prev: any) => ({ ...prev, category: "", page: 1 }))}
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${
              filters.category === "" 
              ? "bg-primary-green text-white shadow-lg shadow-primary-green/20" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span>All Categories</span>
            {filters.category === "" && <ChevronRight className="w-4 h-4" />}
          </button>
          {categories?.map((cat: any) => (
            <button
              key={cat._id}
              onClick={() => setFilters((prev: any) => ({ ...prev, category: cat.name, page: 1 }))}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                filters.category === cat.name 
                ? "bg-primary-green text-white shadow-lg shadow-primary-green/20 scale-[1.02]" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1"
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {filters.category === cat.name && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Price Range (৳)</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Min</label>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-white text-sm font-bold focus:ring-1 focus:ring-primary-green/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Max</label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-white text-sm font-bold focus:ring-1 focus:ring-primary-green/50"
            />
          </div>
        </div>
        <button
          onClick={handlePriceChange}
          className="w-full py-3 bg-dark-blue hover:bg-slate-800 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
        >
          Apply Price
        </button>
      </div>

      {/* Quick Filters */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Quick Filters</h3>
        <div className="flex flex-wrap gap-2">
            {[
                { label: 'In Stock', value: 'In Stock' },
            ].map((tag) => (
                <button
                    key={tag.value}
                    onClick={() => {
                        if (tag.value === 'In Stock') {
                            setFilters((prev: any) => ({ ...prev, stockStatus: prev.stockStatus === tag.value ? "" : tag.value, page: 1 }));
                        }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        filters.stockStatus === tag.value
                        ? "bg-primary-green/10 border-primary-green text-primary-green"
                        : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400"
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
