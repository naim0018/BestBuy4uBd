
import { Card, Badge, Button, Chip, Tooltip } from "@heroui/react";
import { Star, Eye, Edit } from "lucide-react";
import { ProductDisplay } from "./types";
import { formatPrice, getStatusColor } from "./utils";

interface CardViewProps {
  products: ProductDisplay[];
}

const CardView = ({ products }: CardViewProps) => {
  return (
    // Card View
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
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
  );
};

export default CardView;
