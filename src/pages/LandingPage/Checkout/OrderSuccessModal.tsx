
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

interface OrderDetails {
  orderId: string;
  productPrice: number;
  deliveryCharge: number;
  totalAmount: number;
  appliedCoupon?: {
    code: string;
    discount: number;
  };
}

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderDetails;
}

const OrderSuccessModal = ({ isOpen, onClose, orderDetails }: OrderSuccessModalProps) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#FFC107', '#2196F3']
      });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderDetails.orderId);
    setCopied(true);
    toast.info('অর্ডার আইডি কপি করা হয়েছে!');
    setTimeout(() => setCopied(false), 1000);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="z-50 fixed inset-0 w-full overflow-y-auto">
      <div className="flex justify-center items-center px-4 min-h-screen">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-gradient-to-br from-white to-green-50 shadow-2xl mx-auto p-10 border border-green-100 rounded-3xl w-full max-w-6xl">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex justify-center items-center bg-gradient-to-br from-green-400 to-green-600 shadow-lg rounded-full w-24 h-24 hover:scale-105 transition-transform duration-300 transform">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8 text-center">
            <h2 className="mb-4 font-bold text-gray-800 text-3xl">
              অর্ডার সফলভাবে সম্পন্ন হয়েছে!
            </h2>
            <p className="mb-8 text-gray-600 text-lg">
              আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। অনুগ্রহ করে অর্ডার আইডিটি সংরক্ষণ করুন।
            </p>

            {/* Order Details */}
            <div className="bg-white/80 shadow-inner backdrop-blur-sm mb-8 p-8 border border-green-100 rounded-xl">
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">অর্ডার আইডি:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-700">{orderDetails.orderId}</span>
                    <button
                      onClick={handleCopyOrderId}
                      className="hover:bg-green-100 p-2 rounded-full transition-colors"
                      title="Copy Order ID"
                    >
                      {copied ? (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">পণ্যের মূল্য:</span>
                  <span className="font-medium">৳{orderDetails.productPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ডেলিভারি চার্জ:</span>
                  <span className="font-medium">৳{orderDetails.deliveryCharge}</span>
                </div>
                {
                  orderDetails.appliedCoupon && orderDetails.appliedCoupon.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ডিস্কাউন্ট:</span>
                      <span className="font-medium">{orderDetails.appliedCoupon.code} : ৳{orderDetails.appliedCoupon.discount}</span>
                    </div>
                  )
                }
                <div className="flex justify-between pt-2 border-green-200 border-t font-bold text-green-700 text-lg">
                  <span>মোট মূল্য:</span>
                  <span>৳{orderDetails.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCopyOrderId}
              className="bg-gradient-to-r from-green-500 hover:from-green-600 to-green-600 hover:to-green-700 shadow-lg py-4 rounded-xl w-full font-medium text-white text-lg hover:scale-[1.02] transition-all duration-300 transform"
            >
              অর্ডার আইডি কপি করুন
            </button>
            <button
              onClick={onClose}
              className="bg-white hover:bg-gray-50 shadow-md py-4 border border-gray-200 rounded-xl w-full font-medium text-gray-700 text-lg hover:scale-[1.02] transition-all duration-300 transform"
            >
              ঠিক আছে
            </button>
            <button
              onClick={handleGoHome}
              className="bg-blue-50 hover:bg-blue-100 shadow-md py-4 border border-blue-200 rounded-xl w-full font-medium text-blue-700 text-lg hover:scale-[1.02] transition-all duration-300 transform"
            >
              হোম পেজে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
