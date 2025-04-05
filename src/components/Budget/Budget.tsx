import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

interface BudgetProps {
  totalIncome: number;
  totalCosts: number;
  handleProfilePress: () => void;
}

const Budget: React.FC<BudgetProps> = ({ totalIncome, totalCosts, handleProfilePress }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [budget, setBudget] = useState(0);
  const [initialBudget, setInitialBudget] = useState(0);

  useEffect(() => {
    const loadBudget = async () => {
      const storedBudget = await AsyncStorage.getItem('initialBudget');
      const initBudget = storedBudget ? parseInt(storedBudget, 10) : 2000; // За замовчуванням 2000
      setInitialBudget(initBudget);
      const updatedBudget = initBudget + totalIncome - totalCosts;
      setBudget(updatedBudget);
      console.log('Budget updated:', updatedBudget);
    };
    loadBudget();
  }, [totalIncome, totalCosts]);

  const budgetText = `${t('budget.title')}: ${initialBudget} + ${totalIncome} - ${totalCosts} = ${budget} грн`;

  return (
    <View style={styles.budgetSection}>
      <View style={styles.budgetContainer}>
        <Text style={styles.budgetText}>{budgetText}</Text>
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
        <Text style={styles.iconText}>👤</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Budget;