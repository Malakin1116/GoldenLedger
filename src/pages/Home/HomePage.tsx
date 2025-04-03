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
import { incomeCategories, costCategories } from '../../constants/categories'; // Імпорт категорій
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackNavigation } from '../../navigation/types';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
  category?: string;
}

interface HomePageProps {
  navigation: NativeStackNavigationProp<RootStackNavigation, 'HomePage'>;
  route: RouteProp<RootStackNavigation, 'HomePage'>;
}

const HomePage: React.FC<HomePageProps> = ({ navigation, route }) => {
  const monthNames = useMemo(
    () => [
      'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
      'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ],
    []
  );

  const today = useMemo(() => new Date(), []);
  const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState<boolean>(false);
  const [isCostModalVisible, setCostModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(`${today.getDate()} ${monthNames[today.getMonth()]}`);
  const [currentMonthState, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYearState, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const updatedTransactions = route?.params?.monthlyTransactions;
      if (updatedTransactions) {
        setMonthlyTransactions(updatedTransactions);
      }
      setSelectedDate(`${today.getDate()} ${monthNames[today.getMonth()]}`);
    });
    return unsubscribe;
  }, [navigation, route?.params?.monthlyTransactions, monthNames, today]);

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
            name: item.category || 'Продукт',
            amount: item.amount,
            type: item.type,
            date: item.date,
            category: item.category || 'Інший дохід',
          }));

        const fetchedCosts: Transaction[] = transactions
          .filter((item: any) => item.type.toLowerCase() === 'costs')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Витрата',
            amount: item.amount,
            type: item.type,
            date: item.date,
            category: item.category || 'Інші витрати',
          }));

        setIncomes(fetchedIncomes);
        setCosts(fetchedCosts);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
          return;
        }
        console.error('Не вдалося завантажити транзакції:', error);
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
          name: item.category || 'Невідомо',
          amount: item.amount,
          type: item.type,
          date: item.date,
          category: item.category || (item.type.toLowerCase() === 'income' ? 'Інший дохід' : 'Інші витрати'),
        }));
        setMonthlyTransactions(mappedTransactions);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
          return;
        }
        console.error('Не вдалося завантажити місячні транзакції:', error);
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
        return transactionDate === dateStr;
      });

      let filteredDailyTransactions: Transaction[] = dailyTransactions;

      if (selectedCategory) {
        if (selectedCategory === 'Всі доходи') {
          filteredDailyTransactions = dailyTransactions.filter((t) => t.type.toLowerCase() === 'income');
        } else if (selectedCategory === 'Всі витрати') {
          filteredDailyTransactions = dailyTransactions.filter((t) => t.type.toLowerCase() === 'costs');
        } else {
          filteredDailyTransactions = dailyTransactions.filter((t) => t.category === selectedCategory);
        }
      }

      const dailyIncome = filteredDailyTransactions
        .filter((t) => t.type.toLowerCase() === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const dailyCosts = filteredDailyTransactions
        .filter((t) => t.type.toLowerCase() === 'costs')
        .reduce((sum, t) => sum + t.amount, 0);

      return dailyIncome - dailyCosts;
    },
    [currentYearState, currentMonthState, monthlyTransactions, selectedCategory]
  );

  const filteredIncomes = useMemo(() => {
    if (selectedCategory === 'Всі доходи') return incomes;
    if (selectedCategory === 'Всі витрати') return [];
    return selectedCategory ? incomes.filter((item) => item.category === selectedCategory) : incomes;
  }, [incomes, selectedCategory]);

  const filteredCosts = useMemo(() => {
    if (selectedCategory === 'Всі витрати') return costs;
    if (selectedCategory === 'Всі доходи') return [];
    return selectedCategory ? costs.filter((item) => item.category === selectedCategory) : costs;
  }, [costs, selectedCategory]);

  const totalIncome = useMemo(() => filteredIncomes.reduce((sum, item) => sum + item.amount, 0), [filteredIncomes]);
  const totalCosts = useMemo(() => filteredCosts.reduce((sum, item) => sum + item.amount, 0), [filteredCosts]);
  const sum = useMemo(() => totalIncome - totalCosts, [totalIncome, totalCosts]);
  const budget = useMemo(() => 0 + totalIncome - totalCosts, [totalIncome, totalCosts]);

  const handleDateSelect = useCallback(
    (day: number) => {
      const selectedDateStr = `${day} ${monthNames[currentMonthState]}`;
      setSelectedDate(selectedDateStr);
      const formattedDate = `${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      navigation.navigate(
        formattedDate === todayDateStr ? ScreenNames.DAY_PAGE : ScreenNames.DAY_TRANSACTIONS,
        {
          selectedDate: formattedDate,
          selectedYear: currentYearState,
          monthlyTransactions,
        }
      );
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
    console.log('HomePage handleFilterPress - Нова обрана категорія:', category);
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
          name: category || 'Невідомо',
          amount,
          type,
          date: todayDate,
          category: category || (type.toLowerCase() === 'income' ? 'Інший дохід' : 'Інші витрати'),
        };

        const transactionsResponse = await fetchTransactionsToday();
        const transactions = Array.isArray(transactionsResponse) ? transactionsResponse : transactionsResponse.data || [];
        const fetchedIncomes: Transaction[] = transactions
          .filter((item: any) => item.type.toLowerCase() === 'income')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Продукт',
            amount: item.amount,
            type: item.type,
            date: item.date,
            category: item.category || 'Інший дохід',
          }));
        const fetchedCosts: Transaction[] = transactions
          .filter((item: any) => item.type.toLowerCase() === 'costs')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Витрата',
            amount: item.amount,
            type: item.type,
            date: item.date,
            category: item.category || 'Інші витрати',
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
              name: item.category || 'Невідомо',
              amount: item.amount,
              type: item.type,
              date: item.date,
              category: item.category || (item.type.toLowerCase() === 'income' ? 'Інший дохід' : 'Інші витрати'),
            }))
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
          return;
        }
        console.error('Помилка додавання транзакції:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentMonthState, currentYearState, navigation, today]
  );

  const daysInMonth = new Date(currentYearState, currentMonthState + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYearState, currentMonthState, 1).getDay();

  console.log('HomePage render - Обрана категорія:', selectedCategory);

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
        currentDay={today.getDate()}
        currentMonth={monthNames[today.getMonth()]}
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