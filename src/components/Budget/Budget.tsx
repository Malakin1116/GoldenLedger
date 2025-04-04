// src/components/Budget/Budget.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import styles from './styles';

interface BudgetProps {
  totalIncome: number;
  totalCosts: number;
  budget: number;
  handleProfilePress: () => void;
}

const Budget: React.FC<BudgetProps> = ({ totalIncome, totalCosts, budget, handleProfilePress }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [budgetText, setBudgetText] = useState<string>(`${t('budget.title')}: 0 + ${totalIncome} - ${totalCosts} = ${budget}$`);

  useEffect(() => {
    console.log('Budget: Language changed to:', language);
    console.log('Budget: Current translation for budget.title:', t('budget.title'));
    setBudgetText(`${t('budget.title')}: 0 + ${totalIncome} - ${totalCosts} = ${budget}$`);
  }, [language, t, totalIncome, totalCosts, budget]);

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