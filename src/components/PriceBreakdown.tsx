import React from "react";
import { ComboPricing, calculateComboPricing, formatPrice } from "../utils/pricingUtils";

interface PriceBreakdownProps {
  quantity: number;
  unitPrice: number;
  comboPricing: ComboPricing[];
}

/**
 * Displays a detailed breakdown of the price calculation including
 * regular price, applied discounts, and final total.
 */
const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  quantity,
  unitPrice,
  comboPricing,
}) => {
  const { 
    appliedTier, 
    discountAmount, 
    finalPrice, 
    savings, 
    originalTotal 
  } = calculateComboPricing(quantity, unitPrice, comboPricing);

  if (quantity === 0) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
      {/* Regular Price */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Regular Price ({quantity} × {formatPrice(unitPrice)})</span>
        <span className="font-medium">{formatPrice(originalTotal)}</span>
      </div>

      {/* Discount Applied */}
      {appliedTier && discountAmount > 0 && (
        <div className="flex justify-between text-sm text-green-600 font-medium">
          <div className="flex flex-col">
            <span>Combo Discount</span>
            <span className="text-[10px] opacity-80">
              {appliedTier.discountType === 'per_product' 
                ? `${formatPrice(appliedTier.discount)} off per item` 
                : `${formatPrice(appliedTier.discount)} flat off`
              }
            </span>
          </div>
          <span>-{formatPrice(discountAmount)}</span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 my-2" />

      {/* Final Price */}
      <div className="flex justify-between items-center text-gray-900">
        <span className="font-bold text-base">Total Amount</span>
        <span className="font-bold text-xl text-primary-blue">
          {formatPrice(finalPrice)}
        </span>
      </div>

      {/* Savings Badge */}
      {savings > 0 && (
        <div className="bg-green-100 border border-green-200 rounded-lg p-2 text-center animate-pulse">
          <p className="text-green-800 font-bold text-sm">
            🎉 You Saved {formatPrice(savings)}!
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceBreakdown;
