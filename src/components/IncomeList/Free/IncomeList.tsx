import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';

interface Transaction {
  id: string;
  name: string;
  amount: number;
}

interface IncomeListProps {
  incomes: Transaction[];
  onDelete: (id: string) => void;
  totalIncome: number;
}

const IncomeList: React.FC<IncomeListProps> = ({
  incomes,
  onDelete,
  totalIncome,
}) => {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{`${item.name}: ${item.amount}$`}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(item.id)}
              >
                <Text style={styles.actionButtonText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Sum Income: {totalIncome}$</Text>
      </View>
    </View>
  );
};

export default IncomeList;