import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
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
  const [newCategory, setNewCategory] = useState<string>('');
  const [customCategories, setCustomCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const key = transactionType === 'income' ? 'customIncomeCategories' : 'customCostCategories';
      const storedCategories = await AsyncStorage.getItem(key);
      if (storedCategories) setCustomCategories(JSON.parse(storedCategories));
    };
    if (visible) {
      loadCategories();
    }
  }, [transactionType, visible]);

  const saveCustomCategories = async () => {
    const key = transactionType === 'income' ? 'customIncomeCategories' : 'customCostCategories';
    console.log('Saving categories to AsyncStorage:', customCategories); // Дебаг
    await AsyncStorage.setItem(key, JSON.stringify(customCategories));
    // Додаємо невелику затримку, щоб переконатися, що AsyncStorage завершив запис
    setTimeout(() => {
      onCategoriesUpdated();
    }, 100);
  };

  const addCustomCategory = () => {
    if (!newCategory.trim()) return;

    const categoryValue = `category.${transactionType}.${newCategory.toLowerCase().replace(/\s+/g, '_')}`;
    const newCat = { label: newCategory, value: categoryValue };
    setCustomCategories([...customCategories, newCat]);
    setNewCategory('');
    saveCustomCategories();
  };

  const deleteCustomCategory = (value: string) => {
    setCustomCategories(customCategories.filter((cat) => cat.value !== value));
    saveCustomCategories();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {transactionType === 'income' ? 'Редагувати категорії доходів' : 'Редагувати категорії витрат'}
          </Text>

          <Text style={styles.label}>Нова категорія:</Text>
          <View style={styles.amountContainer}>
            <TextInput
              placeholder="Введіть назву категорії"
              value={newCategory}
              onChangeText={setNewCategory}
              style={styles.input}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCustomCategory}>
              <Text style={styles.buttonText}>Додати</Text>
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
            <Text style={styles.noCategoriesText}>Немає кастомних категорій</Text>
          )}

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setNewCategory('');
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditCategoriesModal;