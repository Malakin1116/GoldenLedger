// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { RootStackNavigation } from '../navigation/types';
import { getToken } from '../utils/api';
import { ScreenNames } from '../constants/screenName';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  handleApiError: (error: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; navigation: NavigationProp<RootStackNavigation> }> = ({ children, navigation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkToken = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        navigation.navigate(ScreenNames.LOGIN_PAGE);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Помилка перевірки токена:', error);
      navigation.navigate(ScreenNames.LOGIN_PAGE);
      setIsAuthenticated(false);
    }
  }, [navigation]); // Додаємо navigation як залежність

  const handleApiError = (error: any) => {
    if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
      setIsAuthenticated(false);
      navigation.navigate(ScreenNames.LOGIN_PAGE);
    }
  };

  useEffect(() => {
    checkToken();
    const interval = setInterval(checkToken, 60000); // Перевіряємо кожну хвилину
    return () => clearInterval(interval);
  }, [checkToken]); // Додаємо checkToken до масиву залежностей

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, handleApiError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
