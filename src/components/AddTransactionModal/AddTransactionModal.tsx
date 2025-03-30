import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './styles';

// Визначаємо типи для пропсів
interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (amount: number, category: string, type: string, date: string) => Promise<void>;
  transactionType: 'income' | 'costs';
  title: string;
}

// Предопределенные категории для доходов (8 элементов)
const incomeCategories = [
  { label: 'Salary', value: 'Salary' },
  { label: 'Freelance', value: 'Freelance' },
  { label: 'Investments', value: 'Investments' },
  { label: 'Gifts', value: 'Gifts' },
  { label: 'Business', value: 'Business' },
  { label: 'Rental', value: 'Rental' },
  { label: 'Dividends', value: 'Dividends' },
  { label: 'Other Income', value: 'Other Income' },
];

// Предопределенные категории для расходов (10 элементов)
const costCategories = [
  { label: 'Food', value: 'Food' },
  { label: 'Transport', value: 'Transport' },
  { label: 'Housing', value: 'Housing' },
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Health', value: 'Health' },
  { label: 'Education', value: 'Education' },
  { label: 'Travel', value: 'Travel' },
  { label: 'Other Costs', value: 'Other Costs' },
];

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAdd,
  transactionType,
  title,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

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
      const currentDate = new Date().toISOString();
      await onAdd(parsedAmount, category, transactionType, currentDate);
      setAmount('');
      setCategory(null);
      onClose();
    } catch (error) {
      console.error(`Не вдалося додати ${transactionType === 'income' ? 'дохід' : 'витрату'}`, error);
    }
  };

  const sign = transactionType === 'income' ? '+' : '-';
  const categories = transactionType === 'income' ? incomeCategories : costCategories;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>

          <Text style={styles.label}>Сума:</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.sign}>{sign}</Text>
            <TextInput
              placeholder="Введіть суму"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />
            <Text style={styles.currency}>$</Text>
          </View>

          <Text style={styles.label}>Категорія:</Text>
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
            listItemContainerStyle={styles.listItemContainer} // Добавляем стиль для элементов списка
            maxHeight={300} // Увеличиваем максимальную высоту выпадающего списка
          />

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
    </Modal>
  );
};

export default AddTransactionModal;