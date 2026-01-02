"use client";

import { useState } from "react";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";
import {
  Card,
  Button,
  Input,
  Select,
  SelectItem,
  Pagination,
} from "@heroui/react";
import {
  Search,
  Grid,
  List,
  Package,
  DollarSign,
  TrendingDown,
  Star,
} from "lucide-react";
import TableView from "./TableView";
import CardView from "./CardView";
import { ProductDisplay } from "./types";
import { normalizeProduct } from "./utils";

const AllProduct = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data, isLoading, error } = useGetAllProductsQuery({
    page,
    limit,
  });

  // Extract meta data
  const meta = data?.meta || { page: 1, limit: 12, total: 0, totalPage: 1 };
  const apiProducts = data?.data || [];
  console.log(apiProducts);

  // Normalize products for display
  const products: ProductDisplay[] = apiProducts.map(normalizeProduct);

  // Get unique categories for filter
  const categories = [
    "all",
    ...Array.from(
      new Set(products.map((p: ProductDisplay) => p.basicInfo.category))
    ),
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2">Failed to load products</h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
    {/* Filters and Controls */}
      <Card className="p-4 mb-6 shadow-sm border-none bg-gray-50/50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={handleSearch}
              size="md"
              className="w-full"
              variant="bordered"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            {/* Category Filter */}
            <div className="w-full sm:w-48">
              <Select
                aria-label="Category"
                placeholder="Category"
                selectedKeys={[categoryFilter]}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                size="md"
                variant="bordered"
              >
                {categories.map((category) => (
                  <SelectItem key={category} textValue={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
              <Button
                isIconOnly
                variant={viewMode === "table" ? "flat" : "light"}
                onClick={() => setViewMode("table")}
                size="sm"
                color={viewMode === "table" ? "primary" : "default"}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                variant={viewMode === "card" ? "flat" : "light"}
                onClick={() => setViewMode("card")}
                size="sm"
                color={viewMode === "card" ? "primary" : "default"}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <h3 className="text-2xl font-bold">{meta.total}</h3>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <h3 className="text-2xl font-bold">
                {products.reduce(
                  (acc: number, p: ProductDisplay) => acc + p.sold,
                  0
                )}
              </h3>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <h3 className="text-2xl font-bold">
                {products.length > 0
                  ? (
                      products.reduce(
                        (acc: number, p: ProductDisplay) =>
                          acc + p.rating.average,
                        0
                      ) / products.length
                    ).toFixed(1)
                  : "0.0"}
              </h3>
            </div>
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Sale</p>
              <h3 className="text-2xl font-bold">
                {
                  products.filter(
                    (p: ProductDisplay) => p.additionalInfo.isOnSale
                  ).length
                }
              </h3>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Top Pagination and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500">
            Total {meta.total} Products
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">SHOW:</span>
            <Select
              size="sm"
              className="w-24"
              selectedKeys={[limit.toString()]}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              variant="flat"
            >
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} textValue={size.toString()}>
                  {size} items
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        
        {meta.totalPage > 1 && (
          <Pagination
            total={meta.totalPage}
            page={page}
            onChange={handlePageChange}
            showControls
            color="primary"
            size="sm"
            classNames={{
              cursor: "bg-primary",
            }}
          />
        )}
      </div>

      {/* Products Display */}
      <div className="min-h-[400px]">
        {viewMode === "table" ? (
          <TableView products={products} />
        ) : (
          <CardView products={products} />
        )}
      </div>

      {/* Bottom Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="text-sm text-gray-500">
          Showing {Math.min((page - 1) * limit + 1, meta.total)} to{" "}
          {Math.min(page * limit, meta.total)} of {meta.total} products
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              size="sm"
              className="w-24"
              selectedKeys={[limit.toString()]}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              variant="flat"
            >
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} textValue={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </Select>
          </div>

          {meta.totalPage > 1 && (
            <Pagination
              total={meta.totalPage}
              page={page}
              onChange={handlePageChange}
              showControls
              color="primary"
              size="sm"
              classNames={{
                cursor: "bg-primary",
              }}
            />
          )}
        </div>
      </div>


      {products.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">📦</div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? "No products match your search criteria"
              : "No products available in this category"}
          </p>
          {(searchTerm || categoryFilter !== "all") && (
            <Button
              className="mt-4"
              variant="flat"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default AllProduct;
