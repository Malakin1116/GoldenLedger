// src/components/AddTransactionModal/AddTransactionModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCurrency } from '../../context/CurrencyContext'; // Додаємо хук для валюти
import styles from './styles';
import { incomeCategories, costCategories } from '../../constants/categories';
import EditCategoriesModal from '../../components/EditCategoriesModal/EditCategoriesModal';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (amount: number, category: string, type: string, date: string) => Promise<void>;
  transactionType: 'income' | 'costs';
  title: string;
  selectedDate?: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAdd,
  transactionType,
  title,
  selectedDate,
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrency(); // Використовуємо глобальний контекст валюти
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isEditCategoriesModalVisible, setIsEditCategoriesModalVisible] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);

  const loadCategories = async () => {
    const rawCategories = transactionType === 'income' ? incomeCategories : costCategories;
    const key = transactionType === 'income' ? 'customIncomeCategories' : 'customCostCategories';
    const storedCategories = await AsyncStorage.getItem(key);
    const customCategories = storedCategories ? JSON.parse(storedCategories) : [];

    const allCategories = [
      ...rawCategories.map((item) => ({
        label: t(item.value),
        value: item.value,
      })),
      ...customCategories.map((item: { label: string; value: string }) => ({
        label: item.label,
        value: item.value,
      })),
    ];

    setCategories(allCategories);
  };

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [transactionType, t, visible]);

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
  };

  const handleAdd = async () => {
    if (!amount || !category) {
      console.error('Заповніть усі поля');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error('Сума має бути числом більше 0');
      return;
    }

    try {
      const formattedDate = selectedDate || new Date().toISOString();
      await onAdd(parsedAmount, category, transactionType, formattedDate);
      setAmount('');
      setCategory(null);
      onClose();
    } catch (error) {
      console.error(`Не вдалося додати ${transactionType === 'income' ? 'дохід' : 'витрату'}`, error);
    }
  };

  const handleCategoriesUpdated = () => {
    loadCategories();
  };

  const sign = transactionType === 'income' ? '+' : '-';

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>

          <Text style={styles.label}>Сума:</Text>
          <View style={styles.amountContainer}>
            <Text
              style={[
                styles.sign,
                { color: transactionType === 'income' ? '#4CAF50' : '#FF4D4D' },
              ]}
            >
              {sign}
            </Text>
            <TextInput
              placeholder="Введіть суму"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />
            <Text style={styles.currency}>{currency.symbol}</Text>
          </View>

          <View style={styles.categoryHeader}>
            <Text style={styles.label}>Категорія:</Text>
            <TouchableOpacity onPress={() => setIsEditCategoriesModalVisible(true)}>
              <Text style={styles.editCategoriesButtonText}>Редагувати категорії</Text>
            </TouchableOpacity>
          </View>
          <DropDownPicker
            open={open}
            value={category}
            items={categories}
            setOpen={setOpen}
            setValue={setCategory}
            placeholder="Виберіть категорію"
            style={styles.picker}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.pickerText}
            zIndex={3000}
            zIndexInverse={2000}
            listItemContainerStyle={styles.listItemContainer}
            maxHeight={300}
          />

          <Text style={styles.label}>Дата:</Text>
          <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setAmount('');
                setCategory(null);
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Скасувати</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.buttonText}>Додати</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <EditCategoriesModal
        visible={isEditCategoriesModalVisible}
        onClose={() => setIsEditCategoriesModalVisible(false)}
        transactionType={transactionType}
        onCategoriesUpdated={handleCategoriesUpdated}
      />
    </Modal>
  );
};

export default AddTransactionModal;