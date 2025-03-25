import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://artangelinabackend.onrender.com/auth';

const api = axios.create({
  baseURL: API_URL,
});

// Перевірка наявності AsyncStorage
if (!AsyncStorage) {
  console.error('AsyncStorage is not available. Please ensure @react-native-async-storage/async-storage is installed and linked correctly.');
}

// Реєстрація
export const register = async (name, email, password) => {
  try {
    console.log('Register request:', { name, email, password }); // Логуємо дані
    const userName = name || 'User';
    const response = await api.post('/register', { name: userName, email, password });
    console.log('Register response:', response.data); // Логуємо відповідь
    return response.data;
  } catch (error) {
    console.log('Register error:', error.response?.data || error.message); // Логуємо помилку
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Логін
export const login = async (email, password) => {
  try {
    console.log('Login request:', { email, password }); // Логуємо дані
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response.data); // Логуємо відповідь
    const { accessToken } = response.data;
    if (AsyncStorage) {
      await AsyncStorage.setItem('token', accessToken);
      console.log('Token saved:', accessToken);
    } else {
      console.warn('AsyncStorage is not available. Token not saved.');
    }
    return response.data;
  } catch (error) {
    console.log('Login error:', error.response?.data || error.message); // Логуємо помилку
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