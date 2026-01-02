
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Tooltip,
  Badge,
} from "@heroui/react";
import { Eye, Edit, Trash2, Star } from "lucide-react";
import { ProductDisplay } from "./types";
import { formatPrice, getStatusColor } from "./utils";

interface TableViewProps {
  products: ProductDisplay[];
}

const TableView = ({ products }: TableViewProps) => {
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

  return (
    <div className="p-0 overflow-hidden border border-gray-100 rounded-lg">
      <Table
        aria-label="Products table"
        className="w-full"
        classNames={{
          wrapper: "p-0 shadow-none",
          th: "bg-gray-50 text-gray-600 font-medium",
          td: "py-3",
        }}
        selectionMode="multiple"
      >
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={products.map(renderTableRows)}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{item[columnKey as keyof typeof item]}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
