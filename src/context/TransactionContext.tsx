// src/context/TransactionContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTransactionsForMonth } from '../utils/api';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
  category?: string;
}

interface TransactionContextType {
  monthlyTransactions: Transaction[];
  setMonthlyTransactions: (transactions: Transaction[]) => void;
  totalIncome: number;
  totalCosts: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalCosts, setTotalCosts] = useState<number>(0);

  useEffect(() => {
    const today = new Date();
    const loadTransactions = async () => {
      try {
        const response = await fetchTransactionsForMonth(today.getMonth(), today.getFullYear());
        const transactions = Array.isArray(response) ? response : response.data || [];
        const mappedTransactions = transactions.map((item: any) => ({
          id: item._id,
          name: item.category || 'Невідомо',
          amount: item.amount,
          type: item.type,
          date: item.date,
          category: item.category || (item.type.toLowerCase() === 'income' ? 'Інший дохід' : 'Інші витрати'),
        }));
        setMonthlyTransactions(mappedTransactions);
      } catch (error) {
        console.error('Failed to load monthly transactions:', error);
      }
    };
    loadTransactions();
  }, []);

  useEffect(() => {
    const income = monthlyTransactions
      .filter((t) => t.type.toLowerCase() === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const costs = monthlyTransactions
      .filter((t) => t.type.toLowerCase() === 'costs')
      .reduce((sum, t) => sum + t.amount, 0);
    setTotalIncome(income);
    setTotalCosts(costs);
  }, [monthlyTransactions]);

  return (
    <TransactionContext.Provider value={{ monthlyTransactions, setMonthlyTransactions, totalIncome, totalCosts }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};