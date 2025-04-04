// src/utils/transactionUtils.ts
import { formatDate, getAllDatesInRange } from './dateUtils';
import { TabType } from '../constants/dateConstants';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
}

export const filterTransactionsByDate = (
  transactions: Transaction[],
  currentSelectedDate: string,
  activeTab: TabType
): Transaction[] => {
  let filteredDates: string[] = [];
  if (activeTab === 'Day') {
    filteredDates = [currentSelectedDate];
  } else if (activeTab === 'Week') {
    const selected = new Date(currentSelectedDate);
    const startOfWeek = new Date(selected);
    startOfWeek.setUTCDate(selected.getUTCDate() - 7);
    filteredDates = getAllDatesInRange(formatDate(startOfWeek), currentSelectedDate);
  } else if (activeTab === 'Month') {
    const selected = new Date(currentSelectedDate);
    const startOfMonth = new Date(selected);
    startOfMonth.setUTCDate(selected.getUTCDate() - 30);
    filteredDates = getAllDatesInRange(formatDate(startOfMonth), currentSelectedDate);
  }

  return transactions.filter((transaction) =>
    filteredDates.includes(formatDate(new Date(transaction.date)))
  );
};

export const filterTransactionsByCategory = (
  transactions: Transaction[],
  selectedCategory: string | null
): Transaction[] => {
  if (!selectedCategory) return transactions;

  if (selectedCategory === 'Всі доходи') {
    return transactions.filter((t) => t.type.toLowerCase() === 'income');
  } else if (selectedCategory === 'Всі витрати') {
    return transactions.filter((t) => t.type.toLowerCase() === 'costs');
  } else {
    return transactions.filter((t) => t.name === selectedCategory);
  }
};

export const splitTransactionsByType = (transactions: Transaction[]): { incomes: Transaction[]; costs: Transaction[] } => {
  const incomes = transactions
    .filter((item) => item.type.toLowerCase() === 'income')
    .map((item) => ({ ...item }));
  const costs = transactions
    .filter((item) => item.type.toLowerCase() === 'costs')
    .map((item) => ({ ...item }));
  return { incomes, costs };
};

export const calculateTotals = (incomes: Transaction[], costs: Transaction[]): { totalIncome: number; totalCosts: number; budget: number } => {
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
  const budget = totalIncome - totalCosts;
  return { totalIncome, totalCosts, budget };
};
