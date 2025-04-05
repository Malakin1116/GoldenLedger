import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_API_URL = 'https://bug1116.onrender.com/user';

const userApi = axios.create({
  baseURL: USER_API_URL,
});

userApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    console.log('Token for request:', token); // Дебаг
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found in AsyncStorage');
    }
    return config;
  },
  (error) => {
    console.log('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export const getCurrentUser = async (): Promise<any> => {
  try {
    const response = await userApi.get('/currentUser');
    console.log('Get current user response:', response.data); // Дебаг
    return response.data.data;
  } catch (error: unknown) {
    console.log('Get current user error:', (error as any).response?.data || (error as Error).message);
    throw new Error((error as any).response?.data?.message || 'Failed to fetch current user');
  }
};

export const updateUser = async (userId: string, data: { budget?: number; budgetStartDate?: string; name?: string }): Promise<any> => {
  try {
    console.log('Updating user with ID:', userId, 'Data:', data); // Дебаг
    const response = await userApi.patch(`/update/${userId}`, data);
    console.log('Update user response:', response.data); // Дебаг
    return response.data.data;
  } catch (error: unknown) {
    console.log('Update user error:', (error as any).response?.data || (error as Error).message);
    throw new Error((error as any).response?.data?.message || 'Failed to update user');
  }
};