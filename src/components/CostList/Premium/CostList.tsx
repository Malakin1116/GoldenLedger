// src/components/CostList/CostList.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../../context/CurrencyContext'; // Додаємо хук для валюти
import styles from './styles';
import { DeleteIcon } from '../../../assets/icons/index';

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
  customCategories: { label: string; value: string }[];
}

const CostList: React.FC<CostListProps> = ({
  costs,
  onDelete,
  onAdd,
  totalCosts,
  customCategories,
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency(); // Використовуємо глобальний контекст валюти

  const getCategoryName = (categoryKey: string) => {
    const customCategory = customCategories.find((cat) => cat.value === categoryKey);
    if (customCategory) {
      return customCategory.label;
    }
    return t(categoryKey);
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={costs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{`${getCategoryName(item.name)}: ${item.amount} ${currency.symbol}`}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(item.id)}
              >
                <DeleteIcon width={20} height={20} fill="#FF4D4D" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {t('dayTransactions.cost_list.sum_costs')}: {totalCosts} {currency.symbol}
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