// screens/HomePage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import Calendar from '../../components/Calendar/Calendar';
import Summary from '../../components/Summary/Summary';
import Budget from '../../components/Budget/Budget';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import { createTransaction, fetchTransactionsToday, fetchTransactionsForMonth } from '../../utils/api';
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  [ScreenNames.DAY_PAGE]: undefined;
  [ScreenNames.DAY_TRANSACTIONS]: {
    selectedDate: string;
    selectedYear: number;
    monthlyTransactions: Transaction[];
  };
  [ScreenNames.SETTINGS_PAGE]: undefined;
  [ScreenNames.LOGIN_PAGE]: undefined;
};

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
  category?: string;
}

interface HomePageProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList>;
}

const HomePage: React.FC<HomePageProps> = ({ navigation, route }) => {
  const monthNames = useMemo(
    () => [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    []
  );

  const today = useMemo(() => new Date(), []);

  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; // "2025-03-30"

  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState<boolean>(false);
  const [isCostModalVisible, setCostModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(`${currentDay} ${monthNames[currentMonth]}`);
  const [currentMonthState, setCurrentMonth] = useState<number>(currentMonth);
  const [currentYearState, setCurrentYear] = useState<number>(currentYear);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Списки категорій
  const incomeCategories = useMemo(
    () => [
      'Salary',
      'Freelance',
      'Investment',
      'Gifts',
      'Business',
      'Rental',
      'Dividends',
      'Other Income'
    ],
    []
  );

  const costCategories = useMemo(
    () => [
      'Food',
      'Transport',
      'Housing',
      'Utilities',
      'Entertainment',
      'Shopping',
      'Health',
      'Education',
      'Travel',
      'Other Costs'
    ],
    []
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const updatedTransactions = route?.params?.monthlyTransactions;
      if (updatedTransactions) {
        setMonthlyTransactions(updatedTransactions);
      }
    });
    return unsubscribe;
  }, [navigation, route?.params?.monthlyTransactions]);

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
            category: item.category || 'Other Income',
          }));

        const fetchedCosts: Transaction[] = transactions
          .filter((item: any) => item.type.toLowerCase() === 'costs')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Expense',
            amount: item.amount,
            type: item.type,
            date: item.date,
            category: item.category || 'Other Costs',
          }));

        setIncomes(fetchedIncomes);
        setCosts(fetchedCosts);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
          return;
        }
        console.error('Failed to load transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [navigation]);

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
          category: item.category || (item.type.toLowerCase() === 'income' ? 'Other Income' : 'Other Costs'),
        }));
        setMonthlyTransactions(mappedTransactions);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
          return;
        }
        console.error('Failed to load monthly transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthlyTransactions();
  }, [currentMonthState, currentYearState, navigation]);

  const getDailySum = useCallback(
    (day: number): number => {
      const dateStr = `${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dailyTransactions = monthlyTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
        return transactionDate === dateStr && (!selectedCategory || transaction.category === selectedCategory);
      });

      const dailyIncome = dailyTransactions
        .filter((t) => t.type.toLowerCase() === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const dailyCosts = dailyTransactions
        .filter((t) => t.type.toLowerCase() === 'costs')
        .reduce((sum, t) => sum + t.amount, 0);

      return dailyIncome - dailyCosts;
    },
    [currentYearState, currentMonthState, monthlyTransactions, selectedCategory]
  );

  const filteredIncomes = useMemo(() => {
    return selectedCategory ? incomes.filter((item) => item.category === selectedCategory) : incomes;
  }, [incomes, selectedCategory]);

  const filteredCosts = useMemo(() => {
    return selectedCategory ? costs.filter((item) => item.category === selectedCategory) : costs;
  }, [costs, selectedCategory]);

  const totalIncome = useMemo(() => {
    return filteredIncomes.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredIncomes]);

  const totalCosts = useMemo(() => {
  return filteredCosts.reduce((sum, item) => sum + item.amount, 0); // Заміни t на item
}, [filteredCosts]);

  const sum = useMemo(() => {
    return totalIncome - totalCosts;
  }, [totalIncome, totalCosts]);

  const budget = useMemo(() => {
    return 0 + totalIncome - totalCosts;
  }, [totalIncome, totalCosts]);

  const handleDateSelect = useCallback(
    (day: number) => {
      const selectedDateStr = `${day} ${monthNames[currentMonthState]}`;
      setSelectedDate(selectedDateStr);
      const formattedDate = `${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      if (formattedDate === todayDateStr) {
        navigation.navigate(ScreenNames.DAY_PAGE);
      } else {
        navigation.navigate(ScreenNames.DAY_TRANSACTIONS, {
          selectedDate: formattedDate,
          selectedYear: currentYearState,
          monthlyTransactions,
        });
      }
    },
    [currentMonthState, currentYearState, monthNames, monthlyTransactions, navigation, todayDateStr]
  );

  const handlePrevMonth = useCallback(() => {
    if (currentMonthState === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYearState - 1);
    } else {
      setCurrentMonth(currentMonthState - 1);
    }
  }, [currentMonthState, currentYearState]);

  const handleNextMonth = useCallback(() => {
    if (currentMonthState === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYearState + 1);
    } else {
      setCurrentMonth(currentMonthState + 1);
    }
  }, [currentMonthState, currentYearState]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate(ScreenNames.SETTINGS_PAGE);
  }, [navigation]);

  const handleFilterPress = useCallback((category: string | null) => {
    console.log('HomePage handleFilterPress - New selectedCategory:', category);
    setSelectedCategory(category);
  }, []);

  const handleAddTransaction = useCallback(
    async (amount: number, category: string, type: string, _date: string) => {
      setIsLoading(true);
      try {
        const todayDate = today.toISOString().split('T')[0];
        const response = await createTransaction(amount, category, type, todayDate);
        const newTransaction = {
          id: response?.data?._id || Date.now().toString(),
          name: category || 'Unknown',
          amount,
          type,
          date: todayDate,
          category: category || (type.toLowerCase() === 'income' ? 'Other Income' : 'Other Costs'),
        };

        const transactionsResponse = await fetchTransactionsToday();
        const transactions = Array.isArray(transactionsResponse) ? transactionsResponse : transactionsResponse.data || [];
        const fetchedIncomes: Transaction[] = transactions
          .filter((item: any) => item.type.toLowerCase() === 'income')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Product',
            amount: item.amount,
            type: item.type,
            date: item.date,
            category: item.category || 'Other Income',
          }));
        const fetchedCosts: Transaction[] = transactions
          .filter((item: any) => item.type.toLowerCase() === 'costs')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Expense',
            amount: item.amount,
            type: item.type,
            date: item.date,
            category: item.category || 'Other Costs',
          }));
        setIncomes(fetchedIncomes);
        setCosts(fetchedCosts);

        const transactionMonth = new Date(todayDate).getMonth();
        const transactionYear = new Date(todayDate).getFullYear();
        if (transactionMonth === currentMonthState && transactionYear === currentYearState) {
          setMonthlyTransactions(prev => [...prev, newTransaction]);
        } else {
          const monthlyResponse = await fetchTransactionsForMonth(currentMonthState, currentYearState);
          const fetchedMonthlyTransactions = Array.isArray(monthlyResponse) ? monthlyResponse : monthlyResponse.data || [];
          setMonthlyTransactions(
            fetchedMonthlyTransactions.map((item: any) => ({
              id: item._id,
              name: item.category || 'Unknown',
              amount: item.amount,
              type: item.type,
              date: item.date,
              category: item.category || (item.type.toLowerCase() === 'income' ? 'Other Income' : 'Other Costs'),
            }))
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
          return;
        }
        console.error('Add transaction error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentMonthState, currentYearState, navigation, today]
  );

  const daysInMonth = new Date(currentYearState, currentMonthState + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYearState, currentMonthState, 1).getDay();

  // Дебагінг: перевіряємо selectedCategory перед передачею в Calendar
  console.log('HomePage render - selectedCategory:', selectedCategory);

  return (
    <ScrollView style={styles.container}>
      <Calendar
        currentMonth={currentMonthState}
        currentYear={currentYearState}
        selectedDate={selectedDate}
        monthNames={monthNames}
        daysInMonth={daysInMonth}
        firstDayOfMonth={firstDayOfMonth}
        getDailySum={getDailySum}
        handleDateSelect={handleDateSelect}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        handleFilterPress={handleFilterPress}
        incomeCategories={incomeCategories}
        costCategories={costCategories}
        selectedCategory={selectedCategory}
      />
      <Budget
        totalIncome={totalIncome}
        totalCosts={totalCosts}
        budget={budget}
        handleProfilePress={handleProfilePress}
      />
      <Summary
        currentDay={currentDay}
        currentMonth={monthNames[currentMonth]}
        totalIncome={totalIncome}
        totalCosts={totalCosts}
        sum={sum}
        setIncomeModalVisible={setIncomeModalVisible}
        setCostModalVisible={setCostModalVisible}
      />
      <AddTransactionModal
        visible={isIncomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="income"
        title="Додати дохід"
      />
      <AddTransactionModal
        visible={isCostModalVisible}
        onClose={() => setCostModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="costs"
        title="Додати витрату"
      />
      <LoadingOverlay isLoading={isLoading} />
    </ScrollView>
  );
};

export default HomePage;
