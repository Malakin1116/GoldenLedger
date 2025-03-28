import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import { createTransaction, fetchTransactionsToday } from '../../utils/api';
import styles from './styles';

// Визначаємо типи для транзакцій
interface Transaction {
  id: string;
  name: string;
  amount: number;
}

const HomePage: React.FC = ({ navigation }) => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState<boolean>(false);
  const [isCostModalVisible, setCostModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('18 May'); // Початкова дата
  const [currentMonth, setCurrentMonth] = useState<number>(4); // Травень (0 - Січень, 4 - Травень)
  const [currentYear, setCurrentYear] = useState<number>(2025);

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

  // Функція для переходу на DayPage з вибраною датою
  const handleDateSelect = (day: number) => {
    const selectedDateStr = `${day} May`; // Форматуємо дату
    setSelectedDate(selectedDateStr);
    navigation.navigate('DayPage', { selectedDate: selectedDateStr });
  };

  // Функція для зміни місяця (назад)
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Функція для зміни місяця (вперед)
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Генерація днів для календаря
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }, () => null);

  // Підрахунок сум
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
  const budget = 0 + totalIncome - totalCosts;
  const sum = totalIncome - totalCosts;

  // Назви місяців
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Календар */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Text style={styles.arrow}>◄</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{`${monthNames[currentMonth]} ${currentYear}`}</Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.arrow}>►</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.daysOfWeek}>
          <Text style={styles.dayOfWeek}>Mon</Text>
          <Text style={styles.dayOfWeek}>Tue</Text>
          <Text style={styles.dayOfWeek}>Wed</Text>
          <Text style={styles.dayOfWeek}>Thu</Text>
          <Text style={styles.dayOfWeek}>Fri</Text>
          <Text style={styles.dayOfWeek}>Sat</Text>
          <Text style={styles.dayOfWeek}>Sun</Text>
        </View>

        <View style={styles.daysContainer}>
          {emptyDays.map((_, index) => (
            <View key={`empty-${index}`} style={styles.dayEmpty} />
          ))}
          {daysArray.map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.day,
                selectedDate === `${day} May` && styles.selectedDay,
              ]}
              onPress={() => handleDateSelect(day)}
            >
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Секція підрахунку */}
      <View style={styles.summaryContainer}>
        <Text style={styles.todayText}>TODAY 18 MAY</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Income: {totalIncome}$</Text>
          <Text style={styles.summaryText}>Costs: {totalCosts}$</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => setIncomeModalVisible(true)}>
            <Text style={styles.addButtonText}>Add Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => setCostModalVisible(true)}>
            <Text style={styles.addButtonText}>Add Costs</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sumText}>SUM: {sum}$</Text>
      </View>

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

      {/* Индикатор загрузки */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5a8a9a" />
        </View>
      )}
    </ScrollView>
  );
};

export default HomePage;