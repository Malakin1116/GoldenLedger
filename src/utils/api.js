import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://bug1116.onrender.com/auth';

const api = axios.create({
  baseURL: API_URL,
});

// Функція для затримки
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Перевірка наявності AsyncStorage
if (!AsyncStorage) {
  console.error('AsyncStorage is not available. Please ensure @react-native-async-storage/async-storage is installed and linked correctly.');
}

// Реєстрація
export const register = async (name, email, password) => {
  try {
    console.log('Register request:', { email, password }); // Прибираємо name із логів
    const response = await api.post('/register', { email, password }); // Відправляємо тільки email і password
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
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response.data);
    
    // Витягуємо токен із response.data.data.accessToken
    const accessToken = response.data.data?.accessToken;
    if (!accessToken) {
      throw new Error('Токен не отримано');
    }

    // Зберігаємо токен у AsyncStorage
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

export const createTransaction = async (amount, category, type, date) => {
  try {
    const response = await api.post('/transactions', {
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

// Fetch transactions for today (GET)
export const fetchTransactionsToday = async () => {
  try {
    const response = await api.get('/transactions/today');
    console.log('Fetch transactions response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Fetch transactions error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};