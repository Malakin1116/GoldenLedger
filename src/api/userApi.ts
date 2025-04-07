import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './authApi'; // Імпорт з вашого другого файлу

const USER_API_URL = 'https://bug1116.onrender.com/user';

const userApi = axios.create({
  baseURL: USER_API_URL,
});

userApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken(); // Використовуємо refreshToken з authApi
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return userApi(originalRequest);
      } catch (refreshError) {
        console.log('Помилка оновлення токена:', refreshError);
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export const getCurrentUser = async () => {
  try {
    const response = await userApi.get('/currentUser');
    console.log('Fetched user data:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.log('Get current user error:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, data: { budget?: number; budgetStartDate?: string; name?: string }) => {
  const response = await userApi.patch(`/update/${userId}`, data);
  return response.data.data;
};

export const initBudget = async () => {
  const userData = await getCurrentUser();
  const initialBudget = userData.budget !== undefined ? userData.budget : 2000; // Виправлено логіку
  await AsyncStorage.setItem('initialBudget', initialBudget.toString());
  return initialBudget;
};