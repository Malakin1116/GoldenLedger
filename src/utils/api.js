import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Базовые URL для авторизации и транзакций
const AUTH_API_URL = 'https://bug1116.onrender.com/auth';
const TRANSACTIONS_API_URL = 'https://bug1116.onrender.com';

// Экземпляр axios для авторизации
const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

// Экземпляр axios для транзакций
const transactionsApi = axios.create({
  baseURL: TRANSACTIONS_API_URL,
});

// Функція для затримки
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Перевірка наявності AsyncStorage
if (!AsyncStorage) {
  console.error('AsyncStorage is not available. Please ensure @react-native-async-storage/async-storage is installed and linked correctly.');
}

// Функція для оновлення токена
export const refreshToken = async () => {
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
  } catch (error) {
    console.log('Refresh token error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Не вдалося оновити токен');
  }
};

// Перехватчик для автоматичного оновлення токена (для transactionsApi)
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

transactionsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
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
      } catch (refreshError) {
        processQueue(refreshError, null);
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
const addTokenInterceptor = (instance) => {
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
export const register = async (name, email, password) => {
  try {
    console.log('Register request:', { email, password });
    const response = await authApi.post('/register', { email, password });
    console.log('Register response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Register error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Логін із повторними спробами
export const login = async (email, password, retries = 2) => {
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
  } catch (error) {
    console.log('Login error:', error.response?.data || error.message);
    console.log('Error status:', error.response?.status);
    console.log('Error headers:', error.response?.headers);

    if (error.response?.status === 401 && retries > 0) {
      console.log(`Retrying login (${retries} attempts left)...`);
      await delay(2000);
      return login(email, password, retries - 1);
    }

    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Отримання токена
export const getToken = async () => {
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
export const logout = async () => {
  if (AsyncStorage) {
    await AsyncStorage.removeItem('token');
    console.log('Token removed');
  } else {
    console.warn('AsyncStorage is not available. Cannot remove token.');
  }
};

// Створення транзакції
export const createTransaction = async (amount, category, type, date) => {
  try {
    const response = await transactionsApi.post('/transactions', {
      amount,
      category,
      type,
      date,
    });
    console.log('Create transaction response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Create transaction error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create transaction');
  }
};

// Отримання транзакцій за сьогодні
export const fetchTransactionsToday = async () => {
  try {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const response = await transactionsApi.get(`/transactions/today?date=${todayStr}`);
    console.log('Fetch transactions today response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Fetch transactions today error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};

export const fetchTransactionsForWeek = async (year, week) => {
  try {
    const response = await transactionsApi.get(`/transactions/week?year=${year}&week=${week}`);
    console.log('Fetch transactions for week response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Fetch transactions for week error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions for week');
  }
};

export const fetchTransactionsForMonth = async (month, year) => {
  try {
    // Додаємо 1 до month, щоб відповідати формату 1-12 (січень = 1, березень = 3)
    const adjustedMonth = month + 1;
    console.log(`Fetching transactions for month: ${adjustedMonth}, year: ${year}`);
    const response = await transactionsApi.get(`/transactions/month?month=${adjustedMonth}&year=${year}`);
    console.log('Fetch transactions for month response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Fetch transactions for month error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions for month');
  }
};

// Видалення транзакції
export const deleteTransaction = async (transactionId) => {
  try {
    const response = await transactionsApi.delete(`/transactions/${transactionId}`);
    console.log('Delete transaction response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Delete transaction error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete transaction');
  }
};


export const fetchTransactionsForDaysWeek = async (startDate, endDate) => {
  try {
    const response = await transactionsApi.get(`/transactions/daysWeek?startDate=${startDate}&endDate=${endDate}`);
    console.log('API response for daysWeek:', response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch days week transactions');
  }
};

export const fetchTransactionsForDaysMonth = async (startDate, endDate) => {
  try {
    const response = await transactionsApi.get(`/transactions/daysMonth?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch days month transactions');
  }
};