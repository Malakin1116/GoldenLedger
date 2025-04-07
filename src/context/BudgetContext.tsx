// src/context/BudgetContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, updateUser } from '../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BudgetContextType {
  initialBudget: number;
  setInitialBudget: (budget: number) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialBudget, setInitialBudget] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const userData = await getCurrentUser();
        setUserId(userData._id);
        setInitialBudget(userData.budget || 0);
        await AsyncStorage.setItem('userId', userData._id);
      } catch (error) {
        console.error('Failed to fetch budget:', error);
        setInitialBudget(0);
      }
    };
    fetchBudget();
  }, []);

  return (
    <BudgetContext.Provider value={{ initialBudget, setInitialBudget, userId, setUserId }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};