import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import IncomeList from '../../components/IncomeList/IncomeList';
import CostList from '../../components/CostList/CostList';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import { createTransaction, fetchTransactionsToday, deleteTransaction } from '../../utils/api';
import styles from './styles';

// Визначаємо типи для транзакцій
interface Transaction {
  id: string;
  name: string;
  amount: number;
}

const DayPage: React.FC = ({ navigation }) => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState<boolean>(false);
  const [isCostModalVisible, setCostModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Завантаження транзакцій при монтуванні компонента
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTransactionsToday();
        console.log('Fetch transactions response:', response);

        const transactions = Array.isArray(response) ? response : response.data || [];
        console.log('Transactions:', transactions);

        const fetchedIncomes: Transaction[] = transactions
          .filter((item: any) => item.type !== 'costs')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Product',
            amount: item.amount,
          }));

        const fetchedCosts: Transaction[] = transactions
          .filter((item: any) => item.type === 'costs')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Expense',
            amount: item.amount,
          }));

        setIncomes(fetchedIncomes);
        setCosts(fetchedCosts);
      } catch (error) {
        if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          console.log('Session expired, navigating to Login');
          navigation.navigate('LoginPage');
        } else {
          console.error('Failed to load transactions:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [navigation]);

  // Функція для редагування доходів (поки лог)
  const handleEditIncome = (id: string) => {
    console.log('Редагувати дохід:', id);
  };

  // Функція для видалення доходів через API
  const handleDeleteIncome = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteTransaction(id);
      setIncomes(incomes.filter((item) => item.id !== id));
      console.log('Дохід успішно видалено:', id);
    } catch (error) {
      if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
        console.log('Session expired, navigating to Login');
        navigation.navigate('LoginPage');
      } else {
        console.error('Delete income error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Функція для редагування витрат (поки лог)
  const handleEditCost = (id: string) => {
    console.log('Редагувати витрату:', id);
  };

  // Функція для видалення витрат через API
  const handleDeleteCost = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteTransaction(id);
      setCosts(costs.filter((item) => item.id !== id));
      console.log('Витрата успішно видалена:', id);
    } catch (error) {
      if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
        console.log('Session expired, navigating to Login');
        navigation.navigate('LoginPage');
      } else {
        console.error('Delete cost error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Функція для додавання транзакції
  const handleAddTransaction = async (amount: number, category: string, type: string, date: string) => {
    setIsLoading(true);
    try {
      await createTransaction(amount, category, type, date);
      const response = await fetchTransactionsToday();
      console.log('Fetch transactions response:', response);

      const transactions = Array.isArray(response) ? response : response.data || [];
      const fetchedIncomes: Transaction[] = transactions
        .filter((item: any) => item.type !== 'costs')
        .map((item: any) => ({
          id: item._id,
          name: item.category || 'Product',
          amount: item.amount,
        }));
      const fetchedCosts: Transaction[] = transactions
        .filter((item: any) => item.type === 'costs')
        .map((item: any) => ({
          id: item._id,
          name: item.category || 'Expense',
          amount: item.amount,
        }));
      setIncomes(fetchedIncomes);
      setCosts(fetchedCosts);
      console.log('Транзакція успішно додана:', { amount, category, type, date });
    } catch (error) {
      if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
        console.log('Session expired, navigating to Login');
        navigation.navigate('LoginPage');
      } else {
        console.error('Add transaction error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Функція для переходу на сторінку входу
  const handleProfilePress = () => {
    navigation.navigate('LoginPage');
  };

  // Функція для переходу на HomePage
  const handleCalendarPress = () => {
    navigation.navigate('HomePage');
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
          <TouchableOpacity style={styles.iconButton} onPress={handleCalendarPress}>
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
      <IncomeList
        incomes={incomes}
        onEdit={handleEditIncome}
        onDelete={handleDeleteIncome}
        onAdd={() => setIncomeModalVisible(true)}
        totalIncome={totalIncome}
      />

      {/* Секція витрат */}
      <CostList
        costs={costs}
        onEdit={handleEditCost}
        onDelete={handleDeleteCost}
        onAdd={() => setCostModalVisible(true)}
        totalCosts={totalCosts}
      />

      {/* Бюджет */}
      <View style={styles.budgetSection}>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetText}>
            Budget: 0 + {totalIncome} - {totalCosts} = {budget}$
          </Text>
          <View style={styles.budgetIndicator}>
            <View
              style={[
                styles.budgetBar,
                {
                  width: `${Math.min(Math.abs(budget) / 1000 * 100, 100)}%`,
                  backgroundColor: budget >= 0 ? '#4CAF50' : '#ff4d4d',
                },
              ]}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
          <Text style={styles.iconText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Модальне вікно для доходів */}
      <AddTransactionModal
        visible={isIncomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="income"
        title="Додати дохід"
        navigation={navigation}
      />

      {/* Модальне вікно для витрат */}
      <AddTransactionModal
        visible={isCostModalVisible}
        onClose={() => setCostModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="costs"
        title="Додати витрату"
        navigation={navigation}
      />

      {/* Индикатор загрузки (рендерится последним, чтобы быть поверх всего) */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5a8a9a" />
        </View>
      )}
    </View>
  );
};

export default DayPage;