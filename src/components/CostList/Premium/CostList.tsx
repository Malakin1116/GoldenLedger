// src/components/CostList/Premium/CostList.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './styles';

interface Transaction {
  id: string;
  name: string;
  amount: number;
}

interface CostListProps {
  costs: Transaction[];
  onDelete: (id: string) => void;
  onAdd: () => void;
  totalCosts: number;
}

const CostList: React.FC<CostListProps> = ({
  costs,
  onDelete,
  onAdd,
  totalCosts,
}) => {
  const { t } = useTranslation();

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
                onPress={() => onDelete(item.id)}
              >
                <Text style={styles.actionButtonText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {t('dayTransactions.cost_list.sum_costs')}: {totalCosts}$
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>
            {t('dayTransactions.cost_list.add_cost')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CostList;