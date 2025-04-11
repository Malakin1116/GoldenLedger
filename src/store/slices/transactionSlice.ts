import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTransactionsToday,
  fetchTransactionsForMonth,
  createTransaction,
  deleteTransaction,
  fetchAllTransactions,
  deleteAllTransactions,
} from '../../utils/api';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
  category?: string;
}

interface TransactionState {
  monthlyTransactions: Transaction[];
  allTransactions: Transaction[];
  totalIncome: number;
  totalCosts: number;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  monthlyTransactions: [],
  allTransactions: [],
  totalIncome: 0,
  totalCosts: 0,
  loading: false,
  error: null,
};

export const fetchTodayTransactions = createAsyncThunk(
  'transactions/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTransactionsToday();
      const transactions = response.data || [];
      return transactions.map((item: any) => ({
        id: item._id,
        name: item.category || 'Невідомо',
        amount: item.amount,
        type: item.type,
        date: new Date(item.date).toISOString().split('T')[0],
        category: item.category || (item.type.toLowerCase() === 'income' ? 'Інший дохід' : 'Інші витрати'),
      }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch today transactions');
    }
  }
);

export const fetchMonthlyTransactions = createAsyncThunk(
  'transactions/fetchMonthly',
  async ({ month, year }: { month: number; year: number }, { rejectWithValue }) => {
    try {
      const response = await fetchTransactionsForMonth(month, year);
      const transactions = Array.isArray(response) ? response : response.data || [];
      return transactions.map((item: any) => ({
        id: item._id,
        name: item.category || 'Невідомо',
        amount: item.amount,
        type: item.type,
        date: new Date(item.date).toISOString().split('T')[0],
        category: item.category || (item.type.toLowerCase() === 'income' ? 'Інший дохід' : 'Інші витрати'),
      }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch monthly transactions');
    }
  }
);

export const fetchAllTransactionsThunk = createAsyncThunk(
  'transactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllTransactions();
      const transactions = response.data || [];
      return transactions.map((tx: any) => {
        const id = tx._id || tx.id;
        return {
          id,
          name: tx.category || tx.name || 'Невідомо',
          amount: tx.amount,
          type: tx.type,
          date: new Date(tx.date).toISOString().split('T')[0],
        };
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch all transactions');
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (
    { amount, category, type, date }: { amount: number; category: string; type: string; date: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await createTransaction(amount, category, type, date);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add transaction');
    }
  }
);

export const removeTransaction = createAsyncThunk(
  'transactions/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTransaction(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove transaction');
    }
  }
);

export const removeAllTransactions = createAsyncThunk(
  'transactions/removeAll',
  async (_, { rejectWithValue }) => {
    try {
      await deleteAllTransactions();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove all transactions');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setMonthlyTransactions: (state, action) => {
      state.monthlyTransactions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayTransactions.fulfilled, (state, action) => {
        state.loading = false;
        const todayStr = new Date().toISOString().split('T')[0];
        state.monthlyTransactions = [
          ...state.monthlyTransactions.filter((tx) => tx?.date !== todayStr),
          ...action.payload,
        ];
      })
      .addCase(fetchTodayTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMonthlyTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyTransactions = action.payload;
      })
      .addCase(fetchMonthlyTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllTransactionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.allTransactions = action.payload;
      })
      .addCase(fetchAllTransactionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.id && action.payload.date) {
          state.monthlyTransactions.push(action.payload);
        } else {
          console.error('Invalid transaction data received:', action.payload);
        }
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyTransactions = state.monthlyTransactions.filter((tx) => tx?.id !== action.payload);
        state.allTransactions = state.allTransactions.filter((tx) => tx?.id !== action.payload);
      })
      .addCase(removeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAllTransactions.fulfilled, (state) => {
        state.loading = false;
        state.monthlyTransactions = [];
        state.allTransactions = [];
      })
      .addCase(removeAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMonthlyTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;