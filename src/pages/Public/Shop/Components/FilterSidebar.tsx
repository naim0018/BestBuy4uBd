import { useState, useEffect } from "react";
import { useTracking } from "@/hooks/useTracking";
import { Search, X, ChevronRight, SlidersHorizontal, RotateCcw, Star, CheckCircle2 } from "lucide-react";
import { Slider } from "@heroui/react";

interface FilterSidebarProps {
  categories: any[];
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    search: string;
    stockStatus?: string;
    rating?: number;
  };
  setFilters: (filters: any) => void;
}

const FilterSidebar = ({ categories, filters, setFilters }: FilterSidebarProps) => {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [priceRange, setPriceRange] = useState({ min: filters.minPrice, max: filters.maxPrice });
  const { trackSearch, trackFilterApply } = useTracking();

  // Sync with props when resets or URL changes occur
  useEffect(() => {
    setLocalSearch(filters.search);
    setPriceRange({ min: filters.minPrice, max: filters.maxPrice });
  }, [filters.search, filters.minPrice, filters.maxPrice]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev: any) => ({ ...prev, search: localSearch, page: 1 }));
      if (localSearch) {
        trackSearch(localSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters, trackSearch]);

  const handlePriceChange = () => {
    trackFilterApply("price_range", `${priceRange.min}-${priceRange.max}`);
    setFilters((prev: any) => ({
      ...prev,
      minPrice: Number(priceRange.min),
      maxPrice: Number(priceRange.max),
      page: 1
    }));
  };

  const resetFilters = () => {
    trackFilterApply("reset", "all");
    setFilters({
      category: "",
      minPrice: 0,
      maxPrice: 100000,
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
            className={`flex items-center justify-between px-4 py-2.5 rounded-component transition-all duration-300 font-medium ${filters.category === ""
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
              onClick={() => {
                if (filters.category !== cat.name) trackFilterApply("category", cat.name);
                setFilters((prev: any) => ({ ...prev, category: cat.name, page: 1 }))
              }}
              className={`flex items-center justify-between px-4 py-2.5 rounded-component transition-all duration-300 font-medium ${filters.category === cat.name
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


      {/* Price Range */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pl-1">
          <h3 className="h6 uppercase tracking-widest">Price Range</h3>
          <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
            ৳{priceRange.min} - ৳{priceRange.max}
          </span>
        </div>
        
        <div className="px-1">
          <Slider
            label="Price"
            step={100}
            minValue={0}
            maxValue={100000}
            defaultValue={[filters.minPrice, filters.maxPrice]}
            value={[priceRange.min, priceRange.max]}
            onChange={(value: any) => setPriceRange({ min: value[0], max: value[1] })}
            onChangeEnd={() => handlePriceChange()}
            formatOptions={{ style: "currency", currency: "BDT" }}
            className="max-w-md"
            classNames={{
              base: "max-w-md",
              filler: "bg-secondary",
              thumb: [
                "after:bg-secondary",
                "after:shadow-lg",
                "after:shadow-secondary/20",
              ],
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="space-y-1.5">
            <label className="tag text-text-muted ml-1">Min</label>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              onBlur={handlePriceChange}
              className="w-full px-3 py-2 bg-bg-base border-none rounded-component text-text-primary text-xs font-semibold focus:ring-1 focus:ring-secondary/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="tag text-text-muted ml-1">Max</label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              onBlur={handlePriceChange}
              className="w-full px-3 py-2 bg-bg-base border-none rounded-component text-text-primary text-xs font-semibold focus:ring-1 focus:ring-secondary/50"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-4">
        <h3 className="h6 uppercase tracking-widest pl-1">By Rating</h3>
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => {
                const newVal = filters.rating === rating ? 0 : rating;
                if (newVal) trackFilterApply("rating", newVal.toString());
                setFilters((prev: any) => ({ ...prev, rating: newVal, page: 1 }))
              }}
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
        <h3 className="h6 uppercase tracking-widest pl-1">Availability</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: 'In Stock', value: 'In Stock', color: 'bg-success' },
            { label: 'Out of Stock', value: 'Out of Stock', color: 'bg-danger' },
            { label: 'Pre-order', value: 'Pre-order', color: 'bg-warning' }
          ].map((tag) => (
            <button
              key={tag.value}
              onClick={() => {
                const newVal = filters.stockStatus === tag.value ? "" : tag.value;
                if (newVal) trackFilterApply("stock_status", newVal);
                setFilters((prev: any) => ({ ...prev, stockStatus: newVal, page: 1 }));
              }}
              className={`flex items-center justify-between px-4 py-3 rounded-component border transition-all duration-300 ${
                filters.stockStatus === tag.value
                  ? "border-secondary bg-secondary/5 shadow-sm"
                  : "border-border-main hover:border-text-secondary bg-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                <span className={`text-sm font-medium ${
                  filters.stockStatus === tag.value ? "text-secondary" : "text-text-secondary"
                }`}>
                  {tag.label}
                </span>
              </div>
              {filters.stockStatus === tag.value && (
                <CheckCircle2 className="w-4 h-4 text-secondary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
