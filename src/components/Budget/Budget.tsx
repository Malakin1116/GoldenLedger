import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppSelector';
import { fetchUser } from '../../store/slices/userSlice';
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
  const dispatch = useAppDispatch();
  const { currency } = useAppSelector((state) => state.currency);
  const { user, initialBudget } = useAppSelector((state) => state.user);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchBudget = async () => {
      if (isFetched || user?.budget !== undefined) {
        return;
      }
      try {
        setIsFetched(true);
        await dispatch(fetchUser()).unwrap();
      } catch (error) {
        console.error('Failed to fetch budget:', error);
        if (error === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          // Навігація на екран логіну буде оброблена через authSlice
        }
      }
    };

    fetchBudget();
  }, [user, dispatch, isFetched]);

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