// src/components/PeriodSummary/PeriodSummary.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import { TabType } from '../../constants/dateConstants';

interface PeriodSummaryProps {
  totalIncome: number;
  totalCosts: number;
  activeTab: TabType;
}

const PeriodSummary: React.FC<PeriodSummaryProps> = ({ totalIncome, totalCosts, activeTab }) => {
  const { t } = useTranslation();

  // Визначаємо ключ для перекладу залежно від активної вкладки
  const incomeKey = `periodSummary.income_${activeTab.toLowerCase()}`;
  const costsKey = `periodSummary.costs_${activeTab.toLowerCase()}`;

  return (
    <View style={styles.budgetSection}>
      <View style={styles.budgetContainer}>
        <Text style={styles.budgetText}>
          {t(incomeKey)}: {totalIncome} грн
        </Text>
        <Text style={styles.budgetText}>
          {t(costsKey)}: {totalCosts} грн
        </Text>
      </View>
    </View>
  );
};

export default PeriodSummary;