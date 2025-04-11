import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppSelector';
import { fetchAllTransactionsThunk, fetchMonthlyTransactions } from '../../store/slices/transactionSlice';
import { handleApiError } from '../../store/slices/authSlice';
import IncomeList from '../../components/IncomeList/Premium/IncomeList';
import CostList from '../../components/CostList/Premium/CostList';
import PeriodSummary from '../../components/PeriodSummary/PeriodSummary';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import ModalFilter from '../../components/ModalFilter/ModalFilter';
import { incomeCategories, costCategories } from '../../constants/categories';
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackNavigation } from '../../navigation/types';
import { formatDate, groupByDate } from '../../utils/dateUtils';
import { useDateNavigation } from '../../hooks/useDateNavigation';
import { TABS, TabType } from '../../constants/dateConstants';
import { navigateUtil } from '../../utils/navigateUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilterIcon, CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from '../../assets/icons/index';
import { useTransactions } from '../../hooks/useTransactions';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
}

interface DayTransactionsProps {
  navigation: NativeStackNavigationProp<RootStackNavigation, 'DayTransactions'>;
  route: RouteProp<RootStackNavigation, 'DayTransactions'>;
}

const DayTransactions: React.FC<DayTransactionsProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { allTransactions, monthlyTransactions } = useAppSelector((state) => state.transactions);
  const [activeTab, setActiveTab] = useState<TabType>('Day');
  const [modalState, setModalState] = useState({
    isIncomeModalVisible: false,
    isCostModalVisible: false,
    isFilterModalVisible: false,
  });
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customIncomeCategories, setCustomIncomeCategories] = useState<any[]>([]);
  const [customCostCategories, setCustomCostCategories] = useState<any[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState<boolean>(false);

  const initialDate = route.params?.selectedDate || formatDate(new Date());

  const { currentSelectedDate, displayDate, isNextDayDisabled, handlePreviousDay, handleNextDay } = useDateNavigation({
    navigation,
    initialDate,
    activeTab,
  });

  useEffect(() => {
    if (route.params?.selectedDate && route.params.selectedDate !== currentSelectedDate) {
      setSelectedDateForModal(route.params.selectedDate);
    }
  }, [route.params?.selectedDate, currentSelectedDate]);

  useEffect(() => {
    const loadAllTransactions = async () => {
      setIsLoadingAll(true);
      try {
        await dispatch(fetchAllTransactionsThunk()).unwrap();
      } catch (error: any) {
        console.log('Error in fetchAllTransactionsThunk:', error);
        if (error === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
          return;
        }
        console.error('Помилка завантаження всіх транзакцій:', error);
      } finally {
        setIsLoadingAll(false);
      }
    };

    loadAllTransactions();
  }, [dispatch, navigation]);

  const filtered_transactions = useMemo(() => {
    if (activeTab === 'All') return allTransactions;

    const [_year, month, day] = currentSelectedDate.split('-').map(Number);
    const selectedDate = new Date(_year, month - 1, day);
    selectedDate.setHours(23, 59, 59, 999);

    if (activeTab === 'Day') {
      const selectedDateStr = currentSelectedDate;
      return allTransactions.filter((tx) => tx?.date === selectedDateStr);
    } else if (activeTab === 'Week') {
      const endOfPeriod = new Date(selectedDate);
      const startOfPeriod = new Date(selectedDate);
      startOfPeriod.setDate(endOfPeriod.getDate() - 6);
      startOfPeriod.setHours(0, 0, 0, 0);

      const startOfPeriodStr = startOfPeriod.toISOString().split('T')[0];
      const endOfPeriodStr = endOfPeriod.toISOString().split('T')[0];

      return allTransactions.filter((tx) => tx?.date >= startOfPeriodStr && tx?.date <= endOfPeriodStr);
    } else if (activeTab === 'Month') {
      const endOfPeriod = new Date(selectedDate);
      const startOfPeriod = new Date(selectedDate);
      startOfPeriod.setDate(endOfPeriod.getDate() - 29);
      startOfPeriod.setHours(0, 0, 0, 0);

      const startOfPeriodStr = startOfPeriod.toISOString().split('T')[0];
      const endOfPeriodStr = endOfPeriod.toISOString().split('T')[0];

      return allTransactions.filter((tx) => tx?.date >= startOfPeriodStr && tx?.date <= endOfPeriodStr);
    }
    return allTransactions;
  }, [activeTab, currentSelectedDate, allTransactions]);

  const oldestDate = useMemo(() => {
    if (allTransactions.length === 0) return null;
    const dates = allTransactions.map((tx) => new Date(tx?.date).getTime());
    const oldestTimestamp = Math.min(...dates);
    return formatDate(new Date(oldestTimestamp), t);
  }, [allTransactions, t]);

  const currentDateDisplay = useMemo(() => {
    if (!currentSelectedDate) return '';
    const [_year, month, day] = currentSelectedDate.split('-');
    return `${day}.${month}`;
  }, [currentSelectedDate]);

  const allDateRange = useMemo(() => {
    if (activeTab !== 'All' || !oldestDate) return displayDate;
    return `${oldestDate} – ${currentDateDisplay}`;
  }, [activeTab, oldestDate, currentDateDisplay, displayDate]);

  const { incomes, costs, isLoading, handleDeleteTransaction, handleAddTransaction } = useTransactions({
    navigation,
    currentSelectedDate: activeTab === 'All' ? undefined : currentSelectedDate,
    activeTab,
    selectedCategory,
  });

  const groupedIncomes = groupByDate(incomes);
  const groupedCosts = groupByDate(costs);

  useEffect(() => {
    const loadCustomCategories = async () => {
      const storedIncomeCategories = await AsyncStorage.getItem('customIncomeCategories');
      const storedCostCategories = await AsyncStorage.getItem('customCostCategories');
      setCustomIncomeCategories(storedIncomeCategories ? JSON.parse(storedIncomeCategories) : []);
      setCustomCostCategories(storedCostCategories ? JSON.parse(storedCostCategories) : []);
    };
    loadCustomCategories();
  }, []);

  const refreshTransactionsForMonth = useCallback(async () => {
    try {
      const [year, month] = currentSelectedDate.split('-').map(Number);
      await dispatch(fetchMonthlyTransactions({ month: month - 1, year })).unwrap();
    } catch (error: any) {
      console.error('Помилка оновлення транзакцій за місяць:', error);
    }
  }, [currentSelectedDate, dispatch]);

  const refreshAllTransactions = useCallback(async () => {
    try {
      await dispatch(fetchAllTransactionsThunk()).unwrap();
    } catch (error: any) {
      console.error('Помилка оновлення всіх транзакцій:', error);
    }
  }, [dispatch]);

  const handleCalendarPress = () => navigateUtil(navigation, ScreenNames.HOME_PAGE, {});

  const renderTabs = () => (
    <View style={styles.tabs}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
            {t(`dayTransactions.tabs.${tab.toLowerCase()}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.iconButton} onPress={handleCalendarPress}>
          <CalendarIcon width={20} height={20} fill="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerCenter}>
        {activeTab === 'Day' && (
          <TouchableOpacity style={styles.arrowButton} onPress={handlePreviousDay}>
            <ArrowLeftIcon width={20} height={20} fill="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.dateText}>{activeTab === 'All' ? allDateRange : displayDate}</Text>
        {activeTab === 'Day' && (
          <TouchableOpacity
            style={[styles.arrowButton, isNextDayDisabled && styles.disabledArrow]}
            onPress={!isNextDayDisabled ? handleNextDay : undefined}
            disabled={isNextDayDisabled}
          >
            <ArrowRightIcon width={20} height={20} fill={isNextDayDisabled ? '#757575' : '#fff'} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={() => setModalState((prev) => ({ ...prev, isFilterModalVisible: true }))}>
        <FilterIcon width={20} height={20} fill="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderDailySections = () => {
    if (activeTab === 'Day') {
      return (
        <>
          <IncomeList
            incomes={incomes}
            onDelete={(id) => handleDeleteTransaction(id, 'income')
              .then(() => {
                refreshAllTransactions();
                refreshTransactionsForMonth();
              })
              .catch((error) => dispatch(handleApiError(error)))}
            onAdd={() => {
              setSelectedDateForModal(currentSelectedDate);
              setModalState((prev) => ({ ...prev, isIncomeModalVisible: true }));
            }}
            totalIncome={incomes.reduce((sum, item) => sum + item.amount, 0)}
            customCategories={customIncomeCategories}
          />
          <CostList
            costs={costs}
            onDelete={(id) => handleDeleteTransaction(id, 'costs')
              .then(() => {
                refreshAllTransactions();
                refreshTransactionsForMonth();
              })
              .catch((error) => dispatch(handleApiError(error)))}
            onAdd={() => {
              setSelectedDateForModal(currentSelectedDate);
              setModalState((prev) => ({ ...prev, isCostModalVisible: true }));
            }}
            totalCosts={costs.reduce((sum, item) => sum + item.amount, 0)}
            customCategories={customCostCategories}
          />
        </>
      );
    }

    if (activeTab === 'All' && isLoadingAll) {
      return (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5a8a9a" />
        </View>
      );
    }

    const filteredGroupedIncomes = groupByDate(filtered_transactions.filter((tx) => tx?.type?.toLowerCase() === 'income'));
    const filteredGroupedCosts = groupByDate(filtered_transactions.filter((tx) => tx?.type?.toLowerCase() === 'costs'));

    const filteredDates = [...new Set([...Object.keys(filteredGroupedIncomes), ...Object.keys(filteredGroupedCosts)])].sort(
      (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime()
    );

    if (filteredDates.length === 0 && activeTab !== 'Day') {
      return <Text style={styles.noTransactions}>{t('dayTransactions.no_transactions')}</Text>;
    }

    return (
      <FlatList
        data={filteredDates}
        keyExtractor={(item) => item}
        renderItem={({ item: date }: { item: string }) => {
          const dailyIncomes = filteredGroupedIncomes[date] || [];
          const dailyCosts = filteredGroupedCosts[date] || [];
          const dailyIncomeTotal = dailyIncomes.reduce((sum: number, item: Transaction) => sum + item.amount, 0);
          const dailyCostTotal = dailyCosts.reduce((sum: number, item: Transaction) => sum + item.amount, 0);

          const dateObj = new Date(date);
          const dayOfWeek = dateObj.getUTCDay();
          const daysOfWeekKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
          const dayOfWeekKey = daysOfWeekKeys[dayOfWeek];
          const dayOfWeekName = t(`dayTransactions.days_of_week.${dayOfWeekKey}`);

          return (
            <View style={styles.daySection}>
              <Text style={styles.daySectionTitle}>
                {dayOfWeekName}, {formatDate(new Date(date), t)}
              </Text>
              <IncomeList
                incomes={dailyIncomes}
                onDelete={(id) => handleDeleteTransaction(id, 'income')
                  .then(() => {
                    refreshAllTransactions();
                    refreshTransactionsForMonth();
                  })
                  .catch((error) => dispatch(handleApiError(error)))}
                onAdd={() => {
                  setSelectedDateForModal(date);
                  setModalState((prev) => ({ ...prev, isIncomeModalVisible: true }));
                }}
                totalIncome={dailyIncomeTotal}
                customCategories={customIncomeCategories}
              />
              <CostList
                costs={dailyCosts}
                onDelete={(id) => handleDeleteTransaction(id, 'costs')
                  .then(() => {
                    refreshAllTransactions();
                    refreshTransactionsForMonth();
                  })
                  .catch((error) => dispatch(handleApiError(error)))}
                onAdd={() => {
                  setSelectedDateForModal(date);
                  setModalState((prev) => ({ ...prev, isCostModalVisible: true }));
                }}
                totalCosts={dailyCostTotal}
                customCategories={customCostCategories}
              />
            </View>
          );
        }}
      />
    );
  };

  const periodIncomes = Object.values(groupedIncomes).flat();
  const periodCosts = Object.values(groupedCosts).flat();

  const totalIncome = (activeTab === 'Day' ? incomes : periodIncomes).reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = (activeTab === 'Day' ? costs : periodCosts).reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <View style={styles.scrollContainer}>
        {renderDailySections()}
        <PeriodSummary
          totalIncome={totalIncome}
          totalCosts={totalCosts}
          activeTab={activeTab}
        />
      </View>

      <AddTransactionModal
        visible={modalState.isIncomeModalVisible}
        onClose={() => {
          setModalState((prev) => ({ ...prev, isIncomeModalVisible: false }));
          refreshTransactionsForMonth();
          refreshAllTransactions();
        }}
        onAdd={(amount, category, type, date) => handleAddTransaction(amount, category, type, date)
          .then(() => {
            refreshTransactionsForMonth();
            refreshAllTransactions();
          })}
        transactionType="income"
        title={t('dayTransactions.add_income')}
        selectedDate={selectedDateForModal}
      />

      <AddTransactionModal
        visible={modalState.isCostModalVisible}
        onClose={() => {
          setModalState((prev) => ({ ...prev, isCostModalVisible: false }));
          refreshTransactionsForMonth();
          refreshAllTransactions();
        }}
        onAdd={(amount, category, type, date) => handleAddTransaction(amount, category, type, date)
          .then(() => {
            refreshTransactionsForMonth();
            refreshAllTransactions();
          })}
        transactionType="costs"
        title={t('dayTransactions.add_cost')}
        selectedDate={selectedDateForModal}
      />

      <ModalFilter
        visible={modalState.isFilterModalVisible}
        onClose={() => setModalState((prev) => ({ ...prev, isFilterModalVisible: false }))}
        onSelect={(category) => setSelectedCategory(category)}
        incomeCategories={incomeCategories}
        costCategories={costCategories}
        showAllOption={true}
        selectedCategory={selectedCategory}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5a8a9a" />
        </View>
      )}
    </View>
  );
};

export default DayTransactions;