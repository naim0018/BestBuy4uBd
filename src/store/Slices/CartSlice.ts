import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectedVariant {
  group: string;
  value: string;
}

export interface CartItem {
  id: string;
  itemKey: string;
  name: string;
  price: number; // Current adjusted unit price
  basePrice: number; // Original base price (without variants or bulk)
  image: string;
  quantity: number;
  selectedVariants?: any[];
  bulkPricing?: { minQuantity: number; price: number }[];
  deliveryChargeInsideDhaka?: number;
  deliveryChargeOutsideDhaka?: number;
  freeShipping?: boolean;
}

interface CartState {
  cartItems: CartItem[];
}

// Helper to calculate bulk price
const calculateBulkPrice = (item: CartItem): number => {
  let basePriceToUse = item.basePrice;

  // Apply bulk discount if available
  if (item.bulkPricing && item.bulkPricing.length > 0) {
    const sortedBulk = [...item.bulkPricing].sort(
      (a, b) => b.minQuantity - a.minQuantity
    );
    const tier = sortedBulk.find((t) => item.quantity >= t.minQuantity);
    if (tier) {
      basePriceToUse = tier.price;
    }
  }

  let finalPrice = basePriceToUse;

  // Add variant prices on top of the base price
  if (item.selectedVariants) {
    const variantsToIterate = Array.isArray(item.selectedVariants) 
      ? item.selectedVariants 
      : Object.entries(item.selectedVariants).map(([group, items]) => ({ group, items }));

    variantsToIterate.forEach((variant: any) => {
      // If it's the {group, items: [{value, price}]} format
      if (variant.items && Array.isArray(variant.items)) {
        variant.items.forEach((subItem: any) => {
          finalPrice += (subItem.price || 0);
        });
      } else if (Array.isArray(variant)) {
          // If it's a direct array of items from a group (from Object.entries value)
           variant.forEach((subItem: any) => {
            finalPrice += (subItem.price || 0);
          });
      } else {
        // Old format or single select
        const variantPrice = variant.price || 0;
        finalPrice += variantPrice;
      }
    });
  }

  return finalPrice;
};

// Load cart items from localStorage if they exist
const loadCartItems = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

const initialState: CartState = {
  cartItems: loadCartItems(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const {
        id,
        name,
        price: basePrice,
        image,
        quantity,
        selectedVariants,
        bulkPricing,
        deliveryChargeInsideDhaka,
        deliveryChargeOutsideDhaka,
        freeShipping,
      } = action.payload;
      // Create a unique key that includes all variants
      const variantKey =
        selectedVariants?.length > 0
          ? `${id}-${selectedVariants
              .map((v: any) => `${v.group}-${v.value}`)
              .join("-")}`
          : id;

      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.itemKey === variantKey
      );

      if (existingItemIndex >= 0) {
        state.cartItems[existingItemIndex].quantity += quantity;
        // Recalculate price based on new quantity
        state.cartItems[existingItemIndex].price = calculateBulkPrice(
          state.cartItems[existingItemIndex]
        );
      } else {
        const newItem: CartItem = {
          id,
          itemKey: variantKey,
          name,
          basePrice: basePrice,
          price: 0, // Will be calculated
          image,
          quantity,
          selectedVariants,
          bulkPricing,
          deliveryChargeInsideDhaka,
          deliveryChargeOutsideDhaka,
          freeShipping,
        };
        newItem.price = calculateBulkPrice(newItem);
        state.cartItems.push(newItem);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ itemKey: string; quantity: number }>
    ) => {
      const { itemKey, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.itemKey === itemKey);
      if (item) {
        item.quantity = quantity;
        item.price = calculateBulkPrice(item);
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action: PayloadAction<{ itemKey: string }>) => {
      const { itemKey } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.itemKey !== itemKey
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    incrementQuantity: (state, action: PayloadAction<{ itemKey: string }>) => {
      const { itemKey } = action.payload;
      const item = state.cartItems.find((item) => item.itemKey === itemKey);
      if (item) {
        item.quantity++;
        item.price = calculateBulkPrice(item);
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ itemKey: string }>) => {
      const { itemKey } = action.payload;
      const item = state.cartItems.find((item) => item.itemKey === itemKey);
      if (item && item.quantity > 1) {
        item.quantity--;
        item.price = calculateBulkPrice(item);
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
