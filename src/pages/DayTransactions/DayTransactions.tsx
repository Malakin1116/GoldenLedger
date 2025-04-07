// src/pages/DayTransactions/DayTransactions.tsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useTransactions as useTransactionContext } from '../../context/TransactionContext';
import { useTransactions } from '../../hooks/useTransactions';
import IncomeList from '../../components/IncomeList/Premium/IncomeList';
import CostList from '../../components/CostList/Premium/CostList';
import Budget from '../../components/Budget/Budget';
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
import { useAuth } from '../../context/AuthContext';
import { navigateUtil } from '../../utils/navigateUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTransactionsForMonth, fetchAllTransactions } from '../../utils/api';
import { FilterIcon, CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from '../../assets/icons/index';

const UPDATED_TABS: TabType[] = ['Day', 'Week', 'Month', 'All'];

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
  const { language } = useLanguage();
  const { monthlyTransactions, setMonthlyTransactions, totalIncome, totalCosts } = useTransactionContext();
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
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState<boolean>(false);
  const [hasLoadedMonthly, setHasLoadedMonthly] = useState<boolean>(false);

  const { handleApiError } = useAuth();

  const monthlyTransactionsFromParams = useMemo(
    () => route.params?.monthlyTransactions || monthlyTransactions || [],
    [route.params?.monthlyTransactions, monthlyTransactions]
  );
  const initialDate = route.params?.selectedDate || formatDate(new Date());

  const { currentSelectedDate, displayDate, isNextDayDisabled, handlePreviousDay, handleNextDay } = useDateNavigation({
    navigation,
    initialDate,
    activeTab,
  });

  useEffect(() => {
    const loadAllTransactions = async () => {
      if (activeTab === 'All') {
        setIsLoadingAll(true);
        try {
          const response = await fetchAllTransactions();
          const transactions = response.data || [];
          const mappedTransactions = transactions.map((tx: any, index: number) => {
            const id = tx._id || tx.id || `${tx.type}-${index}`;
            return {
              id,
              name: tx.category || tx.name || 'Невідомо',
              amount: tx.amount,
              type: tx.type,
              date: tx.date,
            };
          });
          setAllTransactions(mappedTransactions);
        } catch (error: any) {
          console.error('Помилка завантаження всіх транзакцій:', error.message);
        } finally {
          setIsLoadingAll(false);
        }
      }
    };

    loadAllTransactions();
  }, [activeTab]);

  useEffect(() => {
    const loadMonthlyTransactions = async () => {
      if (activeTab !== 'All' && monthlyTransactionsFromParams.length === 0 && !hasLoadedMonthly) {
        setHasLoadedMonthly(true);
        try {
          const [year, month] = currentSelectedDate.split('-');
          const response = await fetchTransactionsForMonth(parseInt(month) - 1, parseInt(year));
          const updatedTransactions = response.data || [];

          const fixedTransactions = updatedTransactions.map((tx: any, index: number) => {
            const id = tx._id || tx.id || `${tx.type}-${index}`;
            return {
              id,
              name: tx.category || tx.name || 'Невідомо',
              amount: tx.amount,
              type: tx.type,
              date: tx.date,
            };
          });

          setMonthlyTransactions(fixedTransactions);
          navigation.setParams({ monthlyTransactions: fixedTransactions });
        } catch (error: any) {
          console.error('Помилка завантаження транзакцій:', error.message);
        }
      }
    };

    loadMonthlyTransactions();
  }, [activeTab, currentSelectedDate, monthlyTransactionsFromParams, navigation, setMonthlyTransactions, hasLoadedMonthly]);

  useEffect(() => {
    setHasLoadedMonthly(false);
  }, [activeTab, currentSelectedDate]);

  const oldestDate = useMemo(() => {
    if (allTransactions.length === 0) return null;
    const dates = allTransactions.map((tx) => new Date(tx.date).getTime());
    const oldestTimestamp = Math.min(...dates);
    return formatDate(new Date(oldestTimestamp), t);
  }, [allTransactions, t]);

  const currentDateDisplay = useMemo(() => {
    if (!currentSelectedDate) return '';
    const [year, month, day] = currentSelectedDate.split('-');
    return `${day}.${month}`;
  }, [currentSelectedDate]);

  const allDateRange = useMemo(() => {
    if (activeTab !== 'All' || !oldestDate) return displayDate;
    return `${oldestDate} – ${currentDateDisplay}`;
  }, [activeTab, oldestDate, currentDateDisplay, displayDate]);

  const transactionsSource = activeTab === 'All' ? allTransactions : monthlyTransactionsFromParams;

  const { incomes, costs, isLoading, handleDeleteTransaction, handleAddTransaction } = useTransactions({
    navigation,
    monthlyTransactions: transactionsSource,
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

  const refreshMonthlyTransactions = useCallback(async () => {
    try {
      const [year, month] = currentSelectedDate.split('-');
      const response = await fetchTransactionsForMonth(parseInt(month) - 1, parseInt(year));
      const updatedTransactions = response.data || [];

      const fixedTransactions = updatedTransactions.map((tx: any, index: number) => {
        const id = tx._id || tx.id || `${tx.type}-${index}`;
        return {
          id,
          name: tx.category || tx.name || 'Невідомо',
          amount: tx.amount,
          type: tx.type,
          date: tx.date,
        };
      });

      setMonthlyTransactions(fixedTransactions);
      navigation.setParams({ monthlyTransactions: fixedTransactions });
    } catch (error: any) {
      console.error('Помилка оновлення транзакцій:', error.message);
    }
  }, [currentSelectedDate, navigation, setMonthlyTransactions]);

  const handleProfilePress = () => navigateUtil(navigation, ScreenNames.SETTINGS_PAGE);
  const handleCalendarPress = () => navigateUtil(navigation, ScreenNames.HOME_PAGE, {});

  const renderTabs = () => (
    <View style={styles.tabs}>
      {UPDATED_TABS.map((tab) => (
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
            onDelete={(id) => {
              handleDeleteTransaction(id, 'income').catch(handleApiError);
            }}
            onAdd={() => {
              setSelectedDateForModal(currentSelectedDate);
              setModalState((prev) => ({ ...prev, isIncomeModalVisible: true }));
            }}
            totalIncome={totalIncome}
            customCategories={customIncomeCategories}
          />
          <CostList
            costs={costs}
            onDelete={(id) => {
              handleDeleteTransaction(id, 'costs').catch(handleApiError);
            }}
            onAdd={() => {
              setSelectedDateForModal(currentSelectedDate);
              setModalState((prev) => ({ ...prev, isCostModalVisible: true }));
            }}
            totalCosts={totalCosts}
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

    const filteredDates = [...new Set([...Object.keys(groupedIncomes), ...Object.keys(groupedCosts)])].sort(
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
          const dailyIncomes = groupedIncomes[date] || [];
          const dailyCosts = groupedCosts[date] || [];
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
                onDelete={(id) => {
                  handleDeleteTransaction(id, 'income').catch(handleApiError);
                }}
                onAdd={() => {
                  setSelectedDateForModal(date);
                  setModalState((prev) => ({ ...prev, isIncomeModalVisible: true }));
                }}
                totalIncome={dailyIncomeTotal}
                customCategories={customIncomeCategories}
              />
              <CostList
                costs={dailyCosts}
                onDelete={(id) => {
                  handleDeleteTransaction(id, 'costs').catch(handleApiError);
                }}
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

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <View style={styles.scrollContainer}>
        {renderDailySections()}
        {activeTab === 'Day' ? (
          <Budget />
        ) : (
          <PeriodSummary totalIncome={totalIncome} totalCosts={totalCosts} activeTab={activeTab} />
        )}
      </View>

      <AddTransactionModal
        visible={modalState.isIncomeModalVisible}
        onClose={() => {
          setModalState((prev) => ({ ...prev, isIncomeModalVisible: false }));
          refreshMonthlyTransactions();
        }}
        onAdd={handleAddTransaction}
        transactionType="income"
        title={t('dayTransactions.add_income')}
        selectedDate={selectedDateForModal}
      />

      <AddTransactionModal
        visible={modalState.isCostModalVisible}
        onClose={() => {
          setModalState((prev) => ({ ...prev, isCostModalVisible: false }));
          refreshMonthlyTransactions();
        }}
        onAdd={handleAddTransaction}
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