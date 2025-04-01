import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Базові URL для авторизації та транзакцій
const AUTH_API_URL = 'https://bug1116.onrender.com/auth';
const TRANSACTIONS_API_URL = 'https://bug1116.onrender.com';

// Екземпляри axios для авторизації та транзакцій
const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

const transactionsApi = axios.create({
  baseURL: TRANSACTIONS_API_URL,
});

// Функція для затримки
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Перевірка наявності AsyncStorage
if (!AsyncStorage) {
  console.error('AsyncStorage is not available. Please ensure @react-native-async-storage/async-storage is installed and linked correctly.');
}

// Функція для оновлення токена
export const refreshToken = async (): Promise<string> => {
  try {
    const currentToken = await getToken();
    if (!currentToken) {
      throw new Error('Токен не знайдено. Будь ласка, увійдіть знову.');
    }
    const response = await authApi.post(
      '/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      }
    );
    const newAccessToken = response.data.data?.accessToken;
    if (!newAccessToken) {
      throw new Error('Новий токен не отримано');
    }
    await AsyncStorage.setItem('token', newAccessToken);
    console.log('Token refreshed and saved:', newAccessToken);
    return newAccessToken;
  } catch (error: unknown) {
    console.log('Refresh token error:', (error as any).response?.data || (error as Error).message);
    throw new Error((error as any).response?.data?.message || 'Не вдалося оновити токен');
  }
};

// Перехватчик для автоматичного оновлення токена (для transactionsApi)
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: Error) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

transactionsApi.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return transactionsApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return transactionsApi(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError as Error, null);
        await AsyncStorage.removeItem('token');
        throw new Error('Сесія закінчилася. Будь ласка, увійдіть знову.');
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Додаємо токен до всіх запитів через перехватчик (для обох API)
const addTokenInterceptor = (instance: typeof authApi) => {
  instance.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

addTokenInterceptor(authApi);
addTokenInterceptor(transactionsApi);

// Реєстрація
export const register = async (name: string, email: string, password: string): Promise<any> => {
  try {
    console.log('Register request:', { email, password });
    const response = await authApi.post('/register', { email, password });
    console.log('Register response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.log('Register error:', (error as any).response?.data || (error as Error).message);
    throw new Error((error as any).response?.data?.message || 'Registration failed');
  }
};

// Логін із повторними спробами
export const login = async (email: string, password: string, retries: number = 2): Promise<{ accessToken: string }> => {
  try {
    console.log('Login request:', { email, password });
    const response = await authApi.post('/login', { email, password });
    console.log('Login response:', response.data);

    const accessToken = response.data.data?.accessToken;
    if (!accessToken) {
      throw new Error('Токен не отримано');
    }

    if (AsyncStorage) {
      await AsyncStorage.setItem('token', accessToken);
      console.log('Token saved:', accessToken);
    } else {
      console.warn('AsyncStorage is not available. Token not saved.');
    }

    return { accessToken };
  } catch (error: unknown) {
    console.log('Login error:', (error as any).response?.data || (error as Error).message);
    console.log('Error status:', (error as any).response?.status);
    console.log('Error headers:', (error as any).response?.headers);

    if ((error as any).response?.status === 401 && retries > 0) {
      console.log(`Retrying login (${retries} attempts left)...`);
      await delay(2000);
      return login(email, password, retries - 1);
    }

    throw new Error((error as any).response?.data?.message || 'Login failed');
  }
};

// Отримання токена
export const getToken = async (): Promise<string | null> => {
  if (AsyncStorage) {
    const token = await AsyncStorage.getItem('token');
    console.log('Retrieved token:', token);
    return token;
  } else {
    console.warn('AsyncStorage is not available. Cannot retrieve token.');
    return null;
  }
};

// Логаут
export const logout = async (): Promise<void> => {
  if (AsyncStorage) {
    await AsyncStorage.removeItem('token');
    console.log('Token removed');
  } else {
    console.warn('AsyncStorage is not available. Cannot remove token.');
  }
};

// Створення транзакції
export const createTransaction = async (amount: number, category: string, type: string, date: string): Promise<any> => {
  try {
    const response = await transactionsApi.post('/transactions', {
      amount,
      category,
      type,
      date,
    });
    console.log('Create transaction response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.log('Create transaction error:', (error as any).response?.data || (error as Error).message);
    throw new Error((error as any).response?.data?.message || 'Failed to create transaction');
  }
};

// Отримання транзакцій за сьогодні
export const fetchTransactionsToday = async (): Promise<any> => {
  try {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const response = await transactionsApi.get(`/transactions/today?date=${todayStr}`);
    console.log('Fetch transactions today response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.log('Fetch transactions today error:', (error as any).response?.data || (error as Error).message);
    throw new Error((error as any).response?.data?.message || 'Failed to fetch transactions');
  }
};

// Отримання транзакцій за тиждень
export const fetchTransactionsForWeek = async (year: number, week: number): Promise<any> => {
  try {
    const response = await transactionsApi.get(`/transactions/week?year=${year}&week=${week}`);
    console.log('Fetch transactions for week response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.log('Fetch transactions for week error:', (error as any).response?.data || (error as Error).message);
    throw new Error((error as any).response?.data?.message || 'Failed to fetch transactions for week');
  }
};

// Отримання транзакцій за місяць
export const fetchTransactionsForMonth = async (month: number, year: number): Promise<any> => {
  try {
    // Додаємо 1 до month, щоб відповідати формату 1-12 (січень = 1, березень = 3)
    const adjustedMonth = month + 1;
    console.log(`Fetching transactions for month: ${adjustedMonth}, year: ${year}`);
    const response = await transactionsApi.get(`/transactions/month?month=${adjustedMonth}&year=${year}`);
    console.log('Fetch transactions for month response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.log('Fetch transactions for month error:', (error as any).response?.data || (error as Error).message);
    throw new Error((error as any).response?.data?.message || 'Failed to fetch transactions for month');
  }
};

// Видалення транзакції
export const deleteTransaction = async (transactionId: string): Promise<any> => {
  try {
    const response = await transactionsApi.delete(`/transactions/${transactionId}`);
    console.log('Delete transaction response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.log('Delete transaction error:', (error as any).response?.data || (error as Error).message);
    throw new Error((error as any).response?.data?.message || 'Failed to delete transaction');
  }
};

// Отримання транзакцій за діапазон дат (тиждень)
export const fetchTransactionsForDaysWeek = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const response = await transactionsApi.get(`/transactions/daysWeek?startDate=${startDate}&endDate=${endDate}`);
    console.log('API response for daysWeek:', response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error((error as any).response?.data?.message || 'Failed to fetch days week transactions');
  }
};

// Отримання транзакцій за діапазон дат (місяць)
export const fetchTransactionsForDaysMonth = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const response = await transactionsApi.get(`/transactions/daysMonth?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error: unknown) {
    throw new Error((error as any).response?.data?.message || 'Failed to fetch days month transactions');
  }
};
