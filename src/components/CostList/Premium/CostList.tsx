import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';

interface Transaction {
  id: string;
  name: string;
  amount: number;
}

interface CostListProps {
  costs: Transaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  totalCosts: number;
}

const CostList: React.FC<CostListProps> = ({
  costs,
  onEdit,
  onDelete,
  onAdd,
  totalCosts,
}) => {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={costs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{`${item.name}: ${item.amount}$`}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(item.id)}
              >
                <Text style={styles.actionButtonText}>✏️</Text>
              </TouchableOpacity>
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
        <Text style={styles.summaryText}>Sum Costs: {totalCosts}$</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>Add Costs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CostList;