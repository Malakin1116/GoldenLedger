// src/hooks/useTransactions.ts
import { useState, useEffect, useCallback } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { createTransaction, deleteTransaction } from '../utils/api';
import { formatISODate } from '../utils/dateUtils';
import { filterTransactionsByDate, filterTransactionsByCategory, splitTransactionsByType, calculateTotals } from '../utils/transactionUtils';
import { RootStackNavigation } from '../navigation/types';
import { TabType } from '../constants/dateConstants';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
}

interface UseTransactionsProps {
  navigation: NavigationProp<RootStackNavigation>;
  monthlyTransactions: Transaction[];
  currentSelectedDate: string;
  activeTab: TabType;
  selectedCategory: string | null;
}

export const useTransactions = ({
  navigation,
  monthlyTransactions,
  currentSelectedDate,
  activeTab,
  selectedCategory,
}: UseTransactionsProps) => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadTransactions = useCallback(() => {
    if (!monthlyTransactions.length) {
      console.log('monthlyTransactions порожній');
      setIncomes([]);
      setCosts([]);
      return;
    }

    const filteredByDate = filterTransactionsByDate(monthlyTransactions, currentSelectedDate, activeTab);
    const filteredByCategory = filterTransactionsByCategory(filteredByDate, selectedCategory);
    const { incomes: newIncomes, costs: newCosts } = splitTransactionsByType(filteredByCategory);

    setIncomes(newIncomes);
    setCosts(newCosts);
  }, [monthlyTransactions, currentSelectedDate, activeTab, selectedCategory]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleDeleteTransaction = useCallback(
    async (id: string, type: string) => {
      setIsLoading(true);
      try {
        await deleteTransaction(id);
        if (type.toLowerCase() === 'income') {
          setIncomes((prev) => prev.filter((item) => item.id !== id));
        } else {
          setCosts((prev) => prev.filter((item) => item.id !== id));
        }
        const updatedTransactions = monthlyTransactions.filter((item) => item.id !== id);
        navigation.setParams({ monthlyTransactions: updatedTransactions });
      } catch (error: any) {
        console.error('Помилка видалення транзакції:', error.message);
        throw error; // Передаємо помилку вгору
      } finally {
        setIsLoading(false);
      }
    },
    [monthlyTransactions, navigation]
  );

  const handleAddTransaction = async (amount: number, category: string, type: string, date: string) => {
    setIsLoading(true);
    try {
      const isoDate = formatISODate(date);
      const newTransaction = await createTransaction(amount, category, type, isoDate);

      const updatedTransaction: Transaction = {
        id: newTransaction.id || `${type}-${Date.now()}`,
        name: category,
        amount,
        type,
        date: isoDate,
      };

      if (type.toLowerCase() === 'income') {
        setIncomes((prev) => [...prev, updatedTransaction]);
      } else {
        setCosts((prev) => [...prev, updatedTransaction]);
      }

      const updatedMonthlyTransactions = [...monthlyTransactions, updatedTransaction];
      navigation.setParams({ monthlyTransactions: updatedMonthlyTransactions });
    } catch (error: any) {
      console.error('Помилка додавання транзакції:', error.message);
      throw error; // Передаємо помилку вгору
    } finally {
      setIsLoading(false);
    }
  };

  const { totalIncome, totalCosts, budget } = calculateTotals(incomes, costs);

  return {
    incomes,
    costs,
    isLoading,
    totalIncome,
    totalCosts,
    budget,
    handleDeleteTransaction,
    handleAddTransaction,
  };
};
