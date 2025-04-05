import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import styles from './styles';

interface ModalFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: string | null) => void;
  incomeCategories: { label: string; value: string }[];
  costCategories: { label: string; value: string }[];
  showAllOption?: boolean;
  selectedCategory?: string | null;
}

const ModalFilter: React.FC<ModalFilterProps> = ({
  visible,
  onClose,
  onSelect,
  incomeCategories,
  costCategories,
  showAllOption = true,
  selectedCategory = null,
}) => {
  const { t } = useTranslation();
  const [tempSelectedCategory, setTempSelectedCategory] = useState<string | null>(selectedCategory ?? null);
  const [customIncomeCategories, setCustomIncomeCategories] = useState<any[]>([]);
  const [customCostCategories, setCustomCostCategories] = useState<any[]>([]);

  // Завантажуємо кастомні категорії з AsyncStorage
  useEffect(() => {
    const loadCustomCategories = async () => {
      const storedIncomeCategories = await AsyncStorage.getItem('customIncomeCategories');
      const storedCostCategories = await AsyncStorage.getItem('customCostCategories');
      setCustomIncomeCategories(storedIncomeCategories ? JSON.parse(storedIncomeCategories) : []);
      setCustomCostCategories(storedCostCategories ? JSON.parse(storedCostCategories) : []);
    };
    if (visible) {
      loadCustomCategories();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setTempSelectedCategory(selectedCategory ?? null);
    }
  }, [visible, selectedCategory]);

  const renderCategoryItem = (item: { label: string; value: string }, isCustom: boolean = false) => {
    const displayLabel = isCustom ? item.label : t(item.label); // Для кастомних категорій — label, для фіксованих — переклад
    return (
      <TouchableOpacity
        style={item.value === tempSelectedCategory ? styles.selectedCategoryItem : styles.categoryItem}
        onPress={() => {
          setTempSelectedCategory(item.value);
          onSelect(item.value);
          onClose();
        }}
      >
        <Text style={styles.categoryText}>{displayLabel}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t('categories.modal_filter.select_category')}</Text>

          {showAllOption && (
            <TouchableOpacity
              style={tempSelectedCategory === null ? styles.selectedAllButton : styles.allButton}
              onPress={() => {
                setTempSelectedCategory(null);
                onSelect(null);
                onClose();
              }}
            >
              <Text style={styles.categoryText}>{t('categories.modal_filter.all')}</Text>
            </TouchableOpacity>
          )}

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.categoriesContainer}>
              {costCategories.length > 0 && (
                <View style={styles.column}>
                  <Text style={styles.sectionTitle}>{t('categories.costs.all_costs')}</Text>
                  <TouchableOpacity
                    style={tempSelectedCategory === 'All Costs' ? styles.selectedCategoryItem : styles.categoryItem}
                    onPress={() => {
                      setTempSelectedCategory('All Costs');
                      onSelect('All Costs');
                      onClose();
                    }}
                  >
                    <Text style={styles.categoryText}>{t('categories.costs.all_costs')}</Text>
                  </TouchableOpacity>
                  {costCategories.map((item) => (
                    <View key={item.value}>{renderCategoryItem(item)}</View>
                  ))}
                  {customCostCategories.map((item) => (
                    <View key={item.value}>{renderCategoryItem(item, true)}</View>
                  ))}
                </View>
              )}

              {incomeCategories.length > 0 && (
                <View style={styles.column}>
                  <Text style={styles.sectionTitle}>{t('categories.income.all_incomes')}</Text>
                  <TouchableOpacity
                    style={tempSelectedCategory === 'All Incomes' ? styles.selectedCategoryItem : styles.categoryItem}
                    onPress={() => {
                      setTempSelectedCategory('All Incomes');
                      onSelect('All Incomes');
                      onClose();
                    }}
                  >
                    <Text style={styles.categoryText}>{t('categories.income.all_incomes')}</Text>
                  </TouchableOpacity>
                  {incomeCategories.map((item) => (
                    <View key={item.value}>{renderCategoryItem(item)}</View>
                  ))}
                  {customIncomeCategories.map((item) => (
                    <View key={item.value}>{renderCategoryItem(item, true)}</View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.scrollFade} />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{t('categories.modal_filter.close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalFilter;