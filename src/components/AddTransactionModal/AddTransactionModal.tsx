// src/components/AddTransactionModal/AddTransactionModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCurrency } from '../../context/CurrencyContext';
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
  const { currency } = useCurrency();
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
      console.error(t('addTransactionModal.error_fill_fields')); // Додаємо переклад для помилки
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error(t('addTransactionModal.error_invalid_amount')); // Додаємо переклад для помилки
      return;
    }

    try {
      const formattedDate = selectedDate || new Date().toISOString();
      await onAdd(parsedAmount, category, transactionType, formattedDate);
      setAmount('');
      setCategory(null);
      onClose();
    } catch (error) {
      console.error(
        `${t('addTransactionModal.error_adding')} ${transactionType === 'income' ? t('addTransactionModal.income') : t('addTransactionModal.cost')}`,
        error
      );
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

          <Text style={styles.label}>{t('addTransactionModal.amount_label')}</Text>
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
              placeholder={t('addTransactionModal.enter_amount_placeholder')}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />
            <Text style={styles.currency}>{currency.symbol}</Text>
          </View>

          <View style={styles.categoryHeader}>
            <Text style={styles.label}>{t('addTransactionModal.category_label')}</Text>
            <TouchableOpacity onPress={() => setIsEditCategoriesModalVisible(true)}>
              <Text style={styles.editCategoriesButtonText}>{t('addTransactionModal.edit_categories')}</Text>
            </TouchableOpacity>
          </View>
          <DropDownPicker
            open={open}
            value={category}
            items={categories}
            setOpen={setOpen}
            setValue={setCategory}
            placeholder={t('addTransactionModal.select_category_placeholder')}
            style={styles.picker}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.pickerText}
            zIndex={3000}
            zIndexInverse={2000}
            listItemContainerStyle={styles.listItemContainer}
            maxHeight={300}
          />

          <Text style={styles.label}>{t('addTransactionModal.date_label')}</Text>
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
              <Text style={styles.buttonText}>{t('addTransactionModal.cancel_button')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.buttonText}>{t('addTransactionModal.add_button')}</Text>
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