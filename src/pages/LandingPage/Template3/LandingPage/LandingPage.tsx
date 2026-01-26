import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { clearCart } from "@/store/Slices/CartSlice";
import { useCreateOrderMutation } from "@/store/Api/OrderApi";
import { Product } from "@/types/Product/Product";
import AnimatedContainer from "../../Components/AnimatedContainer";
import CountdownTimer from "../Components/CountdownTimer";
import CheckoutSection from "../../Template2/LandingPage/CheckoutSection";
import OrderSuccessModal from "../../Template2/LandingPage/OrderSuccessModal";
import RelatedProducts from "../../Components/RelatedProducts";

const LandingPage = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Map<string, any>>(
    new Map(),
  );
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  }>({ code: "", discount: 0 });
  const [discount, setDiscount] = useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState<any>(null);

  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (product) {
      setCurrentPrice(product.price.discounted || product.price.regular);
      setCurrentImage(product.images[0]);
    }
    return () => {
      if (product) dispatch(clearCart());
    };
  }, [product, dispatch]);

  if (!product) return null;

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
      const img = product.images.find((i) => i.url === variant.image.url);
      if (img) setCurrentImage(img);
    }

    setSelectedVariants(newVariants);
  };

  const applyCoupon = () => {
    const availableCoupons: Record<string, number> = {
      SAVE10: 50,
      WELCOME: 100,
    };

    if (availableCoupons[couponCode]) {
      const disc = availableCoupons[couponCode];
      setDiscount(disc);
      setAppliedCoupon({ code: couponCode, discount: disc });
      toast.success(`Coupon ${couponCode} applied!`);
    } else {
      setDiscount(0);
      setAppliedCoupon({ code: "", discount: 0 });
      toast.error("Invalid coupon code.");
    }
  };

  const calculateTotal = (courierCharge: string | null) => {
    const base = currentPrice * quantity;
    if (product.additionalInfo?.freeShipping) {
      return Math.max(0, base - discount);
    }
    const chargeInside = product.basicInfo.deliveryChargeInsideDhaka ?? 80;
    const chargeOutside = product.basicInfo.deliveryChargeOutsideDhaka ?? 150;
    const shipping =
      courierCharge === "insideDhaka" ? chargeInside : chargeOutside;
    return Math.max(0, base + shipping - discount);
  };

  const handleSubmit = async (formData: any) => {
    try {
      const total = calculateTotal(formData.courierCharge);
      const orderData = {
        body: {
          items: [
            {
              product: product._id,
              image: currentImage?.url,
              quantity,
              price: currentPrice,
              itemKey: `${product._id}-${Date.now()}`,
              selectedVariants: Object.fromEntries(
                Array.from(selectedVariants.entries()).map(([g, v]) => [
                  g,
                  { value: v.value, price: v.price || 0 },
                ]),
              ),
            },
          ],
          totalAmount: total,
          status: "pending",
          billingInformation: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            email: formData.email || "no-email@example.com",
            country: "Bangladesh",
            paymentMethod: "cod",
          },
          courierCharge: formData.courierCharge,
          cuponCode: appliedCoupon.code,
          discount: appliedCoupon.discount,
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
        totalAmount: total,
        appliedCoupon: appliedCoupon,
      });
      setShowSuccessModal(true);
    } catch (err: any) {
      toast.error(err.data?.message || "Order failed");
    }
  };

  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-primary text-gray-900 pb-20">
      {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )}

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <AnimatedContainer direction="down">
            <h1 className="text-2xl md:text-4xl font-black text-green-700 mb-6 leading-tight">
              {product.basicInfo.title}
            </h1>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.1}>
            <div className="relative group max-w-xl mx-auto mb-8">
              <div className="aspect-square rounded-[1.5rem] overflow-hidden border-6 border-green-600 shadow-xl bg-white p-1.5">
                <img
                  src={
                    currentImage?.url ||
                    "https://placehold.co/800x800?text=No+Image"
                  }
                  alt={product.basicInfo.title}
                  className="w-full h-full object-cover rounded-[1rem]"
                />
              </div>
            </div>
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.2}>
            <CountdownTimer days={3} />
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.3}>
            <div className="flex flex-col items-center gap-4 mt-4">
              <div className="flex items-center gap-4">
                <span className="text-xl text-gray-400 line-through font-bold">
                  ৳{product.price.regular.toLocaleString()}
                </span>
                <span className="text-4xl md:text-5xl font-black text-red-600">
                  ৳
                  {product.price.discounted?.toLocaleString() ||
                    product.price.regular.toLocaleString()}
                </span>
              </div>

              <button
                onClick={scrollToCheckout}
                className="bg-green-600 hover:bg-green-700 text-xl md:text-2xl font-black py-4 px-10 rounded-xl shadow-[0_6px_0_0_#000] hover:shadow-[0_4px_0_0_#000] transition-all duration-200 active:translate-y-1 active:shadow-none mt-4 animate-pulse text-gray-800"
              >
                অর্ডার করতে চাই
              </button>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* Why Buy Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <AnimatedContainer direction="left">
          <div className="bg-green-600 text-white p-4 rounded-t-2xl text-center">
            <h2 className="text-xl md:text-3xl font-black uppercase">
              {product.basicInfo.title} কেন খাবেন?
            </h2>
          </div>
          <div className="bg-white p-6 md:p-10 rounded-b-2xl shadow-lg border-x border-b border-green-100">
            {product.basicInfo.description ? (
              <div
                className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{
                  __html: product.basicInfo.description,
                }}
              />
            ) : (
              <div className="grid gap-3">
                {product.basicInfo.keyFeatures?.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100 italic font-medium"
                  >
                    <span className="text-green-600 text-xl font-bold">✔</span>
                    <span className="text-base text-green-900">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-10 bg-gray-100 py-4 rounded-xl border-2 border-dashed border-green-300">
              <h3 className="text-2xl md:text-3xl font-black text-green-700">
                ১ কেজি ৯০০ টাকা মাত্র
              </h3>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={scrollToCheckout}
                className="bg-green-600 hover:bg-green-700 text-lg md:text-xl font-black py-3 px-8 rounded-lg shadow-md transition-all"
              >
                অর্ডার করতে চাই
              </button>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Why Buy From Us */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AnimatedContainer direction="right">
          <div className="bg-green-600 text-white p-4 rounded-t-2xl text-center">
            <h2 className="text-xl md:text-3xl font-black uppercase">
              আমাদের কাছে কেন কিনবেন?
            </h2>
          </div>
          <div className="bg-white p-6 md:p-10 rounded-b-2xl shadow-lg border-x border-b border-green-100 space-y-4">
            {[
              "আজওয়াই বিচি এই খোরমার বেশ স্বাস্থ্যকর হিসেবে পরিচিত",
              "আমাদের খেজুর এ কোনো প্রকার ঝামেলা বা উপায় নেই",
              "সারা বাংলাদেশে ৭২ ঘণ্টায় হোম ডেলিভারি করা হয়",
              "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা",
              "পণ্য হাতে পাওয়ার পর মূল্য পরিশোধ করার সুবিধা",
              "আমাদের কাছে কোনো প্রোডাক্টের বা সেবার মানের সম্পূর্ণ নিশ্চয়তা রয়েছে",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-base font-bold text-green-800"
              >
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0 shadow-sm text-xs">
                  {i + 1}
                </div>
                <p className="text-sm md:text-base">{text}</p>
              </div>
            ))}

            <div className="mt-8 rounded-2xl overflow-hidden border-4 border-green-600 shadow-xl">
              <img
                src={product.images[0]?.url}
                alt="Quality assurance"
                className="w-full h-auto"
              />
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Contact Bar */}
      <div className="bg-green-600 text-white py-3 sticky top-0 z-40 mb-8 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg md:text-2xl font-black tracking-wide">
            যে কোন প্রয়োজনে যোগাযোগ করুন 01610403011
          </p>
        </div>
      </div>

      {/* Checkout Section Integration */}
      <div id="checkout" className="container mx-auto px-4 max-w-5xl">
        <AnimatedContainer direction="none" delay={0.1}>
          <div className="bg-white rounded-[2rem] shadow-xl border border-green-100 overflow-hidden">
            <div className="bg-green-50 py-8 text-center border-b border-green-100">
              <h2 className="text-2xl md:text-4xl font-black text-green-700 px-4">
                অর্ডার করতে নিচের ফর্মটি পূরণ করুন
              </h2>
            </div>

            <div className="p-3 md:p-8">
              <CheckoutSection
                orderDetails={{
                  title: product.basicInfo.title,
                  price: currentPrice,
                  variants: selectedVariants,
                  quantity: quantity,
                  image: currentImage,
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
          </div>
        </AnimatedContainer>
      </div>

      {/* Related Products */}
      <div className="container mx-auto px-4 py-20">
        <RelatedProducts
          category={product.basicInfo.category}
          currentProductId={product._id}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-100 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p>Copyright © 2026 BestBuy4uBd</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
