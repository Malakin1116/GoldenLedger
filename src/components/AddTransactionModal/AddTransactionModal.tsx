import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from './styles'; // Импортируем стили из вашего файла

// Визначаємо типи для пропсів
interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (amount: number, category: string, type: string, date: string) => Promise<void>;
  transactionType: 'income' | 'costs';
  title: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAdd,
  transactionType,
  title,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // По умолчанию текущая дата

  const handleAdd = async () => {
    if (!amount || !category) {
      Alert.alert('Помилка', 'Заповніть усі поля');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Помилка', 'Сума має бути числом більше 0');
      return;
    }

    try {
      await onAdd(parsedAmount, category, transactionType, date);
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (error) {
      Alert.alert('Помилка', `Не вдалося додати ${transactionType === 'income' ? 'дохід' : 'витрату'}`);
    }
  };

  // Определяем знак в зависимости от типа транзакции
  const sign = transactionType === 'income' ? '+' : '-';

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
          <TextInput
            placeholder="Введіть категорію"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />

          <Text style={styles.label}>Дата:</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setAmount('');
                setCategory('');
                setDate(new Date().toISOString().split('T')[0]);
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