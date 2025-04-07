// src/components/Budget/Budget.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';
import { getCurrentUser } from '../../api/userApi';
import styles from './styles';

interface BudgetProps {
  totalIncome: number;
  totalCosts: number;
}

const Budget: React.FC<BudgetProps> = ({ totalIncome, totalCosts }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const [budget, setBudget] = useState<number>(0);
  const [initialBudget, setInitialBudget] = useState<number>(0);

  useEffect(() => {
    const loadBudget = async () => {
      try {
        const userData = await getCurrentUser();
        const initBudget = userData.budget || 0;
        setInitialBudget(initBudget);
        const updatedBudget = initBudget + totalIncome - totalCosts;
        setBudget(updatedBudget);
        console.log('Budget updated:', updatedBudget);
      } catch (error) {
        console.error('Failed to load budget:', error);
        setInitialBudget(0);
        setBudget(totalIncome - totalCosts);
      }
    };
    loadBudget();
  }, [totalIncome, totalCosts]);

  const budgetText = `${t('budget.title')}: ${initialBudget} + ${totalIncome} - ${totalCosts} = ${budget} ${currency.symbol}`;

  return (
    <View style={styles.budgetSection}>
      <View style={styles.budgetContainer}>
        <Text style={styles.budgetText}>{budgetText}</Text>
      </View>
    </View>
  );
};

export default Budget;