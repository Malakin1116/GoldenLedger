import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser, updateUser, initBudget } from '../../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  budget: number;
}

interface UserState {
  user: User | null;
  initialBudget: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  initialBudget: 0,
  loading: false,
  error: null,
};

// Асинхронний thunk для отримання користувача
export const fetchUser = createAsyncThunk('user/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const userData = await getCurrentUser();
    return {
      id: userData._id,
      name: userData.name || '',
      budget: userData.budget || 0,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch user');
  }
});

// Асинхронний thunk для оновлення користувача
export const updateUserProfile = createAsyncThunk(
  'user/updateUser',
  async ({ userId, data }: { userId: string; data: { budget?: number; budgetStartDate?: string; name?: string } }, { rejectWithValue }) => {
    try {
      const updatedUser = await updateUser(userId, data);
      return {
        id: updatedUser._id,
        name: updatedUser.name || '',
        budget: updatedUser.budget || 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

// Асинхронний thunk для ініціалізації бюджету
export const initializeBudget = createAsyncThunk('user/initBudget', async (_, { rejectWithValue }) => {
  try {
    const budget = await initBudget();
    return budget;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to initialize budget');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setInitialBudget: (state, action) => {
      state.initialBudget = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialBudget = action.payload.budget;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialBudget = action.payload.budget;
      })
      .addCase(initializeBudget.fulfilled, (state, action) => {
        state.initialBudget = action.payload;
      });
  },
});

export const { setUser, setInitialBudget } = userSlice.actions;
export default userSlice.reducer;