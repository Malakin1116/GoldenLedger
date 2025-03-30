import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

interface SummaryProps {
  currentDay: number;
  currentMonth: string;
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
  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.todayText}>{`TODAY ${currentDay} ${currentMonth}`}</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Income: {totalIncome}$</Text>
        <Text style={styles.summaryText}>Costs: {totalCosts}$</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => setIncomeModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setCostModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Costs</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sumText}>SUM: {sum}$</Text>
    </View>
  );
};

export default Summary;