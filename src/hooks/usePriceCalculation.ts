import { useMemo } from 'react';

export interface PriceBreakdown {
  basePrice: number;
  variantTotal: number;
  subtotal: number;
  comboDiscount: number;
  finalTotal: number;
  totalQuantity: number;
  appliedComboTier?: { minQuantity: number; discount: number };
}

export const usePriceCalculation = (
  product: any,
  selectedVariants: any[],
  manualQuantity?: number
): PriceBreakdown => {
  return useMemo(() => {
    if (!product) {
      return {
        basePrice: 0,
        variantTotal: 0,
        subtotal: 0,
        comboDiscount: 0,
        finalTotal: 0,
        totalQuantity: 0
      };
    }

    // Calculate total quantity from variants or use manual quantity
    const variantQtySum = selectedVariants.reduce((sum, v) => sum + (v.quantity || 1), 0);
    const totalQuantity = manualQuantity !== undefined ? manualQuantity : variantQtySum;

    // Base price is discounted price if available, otherwise regular price
    const basePrice = product.price.discounted || product.price.regular;
    
    // Check if base variant exists in selectedVariants
    const baseVariant = selectedVariants.find(v => v.isBaseVariant);
    const baseVariantQuantity = baseVariant?.quantity || 0;
    
    // Calculate variant total (additive pricing)
    // Each variant's price is the extra cost per unit, multiplied by its quantity
    const variantTotal = selectedVariants.reduce((sum, v) => {
      // Don't include base variant in variant total (it has price: 0 anyway)
      if (v.isBaseVariant) return sum;
      return sum + ((v.item.price || 0) * v.quantity);
    }, 0);

    // Calculate subtotal: base price * base variant quantity + all variant extras
    // Only include base price if base variant is selected
    const subtotal = (basePrice * baseVariantQuantity) + variantTotal;

    // Apply combo discount (flat discount based on total quantity)
    let comboDiscount = 0;
    let appliedComboTier = undefined;
    
    if (product.comboPricing && product.comboPricing.length > 0 && totalQuantity > 0) {
      const sortedCombo = [...product.comboPricing].sort((a: any, b: any) => b.minQuantity - a.minQuantity);
      const tier = sortedCombo.find((t: any) => totalQuantity >= t.minQuantity);
      if (tier) {
        comboDiscount = tier.discount;
        appliedComboTier = tier;
      }
    }

    const finalTotal = Math.max(0, subtotal - comboDiscount);

    return {
      basePrice,
      variantTotal,
      subtotal,
      comboDiscount,
      finalTotal,
      totalQuantity,
      appliedComboTier
    };
  }, [product, selectedVariants, manualQuantity]);
};
