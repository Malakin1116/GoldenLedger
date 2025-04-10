import { createSlice } from '@reduxjs/toolkit';
import i18n from '../../i18n/i18n';
import { saveLanguage } from '../../i18n/LanguageManager'; // Видалили loadLanguage

interface LanguageState {
  language: string;
  isLoaded: boolean;
}

const initialState: LanguageState = {
  language: 'en',
  isLoaded: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      i18n.changeLanguage(action.payload);
      saveLanguage(action.payload);
    },
    setLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
    loadLanguageSuccess: (state, action) => {
      state.language = action.payload;
      state.isLoaded = true;
      i18n.changeLanguage(action.payload);
    },
  },
});

export const { setLanguage, setLoaded, loadLanguageSuccess } = languageSlice.actions;
export default languageSlice.reducer;