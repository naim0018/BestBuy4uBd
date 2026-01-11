import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@/store/Api/OrderApi";
import { clearCart } from "@/store/Slices/CartSlice";
import CommonWrapper from "@/common/CommonWrapper";
import { Truck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import OrderSuccessModal from "@/pages/LandingPage/Checkout/OrderSuccessModal";

interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  courierCharge: string;
}

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

  const [deliveryChargeType, setDeliveryChargeType] =
    useState<string>("insideDhaka");
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  }>({ code: "", discount: 0 });
  const [discount, setDiscount] = useState<number>(0);
  const [formValid, setFormValid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState<any>(null);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryCharge = deliveryChargeType === "insideDhaka" ? 80 : 150;
  const total = subtotal + deliveryCharge - discount;

  const handleDeliveryChargeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDeliveryChargeType(e.target.value);
  };

  const checkFormValidity = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (form) {
      const isValid = form.checkValidity();
      setFormValid(isValid);
    }
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;

    const formData: CheckoutFormData = {
      name: (target.elements.namedItem("name") as HTMLInputElement).value,
      phone: (target.elements.namedItem("phone") as HTMLInputElement).value,
      address: (target.elements.namedItem("address") as HTMLTextAreaElement)
        .value,
      notes: (target.elements.namedItem("notes") as HTMLTextAreaElement).value,
      courierCharge: (
        target.elements.namedItem("courierCharge") as HTMLSelectElement
      ).value,
    };

    try {
      const orderData = {
        body: {
          items: cartItems.map((item) => {
            // Convert selectedVariants array to object format
            const selectedVariantsObj =
              item.selectedVariants && item.selectedVariants.length > 0
                ? item.selectedVariants.reduce((acc: any, variant: any) => {
                    acc[variant.group] = {
                      value: variant.value,
                      price: variant.price || 0,
                    };
                    return acc;
                  }, {})
                : {};

            return {
              product: item.id,
              image: item.image,
              quantity: item.quantity,
              itemKey: item.itemKey,
              price: item.price,
              selectedVariants: selectedVariantsObj,
            };
          }),
          totalAmount: total,
          status: "pending",
          billingInformation: {
            name: formData.name,
            email: "no-email@example.com",
            phone: formData.phone,
            address: formData.address,
            country: "Bangladesh",
            paymentMethod: "cash on delivery",
            notes: formData.notes || "",
          },
          courierCharge: formData.courierCharge,
          cuponCode: appliedCoupon.code || "",
          discount: appliedCoupon.discount || 0,
        },
      };

      const response = await createOrder(orderData).unwrap();

      setSuccessOrderDetails({
        orderId: response.data._id,
        productPrice: subtotal,
        deliveryCharge: deliveryCharge,
        totalAmount: total,
        appliedCoupon: appliedCoupon,
      });

      setShowSuccessModal(true);
      dispatch(clearCart());

      // Reset form
      setCouponCode("");
      setAppliedCoupon({ code: "", discount: 0 });
      setDiscount(0);
    } catch (error: any) {
      console.error("Order Error:", error);
      toast.error(error.data?.message || "Sad! Order could not be completed.");
    }
  };

  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="card-container p-12 text-center max-w-md">
          <ShoppingBag className="w-20 h-20 text-text-muted mx-auto mb-6" />
          <h2 className="h4 mb-4">Your Cart is Empty</h2>
          <p className="text-text-secondary mb-6">
            Add some products to your cart before checking out.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-8 py-3 bg-secondary text-white rounded-component font-semibold shadow-lg shadow-secondary/20 uppercase tracking-widest text-xs hover:scale-105 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-bg-base pb-20 font-primary">
        {/* Header */}
        <div className="bg-bg-surface border-b border-border-main mb-8">
          <CommonWrapper className="py-6 px-4">
            <h1 className="h3 uppercase tracking-tighter">Checkout</h1>
            <p className="text-text-muted text-sm mt-2">
              Complete your order by filling in the details below
            </p>
          </CommonWrapper>
        </div>

        <CommonWrapper className="px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border-main">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Checkout Form */}
              <form
                onSubmit={handleFormSubmit}
                onChange={checkFormValidity}
                className="p-4 md:p-10 bg-white order-2 md:order-none"
              >
                {/* <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6 md:mb-8 flex items-center">
                  <span className="bg-secondary/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                  </span>
                  ডেলিভারি তথ্য
                </h2> */}

                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        নাম <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-border-main focus:border-secondary focus:ring-0 transition-colors bg-bg-base"
                        placeholder="আপনার পূর্ণ নাম"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        ফোন নাম্বার <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        pattern="01[2-9][0-9]{8}"
                        className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-border-main focus:border-secondary focus:ring-0 transition-colors bg-bg-base"
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      ঠিকানা <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-border-main focus:border-secondary focus:ring-0 transition-colors bg-bg-base"
                      placeholder="আপনার সম্পূর্ণ ঠিকানা"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-secondary/5 p-3 md:p-4 rounded-xl">
                      <label className="block text-text-primary font-medium mb-2">
                        ডেলিভারি এলাকা <span className="text-danger">*</span>
                      </label>
                      <select
                        name="courierCharge"
                        className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-secondary/20 focus:border-secondary focus:ring-0 transition-colors bg-white"
                        required
                        onChange={handleDeliveryChargeChange}
                        value={deliveryChargeType}
                      >
                        <option value="insideDhaka">ঢাকার ভিতরে (৳80)</option>
                        <option value="outsideDhaka">ঢাকার বাইরে (৳150)</option>
                      </select>
                    </div>

                    <div className="bg-secondary/5 p-3 md:p-4 rounded-xl">
                      <label className="block text-text-primary font-medium mb-2">
                        কুপন কোড{" "}
                        <span className="text-text-muted text-sm">
                          (ঐচ্ছিক)
                        </span>
                      </label>
                      <div className="flex gap-2 w-full">
                        <div className="relative w-full border-2 border-secondary/20 rounded-xl bg-white">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            name="cuponCode"
                            className="w-[70%] px-4 md:px-5 py-2 md:py-3 rounded-xl focus:border-secondary focus:ring-0 transition-colors bg-white"
                            placeholder="কুপন কোড"
                          />
                          <button
                            onClick={applyCoupon}
                            type="button"
                            className="px-3 md:px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors absolute right-1 top-1/2 transform -translate-y-1/2"
                          >
                            যাচাই করুন
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      অতিরিক্ত তথ্য{" "}
                      <span className="text-text-muted text-sm">(ঐচ্ছিক)</span>
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-border-main focus:border-secondary focus:ring-0 transition-colors bg-bg-base"
                      placeholder="যদি কোন বিশেষ নির্দেশনা থাকে"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formValid || isOrderLoading}
                  className={`w-full mt-6 md:mt-10 bg-gradient-to-r 
              ${
                formValid && !isOrderLoading
                  ? "from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary"
                  : "from-gray-400 to-gray-500 cursor-not-allowed"
              } 
              text-white py-3 md:py-4 rounded-xl text-base md:text-lg font-bold 
              transition-all duration-300 transform hover:scale-[1.02] 
              focus:ring-4 focus:ring-secondary/50 shadow-lg
              relative
            `}
                >
                  {isOrderLoading ? (
                    <>
                      <span className="opacity-0">অর্ডার কনফার্ম করুন</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    </>
                  ) : (
                    "অর্ডার কনফার্ম করুন"
                  )}
                </button>
              </form>

              {/* Order Summary Section */}
              <div className="p-4 md:p-10 bg-gradient-to-br from-secondary/5 via-white to-secondary/5">
                <h2 className="text-2xl font-bold text-text-primary mb-6 md:mb-8 flex items-center">
                  <span className="bg-secondary/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                  </span>
                  অর্ডার সামারি
                </h2>

                <div className="space-y-6 md:space-y-8">
                  {/* Cart Items */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.itemKey}
                        className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-20 object-cover rounded-xl"
                          />
                          <div className="absolute -top-2 -right-2 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-sm md:text-base text-text-primary line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-lg md:text-xl font-bold text-secondary mt-1">
                            ৳{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="text-text-muted">সাবটোটাল:</span>
                        <span className="font-medium">৳{subtotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="text-text-muted">ডেলিভারি চার্জ:</span>
                        <span className="font-medium">৳{deliveryCharge}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between items-center text-sm md:text-base text-secondary">
                          <span className="text-text-muted">
                            কুপন ডিসকাউন্ট:
                          </span>
                          <span className="font-medium">-৳{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center bg-secondary/10 p-3 md:p-4 rounded-xl">
                        <span className="text-base md:text-lg font-medium text-text-primary">
                          মোট মূল্য
                        </span>
                        <span className="text-xl md:text-2xl font-bold text-secondary">
                          ৳{total}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-6 md:mt-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4 md:mb-6 flex items-center">
                      <span className="bg-secondary/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4">
                        <Truck className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                      </span>
                      পেমেন্ট পদ্ধতি
                    </h2>
                    <div className="bg-secondary/10 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 md:h-6 md:w-6 text-secondary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-base md:text-lg font-medium text-text-primary">
                            ক্যাশ অন ডেলিভারি
                          </p>
                          <p className="text-xs md:text-sm text-text-muted">
                            পণ্য হাতে পেয়ে টাকা প্রদান করুন
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CommonWrapper>
      </div>

      {/* Success Modal */}
      {showSuccessModal && successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate("/");
          }}
          orderDetails={successOrderDetails}
        />
      )}
    </>
  );
};

export default Checkout;
