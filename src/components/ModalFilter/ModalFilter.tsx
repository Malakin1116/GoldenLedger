import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
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
  selectedCategory = null, // За замовчуванням null, якщо undefined
}) => {
  const [tempSelectedCategory, setTempSelectedCategory] = useState<string | null>(selectedCategory ?? null);

  useEffect(() => {
    if (visible) {
      setTempSelectedCategory(selectedCategory ?? null); // Обробка undefined
    }
  }, [visible, selectedCategory]);

  const renderCategoryItem = (item: { label: string; value: string }) => {
    return (
      <TouchableOpacity
        style={item.value === tempSelectedCategory ? styles.selectedCategoryItem : styles.categoryItem}
        onPress={() => {
          setTempSelectedCategory(item.value);
          onSelect(item.value);
          onClose();
        }}
      >
        <Text style={styles.categoryText}>{item.label}</Text>
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
          <Text style={styles.modalTitle}>Виберіть категорію</Text>

          {showAllOption && (
            <TouchableOpacity
              style={tempSelectedCategory === null ? styles.selectedAllButton : styles.allButton}
              onPress={() => {
                setTempSelectedCategory(null);
                onSelect(null);
                onClose();
              }}
            >
              <Text style={styles.categoryText}>Усі</Text>
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
                  <Text style={styles.sectionTitle}>Витрати</Text>
                  <TouchableOpacity
                    style={tempSelectedCategory === 'Всі витрати' ? styles.selectedCategoryItem : styles.categoryItem}
                    onPress={() => {
                      setTempSelectedCategory('Всі витрати');
                      onSelect('Всі витрати');
                      onClose();
                    }}
                  >
                    <Text style={styles.categoryText}>Усі витрати</Text>
                  </TouchableOpacity>
                  {costCategories.map((item) => (
                    <View key={item.value}>{renderCategoryItem(item)}</View>
                  ))}
                </View>
              )}

              {incomeCategories.length > 0 && (
                <View style={styles.column}>
                  <Text style={styles.sectionTitle}>Дохід</Text>
                  <TouchableOpacity
                    style={tempSelectedCategory === 'Всі доходи' ? styles.selectedCategoryItem : styles.categoryItem}
                    onPress={() => {
                      setTempSelectedCategory('Всі доходи');
                      onSelect('Всі доходи');
                      onClose();
                    }}
                  >
                    <Text style={styles.categoryText}>Усі доходи</Text>
                  </TouchableOpacity>
                  {incomeCategories.map((item) => (
                    <View key={item.value}>{renderCategoryItem(item)}</View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.scrollFade} />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Закрити</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalFilter;
