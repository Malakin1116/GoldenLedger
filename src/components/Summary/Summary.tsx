import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks/useAppSelector';
import styles from './styles';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
  category?: string;
}

interface SummaryProps {
  transactions: Transaction[];
  selectedDate: string; // Формат "YYYY-MM-DD"
  setIncomeModalVisible: (visible: boolean) => void;
  setCostModalVisible: (visible: boolean) => void;
}

const Summary: React.FC<SummaryProps> = ({
  transactions,
  selectedDate,
  setIncomeModalVisible,
  setCostModalVisible,
}) => {
  const { t } = useTranslation();
  const { currency } = useAppSelector((state) => state.currency);
  const { monthlyTransactions } = useAppSelector((state) => state.transactions);

  const dailyTransactions = monthlyTransactions.filter((tx) => {
    const txDate = new Date(tx.date).toISOString().split('T')[0];
    return txDate === selectedDate;
  });

  const totalIncome = dailyTransactions
    .filter((tx) => tx.type.toLowerCase() === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalCosts = dailyTransactions
    .filter((tx) => tx.type.toLowerCase() === 'costs')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const sum = totalIncome - totalCosts;

  const [year, month, day] = selectedDate.split('-').map(Number);
  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const translatedMonth = t(`calendar.months.${monthNames[month - 1]}`);

  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.todayText}>
        {t('home.summary.today', { day, month: translatedMonth })}
      </Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {t('home.summary.income')}: {totalIncome} {currency.symbol}
        </Text>
        <Text style={styles.summaryText}>
          {t('home.summary.costs')}: {totalCosts} {currency.symbol}
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
        {t('home.summary.sum')}: {sum} {currency.symbol}
      </Text>
    </View>
  );
};

export default Summary;
