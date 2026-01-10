// PromoBannerModal.tsx
import React, { useState } from "react";

interface PromoBannerModalProps {
  onClose?: () => void;
  isVisible?: boolean;
}

const PromoBannerModal: React.FC<PromoBannerModalProps> = ({
  onClose = () => {},
  isVisible = true,
}) => {
  const [promoCode, setPromoCode] = useState("SWAT100FF");

  if (!isVisible) return null;

  return (
    <div
      className="relative w-full bg-yellow-300 py-3 px-4 shadow-md z-50"
      role="banner"
      aria-label="Promotional offer banner"
    >
      {/* Close button (always top-right, even on mobile) */}
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-gray-800 hover:text-gray-900 focus:outline-none"
        aria-label="Close promotional banner"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Flex container that stacks on mobile, rows on larger screens */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Product Info */}
        <div className="text-center sm:text-left">
          <h2 className="font-bold text-lg md:text-xl text-gray-800">
            Convertible Cribs
          </h2>
          <p className="text-sm text-gray-700 mt-1">Otto 3-in-1 Full-Size</p>
        </div>

        {/* Center: Sale Badge + Promo Code (stacked on mobile, inline on tablet+) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Sale Badge */}
          <div className="bg-white rounded-md px-3 py-2 flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap">
            <span className="text-red-600 font-bold text-xl">10%</span>
            <span className="text-gray-700 font-medium text-sm">SALE OFF</span>
          </div>

          {/* Promo Code Input */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <label className="text-xs sm:text-sm font-medium text-gray-800 whitespace-nowrap">
              Enter promotion code
            </label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="border border-gray-400 rounded px-2 py-1.5 text-sm w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SWAT100FF"
            />
          </div>
        </div>

        {/* Right: SHOP NOW Button */}
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition-colors w-full sm:w-auto"
          onClick={() => {
            // Example: redirect or trigger cart action
            alert("Redirecting to shop...");
          }}
        >
          SHOP NOW
        </button>
      </div>
    </div>
  );
};

export default PromoBannerModal;
