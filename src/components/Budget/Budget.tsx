// src/components/Budget/Budget.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext'; // Додаємо хук для валюти
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

interface BudgetProps {
  totalIncome: number;
  totalCosts: number;
}

const Budget: React.FC<BudgetProps> = ({ totalIncome, totalCosts }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currency } = useCurrency(); // Використовуємо глобальний контекст валюти
  const [budget, setBudget] = useState(0);
  const [initialBudget, setInitialBudget] = useState(0);

  useEffect(() => {
    const loadBudget = async () => {
      const storedBudget = await AsyncStorage.getItem('initialBudget');
      const initBudget = storedBudget ? parseInt(storedBudget, 10) : 2000;
      setInitialBudget(initBudget);
      const updatedBudget = initBudget + totalIncome - totalCosts;
      setBudget(updatedBudget);
      console.log('Budget updated:', updatedBudget);
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