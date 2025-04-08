import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTransactions as useTransactionContext } from '../../context/TransactionContext';
import Calendar from '../../components/Calendar/Calendar';
import Summary from '../../components/Summary/Summary';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import { createTransaction, fetchTransactionsToday, fetchTransactionsForMonth } from '../../utils/api';
import { filterTransactionsByCategory } from '../../utils/transactionUtils';
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';
import { incomeCategories, costCategories } from '../../constants/categories';
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
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { monthlyTransactions, setMonthlyTransactions } = useTransactionContext();
  const today = useMemo(() => new Date(), []);

  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState<boolean>(false);
  const [isCostModalVisible, setCostModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(`${today.getDate()} ${t(`calendar.months.${today.getMonth()}`)}`);
  const [currentMonthState, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYearState, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>('');

  useEffect(() => {
    setSelectedDate(`${today.getDate()} ${t(`calendar.months.${today.getMonth()}`)}`);
  }, [language, t, today]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const updatedTransactions = route?.params?.monthlyTransactions;
      if (updatedTransactions) {
        setMonthlyTransactions(updatedTransactions);
      }
      setSelectedDate(`${today.getDate()} ${t(`calendar.months.${today.getMonth()}`)}`);

      // Оновлюємо incomes і costs після повернення з DayTransactions
      const loadTodayTransactions = async () => {
        setIsLoading(true);
        try {
          const response = await fetchTransactionsToday();
          const transactions = Array.isArray(response) ? response : response.data || [];
          const fetchedIncomes = transactions
            .filter((item: any) => item.type.toLowerCase() === 'income')
            .map((item: any) => ({
              id: item._id,
              name: item.category || 'Продукт',
              amount: item.amount,
              type: item.type,
              date: item.date,
              category: item.category || 'Інший дохід',
            }));
          const fetchedCosts = transactions
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
          console.error('Не вдалося завантажити транзакції за сьогодні:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadTodayTransactions();
    });
    return unsubscribe;
  }, [navigation, route?.params?.monthlyTransactions, today, t, setMonthlyTransactions]);

  // Завантаження транзакцій за сьогоднішній день для Summary
  useEffect(() => {
    const loadTodayTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTransactionsToday();
        const transactions = Array.isArray(response) ? response : response.data || [];
        const fetchedIncomes = transactions
          .filter((item: any) => item.type.toLowerCase() === 'income')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Продукт',
            amount: item.amount,
            type: item.type,
            date: item.date,
            category: item.category || 'Інший дохід',
          }));
        const fetchedCosts = transactions
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
        console.error('Не вдалося завантажити транзакції за сьогодні:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodayTransactions();
  }, [navigation]);

  // Оновлення incomes і costs при зміні monthlyTransactions
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTransactions = monthlyTransactions.filter((tx) => tx.date === todayStr);
    const fetchedIncomes = todayTransactions
      .filter((item) => item.type.toLowerCase() === 'income')
      .map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        type: item.type,
        date: item.date,
        category: item.category || 'Інший дохід',
      }));
    const fetchedCosts = todayTransactions
      .filter((item) => item.type.toLowerCase() === 'costs')
      .map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        type: item.type,
        date: item.date,
        category: item.category || 'Інші витрати',
      }));
    setIncomes(fetchedIncomes);
    setCosts(fetchedCosts);
  }, [monthlyTransactions]);

  // Завантаження транзакцій за поточний місяць для календаря
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
          date: new Date(item.date).toISOString().split('T')[0],
          category: item.category || (item.type.toLowerCase() === 'income' ? 'Інший дохід' : 'Інші витрати'),
        }));
        setMonthlyTransactions(mappedTransactions);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
          return;
        }
        console.error('Не вдалося завантажити транзакції за місяць:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthlyTransactions();
  }, [currentMonthState, currentYearState, navigation, setMonthlyTransactions]);

  const getDailySum = useCallback(
    (day: number): number => {
      const dateStr = `${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dailyTransactions = monthlyTransactions.filter((transaction) => {
        const transactionDate = transaction.date;
        return transactionDate === dateStr;
      });

      const filteredDailyTransactions = filterTransactionsByCategory(dailyTransactions, selectedCategory);

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
    const filtered = filterTransactionsByCategory([...incomes, ...costs], selectedCategory);
    return filtered.filter((t) => t.type.toLowerCase() === 'income');
  }, [incomes, costs, selectedCategory]);

  const filteredCosts = useMemo(() => {
    const filtered = filterTransactionsByCategory([...incomes, ...costs], selectedCategory);
    return filtered.filter((t) => t.type.toLowerCase() === 'costs');
  }, [incomes, costs, selectedCategory]);

  const handleDateSelect = useCallback(
    (day: number) => {
      const selectedDateStr = `${day} ${t(`calendar.months.${currentMonthState}`)}`;
      setSelectedDate(selectedDateStr);
      const formattedDate = `${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDateForModal(formattedDate);

      navigation.navigate(ScreenNames.DAY_TRANSACTIONS, {
        selectedDate: formattedDate,
        selectedYear: currentYearState,
        monthlyTransactions,
      });
    },
    [currentMonthState, currentYearState, monthlyTransactions, navigation, t]
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

  const handleFilterPress = useCallback((category: string | null) => {
    console.log('HomePage handleFilterPress - Нова обрана категорія:', category);
    setSelectedCategory(category);
  }, []);

  const handleAddTransaction = useCallback(
    async (amount: number, category: string, type: string, _date: string) => {
      setIsLoading(true);
      try {
        const response = await createTransaction(amount, category, type, _date);
        console.log('createTransaction response:', response);

        // Оновлюємо транзакції за сьогодні для Summary
        const transactionsResponse = await fetchTransactionsToday();
        const transactions = Array.isArray(transactionsResponse) ? transactionsResponse.data || [] : transactionsResponse.data || [];
        const fetchedIncomes = transactions
          .filter((item: any) => item.type.toLowerCase() === 'income')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Продукт',
            amount: item.amount,
            type: item.type,
            date: item.date,
            category: item.category || 'Інший дохід',
          }));
        const fetchedCosts = transactions
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

        // Оновлюємо monthlyTransactions у контексті, якщо транзакція за поточний місяць
        const transactionMonth = new Date(_date).getMonth();
        const transactionYear = new Date(_date).getFullYear();
        if (transactionMonth === currentMonthState && transactionYear === currentYearState) {
          const monthlyResponse = await fetchTransactionsForMonth(currentMonthState, currentYearState);
          const fetchedMonthlyTransactions = Array.isArray(monthlyResponse) ? monthlyResponse : monthlyResponse.data || [];
          const updatedTransactions = fetchedMonthlyTransactions.map((item: any) => ({
            id: item._id,
            name: item.category || 'Невідомо',
            amount: item.amount,
            type: item.type,
            date: new Date(item.date).toISOString().split('T')[0],
            category: item.category || (item.type.toLowerCase() === 'income' ? 'Інший дохід' : 'Інші витрати'),
          }));
          setMonthlyTransactions(updatedTransactions);
          console.log('Updated monthlyTransactions in HomePage:', updatedTransactions);
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
    [navigation, setMonthlyTransactions, currentMonthState, currentYearState]
  );

  const daysInMonth = new Date(currentYearState, currentMonthState + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYearState, currentMonthState, 1).getDay();

  const allTransactions = [...incomes, ...costs];
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  console.log('HomePage render - Обрана категорія:', selectedCategory);

  return (
    <ScrollView style={styles.container}>
      <Calendar
        currentMonth={currentMonthState}
        currentYear={currentYearState}
        selectedDate={selectedDate}
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
      <Summary
        transactions={allTransactions}
        selectedDate={todayDate}
        setIncomeModalVisible={(visible) => {
          setSelectedDateForModal(`${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
          setIncomeModalVisible(visible);
        }}
        setCostModalVisible={(visible) => {
          setSelectedDateForModal(`${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
          setCostModalVisible(visible);
        }}
      />
      <AddTransactionModal
        visible={isIncomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="income"
        title={t('home.add_income')}
        selectedDate={selectedDateForModal}
      />
      <AddTransactionModal
        visible={isCostModalVisible}
        onClose={() => setCostModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="costs"
        title={t('home.add_cost')}
        selectedDate={selectedDateForModal}
      />
      <LoadingOverlay isLoading={isLoading} />
    </ScrollView>
  );
};

export default HomePage;