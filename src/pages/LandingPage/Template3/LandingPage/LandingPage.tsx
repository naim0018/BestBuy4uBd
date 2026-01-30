import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { clearCart } from "@/store/Slices/CartSlice";
import { useCreateOrderMutation } from "@/store/Api/OrderApi";
import { Product } from "@/types/Product/Product";
import { useGetHost } from "@/utils/useGetHost";
import AnimatedContainer from "../../Components/AnimatedContainer";
import CountdownTimer from "../Components/CountdownTimer";
import CheckoutSection from "../../Template2/LandingPage/CheckoutSection";
import OrderSuccessModal from "../../Template2/LandingPage/OrderSuccessModal";
import RelatedProducts from "../../Components/RelatedProducts";
import WhyBuyFromUs from "../Components/WhyBuyFromUs";
import VideoGallery from "../Components/VideoGallery";

const LandingPage = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const host = useGetHost();
  const [selectedVariants, setSelectedVariants] = useState<Map<string, any[]>>(
    new Map(),
  );
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

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
    if (product?.variants && selectedVariants.size === 0) {
      const defaults = new Map<string, any[]>();
      product.variants.forEach((vg) => {
        const name = vg.group.toLowerCase();
        const isPricing =
          name.includes("qty") ||
          name.includes("quantity") ||
          name.includes("টা") ||
          name.includes("প্যাকেজ");

        if (!isPricing && vg.items.length > 0) {
          defaults.set(vg.group, [vg.items[0]]);
        }
      });
      setSelectedVariants(defaults);
    }
  }, [product, selectedVariants]);
  console.log(selectedVariants, product.price.regular);
  // Sync Quantity with Selection
  // Sync Quantity with Selection
  useEffect(() => {

      
      // If we have distinct variant selections (e.g. Red, Blue), quantity should match
      // Note: We need to avoid counting "Size" if it's attached to "Color".
      // But structure is Map<Group, Items[]>. 
      // If I select Red (Color) and Large (Size), totalItems is 2. But Qty is 1.
      // Heuristic: Max count of any single group.
      let maxGroupSelection = 1;
      selectedVariants.forEach((items) => {
          if (items.length > maxGroupSelection) maxGroupSelection = items.length;
      });

      if (maxGroupSelection > 1) {
          setQuantity(maxGroupSelection);
      }

  }, [selectedVariants]);

  useEffect(() => {
    if (product) {
      const basePrice = product.price.discounted || product.price.regular;
      let totalVariantPrice = 0;
      let totalSelectedCount = 0;

      
      // Calculate total price based on selected variants
      selectedVariants.forEach((items, groupName) => {
        const name = groupName.toLowerCase();
        const isPricing =
          name.includes("qty") ||
          name.includes("quantity") ||
          name.includes("টা") ||
          name.includes("প্যাকেজ");

        items.forEach((item) => {
          totalSelectedCount++;
          if (item.price && item.price > 0) {
              if (isPricing) {
                  // For "Pricing" variants (like Pack of 2), the price is usually total
                  // We treat it as a unit price effectively for calculations if qty matches?
                  // Actually, let's treat item.price as the price contribution of this item
                  totalVariantPrice += item.price;
              } else {
                  // e.g. Color with price override
                  totalVariantPrice += item.price;
              }
          } else {
              // No specific price, add base price
              totalVariantPrice += basePrice;
          }
        });
      });

      // If no variants selected (shouldn't happen if defaults set), use base * qty
      if (totalSelectedCount === 0) {
        totalVariantPrice = basePrice * quantity;
      } else {
         // If user manually increased quantity beyond selected variants
         // e.g. Selected Red (1 item), but Qty is 2. We assume the second item is same configuration?
         // Or simple multiplier
         if (quantity > totalSelectedCount) {
             const avgPrice = totalVariantPrice / totalSelectedCount;
             totalVariantPrice += avgPrice * (quantity - totalSelectedCount);
         }
      }

      let finalTotal = 0;
      let usedComboPrice = false;

      // Check if there is a specific "Pricing Variant" selected that matches the current quantity
      // e.g. "Pack of 2" (qty 2) -> Price 650.
      let matchingComboVariantPrice = 0;

      selectedVariants.forEach((items, groupName) => {
          const name = groupName.toLowerCase();
          const isPricing =
            name.includes("qty") ||
            name.includes("quantity") ||
            name.includes("টা") ||
            name.includes("প্যাকেজ");

          if (isPricing) {
              items.forEach(item => {
                  // Only treat as combo override if it looks like a package deal
                  // Heuristic: If item name contains the number equal to quantity? 
                  // Or just trust the user selected the right one. 
                  // User rule: "if user select multiple variant or quantity if that quantity matches the Combo quantity then update the price to combo price"
                  // Actually, if "2 Ta" is selected, and Qty is 2.
                  // We should use 2 Ta price.
                  
                  // Extract number from variant name
                   const match = item.value.match(/\d+/);
                   const variantQty = match ? parseInt(match[0]) : 1;

                   if (variantQty === quantity && item.price && item.price > 0) {
                       matchingComboVariantPrice = item.price;
                       usedComboPrice = true;
                   }
              })
          }
      });

      if (usedComboPrice) {
          finalTotal = matchingComboVariantPrice;
      } else {
          // Fallback: Sum of selected non-pricing variants (e.g. Colors)
          // If I select Red (350), Black (350). Sum = 700.
          // If Qty is 2. Total should be 700.
          // If I select Red (350). Qty 2. Total 700.
          
          // Re-calculate sum of non-pricing variants
           let nonPricingVariantSum = 0;
           let nonPricingCount = 0;
           
           selectedVariants.forEach((items, groupName) => {
              const name = groupName.toLowerCase();
              const isPricing =
                name.includes("qty") ||
                name.includes("quantity") ||
                name.includes("টা") ||
                name.includes("প্যাকেজ");

              if (!isPricing) {
                  items.forEach(item => {
                     nonPricingCount++;
                     if (item.price && item.price > 0) {
                         // If variant price is set, use it. Is it Full Price or Surcharge?
                         // Screenshot shows "+350". Base is 410.
                         // But if user says "Product Price 350 and showing 700" earlier.
                         // This implies 350 IS the price.
                         // Let's assume item.price is the Unit Price for that variant.
                         nonPricingVariantSum += item.price;
                     } else {
                         nonPricingVariantSum += basePrice;
                     }
                  });
              }
           });
           
           if (nonPricingCount === 0) {
               finalTotal = basePrice * quantity;
           } else {
               // If we selected Red and Black (2 items), sum is 700.
               // If Qty is 2 -> Total 700.
               if (quantity === nonPricingCount) {
                   finalTotal = nonPricingVariantSum;
               } else if (quantity > nonPricingCount) {
                   // Extrapolate average
                   const avg = nonPricingVariantSum / nonPricingCount;
                   finalTotal = nonPricingVariantSum + (avg * (quantity - nonPricingCount));
               } else {
                   // quantity < selected count? (Shouldn't happen if auto-sync works)
                   // Just take average * qty
                   const avg = nonPricingVariantSum / nonPricingCount;
                   finalTotal = avg * quantity;
               }
           }
      }

      // Calculate Unit Price for display context (though we track Total usually)
      // CheckoutSection expects 'price' as Unit Price usually? 
      // User complaint: "2050". (410 * 5).
      // If I return Total here, CheckoutSection might multiply it again?
      // CheckoutSection logic: const base = currentPrice * quantity;
      // So 'currentPrice' MUST be Unit Price.
      
      let finalUnitPrice = finalTotal / (quantity || 1);
      
      setCurrentPrice(finalUnitPrice);
      setCurrentImage(product.images[0]);
    }
    return () => {
      if (product) dispatch(clearCart());
    };
  }, [product, quantity, selectedVariants, dispatch]);

  if (!product) return null;

  const handleVariantChange = (groupName: string, variant: any) => {
    const newVariants = new Map(selectedVariants);
    const currentItems = newVariants.get(groupName) || [];

    // Toggle selection
    const index = currentItems.findIndex((i) => i.value === variant.value);
    let updatedItems;
    if (index > -1) {
      updatedItems = currentItems.filter((i) => i.value !== variant.value);
    } else {
      updatedItems = [...currentItems, variant];
    }

    if (updatedItems.length === 0) {
      newVariants.delete(groupName);
    } else {
      newVariants.set(groupName, updatedItems);
    }

    if (variant.image?.url) {
      setCurrentImage(variant.image);
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
                Array.from(selectedVariants.entries()).map(([group, items]) => [
                  group,
                  items.map((i) => ({ value: i.value, price: i.price || 0 })),
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

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(img)}
                    className={`size-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      currentImage?.url === img.url
                        ? "border-green-600 ring-2 ring-green-300 scale-110"
                        : "border-gray-200 hover:border-green-400"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.basicInfo.title} thumb ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {/* Scroll to Video Link */}
                {product.videos && product.videos.length > 0 && (
                  <button
                    onClick={() =>
                      document
                        .getElementById("product-video")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="size-16 rounded-xl overflow-hidden border-2 border-green-200 bg-green-50 flex items-center justify-center hover:bg-green-100 transition-all group"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                      </svg>
                      <span className="text-[10px] font-bold text-green-600">
                        VIDEO
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.2}>
            <CountdownTimer days={3} />
          </AnimatedContainer>

          <AnimatedContainer direction="up" delay={0.3}>
            <div className="flex flex-col items-center gap-4 mt-4">
                <div className="flex flex-col items-center">
                    <span className="text-xl text-gray-400 line-through font-bold mb-1">
                      Start: ৳{product.price.regular.toLocaleString()}
                    </span>
                    <span className="text-4xl md:text-5xl font-black text-green-600">
                      Total: ৳{(currentPrice * quantity).toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-gray-500 mt-1">
                        (৳{currentPrice.toLocaleString()} / unit)
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
              {product.basicInfo.title}
            </h2>
          </div>
          <div className="bg-white p-6 md:p-10 rounded-b-2xl shadow-lg border-x border-b border-green-100">
            {product.basicInfo.description ? (
              <div
                className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-3 whitespace-pre-line [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>li]:mb-2"
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

            <div className="text-center mt-10 bg-green-100 py-4 rounded-xl border-2 border-dashed border-green-300">
              <h3 className="text-2xl md:text-4xl font-black text-green-700">
                {product.price.discounted || product.price.regular}
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
            <WhyBuyFromUs features={product.basicInfo.keyFeatures} />

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

      {/* Video Demonstration Section */}
      {product.videos && product.videos.length > 0 && (
        <div
          id="product-video"
          className="container mx-auto px-4 py-8 max-w-4xl"
        >
          <AnimatedContainer direction="up">
            <div className="bg-green-600 text-white p-4 rounded-t-2xl text-center">
              <h2 className="text-xl md:text-3xl font-black uppercase">
                Product Video Review
              </h2>
            </div>
            <div className="bg-white p-4 md:p-8 rounded-b-2xl shadow-lg border-x border-b border-green-100">
              <VideoGallery videos={product.videos} />
            </div>
          </AnimatedContainer>
        </div>
      )}

      {/* Contact Bar */}
      <div className="bg-green-600 text-white py-3 sticky top-0 z-40 mb-8 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg md:text-2xl font-black tracking-wide">
            যে কোন প্রয়োজনে যোগাযোগ করুন {host.phone || "01610403011"}
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
