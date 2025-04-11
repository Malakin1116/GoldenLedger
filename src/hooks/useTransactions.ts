import { useState, useEffect, useCallback } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { RootStackNavigation } from '../navigation/types';
import { TabType } from '../constants/dateConstants';
import { useAppSelector, useAppDispatch } from './useAppSelector';
import { addTransaction, removeTransaction, fetchMonthlyTransactions } from '../store/slices/transactionSlice';
import { formatISODate } from '../utils/dateUtils';
import { filterTransactionsByDate, filterTransactionsByCategory, splitTransactionsByType, calculateTotals } from '../utils/transactionUtils';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
}

interface UseTransactionsProps {
  navigation: NavigationProp<RootStackNavigation>;
  currentSelectedDate?: string;
  activeTab: TabType;
  selectedCategory: string | null;
}

export const useTransactions = ({
  navigation,
  currentSelectedDate,
  activeTab,
  selectedCategory,
}: UseTransactionsProps) => {
  const dispatch = useAppDispatch();
  const { monthlyTransactions } = useAppSelector((state) => state.transactions);
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadTransactions = useCallback(() => {
    if (!monthlyTransactions.length) {
      setIncomes([]);
      setCosts([]);
      return;
    }

    let filteredTransactions = monthlyTransactions;

    if (activeTab !== 'All') {
      if (!currentSelectedDate) {
        setIncomes([]);
        setCosts([]);
        return;
      }
      filteredTransactions = filterTransactionsByDate(monthlyTransactions, currentSelectedDate, activeTab);
    }

    const filteredByCategory = filterTransactionsByCategory(filteredTransactions, selectedCategory);
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
        await dispatch(removeTransaction(id)).unwrap();
        if (type.toLowerCase() === 'income') {
          setIncomes((prev) => prev.filter((item) => item.id !== id));
        } else {
          setCosts((prev) => prev.filter((item) => item.id !== id));
        }

        const [year, month] = currentSelectedDate ? currentSelectedDate.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
        await dispatch(fetchMonthlyTransactions({ month: month - 1, year })).unwrap();
      } catch (error: any) {
        console.error('Помилка видалення транзакції:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [currentSelectedDate, dispatch]
  );

  const handleAddTransaction = async (amount: number, category: string, type: string, date: string) => {
    setIsLoading(true);
    try {
      const isoDate = formatISODate(date);
      const newTransaction = await dispatch(addTransaction({ amount, category, type, date: isoDate })).unwrap();

      const [year, month] = date.split('-').map(Number);
      await dispatch(fetchMonthlyTransactions({ month: month - 1, year })).unwrap();
    } catch (error: any) {
      console.error('Помилка додавання транзакції:', error);
      throw error;
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