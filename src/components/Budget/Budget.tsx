// src/components/Budget/Budget.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';
import { useUser } from '../../context/UserContext';
import { getCurrentUser } from '../../api/userApi';
import styles from './styles';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
  category?: string;
}

interface BudgetProps {
  transactions: Transaction[];
  selectedDate: string; // Формат "YYYY-MM-DD"
}

const Budget: React.FC<BudgetProps> = ({ transactions, selectedDate }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { user, setUser } = useUser();
  const [initialBudget, setInitialBudget] = useState<number>(0);
  const [isFetched, setIsFetched] = useState<boolean>(false); // Додаємо прапор

  useEffect(() => {
    const fetchBudget = async () => {
      // Якщо запит уже виконано або бюджет встановлено, не робимо новий запит
      if (isFetched || user?.budget !== undefined) {
        setInitialBudget(user?.budget || 0);
        return;
      }

      try {
        setIsFetched(true); // Помічаємо, що запит виконується
        const userData = await getCurrentUser();
        setUser({ id: userData._id, name: userData.name, budget: userData.budget || 0 });
        setInitialBudget(userData.budget || 0);
      } catch (error) {
        console.error('Failed to fetch budget:', error);
        setInitialBudget(0);
        if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          // Додай навігацію на екран логіну, якщо є доступ до navigation
        }
      }
    };

    fetchBudget();
  }, [user, setUser, isFetched]); // Додаємо isFetched у залежності

  // Підраховуємо totalIncome і totalCosts лише за обраний день
  const dailyTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date).toISOString().split('T')[0];
    return txDate === selectedDate;
  });

  const totalIncome = dailyTransactions
    .filter((tx) => tx.type.toLowerCase() === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalCosts = dailyTransactions
    .filter((tx) => tx.type.toLowerCase() === 'costs')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentBudget = initialBudget + totalIncome - totalCosts;
  const budgetText = `${t('budget.title')}: ${initialBudget} + ${totalIncome} - ${totalCosts} = ${currentBudget} ${currency.symbol}`;

  return (
    <View style={styles.budgetSection}>
      <View style={styles.budgetContainer}>
        <Text style={styles.budgetText}>{budgetText}</Text>
      </View>
    </View>
  );
};

export default Budget;