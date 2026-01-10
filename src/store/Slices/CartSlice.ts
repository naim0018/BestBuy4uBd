import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectedVariant {
  group: string;
  value: string;
}

export interface CartItem {
  id: string;
  itemKey: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariants?: any[]; // Keep as any[] for now to match current logic or refine later
}

interface CartState {
  cartItems: CartItem[];
}

// Load cart items from localStorage if they exist
const loadCartItems = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const initialState: CartState = {
  cartItems: loadCartItems(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
    
      const { id, name, price:basePrice, image, quantity, selectedVariants } = action.payload;
      // Create a unique key that includes all variants
      const variantKey = selectedVariants?.length > 0
        ? `${id}-${selectedVariants.map((v: any) => `${v.group}-${v.value}`).join('-')}`
        : id;
      
      const existingItemIndex = state.cartItems.findIndex(
        item => item.itemKey === variantKey
      );

      // Calculate the price based on selected variants
      let price = basePrice;
      
      if (selectedVariants?.length > 0) {
        selectedVariants.forEach((variant: any) => {
          const variantItem = variant.items?.find((item: any) => item.value === variant.value);
          if (variantItem && variantItem.price) {
            price += variantItem.price;
          }
        });
      }
      
      if (existingItemIndex >= 0) {
        state.cartItems[existingItemIndex].quantity += quantity;
      } else {
        state.cartItems.push({
          id,
          itemKey: variantKey,
          name,
          price : price,
          image,
          quantity,
          selectedVariants
        });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action: PayloadAction<{ itemKey: string; quantity: number }>) => {
      const { itemKey, quantity } = action.payload;
      const item = state.cartItems.find(item => item.itemKey === itemKey);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action: PayloadAction<{ itemKey: string }>) => {
      const { itemKey } = action.payload;
      state.cartItems = state.cartItems.filter(item => item.itemKey !== itemKey);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    incrementQuantity: (state, action: PayloadAction<{ itemKey: string }>) => {
      const { itemKey } = action.payload;
      const item = state.cartItems.find(item => item.itemKey === itemKey);
      if (item) {
        item.quantity++;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ itemKey: string }>) => {
      const { itemKey } = action.payload;
      const item = state.cartItems.find(item => item.itemKey === itemKey);
      if (item && item.quantity > 1) {
        item.quantity--;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
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
