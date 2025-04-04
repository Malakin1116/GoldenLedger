// src/components/Summary/Summary.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './styles';

interface SummaryProps {
  currentDay: number;
  currentMonth: string; // Очікуємо індекс місяця як рядок
  totalIncome: number;
  totalCosts: number;
  sum: number;
  setIncomeModalVisible: (visible: boolean) => void;
  setCostModalVisible: (visible: boolean) => void;
}

const Summary: React.FC<SummaryProps> = ({
  currentDay,
  currentMonth,
  totalIncome,
  totalCosts,
  sum,
  setIncomeModalVisible,
  setCostModalVisible,
}) => {
  const { t } = useTranslation();

  // Перекладаємо місяць із індексу
  const monthIndex = parseInt(currentMonth, 10);
  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const translatedMonth = t(`calendar.months.${monthNames[monthIndex]}`);

  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.todayText}>
        {t('home.summary.today', { day: currentDay, month: translatedMonth })}
      </Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {t('home.summary.income')}: {totalIncome}$
        </Text>
        <Text style={styles.summaryText}>
          {t('home.summary.costs')}: {totalCosts}$
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => setIncomeModalVisible(true)}>
          <Text style={styles.addButtonText}>{t('home.summary.add_income')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setCostModalVisible(true)}>
          <Text style={styles.addButtonText}>{t('home.summary.add_cost')}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sumText}>
        {t('home.summary.sum')}: {sum}$
      </Text>
    </View>
  );
};

export default Summary;