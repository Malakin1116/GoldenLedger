import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToken, logout } from '../../utils/api';
import { ScreenNames } from '../../constants/screenName';
import { NavigationProp } from '@react-navigation/native'; // Додаємо імпорт
import { RootStackNavigation } from '../../navigation/types';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const checkToken = createAsyncThunk(
  'auth/checkToken',
  async (navigation: NavigationProp<RootStackNavigation>, { rejectWithValue }) => {
    try {
      const token = await getToken();
      console.log('Token in checkToken:', token);
      if (!token) {
        console.log('No token found, navigating to login');
        navigation.navigate(ScreenNames.LOGIN_PAGE);
        return false;
      }
      console.log('Token found, user is authenticated');
      return true;
    } catch (error) {
      console.error('Error in checkToken:', error);
      navigation.navigate(ScreenNames.LOGIN_PAGE);
      return rejectWithValue('Помилка перевірки токена');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (navigation: NavigationProp<RootStackNavigation>, { rejectWithValue }) => {
    try {
      await logout();
      navigation.navigate(ScreenNames.LOGIN_PAGE);
      return true;
    } catch (error) {
      return rejectWithValue('Помилка логауту');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    handleApiError: (state, action) => {
      if (action.payload === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
        state.isAuthenticated = false;
      }
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkToken.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
        state.loading = false;
      })
      .addCase(checkToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { setAuthenticated, handleApiError } = authSlice.actions;
export default authSlice.reducer;