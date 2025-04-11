import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppSelector';
import { fetchMonthlyTransactions, fetchTodayTransactions } from '../../store/slices/transactionSlice';
import Calendar from '../../components/Calendar/Calendar';
import Summary from '../../components/Summary/Summary';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import { useTransactions } from '../../hooks/useTransactions';
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
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.language);
  const { monthlyTransactions } = useAppSelector((state) => state.transactions);
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

  const { handleAddTransaction } = useTransactions({
    navigation,
    currentSelectedDate: `${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    activeTab: 'Day',
    selectedCategory,
  });

  useEffect(() => {
    setSelectedDate(`${today.getDate()} ${t(`calendar.months.${today.getMonth()}`)}`);
  }, [language, t, today]);

  // Завантаження транзакцій при вході на сторінку
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const updatedTransactions = route?.params?.monthlyTransactions;
      if (updatedTransactions) {
        dispatch({ type: 'transactions/setMonthlyTransactions', payload: updatedTransactions });
      }
      setSelectedDate(`${today.getDate()} ${t(`calendar.months.${today.getMonth()}`)}`);

      const loadTodayTransactions = async () => {
        setIsLoading(true);
        try {
          const transactions = await dispatch(fetchTodayTransactions()).unwrap();
          const fetchedIncomes = transactions.filter((item: Transaction) => item?.type?.toLowerCase() === 'income');
          const fetchedCosts = transactions.filter((item: Transaction) => item?.type?.toLowerCase() === 'costs');
          setIncomes(fetchedIncomes);
          setCosts(fetchedCosts);
        } catch (error: any) {
          if (error === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
            navigation.navigate(ScreenNames.LOGIN_PAGE);
            return;
          }
          console.error('Не вдалося завантажити транзакції за сьогодні:', error);
        } finally {
          setIsLoading(false);
        }
      };

      const loadMonthlyTransactions = async () => {
        setIsLoading(true);
        try {
          await dispatch(fetchMonthlyTransactions({ month: currentMonthState, year: currentYearState })).unwrap();
        } catch (error: any) {
          if (error === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
            navigation.navigate(ScreenNames.LOGIN_PAGE);
            return;
          }
          console.error('Не вдалося завантажити транзакції за місяць:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadTodayTransactions();
      loadMonthlyTransactions();
    });
    return unsubscribe;
  }, [navigation, route?.params?.monthlyTransactions, today, t, dispatch, currentMonthState, currentYearState]);

  // Завантаження транзакцій при зміні місяця
  useEffect(() => {
    const loadMonthlyTransactions = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchMonthlyTransactions({ month: currentMonthState, year: currentYearState })).unwrap();
      } catch (error: any) {
        if (error === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
          return;
        }
        console.error('Не вдалося завантажити транзакції за місяць:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthlyTransactions();
  }, [currentMonthState, currentYearState, dispatch, navigation]);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTransactions = monthlyTransactions.filter((tx) => tx?.date === todayStr);
    const fetchedIncomes = todayTransactions.filter((item) => item?.type?.toLowerCase() === 'income');
    const fetchedCosts = todayTransactions.filter((item) => item?.type?.toLowerCase() === 'costs');
    setIncomes(fetchedIncomes);
    setCosts(fetchedCosts);
  }, [monthlyTransactions]);

  const getDailySum = useCallback(
    (day: number): number => {
      const dateStr = `${currentYearState}-${String(currentMonthState + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dailyTransactions = monthlyTransactions.filter((transaction) => {
        if (!transaction || !transaction.date) {
          console.warn('Invalid transaction found in monthlyTransactions:', transaction);
          return false;
        }
        return transaction.date === dateStr;
      });

      const filteredDailyTransactions = filterTransactionsByCategory(dailyTransactions, selectedCategory);

      const dailyIncome = filteredDailyTransactions
        .filter((t) => t?.type?.toLowerCase() === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const dailyCosts = filteredDailyTransactions
        .filter((t) => t?.type?.toLowerCase() === 'costs')
        .reduce((sum, t) => sum + t.amount, 0);

      return dailyIncome - dailyCosts;
    },
    [currentYearState, currentMonthState, monthlyTransactions, selectedCategory]
  );

  const filteredIncomes = useMemo(() => {
    const filtered = filterTransactionsByCategory([...incomes, ...costs], selectedCategory);
    return filtered.filter((t) => t?.type?.toLowerCase() === 'income');
  }, [incomes, costs, selectedCategory]);

  const filteredCosts = useMemo(() => {
    const filtered = filterTransactionsByCategory([...incomes, ...costs], selectedCategory);
    return filtered.filter((t) => t?.type?.toLowerCase() === 'costs');
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

  const daysInMonth = new Date(currentYearState, currentMonthState + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYearState, currentMonthState, 1).getDay();

  const allTransactions = [...incomes, ...costs];
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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