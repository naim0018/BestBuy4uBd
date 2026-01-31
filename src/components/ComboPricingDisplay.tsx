import React from "react";

interface ComboPricingTier {
  minQuantity: number;
  discount: number;
}

interface ComboPricingDisplayProps {
  comboPricing: ComboPricingTier[];
  currentQuantity: number;
  appliedTier?: ComboPricingTier;
  variant?: "primary" | "secondary" | "success";
}

/**
 * Reusable component to display combo pricing tiers
 * Shows all available tiers with visual indicators for active/met tiers
 */
const ComboPricingDisplay: React.FC<ComboPricingDisplayProps> = ({
  comboPricing,
  currentQuantity,
  appliedTier,
  variant = "primary",
}) => {
  if (!comboPricing || comboPricing.length === 0) {
    return null;
  }

  const colorClasses = {
    primary: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-600",
      active: "border-blue-600 ring-2 ring-blue-600 bg-blue-50",
      met: "border-blue/50",
      inactive: "border-blue-100",
      activeText: "text-blue-700",
      inactiveText: "text-blue-600 opacity-80",
    },
    secondary: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      dot: "bg-green-600",
      active: "border-green-600 ring-1 ring-green-600",
      met: "border-green-600/50",
      inactive: "border-green-100",
      activeText: "text-green-600",
      inactiveText: "text-green-600 opacity-80",
    },
    success: {
      bg: "bg-primary-green/5",
      border: "border-primary-green/10",
      text: "text-primary-green",
      dot: "bg-primary-green",
      active:
        "border-primary-green ring-1 ring-primary-green bg-primary-green/5",
      met: "border-primary-green/50",
      inactive: "border-primary-green/10",
      activeText: "text-primary-green scale-110",
      inactiveText: "text-primary-green opacity-80",
    },
  };

  const colors = colorClasses[variant];

  return (
    <div
      className={`${colors.bg} rounded-2xl p-6 border ${colors.border} space-y-4`}
    >
      <h3
        className={`text-[10px] font-bold ${colors.text} uppercase tracking-[0.2em] flex items-center gap-2`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        Combo Savings
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {comboPricing.map((tier, idx) => {
          const isApplied =
            appliedTier && appliedTier.minQuantity === tier.minQuantity;
          const isMet = currentQuantity >= tier.minQuantity;

          return (
            <div
              key={idx}
              className={`bg-white p-3 rounded-xl border flex justify-between items-center shadow-sm ${
                isApplied ? colors.active : isMet ? colors.met : colors.inactive
              }`}
            >
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Buy {tier.minQuantity}+
              </span>
              <span
                className={`font-bold ${isApplied ? colors.activeText : colors.inactiveText}`}
              >
                -৳{tier.discount.toLocaleString()} OFF
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComboPricingDisplay;
