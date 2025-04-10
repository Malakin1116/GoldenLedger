import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Currency {
  code: string;
  symbol: string;
}

interface CurrencyState {
  currency: Currency;
  isPremium: boolean;
}

const initialState: CurrencyState = {
  currency: { code: 'UAH', symbol: 'грн' },
  isPremium: false,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      AsyncStorage.setItem('currency', JSON.stringify(action.payload));
    },
    loadCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency, loadCurrency } = currencySlice.actions;
export default currencySlice.reducer;