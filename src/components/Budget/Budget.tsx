// src/components/Budget/Budget.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';
import { useUser } from '../../context/UserContext';
import { useTransactions } from '../../context/TransactionContext';
import { getCurrentUser } from '../../api/userApi';
import styles from './styles';

const Budget: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { user, setUser } = useUser();
  const { totalIncome, totalCosts } = useTransactions();
  const [initialBudget, setInitialBudget] = useState<number>(0);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        if (!user?.budget) {
          const userData = await getCurrentUser();
          setUser({ id: userData._id, name: userData.name, budget: userData.budget || 0 });
          setInitialBudget(userData.budget || 0);
        } else {
          setInitialBudget(user.budget);
        }
      } catch (error) {
        console.error('Failed to fetch budget:', error);
        setInitialBudget(0);
      }
    };
    fetchBudget();
  }, [user, setUser]);

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