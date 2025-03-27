// AddTransactionModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, Alert } from 'react-native';
import styles from './styles'; // Імпортуємо стилі

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
      await onAdd(parsedAmount, category, transactionType, new Date().toISOString());
      setAmount('');
      setCategory('');
      onClose();
    } catch (error) {
      Alert.alert('Помилка', `Не вдалося додати ${transactionType === 'income' ? 'дохід' : 'витрату'}`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            placeholder="Сума"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />
          <TextInput
            placeholder="Категорія"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Додати" onPress={handleAdd} />
            <Button
              title="Скасувати"
              onPress={() => {
                setAmount('');
                setCategory('');
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTransactionModal;