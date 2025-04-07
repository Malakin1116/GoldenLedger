// src/components/EditCategoriesModal/EditCategoriesModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'; // Додаємо Alert
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

interface Category {
  label: string;
  value: string;
}

interface EditCategoriesModalProps {
  visible: boolean;
  onClose: () => void;
  transactionType: 'income' | 'costs';
  onCategoriesUpdated: () => void;
}

const EditCategoriesModal: React.FC<EditCategoriesModalProps> = ({
  visible,
  onClose,
  transactionType,
  onCategoriesUpdated,
}) => {
  const { t } = useTranslation();
  const [newCategory, setNewCategory] = useState<string>('');
  const [customCategories, setCustomCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const key = transactionType === 'income' ? 'customIncomeCategories' : 'customCostCategories';
      const storedCategories = await AsyncStorage.getItem(key);
      console.log('Loaded categories from AsyncStorage:', storedCategories);
      if (storedCategories) {
        setCustomCategories(JSON.parse(storedCategories));
      } else {
        setCustomCategories([]);
      }
    };
    if (visible) {
      loadCategories();
    }
  }, [transactionType, visible]);

  const saveCustomCategories = async (updatedCategories: Category[]) => {
    const key = transactionType === 'income' ? 'customIncomeCategories' : 'customCostCategories';
    console.log('Saving categories to AsyncStorage:', updatedCategories);
    await AsyncStorage.setItem(key, JSON.stringify(updatedCategories));
    onCategoriesUpdated();
  };

  const addCustomCategory = () => {
    if (!newCategory.trim()) {
      // Відображаємо повідомлення про помилку, якщо інпут порожній
      Alert.alert(t('editCategoriesModal.error_empty_category'));
      return;
    }

    const categoryValue = `category.${transactionType}.${newCategory.toLowerCase().replace(/\s+/g, '_')}`;
    const newCat = { label: newCategory, value: categoryValue };
    const updatedCategories = [...customCategories, newCat];
    setCustomCategories(updatedCategories);
    setNewCategory('');
    saveCustomCategories(updatedCategories);
  };

  const deleteCustomCategory = (value: string) => {
    const updatedCategories = customCategories.filter((cat) => cat.value !== value);
    setCustomCategories(updatedCategories);
    saveCustomCategories(updatedCategories);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {transactionType === 'income'
              ? t('editCategoriesModal.edit_income_categories')
              : t('editCategoriesModal.edit_cost_categories')}
          </Text>

          <Text style={styles.label}>{t('editCategoriesModal.new_category_label')}</Text>
          <View style={styles.amountContainer}>
            <TextInput
              placeholder={t('editCategoriesModal.enter_category_placeholder')}
              value={newCategory}
              onChangeText={setNewCategory}
              style={styles.input}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCustomCategory}>
              <Text style={styles.buttonText}>{t('editCategoriesModal.add_button')}</Text>
            </TouchableOpacity>
          </View>

          {customCategories.length > 0 ? (
            customCategories.map((item) => (
              <View key={item.value} style={styles.categoryItem}>
                <Text style={styles.categoryText}>{item.label}</Text>
                <TouchableOpacity onPress={() => deleteCustomCategory(item.value)}>
                  <Text style={styles.deleteCategoryButton}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noCategoriesText}>{t('editCategoriesModal.no_custom_categories')}</Text>
          )}

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setNewCategory('');
                onClose();
              }}
            >
              <Text style={styles.buttonText}>{t('editCategoriesModal.close_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditCategoriesModal;
