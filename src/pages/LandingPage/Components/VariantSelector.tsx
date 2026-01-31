import { Minus } from "lucide-react";
import { VariantSelection } from "@/hooks/useVariantQuantity";

interface VariantSelectorProps {
  selectedVariants: VariantSelection[];
  productVariants?: any[];
  onVariantAdd: (group: string, item: any) => void;
  onVariantUpdate: (group: string, value: string, quantity: number) => void;
  showBaseVariant?: boolean;
  className?: string;
}

const VariantSelector = ({
  selectedVariants,
  productVariants = [],
  onVariantAdd,
  onVariantUpdate,
  showBaseVariant = true,
  className = "",
}: VariantSelectorProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Base Variant - Auto-injected quantity option */}
      {showBaseVariant && selectedVariants.find((v) => v.isBaseVariant) && (
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1">
            Select Quantity
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedVariants
              .filter((v) => v.isBaseVariant)
              .map((variant) => {
                const quantity = variant.quantity;
                const isActive = quantity > 0;

                return (
                  <button
                    key={variant.item.value}
                    onClick={() => {
                      // Base variant clicking increments quantity
                      onVariantUpdate(
                        variant.group,
                        variant.item.value,
                        quantity + 1
                      );
                    }}
                    className={`relative px-6 py-3 rounded-component border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      isActive
                        ? "border-secondary bg-secondary text-white shadow-lg"
                        : "border-border-main hover:border-text-secondary text-text-primary bg-bg-surface"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{variant.item.value}</span>
                      <span className="opacity-60 text-[8px]">Base Price</span>
                    </div>

                    {/* Quantity Badge */}
                    {isActive && (
                      <div className="absolute -top-2 -right-2 bg-white text-secondary text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-secondary shadow-sm z-10">
                        {quantity}
                      </div>
                    )}

                    {/* Decrease Control */}
                    {isActive && (
                      <div
                        className="absolute -top-2 -left-2 bg-white text-danger text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-danger shadow-sm z-10 hover:bg-danger hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onVariantUpdate(
                            variant.group,
                            variant.item.value,
                            quantity - 1
                          );
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Product Variants */}
      {productVariants?.map((variantGroup: any) => {
        return (
          <div key={variantGroup.group} className="space-y-3">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1">
              Select {variantGroup.group}
            </label>
            <div className="flex flex-wrap gap-2">
              {variantGroup.items.map((item: any) => {
                const selection = selectedVariants.find(
                  (v) =>
                    v.group === variantGroup.group && v.item.value === item.value
                );
                const quantity = selection?.quantity || 0;
                const isActive = quantity > 0;

                return (
                  <button
                    key={item.value}
                    onClick={() => {
                      onVariantAdd(variantGroup.group, item);
                    }}
                    className={`relative px-6 py-3 rounded-component border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      isActive
                        ? "border-secondary bg-secondary text-white shadow-lg"
                        : "border-border-main hover:border-text-secondary text-text-primary bg-bg-surface"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{item.value}</span>
                      {(item.price ?? 0) > 0 && (
                        <span className="opacity-60 text-[8px]">
                          +৳{item.price}
                        </span>
                      )}
                    </div>

                    {/* Quantity Badge */}
                    {isActive && (
                      <div className="absolute -top-2 -right-2 bg-white text-secondary text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-secondary shadow-sm z-10">
                        {quantity}
                      </div>
                    )}

                    {/* Decrease Control */}
                    {isActive && (
                      <div
                        className="absolute -top-2 -left-2 bg-white text-danger text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-danger shadow-sm z-10 hover:bg-danger hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onVariantUpdate(
                            variantGroup.group,
                            item.value,
                            quantity - 1
                          );
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VariantSelector;
