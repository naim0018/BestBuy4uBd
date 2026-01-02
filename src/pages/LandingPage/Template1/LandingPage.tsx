import { useNavigate } from "react-router-dom";
import {
  Button,
  Chip,
  Tabs,
  Tab,
  Card,
  CardBody,
  Divider,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/Product/Product";

const LandingPage = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button
          color="primary"
          variant="flat"
          startContent={<ArrowLeft className="w-4 h-4" />}
          onPress={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const {
    basicInfo,
    price,
    images,
    rating,
    stockStatus,
    stockQuantity,
    additionalInfo,
    tags,
    specifications,
  } = product;

  // Safe checks
  const regularPrice = price?.regular || 0;
  const discountedPrice = price?.discounted || regularPrice;

  const discountPercentage =
    regularPrice > discountedPrice
      ? Math.round(((regularPrice - discountedPrice) / regularPrice) * 100)
      : 0;

  const avgRating = rating?.average || 0;
  const reviewCount = rating?.count || 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumb & Back */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="light"
          startContent={<ArrowLeft className="w-4 h-4" />}
          onPress={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-black"
        >
          Back to Products
        </Button>
        <Breadcrumbs>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Products</BreadcrumbItem>
          <BreadcrumbItem>{basicInfo?.category}</BreadcrumbItem>
          <BreadcrumbItem className="text-primary-green font-medium">
            {basicInfo?.title}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
              <img
                src={images?.[selectedImage]?.url || "https://placehold.co/600x600?text=No+Image"}
                alt={basicInfo?.title}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== "https://placehold.co/600x600?text=No+Image") {
                    target.src = "https://placehold.co/600x600?text=No+Image";
                  }
                }}
              />
              {additionalInfo?.isOnSale && discountPercentage > 0 && (
                <div className="absolute top-4 left-4">
                  <Chip
                    color="danger"
                    variant="shadow"
                    size="lg"
                    className="uppercase font-bold"
                  >
                    Sale {discountPercentage}% Off
                  </Chip>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index
                      ? "border-primary-green shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img.url || "https://placehold.co/100x100?text=No+Image"}
                    alt={`${basicInfo?.title} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== "https://placehold.co/100x100?text=No+Image") {
                        target.src = "https://placehold.co/100x100?text=No+Image";
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="uppercase tracking-wider font-semibold"
                >
                  {basicInfo?.brand}
                </Chip>
                {stockStatus === "In Stock" ? (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="success"
                    startContent={
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
                    }
                  >
                    In Stock
                  </Chip>
                ) : (
                  <Chip size="sm" variant="flat" color="danger">
                    Out of Stock
                  </Chip>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {basicInfo?.title}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-lg">
                    {avgRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 underline decoration-dotted cursor-pointer hover:text-primary-green transition">
                  {reviewCount} Reviews
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{product.sold || 0} Sold</span>
              </div>
            </div>

            <Divider className="my-6" />

            {/* Price & Quantity */}
            <div className="space-y-6">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-primary-green">
                  ৳{discountedPrice.toLocaleString()}
                </span>
                {regularPrice > discountedPrice && (
                  <div className="flex flex-col mb-1">
                    <span className="text-lg text-gray-400 line-through decoration-1">
                      ৳{regularPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl h-12 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 hover:text-primary-green transition"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(stockQuantity || 99, quantity + 1))
                    }
                    className="px-4 hover:text-primary-green transition"
                    disabled={quantity >= (stockQuantity || 99)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 flex gap-3">
                  <Button
                    size="lg"
                    color="primary"
                    className="flex-1 font-bold text-white shadow-lg shadow-primary-green/20"
                    startContent={<ShoppingCart className="w-5 h-5" />}
                    isDisabled={stockStatus !== "In Stock"}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    isIconOnly
                    size="lg"
                    variant="bordered"
                    className="border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button
                    isIconOnly
                    size="lg"
                    variant="bordered"
                    className="border-gray-200 text-gray-600 hover:text-blue-500 hover:border-blue-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Features/Services */}
            <div className="grid grid-cols-2 bg-gray-50 rounded-xl p-4 gap-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Truck className="w-5 h-5 text-primary-green" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Free Delivery</p>
                  <p className="text-xs text-gray-500">Orders over ৳5000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <RotateCcw className="w-5 h-5 text-primary-green" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Return Policy</p>
                  <p className="text-xs text-gray-500">30 days return</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-primary-green" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Warranty</p>
                  <p className="text-xs text-gray-500">1 Year Official</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag, i) => (
                  <Chip
                    key={i}
                    size="sm"
                    variant="flat"
                    className="text-gray-500 bg-gray-100"
                  >
                    #{tag}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section for Description/Specs */}
        <div className="mt-16">
          <Tabs
            aria-label="Product Details"
            color="primary"
            variant="underlined"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary-green",
              tab: "max-w-fit px-0 h-12",
              tabContent:
                "group-data-[selected=true]:text-primary-green font-semibold text-lg",
            }}
          >
            <Tab key="description" title="Description">
              <Card className="shadow-none border border-gray-100 mt-6 bg-gray-50/50">
                <CardBody className="p-6 md:p-8">
                  <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                    {basicInfo?.description}
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="specifications" title="Specifications">
              <Card className="shadow-none border border-gray-100 mt-6">
                <CardBody className="p-0">
                  {specifications && specifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 p-6 md:p-8">
                      {specifications.map((specGroup, idx) => (
                        <div key={idx}>
                          <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            {specGroup.group}
                          </h3>
                          <ul className="space-y-3">
                            {specGroup.items.map((item, i) => (
                              <li
                                key={i}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-500 font-medium">
                                  {item.name}
                                </span>
                                <span className="text-gray-900 font-semibold text-right">
                                  {item.value}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No specifications available.
                    </div>
                  )}
                </CardBody>
              </Card>
            </Tab>
            <Tab key="reviews" title={`Reviews (${reviewCount})`}>
              <Card className="shadow-none border border-gray-100 mt-6">
                <CardBody className="p-8 text-center">
                  <p className="text-gray-500">
                    Reviews functionality coming soon...
                  </p>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
