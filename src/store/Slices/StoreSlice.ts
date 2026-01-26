import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoreConfig {
  _id: string;
  name: string;
  identity: {
    logoUrl: string;
    faviconUrl: string;
    primaryColor: string;
    secondaryColor: string;
  };
  settings: {
    currency: string;
    supportEmail: string;
    supportPhone: string;
    address: string;
    gtmId?: string;
    facebookPixelId?: string;
  };
}

interface StoreState {
  config: StoreConfig | null;
  isInitialized: boolean;
}

const initialState: StoreState = {
  config: null,
  isInitialized: false,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setStoreConfig: (state, action: PayloadAction<StoreConfig>) => {
      state.config = action.payload;
      state.isInitialized = true;
    },
  },
});

export const { setStoreConfig } = storeSlice.actions;
export default storeSlice.reducer;
