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
import RelatedProducts from "../../Components/RelatedProducts";
import DynamicBanner from "../../Components/DynamicBanner";
import AnimatedContainer from "../../Components/AnimatedContainer";

const LandingPage = ({ product }: { product: Product }) => {
  const [selectedVariants, setSelectedVariants] = useState<Map<string, any[]>>(
    new Map()
  );
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isManualQty, setIsManualQty] = useState<boolean>(false);
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState<any>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  }>({ code: "", discount: 0 });
  const [discount, setDiscount] = useState<number>(0);


  const parseQty = (value: string) => {
    const match = value.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  };


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
    localStorage.setItem(
      "appliedCoupon",
      JSON.stringify({
        code: appliedCoupon.code,
        discount: appliedCoupon.discount,
      })
    );
  }, [appliedCoupon]);

  useEffect(() => {
    if (product?.variants && selectedVariants.size === 0) {
      const defaults = new Map<string, any[]>();
      product.variants.forEach(vg => {
        if (vg.items.length > 0) {
          defaults.set(vg.group, [vg.items[0]]);
        }
      });
      setSelectedVariants(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, selectedVariants]);

  // Sync Quantity with Selection
  useEffect(() => {
    if (!isManualQty) {
      let maxGroupSelection = 1;
      let pricingVariantQty = 1;
      let hasPricingVariant = false;

      selectedVariants.forEach((groupItems, groupName) => {
        const name = groupName.toLowerCase();
        const isPricing = name.includes("qty") || name.includes("quantity") || name.includes("টা") || name.includes("প্যাকেজ");
        
        if (isPricing) {
          groupItems.forEach(item => {
            pricingVariantQty *= parseQty(item.value);
            hasPricingVariant = true;
          });
        } else {
          if (groupItems.length > maxGroupSelection) {
            maxGroupSelection = groupItems.length;
          }
        }
      });

      if (hasPricingVariant) {
        setQuantity(Math.max(1, pricingVariantQty));
      } else {
        setQuantity(Math.max(1, maxGroupSelection));
      }
    }
  }, [selectedVariants, isManualQty]);


  useEffect(() => {
    if (product) {
      const regularPrice = product.price.regular;
      const discountedPrice = product.price.discounted || regularPrice;

      // Determine price per unit based on quantity and bulk pricing tiers
      let pricePerUnit = discountedPrice;

      // Check bulk pricing tiers (these are PER-UNIT prices)
      if (product.bulkPricing && product.bulkPricing.length > 0) {
        const sortedBulk = [...product.bulkPricing].sort((a, b) => b.minQuantity - a.minQuantity);
        const tier = sortedBulk.find(t => quantity >= t.minQuantity);
        if (tier) {
          pricePerUnit = tier.price; // This is the per-unit price for this tier
        }
      }

      // Set the per-unit price (will be multiplied by quantity in the UI)
      setCurrentPrice(pricePerUnit);
      setCurrentImage(product.images[0]);
    }
  }, [product, quantity, selectedVariants]);



  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-yellow-100 p-6 rounded-lg">
          <p className="text-yellow-700 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  // --- Variant Selection Logic ---
  const handleVariantSelect = (groupName: string, variant: any) => {
    const newSelectedVariants = new Map(selectedVariants);
    const currentItems = newSelectedVariants.get(groupName) || [];
    
    // Toggle selection
    const index = currentItems.findIndex(i => i.value === variant.value);
    let updatedItems;
    if (index > -1) {
      updatedItems = currentItems.filter(i => i.value !== variant.value);
    } else {
      updatedItems = [...currentItems, variant];
    }
    
    if (updatedItems.length === 0) {
        newSelectedVariants.delete(groupName);
    } else {
        newSelectedVariants.set(groupName, updatedItems);
    }

    // Image update: use variant image if available
    if (variant.image?.url) {
      setCurrentImage(variant.image);
    }
    
    setIsManualQty(false); // Reset to auto-sync when interacting with variants
    setSelectedVariants(newSelectedVariants);
  };

  // --- Quantity Logic ---
  const handleIncrement = () => {
      setIsManualQty(true);
      setQuantity((q) => q + 1);
  };
  const handleDecrement = () => {
      setIsManualQty(true);
      setQuantity((q) => (q > 1 ? q - 1 : 1));
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
    const deliveryCharge =
      courierChargeType === "insideDhaka" ? chargeInside : chargeOutside;
    const total = productTotal + deliveryCharge - currentDiscount;
    return total > 0 ? total : 0;
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
                  ([group, items]) => [
                    group,
                    items.map(i => ({ value: i.value, price: i.price || 0 }))
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
        currentPrice={currentPrice}
        setCurrentImage={setCurrentImage}
        selectedVariants={selectedVariants}
        handleVariantSelect={handleVariantSelect}
        quantity={quantity}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        scrollToCheckout={scrollToCheckout}
      />

      {/* Dynamic Banner */}
      <div className="my-12">
      <DynamicBanner
        title={product.basicInfo.title}
        regularPrice={product.price.regular}
        discountedPrice={currentPrice}
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
            selectedVariants={Object.fromEntries(selectedVariants)}
            currentPrice={currentPrice}
            currentImage={currentImage}
            quantity={quantity}
            onVariantChange={handleVariantSelect}
            onQuantityChange={setQuantity}
        />

        {/* Checkout Section Integration */}
        <AnimatedContainer direction="none" delay={0.1}>
            <div id="checkout" className="pt-20">
              <CheckoutSection
                orderDetails={{
                  title: product.basicInfo.title,
                  price: currentPrice,
                  variants: selectedVariants,
                  quantity: quantity,
                  image: product.images[0],
                  product: product,
                  discount: discount,
                }}
                handleSubmit={handleSubmit}
                onQuantityChange={setQuantity}
                onVariantChange={handleVariantSelect}
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
