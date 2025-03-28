import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import Calendar from '../../components/Calendar/Calendar';
import Summary from '../../components/Summary/Summary';
import Budget from '../../components/Budget/Budget';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import { createTransaction, fetchTransactionsToday, fetchTransactionsForMonth } from '../../utils/api';
import styles from './styles';

// Визначаємо типи для транзакцій
interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
}

const HomePage: React.FC = ({ navigation }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Встановлюємо поточну дату
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState<boolean>(false);
  const [isCostModalVisible, setCostModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(`${currentDay} ${monthNames[currentMonth]}`);
  const [currentMonthState, setCurrentMonth] = useState<number>(currentMonth);
  const [currentYearState, setCurrentYear] = useState<number>(currentYear);

  // Завантаження транзакцій за день
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTransactionsToday();
        const transactions = Array.isArray(response) ? response : response.data || [];

        const fetchedIncomes: Transaction[] = transactions
          .filter((item: any) => item.type.toLowerCase() === 'income')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Product',
            amount: item.amount,
            type: item.type,
            date: item.date,
          }));

        const fetchedCosts: Transaction[] = transactions
          .filter((item: any) => item.type.toLowerCase() === 'costs')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Expense',
            amount: item.amount,
            type: item.type,
            date: item.date,
          }));

        setIncomes(fetchedIncomes);
        setCosts(fetchedCosts);
      } catch (error) {
        if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
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

  // Завантаження транзакцій за місяць
  useEffect(() => {
    const loadMonthlyTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTransactionsForMonth(currentMonthState, currentYearState);
        const transactions = Array.isArray(response) ? response : response.data || [];
        const mappedTransactions = transactions.map((item: any) => ({
          id: item._id,
          name: item.category || 'Unknown',
          amount: item.amount,
          type: item.type,
          date: item.date,
        }));
        setMonthlyTransactions(mappedTransactions);
      } catch (error) {
        if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate('LoginPage');
        } else {
          console.error('Failed to load monthly transactions:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthlyTransactions();
  }, [currentMonthState, currentYearState, navigation]);

  // Функція для підрахунку суми транзакцій за день
  const getDailySum = (day: number): number => {
    const dateStr = `${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dailyTransactions = monthlyTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
      return transactionDate === dateStr;
    });

    const dailyIncome = dailyTransactions
      .filter((t) => t.type.toLowerCase() === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const dailyCosts = dailyTransactions
      .filter((t) => t.type.toLowerCase() === 'costs')
      .reduce((sum, t) => sum + t.amount, 0);

    return dailyIncome - dailyCosts;
  };

  // Функція для визначення кольору дня
  const getDayColor = (day: number): string => {
    const sum = getDailySum(day);
    if (sum > 0) return '#4CAF50'; // Зелений
    if (sum < 0) return '#ff4d4d'; // Червоний
    return '#ffffff'; // Білий
  };

  // Функція для додавання транзакції
  const handleAddTransaction = async (amount: number, category: string, type: string, date: string) => {
    setIsLoading(true);
    try {
      const todayDate = today.toISOString().split('T')[0];
      await createTransaction(amount, category, type, todayDate);
      const response = await fetchTransactionsToday();
      const transactions = Array.isArray(response) ? response : response.data || [];
      const fetchedIncomes: Transaction[] = transactions
        .filter((item: any) => item.type.toLowerCase() === 'income')
        .map((item: any) => ({
          id: item._id,
          name: item.category || 'Product',
          amount: item.amount,
          type: item.type,
          date: item.date,
        }));
      const fetchedCosts: Transaction[] = transactions
        .filter((item: any) => item.type.toLowerCase() === 'costs')
        .map((item: any) => ({
          id: item._id,
          name: item.category || 'Expense',
          amount: item.amount,
          type: item.type,
          date: item.date,
        }));
      setIncomes(fetchedIncomes);
      setCosts(fetchedCosts);

      const monthlyResponse = await fetchTransactionsForMonth(currentMonthState, currentYearState);
      const monthlyTransactions = Array.isArray(monthlyResponse) ? monthlyResponse : monthlyResponse.data || [];
      setMonthlyTransactions(
        monthlyTransactions.map((item: any) => ({
          id: item._id,
          name: item.category || 'Unknown',
          amount: item.amount,
          type: item.type,
          date: item.date,
        }))
      );
    } catch (error) {
      if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
        navigation.navigate('LoginPage');
      } else {
        console.error('Add transaction error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePress = () => {
    navigation.navigate('LoginPage');
  };

  const handleDateSelect = (day: number) => {
    const selectedDateStr = `${day} ${monthNames[currentMonthState]}`;
    setSelectedDate(selectedDateStr);
    navigation.navigate('DayPage', { selectedDate: selectedDateStr });
  };

  const handlePrevMonth = () => {
    if (currentMonthState === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYearState - 1);
    } else {
      setCurrentMonth(currentMonthState - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthState === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYearState + 1);
    } else {
      setCurrentMonth(currentMonthState + 1);
    }
  };

  const daysInMonth = new Date(currentYearState, currentMonthState + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYearState, currentMonthState, 1).getDay();

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
  const budget = 0 + totalIncome - totalCosts;
  const sum = totalIncome - totalCosts;

  return (
    <ScrollView style={styles.container}>
      <Calendar
        currentMonth={currentMonthState}
        currentYear={currentYearState}
        selectedDate={selectedDate}
        monthNames={monthNames}
        daysInMonth={daysInMonth}
        firstDayOfMonth={firstDayOfMonth}
        getDayColor={getDayColor}
        getDailySum={getDailySum}
        handleDateSelect={handleDateSelect}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
      />

      <Summary
        currentDay={currentDay}
        currentMonth={monthNames[currentMonthState]}
        totalIncome={totalIncome}
        totalCosts={totalCosts}
        sum={sum}
        setIncomeModalVisible={setIncomeModalVisible}
        setCostModalVisible={setCostModalVisible}
      />

      <Budget
        totalIncome={totalIncome}
        totalCosts={totalCosts}
        budget={budget}
        handleProfilePress={handleProfilePress}
      />

      <AddTransactionModal
        visible={isIncomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="income"
        title="Додати дохід"
        navigation={navigation}
      />
      <AddTransactionModal
        visible={isCostModalVisible}
        onClose={() => setCostModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="costs"
        title="Додати витрату"
        navigation={navigation}
      />

      <LoadingOverlay isLoading={isLoading} />
    </ScrollView>
  );
};

export default HomePage;