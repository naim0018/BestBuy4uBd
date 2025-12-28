"use client";

import { useState } from "react";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";
import type { Product as ApiProduct } from "@/types/Product/Product"; // Import with alias
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Button,
  Input,
  Select,
  SelectItem,
  Pagination,
  Badge,
  Chip,
  Tooltip,
} from "@heroui/react";
import {
  Search,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Star,
  Package,
  DollarSign,
  TrendingDown,
} from "lucide-react";

// Local interface with safe defaults
interface ProductDisplay {
  _id: string;
  basicInfo: {
    title: string;
    productCode: string;
    brand: string;
    category: string;
    description: string;
  };
  price: {
    regular: number;
    discounted: number;
  };
  stockStatus: string;
  stockQuantity: number;
  sold: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  rating: {
    average: number;
    count: number;
  };
  additionalInfo: {
    freeShipping: boolean;
    isFeatured: boolean;
    isOnSale: boolean;
  };
  createdAt: string;
  tags: string[];
}

// Helper function to safely convert API product to display product
const normalizeProduct = (apiProduct: ApiProduct): ProductDisplay => {
  return {
    _id: apiProduct._id || "",
    basicInfo: {
      title: apiProduct.basicInfo?.title || "No Title",
      productCode: apiProduct.basicInfo?.productCode || "N/A",
      brand: apiProduct.basicInfo?.brand || "No Brand",
      category: apiProduct.basicInfo?.category || "Uncategorized",
      description: apiProduct.basicInfo?.description || "",
    },
    price: {
      regular: apiProduct.price?.regular || 0,
      discounted: apiProduct.price?.discounted || 0,
    },
    stockStatus: apiProduct.stockStatus || "Unknown",
    stockQuantity: apiProduct.stockQuantity || 0,
    sold: apiProduct.sold || 0,
    images: apiProduct.images || [],
    rating: {
      average: apiProduct.rating?.average || 0,
      count: apiProduct.rating?.count || 0,
    },
    additionalInfo: {
      freeShipping: apiProduct.additionalInfo?.freeShipping || false,
      isFeatured: apiProduct.additionalInfo?.isFeatured || false,
      isOnSale: apiProduct.additionalInfo?.isOnSale || false,
    },
    createdAt: apiProduct.createdAt || "",
    tags: apiProduct.tags || [],
  };
};

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "success";
      case "Out of Stock":
        return "danger";
      default:
        return "warning";
    }
  };

  const tableColumns = [
    { key: "image", label: "Product" },
    { key: "title", label: "Name" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "sales", label: "Sales" },
    { key: "rating", label: "Rating" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderTableRows = (product: ProductDisplay) => ({
    key: product._id,
    image: (
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={product.images[0]?.url || "/placeholder-product.jpg"}
          alt={product.images[0]?.alt || product.basicInfo.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-product.jpg";
          }}
        />
      </div>
    ),
    title: (
      <div className="flex flex-col">
        <p className="font-medium text-sm line-clamp-1">
          {product.basicInfo.title}
        </p>
        <p className="text-xs text-gray-500">{product.basicInfo.productCode}</p>
        <p className="text-xs text-gray-400">{product.basicInfo.brand}</p>
      </div>
    ),
    price: (
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-medium">
            {formatPrice(product.price.discounted)}
          </span>
          {product.price.discounted < product.price.regular && (
            <span className="text-xs line-through text-gray-500">
              {formatPrice(product.price.regular)}
            </span>
          )}
        </div>
        {product.price.discounted < product.price.regular && (
          <Chip size="sm" color="danger" variant="flat">
            Save {formatPrice(product.price.regular - product.price.discounted)}
          </Chip>
        )}
      </div>
    ),
    stock: (
      <div className="flex flex-col">
        <span className="font-medium">{product.stockQuantity}</span>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-full rounded-full ${
              product.stockQuantity > 20
                ? "bg-green-500"
                : product.stockQuantity > 5
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    ),
    sales: (
      <div className="flex flex-col">
        <span className="font-medium">{product.sold}</span>
        <span className="text-xs text-gray-500">Units sold</span>
      </div>
    ),
    rating: (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="font-medium">{product.rating.average.toFixed(1)}</span>
        <span className="text-xs text-gray-500">
          ({product.rating.count} reviews)
        </span>
      </div>
    ),
    status: (
      <div className="flex flex-col gap-1">
        <Badge
          color={getStatusColor(product.stockStatus)}
          variant="flat"
          size="sm"
        >
          {product.stockStatus}
        </Badge>
        {product.additionalInfo.isFeatured && (
          <Badge color="secondary" variant="flat" size="sm">
            Featured
          </Badge>
        )}
        {product.additionalInfo.isOnSale && (
          <Badge color="danger" variant="flat" size="sm">
            Sale
          </Badge>
        )}
      </div>
    ),
    actions: (
      <div className="flex gap-2">
        <Tooltip content="View Details">
          <Button isIconOnly size="sm" variant="light">
            <Eye className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Edit Product">
          <Button isIconOnly size="sm" variant="light" color="primary">
            <Edit className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Delete">
          <Button isIconOnly size="sm" variant="light" color="danger">
            <Trash2 className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    ),
  });

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
      {/* Header */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your products and inventory ({meta.total} total)
          </p>
        </div>
        <Button color="primary" size="lg">
          + Add New Product
        </Button>
      </div> */}

      {/* Filters and Controls */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search products by name, code, or brand..."
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={handleSearch}
              size="lg"
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <Select
              label="Category"
              placeholder="All Categories"
              selectedKeys={[categoryFilter]}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              size="lg"
            >
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant={viewMode === "table" ? "solid" : "light"}
              onClick={() => setViewMode("table")}
              size="lg"
            >
              <List className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant={viewMode === "card" ? "solid" : "light"}
              onClick={() => setViewMode("card")}
              size="lg"
            >
              <Grid className="w-5 h-5" />
            </Button>
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

      {/* Products Display */}
      {viewMode === "table" ? (
        // Table View
        <Card className="p-0 overflow-hidden">
          <Table
            aria-label="Products table"
            className="w-full"
            classNames={{
              wrapper: "p-0",
              th: "bg-gray-50",
            }}
            selectionMode="multiple"
          >
            <TableHeader columns={tableColumns}>
              {(column: any) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={products.map(renderTableRows)}>
              {(item: any) => (
                <TableRow key={item.key}>
                  {(columnKey: any) => (
                    <TableCell>
                      {item[columnKey as keyof typeof item]}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: ProductDisplay) => (
            <Card
              key={product._id}
              className="p-4 hover:shadow-lg transition-shadow border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.images[0]?.url || "/placeholder-product.jpg"}
                  alt={product.images[0]?.alt || product.basicInfo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-product.jpg";
                  }}
                />
                {product.additionalInfo.isOnSale && (
                  <div className="absolute top-2 left-2">
                    <Badge color="danger" size="lg">
                      SALE
                    </Badge>
                  </div>
                )}
                {product.additionalInfo.freeShipping && (
                  <div className="absolute top-2 right-2">
                    <Badge color="success" size="lg">
                      FREE SHIPPING
                    </Badge>
                  </div>
                )}
                {product.additionalInfo.isFeatured && (
                  <div className="absolute bottom-2 left-2">
                    <Badge color="secondary" size="sm">
                      FEATURED
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-2 text-sm">
                    {product.basicInfo.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.basicInfo.category} • {product.basicInfo.brand}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {product.basicInfo.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">
                      {formatPrice(product.price.discounted)}
                    </span>
                    {product.price.discounted < product.price.regular && (
                      <span className="text-sm line-through text-gray-500 ml-2">
                        {formatPrice(product.price.regular)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">
                      {product.rating.average.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <Badge
                    color={getStatusColor(product.stockStatus)}
                    variant="flat"
                  >
                    {product.stockStatus}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Stock: {product.stockQuantity}
                  </span>
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <Chip key={index} size="sm" variant="flat">
                        {tag}
                      </Chip>
                    ))}
                    {product.tags.length > 3 && (
                      <Tooltip content={`+${product.tags.length - 3} more`}>
                        <Chip size="sm" variant="flat">
                          +{product.tags.length - 3}
                        </Chip>
                      </Tooltip>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="light"
                    fullWidth
                    startContent={<Eye className="w-4 h-4" />}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    fullWidth
                    startContent={<Edit className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPage > 1 && (
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
          <Pagination
            total={meta.totalPage}
            page={page}
            onChange={handlePageChange}
            showControls
            color="primary"
            classNames={{
              cursor: "bg-primary",
            }}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              size="sm"
              className="w-20"
              selectedKeys={[limit.toString()]}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              {[12, 24, 36, 48].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* Footer Info */}
      {products.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-6">
          Showing {Math.min((page - 1) * limit + 1, meta.total)} to{" "}
          {Math.min(page * limit, meta.total)} of {meta.total} products
        </div>
      )}

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
