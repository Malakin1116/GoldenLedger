import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTransactionsForMonth,
  fetchTransactionsToday,
  fetchAllTransactions,
  createTransaction,
  deleteTransaction,
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

// Асинхронний thunk для завантаження транзакцій за місяць
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

// Асинхронний thunk для завантаження всіх транзакцій
export const fetchAllTransactionsThunk = createAsyncThunk(
  'transactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllTransactions();
      const transactions = response.data || [];
      return transactions.map((tx: any, index: number) => {
        const id = tx._id || tx.id || `${tx.type}-${index}`;
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

// Асинхронний thunk для завантаження транзакцій за сьогодні
export const fetchTodayTransactions = createAsyncThunk(
  'transactions/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTransactionsToday();
      const transactions = Array.isArray(response) ? response : response.data || [];
      return transactions.map((item: any) => ({
        id: item._id,
        name: item.category || (item.type.toLowerCase() === 'income' ? 'Продукт' : 'Витрата'),
        amount: item.amount,
        type: item.type,
        date: item.date,
        category: item.category || (item.type.toLowerCase() === 'income' ? 'Інший дохід' : 'Інші витрати'),
      }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch today transactions');
    }
  }
);

// Асинхронний thunk для створення транзакції
export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (
    { amount, category, type, date }: { amount: number; category: string; type: string; date: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await createTransaction(amount, category, type, date);
      const newTransactionData = response?.data || response;
      const newTransactionId = newTransactionData?._id || newTransactionData?.id || `${type}-${Date.now()}`;
      return {
        id: newTransactionId,
        name: category,
        amount,
        type,
        date,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add transaction');
    }
  }
);

// Асинхронний thunk для видалення транзакції
export const removeTransaction = createAsyncThunk(
  'transactions/remove',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      await deleteTransaction(transactionId);
      return transactionId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete transaction');
    }
  }
);

// Асинхронний thunk для видалення всіх транзакцій
export const removeAllTransactions = createAsyncThunk(
  'transactions/removeAll',
  async (_, { rejectWithValue }) => {
    try {
      await deleteAllTransactions();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete all transactions');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setMonthlyTransactions: (state, action) => {
      state.monthlyTransactions = action.payload;
      state.totalIncome = action.payload
        .filter((t: Transaction) => t.type.toLowerCase() === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      state.totalCosts = action.payload
        .filter((t: Transaction) => t.type.toLowerCase() === 'costs')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyTransactions.fulfilled, (state, action) => {
        state.monthlyTransactions = action.payload;
        state.totalIncome = action.payload
          .filter((t: Transaction) => t.type.toLowerCase() === 'income')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        state.totalCosts = action.payload
          .filter((t: Transaction) => t.type.toLowerCase() === 'costs')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        state.loading = false;
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
        state.allTransactions = action.payload;
        state.monthlyTransactions = action.payload;
        state.totalIncome = action.payload
          .filter((t: Transaction) => t.type.toLowerCase() === 'income')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        state.totalCosts = action.payload
          .filter((t: Transaction) => t.type.toLowerCase() === 'costs')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        state.loading = false;
      })
      .addCase(fetchAllTransactionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTodayTransactions.fulfilled, (state, action) => {
        state.monthlyTransactions = action.payload;
        state.totalIncome = action.payload
          .filter((t: Transaction) => t.type.toLowerCase() === 'income')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        state.totalCosts = action.payload
          .filter((t: Transaction) => t.type.toLowerCase() === 'costs')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.monthlyTransactions.push(action.payload);
        state.allTransactions.push(action.payload);
        if (action.payload.type.toLowerCase() === 'income') {
          state.totalIncome += action.payload.amount;
        } else {
          state.totalCosts += action.payload.amount;
        }
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        const transactionId = action.payload;
        const transaction = state.monthlyTransactions.find((t) => t.id === transactionId);
        state.monthlyTransactions = state.monthlyTransactions.filter((t) => t.id !== transactionId);
        state.allTransactions = state.allTransactions.filter((t) => t.id !== transactionId);
        if (transaction) {
          if (transaction.type.toLowerCase() === 'income') {
            state.totalIncome -= transaction.amount;
          } else {
            state.totalCosts -= transaction.amount;
          }
        }
      })
      .addCase(removeAllTransactions.fulfilled, (state) => {
        state.monthlyTransactions = [];
        state.allTransactions = [];
        state.totalIncome = 0;
        state.totalCosts = 0;
      });
  },
});

export const { setMonthlyTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;