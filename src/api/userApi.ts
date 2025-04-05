import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${USER_API_URL}/refresh`, { refreshToken });
          const newToken = response.data.token;
          await AsyncStorage.setItem('token', newToken);
          console.log('Token refreshed and saved:', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return userApi(originalRequest); // Повторюємо запит
        } catch (refreshError) {
          console.log('Refresh token failed:', refreshError);
          throw refreshError;
        }
      } else {
        console.log('No refresh token available');
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
  const initialBudget = userData.budget || 2000;
  await AsyncStorage.setItem('initialBudget', initialBudget.toString());
  return initialBudget;
};