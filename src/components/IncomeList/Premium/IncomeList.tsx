import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './styles';

interface Transaction {
  id: string;
  name: string;
  amount: number;
}

interface IncomeListProps {
  incomes: Transaction[];
  onDelete: (id: string) => void;
  onAdd: () => void;
  totalIncome: number;
  customCategories: { label: string; value: string }[];
}

const IncomeList: React.FC<IncomeListProps> = ({
  incomes,
  onDelete,
  onAdd,
  totalIncome,
  customCategories,
}) => {
  const { t } = useTranslation();

  const getCategoryName = (categoryKey: string) => {
    // Перевіряємо, чи це кастомна категорія
    const customCategory = customCategories.find((cat) => cat.value === categoryKey);
    if (customCategory) {
      return customCategory.label; // Для кастомних категорій повертаємо label
    }
    // Для фіксованих категорій використовуємо переклад
    return t(categoryKey);
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{`${getCategoryName(item.name)}: ${item.amount}$`}</Text>
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
          {t('dayTransactions.income_list.sum_income')}: {totalIncome}$
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>
            {t('dayTransactions.income_list.add_income')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncomeList;