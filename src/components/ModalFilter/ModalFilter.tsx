// components/ModalFilter/ModalFilter.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import styles from './styles';

interface ModalFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: string | null) => void;
  incomeCategories: string[];
  costCategories: string[];
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
  selectedCategory,
}) => {
  const [tempSelectedCategory, setTempSelectedCategory] = useState<string | null>(selectedCategory);

  // Оновлюємо локальний стан при зміні selectedCategory або відкритті модального вікна
  useEffect(() => {
    if (visible) {
      setTempSelectedCategory(selectedCategory);
    }
  }, [visible, selectedCategory]);

  const renderCategoryItem = ({ item }: { item: string }) => {
    console.log(`Item: ${item}, TempSelectedCategory: ${tempSelectedCategory}, IsSelected: ${item === tempSelectedCategory}`);

    return (
      <TouchableOpacity
        style={item === tempSelectedCategory ? styles.selectedCategoryItem : styles.categoryItem}
        onPress={() => {
          setTempSelectedCategory(item); // Оновлюємо локальний стан
          onSelect(item);
          onClose();
        }}
      >
        <Text style={styles.categoryText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Виберіть категорію</Text>
          {showAllOption && (
            <TouchableOpacity
              style={tempSelectedCategory === null ? styles.selectedCategoryItem : styles.categoryItem}
              onPress={() => {
                setTempSelectedCategory(null);
                onSelect(null);
                onClose();
              }}
            >
              <Text style={styles.categoryText}>Усі</Text>
            </TouchableOpacity>
          )}
          {incomeCategories.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Дохід</Text>
              <FlatList
                data={incomeCategories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
              />
            </>
          )}
          {costCategories.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Витрати</Text>
              <FlatList
                data={costCategories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
              />
            </>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Закрити</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalFilter;