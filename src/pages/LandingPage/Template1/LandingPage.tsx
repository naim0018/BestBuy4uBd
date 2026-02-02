import { useNavigate } from "react-router-dom";
import { Button, Chip, Card, CardBody, Divider } from "@heroui/react";
import {
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Layout,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/types/Product/Product";
import { useCreateOrderMutation } from "@/store/Api/OrderApi";
import { toast } from "sonner";
import OrderSuccessModal from "../Template2/LandingPage/OrderSuccessModal";
import CheckoutSection from "../Template2/LandingPage/CheckoutSection";
import RelatedProducts from "../Components/RelatedProducts";
import AnimatedContainer from "@/common/Components/AnimatedContainer";
import DynamicBanner from "../Components/DynamicBanner";
import { useVariantQuantity } from "@/hooks/useVariantQuantity";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import VariantSelector from "../Components/VariantSelector";

const LandingPage = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  // Removed manual states for quantity/variants

  // Utilize new hooks
  const {
    selectedVariants,
    totalQuantity,
    addVariant,
    updateVariantQuantity,
    initVariants
  } = useVariantQuantity(product?.variants, product);

  // Initialize variants when product loads
  useEffect(() => {
    if (product?.variants) {
      initVariants(product.variants, product);
    }
  }, [product, initVariants]);

  // Use effective quantity (fallback to 1 if no variants? or 1 if totalQty is 0?)
  // Use totalQuantity directly as effectiveQuantity since base variant is now handled by hook
  const effectiveQuantity = totalQuantity;

  const {
      basePrice,
      variantTotal,
      comboDiscount,
      finalTotal,
      appliedComboTier
  } = usePriceCalculation(product, selectedVariants, effectiveQuantity);

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
      setCurrentImage(product.images[0]);
    }
  }, [product]);

  if (!product) {
      // ... existing error UI ...
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        {/* ... */}
         <Button onPress={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const {
    basicInfo,
    price,
    images,
    rating,
    stockStatus,
    additionalInfo,
    specifications,
  } = product;

  // regularPrice removed as unused if not needed for calculation logic here (used for display only)
  
  const avgRating = rating?.average || 0;
  const reviewCount = rating?.count || 0;

  const applyCoupon = () => {
    const availableCoupons: Record<string, number> = {
      FreeShippingDhaka: 80,
      FreeShippingBD: 150,
      BestBuy: 50,
    };
    if (availableCoupons[couponCode]) {
        setDiscount(availableCoupons[couponCode]);
        setAppliedCoupon({ code: couponCode, discount: availableCoupons[couponCode] });
        toast.success(`Applied: ${couponCode}`);
    } else {
        setDiscount(0);
        toast.error("Invalid coupon");
    }
  };

  const calculateTotalAmount = (
    courierChargeType: string | null,
    currentDiscount: number,
  ) => {
    const productTotal = finalTotal; // Hook result
    if (product.additionalInfo?.freeShipping) {
      return Math.max(0, productTotal - currentDiscount);
    }
    const chargeInside = product.basicInfo.deliveryChargeInsideDhaka ?? 80;
    const chargeOutside = product.basicInfo.deliveryChargeOutsideDhaka ?? 150;
    const deliveryCharge =
      courierChargeType === "insideDhaka" ? chargeInside : chargeOutside;
    const total = productTotal + deliveryCharge - currentDiscount;
    return total > 0 ? total : 0;
  };



  const handleSubmit = async (formData: any) => {
    try {
      const totalAmount = calculateTotalAmount(
        formData.courierCharge,
        discount,
      );
      
      // Transform variants for Order API
      // Group -> Items
      const variantsPayload: Record<string, any[]> = {};
      selectedVariants.forEach(sv => {
          if (!variantsPayload[sv.group]) variantsPayload[sv.group] = [];
          variantsPayload[sv.group].push({
              value: sv.item.value,
              price: sv.item.price,
              quantity: sv.quantity
          });
      });

      const orderData = {
        body: {
          items: [
            {
              product: product._id,
              image: currentImage?.url,
              quantity: effectiveQuantity,
              itemKey: `${product._id}-${Date.now()}`,
              price: finalTotal / effectiveQuantity, // Unit price
              selectedVariants: variantsPayload,
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
      // ... success handling ...
       setSuccessOrderDetails({
        orderId: (response as any).data._id,
        productPrice: finalTotal,
        deliveryCharge: product.additionalInfo?.freeShipping
          ? 0
          : formData.courierCharge === "insideDhaka"
            ? (product.basicInfo.deliveryChargeInsideDhaka ?? 80)
            : (product.basicInfo.deliveryChargeOutsideDhaka ?? 150),
        totalAmount: totalAmount,
        appliedCoupon: appliedCoupon,
      });
      setShowSuccessModal(true);
    } catch {
      toast.error("두ঃখিত! অর্ডার সম্পন্ন করা যায়নি।");
    }
  };
  
  const scrollToCheckout = () => {
     document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };
  
  const discountPercentage = product.price.regular > 0 && finalTotal < (product.price.regular * effectiveQuantity)
    ? Math.round(
        (((product.price.regular * effectiveQuantity) - finalTotal) /
          (product.price.regular * effectiveQuantity)) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ... Success Modal ... */}
       {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}
      
       <DynamicBanner
        title={basicInfo.title}
        regularPrice={price.regular}
        discountedPrice={finalTotal} // Dynamic Total
        onShopNow={scrollToCheckout}
        backgroundImage={images?.[0]?.url}
      />

       <div className="container mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:max-h-[80vh]">
          {/* ... Image Gallery (Unchanged mostly) ... */}
           <AnimatedContainer direction="right" className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group  max-h-[70vh]">
              {/* Image Logic... */}
              <img
                 src={images?.[selectedImage]?.url || "https://placehold.co/600x600?text=No+Image"}
                 alt={basicInfo?.title}
                 className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
               {/* Tags */}
               {additionalInfo?.isOnSale && discountPercentage > 0 && (
                <div className="absolute top-4 left-4">
                  <Chip color="danger" variant="shadow" size="lg" className="uppercase font-bold">
                    Sale {discountPercentage}% Off
                  </Chip>
                </div>
              )}
            </div>
             {/* Thumbs */}
             <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
               {images?.map((img, index) => (
                 <button
                   key={index}
                   onClick={() => setSelectedImage(index)}
                   className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                     selectedImage === index ? "border-primary-green shadow-md scale-105" : "border-gray-200 hover:border-gray-300"
                   }`}
                 >
                   <img src={img.url} alt="" className="w-full h-full object-cover" />
                 </button>
               ))}
             </div>
           </AnimatedContainer>

          {/* Right Column */}
          <AnimatedContainer direction="left" className="space-y-8">
            <div className="space-y-4">
                {/* Brand / Chips */}
                 <div className="flex items-center gap-2">
                    {basicInfo?.brand && <Chip size="sm" variant="flat" color="primary" className="uppercase font-semibold">{basicInfo.brand}</Chip>}
                    {stockStatus === "In Stock" ? (
                        <Chip size="sm" variant="flat" color="success" startContent={<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />}>In Stock</Chip>
                    ) : <Chip size="sm" variant="flat" color="danger">Out of Stock</Chip>}
                 </div>

                 <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {basicInfo?.title}
                 </h1>
                 
                 {/* Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-lg">{avgRating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-500">{reviewCount} Reviews</span>
                  </div>
            </div>

            <Divider className="my-6" />

            <div className="flex flex-col gap-6">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-primary-green">
                    ৳{finalTotal.toLocaleString()}
                  </span>
                  {price.regular > 0 && finalTotal < (price.regular * effectiveQuantity) && (
                    <div className="flex flex-col mb-1">
                      <span className="text-lg text-gray-400 line-through decoration-1">
                        ৳{(price.regular * effectiveQuantity).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                
                 {/* Price Breakdown */}
                  {(variantTotal > 0 || comboDiscount > 0) && (
                      <div className="text-sm text-gray-500 flex flex-col gap-1">
                          {price.regular > 0 && <span>Base ({effectiveQuantity}x): ৳{(basePrice * effectiveQuantity).toLocaleString()}</span>}
                          {variantTotal > 0 && <span>Variants: +৳{variantTotal.toLocaleString()}</span>}
                          {comboDiscount > 0 && <span className="text-primary-green font-bold">Combo Discount: -৳{comboDiscount.toLocaleString()}</span>}
                      </div>
                  )}


                  {/* Combo Pricing UI */}
                  {product.comboPricing && product.comboPricing.length > 0 && (
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 space-y-4">
                       <h3 className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Combo Savings
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.comboPricing.map((tier: any, idx: number) => {
                           const isApplied = appliedComboTier && appliedComboTier.minQuantity === tier.minQuantity;
                           return (
                              <div key={idx} className={`bg-white p-3 rounded-xl border flex justify-between items-center shadow-sm ${isApplied ? "border-blue-600 ring-1 ring-blue-600 bg-blue-50" : "border-blue-100"}`}>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Buy {tier.minQuantity}+</span>
                                <span className={`font-bold ${isApplied ? "text-blue-700" : "text-blue-600 opacity-80"}`}>-৳{tier.discount.toLocaleString()} OFF</span>
                              </div>
                           );
                        })}
                      </div>
                    </div>
                  )}

                {/* Variant Selection */}
            <div className="mb-8">
                <VariantSelector
                    selectedVariants={selectedVariants}
                    productVariants={product.variants}
                    onVariantAdd={(group, item) => {
                        addVariant(group, item);
                        if (item.image?.url) {
                            const imgIndex = images.findIndex((img: any) => img.url === item.image.url);
                            if (imgIndex !== -1) setSelectedImage(imgIndex);
                        }
                    }}
                    onVariantUpdate={updateVariantQuantity}
                    showBaseVariant={true}
                />
            </div>
            </div>
                        
             {/* Features Card (unchanged) */}
            {/* Quantity & Buy Now */}
            {/* Quantity & Buy Now - Simplified to just button since VariantSelector handles quantity */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">

                 
                 <div className="flex-1 flex gap-3">
                    <Button 
                        size="lg" 
                        color="primary" 
                        className={`flex-1 font-bold shadow-lg ${
                            totalQuantity === 0 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'text-white'
                        }`}
                        startContent={<ShoppingCart className="w-5 h-5" />} 
                        onPress={() => {
                            if (totalQuantity === 0) {
                                toast.error('Please select at least one variant with quantity greater than 0');
                                return;
                            }
                            scrollToCheckout();
                        }}
                        isDisabled={totalQuantity === 0 || stockStatus !== "In Stock"}
                    >
                        Buy Now - ৳{finalTotal.toLocaleString()}
                    </Button>
                 </div>
            </div>

            <div className="grid grid-cols-2 bg-gray-50 rounded-xl p-4 gap-4 border border-gray-100">
               {/* ... */}
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><Truck className="w-5 h-5 text-primary-green" /></div>
                  <div><p className="font-semibold text-sm">Free Delivery</p><p className="text-xs text-gray-500">Orders over ৳5000</p></div>
                 </div>
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><ShieldCheck className="w-5 h-5 text-primary-green" /></div>
                  <div><p className="font-semibold text-sm">Official Warranty</p><p className="text-xs text-gray-500">Available</p></div>
                 </div>
            </div>

          </AnimatedContainer>
        </div>
        {/* ... Info Sections ... */}

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
                  price: finalTotal,
                  variants: selectedVariants,
                  quantity: effectiveQuantity,
                  image: images?.[0],
                  product: product,
                  discount: discount,
                }}
                handleSubmit={handleSubmit}
                onQuantityChange={() => {}}
                onVariantChange={addVariant}
                onVariantUpdate={updateVariantQuantity}
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
