"use client";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../../store/Slices/CartSlice";
import { useCreateOrderMutation } from "../../../../store/Api/OrderApi";
import { toast } from "sonner";
import OrderSuccessModal from "./OrderSuccessModal";
import { FaHome } from "react-icons/fa";
import { Product } from "@/types/Product/Product";
import CheckoutSection from "./CheckoutSection";
import LandingPageProductDetails from "./DecomposedLandingPage Component/LandingPageProductDetails";
import LandingPageHeroSection from "./DecomposedLandingPage Component/LandingPageHeroSection";
import RelatedProducts from "../../Components/RelatedProducts";
import DynamicBanner from "../../Components/DynamicBanner";
import AnimatedContainer from "../../Components/AnimatedContainer";

const LandingPage = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const [selectedVariants, setSelectedVariants] = useState<Map<string, any>>(
    new Map()
  );
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
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
    localStorage.setItem(
      "appliedCoupon",
      JSON.stringify({
        code: appliedCoupon.code,
        discount: appliedCoupon.discount,
      })
    );
  }, [appliedCoupon]);

  useEffect(() => {
    if (product) {
      const initialPrice = product.price.discounted || product.price.regular;
      setCurrentPrice(
        typeof initialPrice === "number" && !isNaN(initialPrice)
          ? initialPrice
          : 0
      );
      setSelectedVariants(new Map());
      setCurrentImage(product.images[0]);
    }
    return () => {
      if (product) dispatch(clearCart());
    };
  }, [product, dispatch]);



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
    if (selectedVariants.get(groupName)?.value === variant.value) {
      newSelectedVariants.delete(groupName);
    } else {
      newSelectedVariants.set(groupName, {
        value: variant.value,
        price: variant.price,
        image: variant.image,
      });
    }

    // Price calculation: base + sum of variant prices
    let price = product.price.discounted || product.price.regular;
    newSelectedVariants.forEach((v) => {
      if (typeof v.price === "number" && !isNaN(v.price)) price = v.price;
    });
    setCurrentPrice(price);

    // Image update: last selected variant with image, else main image
    const lastWithImage = Array.from(newSelectedVariants.values())
      .reverse()
      .find((v) => v.image?.url);
    setCurrentImage(lastWithImage?.image || product.images[0]);
    setSelectedVariants(newSelectedVariants);
  };

  // --- Quantity Logic ---
  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

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

  // --- Order Logic ---
  const orderDetails = {
    title: product?.basicInfo?.title,
    price: currentPrice,
    variants: selectedVariants,
    quantity,
    image: currentImage,
    product,
    discount,
    totalAmount: calculateTotalAmount(null, discount),
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
      setQuantity(1);
      setSelectedVariants(new Map());
      setCurrentPrice(product.price.discounted || product.price.regular);
      setCurrentImage(product.images[0]);
      setCouponCode("");
      setAppliedCoupon({ code: "", discount: 0 });
      setDiscount(0);
    } catch (error: any) {
      toast.error(
        <div>
          <h3 className="font-bold">
            দুঃখিত! অর্ডার সম্পন্ন করা যায়নি।
          </h3>
          {error.data?.message && (
            <p className="text-sm mt-1">
              কারণ: {error.data.message}
            </p>
          )}
        </div>
      );
    }
  };

  // --- Scroll to Checkout ---
  const scrollToCheckout = () => {
    const checkoutSection = document.getElementById("checkout");
    if (checkoutSection) checkoutSection.scrollIntoView({ behavior: "smooth" });
  };

  // --- Helper: Savings ---
  const hasDiscount = !!(
    product.price.discounted && product.price.discounted < product.price.regular
  );
  const savings = hasDiscount
    ? product.price.regular - (product.price.discounted || 0)
    : 0;
  const savingsPercent = hasDiscount
    ? Math.round((savings / product.price.regular) * 100)
    : 0;

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-white">
      {/* Home Icon Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-full px-4 py-2 hover:bg-green-50 transition-colors"
          title="হোম পেজে যান"
        >
          <FaHome className="h-6 w-6 text-green-600" />
          <span className="hidden md:inline text-green-700 font-bold">হোম</span>
        </Link>
      </div>

      {/* Toast notifications are handled globally via Toaster in main.tsx */}

      <Helmet>
        <title>{product?.seo?.metaTitle || product?.basicInfo?.title}</title>
        <meta name="description" content={product?.seo?.metaDescription} />
        <meta name="slug" content={product?.seo?.slug} />
      </Helmet>

      {/* Dynamic Banner */}
      <DynamicBanner
        title={product.basicInfo.title}
        regularPrice={product.price.regular}
        discountedPrice={currentPrice}
        onShopNow={scrollToCheckout}
        backgroundImage={product.images?.[0]?.url}
      />

      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}

      {/* Hero Section with Product */}
      <AnimatedContainer>
        <LandingPageHeroSection
          product={product}
          currentImage={currentImage}
          currentPrice={currentPrice}
          setCurrentImage={setCurrentImage}
          quantity={quantity}
          handleVariantSelect={handleVariantSelect}
          selectedVariants={selectedVariants}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          scrollToCheckout={scrollToCheckout}
        />
      </AnimatedContainer>

      {/* Product Details Sections */}
      <LandingPageProductDetails
        product={product}
        currentPrice={currentPrice}
        currentImage={currentImage}
        selectedVariants={selectedVariants}
        quantity={quantity}
        hasDiscount={hasDiscount}
        savings={savings}
        savingsPercent={savingsPercent}
        scrollToCheckout={scrollToCheckout}
      />

      {/* Checkout Section */}
      <div className="bg-gray-50 py-16" id="checkout">
        <div className="container mx-auto px-4">
          <AnimatedContainer direction="none" delay={0.1}>
            <CheckoutSection
              orderDetails={orderDetails}
              handleSubmit={handleSubmit}
              onQuantityChange={setQuantity}
              onVariantChange={handleVariantSelect}
              isLoading={isOrderLoading}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              applyCoupon={applyCoupon}
            />
          </AnimatedContainer>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="container mx-auto px-4 pb-20">
        <AnimatedContainer delay={0.2}>
          <RelatedProducts category={product.basicInfo.category} currentProductId={product._id} />
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default LandingPage;
