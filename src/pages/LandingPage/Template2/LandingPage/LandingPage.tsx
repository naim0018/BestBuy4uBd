"use client";

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useCreateOrderMutation } from "../../../../store/Api/OrderApi";
import { toast } from "sonner";
import OrderSuccessModal from "./OrderSuccessModal";
import { Product } from "@/types/Product/Product";
import CheckoutSection from "./CheckoutSection";
import LandingPageProductDetails from "./DecomposedLandingPage Component/LandingPageProductDetails";
import LandingPageHeroSection from "./DecomposedLandingPage Component/LandingPageHeroSection";
import { useVariantQuantity } from "@/hooks/useVariantQuantity";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import RelatedProducts from "../../Components/RelatedProducts";
import DynamicBanner from "../../Components/DynamicBanner";
import AnimatedContainer from "../../Components/AnimatedContainer";

const LandingPage = ({ product }: { product: Product }) => {
  // Hooks
  const {
    selectedVariants,
    totalQuantity,
    addVariant,
    updateVariantQuantity,
    initVariants
  } = useVariantQuantity(product?.variants, product);

  useEffect(() => {
    if (product?.variants) {
      initVariants(product.variants, product);
    }
  }, [product, initVariants]);

  const effectiveQuantity = totalQuantity;

  const {
      finalTotal
  } = usePriceCalculation(product, selectedVariants, effectiveQuantity);

  const [currentImage, setCurrentImage] = useState<any>(null);
  
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState<any>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  }>({ code: "", discount: 0 });
  const [discount, setDiscount] = useState<number>(0);



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

  useEffect(() => {
    if (product) {
      setCurrentImage(product.images[0]);
    }
  }, [product]);

  const handleIncrement = () => {
       // Manual increment handling removed in favor of VariantSelector
  };
  const handleDecrement = () => {
       // Manual decrement handling removed in favor of VariantSelector
  };



  const calculateTotalAmount = (
    courierChargeType: string | null,
    currentDiscount: number
  ) => {
    const productTotal = finalTotal;
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
      // Validate quantity
      if (totalQuantity === 0) {
        toast.error('Please select at least one variant with quantity greater than 0');
        return;
      }

      const totalAmount = calculateTotalAmount(
        formData.courierCharge,
        discount
      );

      // Transform variants for Order API
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
      toast.error("দুঃখিত! অর্ডার সম্পন্ন করা যায়নি।");
    }
  };

  const scrollToCheckout = () => {
    const el = document.getElementById("checkout");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-yellow-100 p-6 rounded-lg">
          <p className="text-yellow-700 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
       <Helmet>
        <title>{product.basicInfo.title} | BestBuy4U</title>
        <meta name="description" content={product.basicInfo.description} />
      </Helmet>

      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}

      {/* Hero Section */}
      <LandingPageHeroSection
        product={product}
        currentImage={currentImage}
        currentPrice={finalTotal}
        setCurrentImage={setCurrentImage}
        selectedVariants={selectedVariants}
        handleVariantSelect={addVariant}
        quantity={effectiveQuantity}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        scrollToCheckout={scrollToCheckout}
      />

      {/* Dynamic Banner */}
      <div className="my-12">
      <DynamicBanner
        title={product.basicInfo.title}
        regularPrice={product.price.regular}
        discountedPrice={finalTotal}
        onShopNow={scrollToCheckout}
        backgroundImage={product.images[0]?.url}
      />
      </div>

       {/* Navigation Bar */}
       <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex gap-8">
              {["Features", "Specifications", "Description", "Reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => document.getElementById(tab.toLowerCase())?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors uppercase tracking-wider"
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
               onClick={scrollToCheckout}
               className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all uppercase tracking-widest"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Product Information Sections */}
      <div className="container mx-auto px-4 py-12 space-y-24">
        <LandingPageProductDetails 
            product={product} 
            selectedVariants={selectedVariants}
            currentPrice={finalTotal}
            currentImage={currentImage}
            quantity={effectiveQuantity}
            onVariantChange={addVariant}
            onQuantityChange={() => {}}
        />

        {/* Checkout Section Integration */}
        <AnimatedContainer direction="none" delay={0.1}>
            <div id="checkout" className="pt-20">
              <CheckoutSection
                orderDetails={{
                  title: product.basicInfo.title,
                  price: finalTotal,
                  variants: selectedVariants,
                  quantity: effectiveQuantity,
                  image: product.images[0],
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
          <div className="pt-20">
             <RelatedProducts currentProductId={product._id} category={product.basicInfo.category} />
          </div>
      </div>

      {/* Floating Order Button for Mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] md:hidden">
         <button
            onClick={scrollToCheckout}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-2xl shadow-green-200 border-2 border-white/20 backdrop-blur-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
         >
            <span className="animate-pulse w-2 h-2 bg-white rounded-full" />
            অর্ডার করতে চাই
         </button>
      </div>
    </div>
  );
};

export default LandingPage;
