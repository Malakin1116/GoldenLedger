import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import styles from './styles';

interface Category {
  label: string;
  value: string;
}

const ManageCategories: React.FC = () => {
  const { t } = useTranslation();
  const [newCategory, setNewCategory] = useState<string>('');
  const [categoryType, setCategoryType] = useState<'income' | 'costs'>('costs');
  const [customIncomeCategories, setCustomIncomeCategories] = useState<Category[]>([]);
  const [customCostCategories, setCustomCostCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const storedIncome = await AsyncStorage.getItem('customIncomeCategories');
      const storedCosts = await AsyncStorage.getItem('customCostCategories');
      if (storedIncome) setCustomIncomeCategories(JSON.parse(storedIncome));
      if (storedCosts) setCustomCostCategories(JSON.parse(storedCosts));
    };
    loadCategories();
  }, []);

  const saveCategories = async () => {
    await AsyncStorage.setItem('customIncomeCategories', JSON.stringify(customIncomeCategories));
    await AsyncStorage.setItem('customCostCategories', JSON.stringify(customCostCategories));
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;

    const categoryValue = `category.${categoryType}.${newCategory.toLowerCase().replace(/\s+/g, '_')}`;
    const newCat = { label: newCategory, value: categoryValue };

    if (categoryType === 'income') {
      setCustomIncomeCategories([...customIncomeCategories, newCat]);
    } else {
      setCustomCostCategories([...customCostCategories, newCat]);
    }

    setNewCategory('');
    saveCategories();
  };

  const deleteCategory = (value: string, type: 'income' | 'costs') => {
    if (type === 'income') {
      setCustomIncomeCategories(customIncomeCategories.filter((cat) => cat.value !== value));
    } else {
      setCustomCostCategories(customCostCategories.filter((cat) => cat.value !== value));
    }
    saveCategories();
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('settings.manageCategories')}</Text>
      <View style={styles.categoryInputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('settings.newCategory')}
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity
          style={styles.categoryTypeButton}
          onPress={() => setCategoryType(categoryType === 'income' ? 'costs' : 'income')}
        >
          <Text style={styles.categoryTypeButtonText}>
            {categoryType === 'income' ? t('settings.income') : t('settings.costs')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addCategoryButton} onPress={addCategory}>
          <Text style={styles.addCategoryButtonText}>{t('settings.add')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionDescription}>{t('settings.incomeCategories')}</Text>
      {customIncomeCategories.length > 0 ? (
        customIncomeCategories.map((item) => (
          <View key={item.value} style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item.label}</Text>
            <TouchableOpacity onPress={() => deleteCategory(item.value, 'income')}>
              <Text style={styles.deleteCategoryButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noCategoriesText}>{t('settings.noCategories')}</Text>
      )}

      <Text style={styles.sectionDescription}>{t('settings.costCategories')}</Text>
      {customCostCategories.length > 0 ? (
        customCostCategories.map((item) => (
          <View key={item.value} style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item.label}</Text>
            <TouchableOpacity onPress={() => deleteCategory(item.value, 'costs')}>
              <Text style={styles.deleteCategoryButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noCategoriesText}>{t('settings.noCategories')}</Text>
      )}
    </View>
  );
};

export default ManageCategories;