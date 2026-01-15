import { useNavigate } from "react-router-dom";
import {
  Button,
  Chip,
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ArrowLeft,
  Layout,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/types/Product/Product";
import { useCreateOrderMutation } from "@/store/Api/OrderApi";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/Slices/CartSlice";
import { toast } from "sonner";
import OrderSuccessModal from "../Template2/LandingPage/OrderSuccessModal";
import CheckoutSection from "../Template2/LandingPage/CheckoutSection";
import RelatedProducts from "../Components/RelatedProducts";
import AnimatedContainer from "../Components/AnimatedContainer";
import DynamicBanner from "../Components/DynamicBanner";

const LandingPage = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Map<string, any>>(
    new Map()
  );
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<any>(null);

  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState<any>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  }>({
    code: "",
    discount: 0,
  });
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    if (product) {
      const initialPrice = product.price.discounted || product.price.regular;
      setCurrentPrice(initialPrice);
      setCurrentImage(product.images[0]);
    }
    return () => {
      if (product) dispatch(clearCart());
    };
  }, [product, dispatch]);

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
    specifications,
  } = product;

  const regularPrice = price?.regular || 0;
  const discountedPrice = price?.discounted || regularPrice;
  const discountPercentage =
    regularPrice > discountedPrice
      ? Math.round(((regularPrice - discountedPrice) / regularPrice) * 100)
      : 0;

  const avgRating = rating?.average || 0;
  const reviewCount = rating?.count || 0;

  const applyCoupon = () => {
    const availableCoupons: Record<string, number> = {
      FreeShippingDhaka: 80,
      FreeShippingBD: 150,
      BestBuy: 50,
    };

    if (availableCoupons[couponCode]) {
      const newDiscount = availableCoupons[couponCode];
      setDiscount(newDiscount);
      setAppliedCoupon({ code: couponCode, discount: newDiscount });
      toast.success(`Successfully applied coupon: ${couponCode}`);
    } else {
      setDiscount(0);
      setAppliedCoupon({ code: "", discount: 0 });
      toast.error("Invalid coupon code.");
    }
  };

  const calculateTotalAmount = (
    courierChargeType: string | null,
    currentDiscount: number
  ) => {
    const productTotal = currentPrice * quantity;
    if (product.additionalInfo?.freeShipping) {
      return Math.max(0, productTotal - currentDiscount);
    }
    const chargeInside = product.basicInfo.deliveryChargeInsideDhaka ?? 80;
    const chargeOutside = product.basicInfo.deliveryChargeOutsideDhaka ?? 150;
    const deliveryCharge = courierChargeType === "insideDhaka" ? chargeInside : chargeOutside;
    const total = productTotal + deliveryCharge - currentDiscount;
    return total > 0 ? total : 0;
  };

  const handleVariantChange = (groupName: string, variant: any) => {
    const newVariants = new Map(selectedVariants);
    if (newVariants.get(groupName)?.value === variant.value) {
      newVariants.delete(groupName);
    } else {
      newVariants.set(groupName, variant);
    }

    let price = product.price.discounted || product.price.regular;
    newVariants.forEach((v) => {
      if (v.price) price = v.price;
    });
    setCurrentPrice(price);

    if (variant.image?.url) {
      const imgIndex = images.findIndex((img) => img.url === variant.image.url);
      if (imgIndex !== -1) setSelectedImage(imgIndex);
    }

    setSelectedVariants(newVariants);
  };

  const handleSubmit = async (formData: any) => {
    try {
      const totalAmount = calculateTotalAmount(
        formData.courierCharge,
        discount
      );
      const orderData = {
        body: {
          items: [
            {
              product: product._id,
              image: currentImage?.url,
              quantity,
              itemKey: `${product._id}-${Date.now()}`,
              price: currentPrice,
              selectedVariants: Object.fromEntries(
                Array.from(selectedVariants.entries()).map(
                  ([group, variant]) => [
                    group,
                    { value: variant.value, price: variant.price || 0 },
                  ]
                )
              ),
            },
          ],
          totalAmount: totalAmount,
          status: "pending",
          billingInformation: {
            name: formData.name,
            email: formData.email || "no-email@example.com",
            phone: formData.phone,
            address: formData.address,
            country: "Bangladesh",
            paymentMethod: formData.paymentMethod,
            notes: formData.notes || "",
          },
          courierCharge: formData.courierCharge,
          cuponCode: appliedCoupon.code || "",
          discount: appliedCoupon.discount || 0,
        },
      };

      const response = await createOrder(orderData).unwrap();
      setSuccessOrderDetails({
        orderId: (response as any).data._id,
        productPrice: currentPrice * quantity,
        deliveryCharge: product.additionalInfo?.freeShipping ? 0 : (formData.courierCharge === "insideDhaka" ? (product.basicInfo.deliveryChargeInsideDhaka ?? 80) : (product.basicInfo.deliveryChargeOutsideDhaka ?? 150)),
        totalAmount: totalAmount,
        appliedCoupon: appliedCoupon,
      });
      setShowSuccessModal(true);
    } catch {
      toast.error("দুঃখিত! অর্ডার সম্পন্ন করা যায়নি।");
    }
  };

  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white pb-20">

      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}

      {/* Dynamic Banner */}
      <DynamicBanner
        title={basicInfo.title}
        regularPrice={price.regular}
        discountedPrice={currentPrice}
        onShopNow={scrollToCheckout}
        backgroundImage={images?.[0]?.url}
      />

      {/* Breadcrumb & Back */}
      {/* <AnimatedContainer direction="down" delay={0.1}>
        <div className="container mx-auto px-4 py-8">
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
      </AnimatedContainer> */}

      <div className="container mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Image Gallery */}
          <AnimatedContainer direction="right" className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
              <img
                src={
                  images?.[selectedImage]?.url ||
                  "https://placehold.co/600x600?text=No+Image"
                }
                alt={basicInfo?.title}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (
                    target.src !== "https://placehold.co/600x600?text=No+Image"
                  ) {
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
                    src={
                      img.url || "https://placehold.co/100x100?text=No+Image"
                    }
                    alt={`${basicInfo?.title} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (
                        target.src !==
                        "https://placehold.co/100x100?text=No+Image"
                      ) {
                        target.src =
                          "https://placehold.co/100x100?text=No+Image";
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          </AnimatedContainer>

          {/* Right Column: Product Details */}
          <AnimatedContainer direction="left" className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {basicInfo?.brand && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="uppercase tracking-wider font-semibold"
                  >
                    {basicInfo?.brand}
                  </Chip>
                )}
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
                <span className="text-gray-500">{reviewCount} Reviews</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{product.sold || 0} Sold</span>
              </div>
            </div>

            <Divider className="my-6" />

            <div className="space-y-6">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-primary-green">
                  ৳{(currentPrice || discountedPrice).toLocaleString()}
                </span>
                {regularPrice > currentPrice && (
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
                    onPress={scrollToCheckout}
                  >
                    Buy Now
                  </Button>
                  <Button
                    isIconOnly
                    size="lg"
                    variant="bordered"
                    className="border-gray-200 text-gray-600 hover:text-red-500"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Features Card */}
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
                  <ShieldCheck className="w-5 h-5 text-primary-green" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Official Warranty</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </div>

        {/* Flattened Information Sections */}
        <div className="mt-20 space-y-16">
          {/* Description */}
          {basicInfo?.description && (
            <AnimatedContainer>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg text-primary-green">
                    <Layout className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Product Description
                  </h2>
                </div>
                <Card className="shadow-none border border-gray-100 bg-gray-50/30">
                  <CardBody className="p-8">
                    <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                      {basicInfo?.description}
                    </div>
                  </CardBody>
                </Card>
              </section>
            </AnimatedContainer>
          )}

          {/* Specifications */}
          {specifications && specifications.length > 0 && (
            <AnimatedContainer delay={0.1}>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg text-primary-green">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Technical Specifications
                  </h2>
                </div>
                <Card className="shadow-none border border-gray-100">
                  <CardBody className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 p-8">
                      {specifications.map((specGroup, idx) => (
                        <div key={idx}>
                          <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            {specGroup.group}
                          </h3>
                          <ul className="space-y-3">
                            {specGroup.items.map((item, i) => (
                              <li
                                key={i}
                                className="flex justify-between text-sm py-1"
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
                  </CardBody>
                </Card>
              </section>
            </AnimatedContainer>
          )}

          {/* Reviews placeholder */}
          {reviewCount > 0 && (
            <AnimatedContainer delay={0.2}>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg text-primary-green">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Customer Reviews ({reviewCount})
                  </h2>
                </div>
                <Card className="shadow-none border border-gray-100 p-12 text-center bg-gray-50/50">
                  <p className="text-gray-500 italic">
                    No reviews yet. Be the first to review this product!
                  </p>
                </Card>
              </section>
            </AnimatedContainer>
          )}

          {/* Checkout Section */}
          <AnimatedContainer direction="none" delay={0.3}>
            <div id="checkout" className="pt-10">
              <CheckoutSection
                orderDetails={{
                  title: basicInfo.title,
                  price: currentPrice,
                  variants: selectedVariants,
                  quantity: quantity,
                  image: images?.[0],
                  product: product,
                  discount: discount,
                }}
                handleSubmit={handleSubmit}
                onQuantityChange={setQuantity}
                onVariantChange={handleVariantChange}
                isLoading={isOrderLoading}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                applyCoupon={applyCoupon}
              />
            </div>
          </AnimatedContainer>

          {/* Related Products */}
          <AnimatedContainer>
            <RelatedProducts
              category={basicInfo?.category}
              currentProductId={product._id}
            />
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
