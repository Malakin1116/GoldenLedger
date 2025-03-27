import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function DayPage() {
  // Дані для доходів і витрат (можете замінити на дані з API)
  const [incomes, setIncomes] = useState([
    { id: '1', name: 'Product', amount: 20 },
    { id: '2', name: 'Coffee', amount: 10 },
    { id: '3', name: 'Car', amount: 50 },
    { id: '4', name: 'Tell', amount: 20 },
  ]);

  const [costs, setCosts] = useState([
    { id: '1', name: 'Salery', amount: 30 },
    { id: '2', name: 'Deposit', amount: 30 },
    { id: '3', name: 'Cripto', amount: 30 },
  ]);

  // Функції для редагування та видалення (поки просто логи)
  const handleEditIncome = (id) => {
    console.log('Edit income:', id);
  };

  const handleDeleteIncome = (id) => {
    setIncomes(incomes.filter(item => item.id !== id));
  };

  const handleEditCost = (id) => {
    console.log('Edit cost:', id);
  };

  const handleDeleteCost = (id) => {
    setCosts(costs.filter(item => item.id !== id));
  };

  // Функції для додавання доходів і витрат (поки просто логи)
  const handleAddIncome = () => {
    console.log('Add Income');
  };

  const handleAddCosts = () => {
    console.log('Add Costs');
  };

  // Підрахунок сум
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
  const budget = 0 + totalIncome - totalCosts;

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>📅</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>18 May</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>❤️</Text>
        </TouchableOpacity>
      </View>

      {/* Вкладки */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Year</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
      </View>

      {/* Секція доходів */}
      <View style={styles.section}>
        <FlatList
          data={incomes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{`${item.name}: ${item.amount}$`}</Text>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditIncome(item.id)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteIncome(item.id)}
                >
                  <Text style={styles.actionButtonText}>Del</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Sum Income: {totalIncome}$</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
            <Text style={styles.addButtonText}>Add Income</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Секція витрат */}
      <View style={styles.section}>
        <FlatList
          data={costs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{`${item.name}: ${item.amount}$`}</Text>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditCost(item.id)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteCost(item.id)}
                >
                  <Text style={styles.actionButtonText}>Del</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Sum Costs: {totalCosts}$</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddCosts}>
            <Text style={styles.addButtonText}>Add Costs</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Бюджет */}
      <View style={styles.budgetSection}>
        <Text style={styles.budgetText}>
          Budget: 0 + {totalIncome} - {totalCosts} = {budget}$
        </Text>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}