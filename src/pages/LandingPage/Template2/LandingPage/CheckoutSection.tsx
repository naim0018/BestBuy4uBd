import React, { useState } from "react";
import { toast } from "sonner";

interface OrderDetails {
  title: string;
  variants: Map<string, any>;
  price: number;
  quantity: number;
  image?: { url: string; alt?: string };
  product?: any;
  discount?: number;
  totalAmount?: number;
}

interface CheckoutSectionProps {
  orderDetails: OrderDetails;
  handleSubmit: (formData: any) => void;
  onQuantityChange: (quantity: number) => void;
  onVariantChange: (groupName: string, variant: any) => void;
  isLoading?: boolean;
  couponCode?: string;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({
  orderDetails,
  handleSubmit,
  onQuantityChange,
  onVariantChange,
  isLoading,
  couponCode,
  setCouponCode,
  applyCoupon,
}) => {
  const { title, variants, price, quantity, image, product, discount } = orderDetails;
  const [formValid, setFormValid] = useState(false);
  const [deliveryChargeType, setDeliveryChargeType] = useState("insideDhaka");

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDeliveryChargeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeliveryChargeType(e.target.value);
  };

  const deliveryCharge = product?.additionalInfo?.freeShipping 
    ? 0 
    : (deliveryChargeType === "insideDhaka" 
        ? (product?.basicInfo?.deliveryChargeInsideDhaka ?? 80) 
        : (product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150));

  const calculateTotalPrice = () => {
    const subtotal = price * quantity;
    const total = subtotal + deliveryCharge - (discount || 0);
    return total > 0 ? total : 0;
  };

  const checkFormValidity = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (form) {
      const isValid = form.checkValidity();
      setFormValid(isValid);
    }
  };

  const handleButtonClick = () => {
    if (!formValid && !isLoading) {
      const form = document.querySelector('form');
      if (form) {
        const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement;
        const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
        const addressInput = form.querySelector('textarea[name="address"]') as HTMLTextAreaElement;

        if (!nameInput?.value) {
          return toast.warning("আপনার নাম প্রদান করুন");
        }
        if (!phoneInput?.value) {
          return toast.warning("আপনার ফোন নাম্বার প্রদান করুন");
        }
        if (phoneInput?.validity.patternMismatch) {
          return toast.warning("সঠিক ফোন নাম্বার প্রদান করুন (যেমন: 017XXXXXXXX)");
        }
        if (!addressInput?.value) {
          return toast.warning("আপনার ঠিকানা প্রদান করুন");
        }
        
        if (!form.checkValidity()) {
          return toast.warning("অনুগ্রহ করে সব তথ্য সঠিকভাবে পূরণ করুন");
        }
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid) {
      handleButtonClick();
      return;
    }
    const target = e.currentTarget;
    const formData = {
      name: (target.elements.namedItem("name") as HTMLInputElement).value,
      phone: (target.elements.namedItem("phone") as HTMLInputElement).value,
      address: (target.elements.namedItem("address") as HTMLTextAreaElement).value,
      notes: (target.elements.namedItem("notes") as HTMLTextAreaElement).value,
      paymentMethod: "cash on delivery",
      courierCharge: (target.elements.namedItem("courierCharge") as HTMLSelectElement).value,
      cuponCode: couponCode,
    };

    handleSubmit(formData);
  };

  return (
    <div id="checkout" className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Checkout Form */}
        <form onSubmit={handleFormSubmit} onChange={(e: any) => checkFormValidity(e)} className="p-4 md:p-10 bg-white order-2 md:order-none">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 flex items-center">
            <span className="bg-green-100 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            ডেলিভারি তথ্য
          </h2>

          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 transition-colors"
                  placeholder="আপনার পূর্ণ নাম"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  ফোন নাম্বার <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  pattern="01[2-9][0-9]{8}"
                  className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 transition-colors"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ঠিকানা <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                rows={3}
                className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 transition-colors"
                placeholder="আপনার সম্পূর্ণ ঠিকানা"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-green-50 p-3 md:p-4 rounded-xl">
                <label className="block text-gray-700 font-medium mb-2">
                  ডেলিভারি এলাকা <span className="text-red-500">*</span>
                </label>
                <select
                  name="courierCharge"
                  className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring-0 transition-colors bg-white"
                  required
                  onChange={handleDeliveryChargeChange}
                  value={deliveryChargeType}
                >
                  <option value="insideDhaka">ঢাকার ভিতরে (৳{product?.basicInfo?.deliveryChargeInsideDhaka ?? 80})</option>
                  <option value="outsideDhaka">ঢাকার বাইরে (৳{product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150})</option>
                </select>
                {product?.additionalInfo?.freeShipping && (
                  <p className="text-green-600 text-xs mt-1 font-bold italic">এই পণ্যটির জন্য শিপিং ফ্রি</p>
                )}
              </div>

              <div className="bg-green-50 p-3 md:p-4 rounded-xl">
                <label className="block text-gray-700 font-medium mb-2">
                  কুপন কোড <span className="text-gray-500 text-sm">(ঐচ্ছিক)</span>
                </label>
                <div className="flex gap-2 w-full">
                  <div className="relative w-full border-2 border-green-200 rounded-xl bg-white overflow-hidden">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      name="cuponCode"
                      className="w-full pr-24 px-4 md:px-5 py-2 md:py-3 rounded-xl focus:border-green-500 focus:ring-0 transition-colors bg-white"
                      placeholder="কুপন কোড"
                    />
                    <button 
                      onClick={applyCoupon} 
                      type="button" 
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors absolute right-1 top-1/2 transform -translate-y-1/2 text-sm font-bold"
                    >
                      যাচাই
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                অতিরিক্ত তথ্য <span className="text-gray-500 text-sm">(ঐচ্ছিক)</span>
              </label>
              <textarea
                name="notes"
                rows={2}
                className="w-full px-4 md:px-5 py-2 md:py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 transition-colors"
                placeholder="যদি কোন বিশেষ নির্দেশনা থাকে"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleButtonClick}
            disabled={isLoading}
            className={`w-full mt-6 md:mt-10 bg-gradient-to-r 
              ${!isLoading
                ? 'from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                : 'from-gray-400 to-gray-500 cursor-not-allowed'
              } 
              text-white py-3 md:py-4 rounded-xl text-base md:text-lg font-bold 
              transition-all duration-300 transform hover:scale-[1.02] 
              focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-lg
              relative
              ${!formValid ? 'opacity-90' : 'opacity-100'}
            `}
          >
            {isLoading ? (
              <>
                <span className="opacity-0">অর্ডার কনফার্ম করুন</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </>
            ) : (
              'অর্ডার কনফার্ম করুন'
            )}
          </button>
        </form>

        {/* Order Summary Section */}
        <div className="p-4 md:p-10 bg-gradient-to-br from-green-50 via-white to-green-50">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 flex items-center">
            <span className="bg-green-100 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            অর্ডার সামারি
          </h2>

          <div className="space-y-6 md:space-y-8">
            {/* Product Card */}
            <div className="flex flex-col xl:flex-row items-center gap-3 md:gap-6 p-3 md:p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className=" relative">
                <img
                  src={image?.url || "https://placehold.co/400x400?text=Product"}
                  alt={image?.alt || title}
                  className="size-40 mx-auto object-cover rounded-xl"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== "https://placehold.co/400x400?text=Product") {
                      target.src = "https://placehold.co/400x400?text=Product";
                    }
                  }}
                />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {quantity}
                </div>
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-2">{title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-xl md:text-2xl font-bold text-green-600">৳{price}</p>

                </div>
              </div>
            </div>

            {product?.variants && product.variants.length > 0 && (
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-base md:text-lg text-gray-800 mb-4">ভেরিয়েন্ট নির্বাচন করুন</h3>
                <div className="space-y-4 md:space-y-6">
                  {product.variants.map((variantGroup: any) => (
                    <div key={variantGroup.group}>
                      <p className="text-gray-700 font-medium mb-2">{variantGroup.group}</p>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {variantGroup.items.map((variant: any) => (
                          <button
                            key={variant.value}
                            onClick={() => onVariantChange(variantGroup.group, variant)}
                            className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                              variants.get(variantGroup.group)?.value === variant.value
                                ? 'bg-green-500 text-white shadow-lg transform scale-105'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                              }`}
                          >
                            {variant.value}
                            {variant.price > 0 && (
                              <span className="ml-1 md:ml-2 font-bold">+৳{variant.price}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base md:text-lg font-medium text-gray-700">পরিমাণ</span>
                <div className="flex items-center bg-green-50 rounded-xl border border-green-100">
                  <button
                    onClick={handleQuantityDecrease}
                    className={`w-8 md:w-10 h-8 md:h-10 rounded-l-xl flex items-center justify-center transition-all duration-200 ${
                      quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-green-600 hover:bg-green-100 active:scale-95'
                      }`}
                    disabled={quantity <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 md:h-5 w-4 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="w-12 text-center font-bold text-base md:text-lg border-x border-green-100 py-1.5">
                    {quantity}
                  </div>
                  <button
                    onClick={handleQuantityIncrease}
                    className="w-8 md:w-10 h-8 md:h-10 rounded-r-xl flex items-center justify-center text-green-600 hover:bg-green-100 active:scale-95 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 md:h-5 w-4 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="text-gray-600">সাবটোটাল:</span>
                  <span className="font-medium">৳{price * quantity}</span>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className={`font-medium ${product?.additionalInfo?.freeShipping ? 'text-green-600 line-through' : ''}`}>৳{deliveryChargeType === "insideDhaka" ? (product?.basicInfo?.deliveryChargeInsideDhaka ?? 80) : (product?.basicInfo?.deliveryChargeOutsideDhaka ?? 150)}</span>
                </div>
                {product?.additionalInfo?.freeShipping && (
                  <div className="flex justify-between items-center text-sm md:text-base text-green-600 font-bold italic">
                    <span>শিপিং:</span>
                    <span>ফ্রি</span>
                  </div>
                )}
                {(discount ?? 0) > 0 && (
                  <div className="flex justify-between items-center text-sm md:text-base text-green-600">
                    <span className="text-gray-600">কুপন ডিসকাউন্ট:</span>
                    <span className="font-medium">-৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center bg-green-50 p-3 md:p-4 rounded-xl">
                  <span className="text-base md:text-lg font-medium text-gray-700">মোট মূল্য</span>
                  <span className="text-xl md:text-2xl font-bold text-green-600">৳{calculateTotalPrice()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center">
                <span className="bg-green-100 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                পেমেন্ট পদ্ধতি
              </h2>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-medium text-gray-900">ক্যাশ অন ডেলিভারি</p>
                    <p className="text-xs md:text-sm text-gray-500">পণ্য হাতে পেয়ে টাকা প্রদান করুন</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;
