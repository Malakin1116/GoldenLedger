import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import IncomeList from '../IncomeList/Premium/IncomeList';
import CostList from '../CostList/Premium/CostList';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import ModalFilter from '../../components/ModalFilter/ModalFilter';
import { createTransaction, deleteTransaction } from '../../utils/api';
import { formatDate, formatDisplayDate, formatISODate, getAllDatesInRange, groupByDate, isFutureDate } from '../../utils/dateUtils';
import { incomeCategories, costCategories } from '../../constants/categories';
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
}

interface DayTransactionsProps {
  navigation: any;
  route: {
    params?: {
      selectedDate: string;
      monthlyTransactions?: Transaction[];
    };
  };
}

const months = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

const DayTransactions: React.FC<DayTransactionsProps> = ({ navigation, route }) => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState<boolean>(false);
  const [isCostModalVisible, setCostModalVisible] = useState<boolean>(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>('');
  const [currentSelectedDate, setCurrentSelectedDate] = useState<string>(route.params?.selectedDate || formatDate(new Date()));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const monthlyTransactions = useMemo(() => route.params?.monthlyTransactions || [], [route.params?.monthlyTransactions]);

  const loadTransactions = useCallback(() => {
    if (!monthlyTransactions.length) {
      console.log('monthlyTransactions порожній');
      setIncomes([]);
      setCosts([]);
      return;
    }

    let filteredDates: string[] = [];
    if (activeTab === 'Day') {
      filteredDates = [currentSelectedDate];
    } else if (activeTab === 'Week') {
      const selected = new Date(currentSelectedDate);
      const startOfWeek = new Date(selected);
      startOfWeek.setUTCDate(selected.getUTCDate() - 7);
      filteredDates = getAllDatesInRange(formatDate(startOfWeek), currentSelectedDate);
    } else if (activeTab === 'Month') {
      const selected = new Date(currentSelectedDate);
      const startOfMonth = new Date(selected);
      startOfMonth.setUTCDate(selected.getUTCDate() - 30);
      filteredDates = getAllDatesInRange(formatDate(startOfMonth), currentSelectedDate);
    }

    let filteredTransactions = monthlyTransactions.filter((transaction: Transaction) =>
      filteredDates.includes(formatDate(new Date(transaction.date)))
    );

    if (selectedCategory) {
      if (selectedCategory === 'Всі доходи') {
        filteredTransactions = filteredTransactions.filter((t: Transaction) => t.type.toLowerCase() === 'income');
      } else if (selectedCategory === 'Всі витрати') {
        filteredTransactions = filteredTransactions.filter((t: Transaction) => t.type.toLowerCase() === 'costs');
      } else {
        filteredTransactions = filteredTransactions.filter((t: Transaction) => t.name === selectedCategory);
      }
    }

    const fetchedIncomes = filteredTransactions
      .filter((item: Transaction) => item.type.toLowerCase() === 'income')
      .map((item: Transaction) => ({ ...item }));

    const fetchedCosts = filteredTransactions
      .filter((item: Transaction) => item.type.toLowerCase() === 'costs')
      .map((item: Transaction) => ({ ...item }));

    setIncomes(fetchedIncomes);
    setCosts(fetchedCosts);
  }, [monthlyTransactions, currentSelectedDate, activeTab, selectedCategory]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleDeleteTransaction = useCallback(
    async (id: string, type: string) => {
      setIsLoading(true);
      try {
        await deleteTransaction(id);
        if (type.toLowerCase() === 'income') {
          setIncomes((prev) => prev.filter((item: Transaction) => item.id !== id));
        } else {
          setCosts((prev) => prev.filter((item: Transaction) => item.id !== id));
        }
        const updatedTransactions = monthlyTransactions.filter((item: Transaction) => item.id !== id);
        navigation.setParams({ monthlyTransactions: updatedTransactions });
      } catch (error: any) {
        if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
        } else {
          console.error('Помилка видалення транзакції:', error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [monthlyTransactions, navigation]
  );

  const handleAddTransaction = async (amount: number, category: string, type: string, date?: string) => {
    setIsLoading(true);
    try {
      const transactionDate = date || selectedDateForModal || currentSelectedDate;
      const isoDate = formatISODate(transactionDate);
      const newTransaction = await createTransaction(amount, category, type, isoDate);

      const updatedTransaction: Transaction = {
        id: newTransaction.id || `${type}-${Date.now()}`,
        name: category,
        amount,
        type,
        date: isoDate,
      };

      if (type.toLowerCase() === 'income') {
        setIncomes((prev) => [...prev, updatedTransaction]);
      } else {
        setCosts((prev) => [...prev, updatedTransaction]);
      }

      const updatedMonthlyTransactions = [...monthlyTransactions, updatedTransaction];
      navigation.setParams({ monthlyTransactions: updatedMonthlyTransactions });
    } catch (error: any) {
      console.error('Помилка додавання транзакції:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePress = () => navigation.navigate(ScreenNames.LOGIN_PAGE);
  const handleCalendarPress = () => navigation.navigate(ScreenNames.HOME_PAGE);

  const handlePreviousDay = () => {
    const current = new Date(currentSelectedDate);
    current.setUTCDate(current.getUTCDate() - 1);
    const newDate = formatDate(current);
    setCurrentSelectedDate(newDate);
    navigation.setParams({ selectedDate: newDate });
  };

  const handleNextDay = () => {
    const current = new Date(currentSelectedDate);
    current.setUTCDate(current.getUTCDate() + 1);
    const newDate = formatDate(current);
    const [year, month, day] = newDate.split('-').map(Number);
    if (!isFutureDate(year, month - 1, day)) {
      setCurrentSelectedDate(newDate);
      navigation.setParams({ selectedDate: newDate });
    }
  };

  const totalIncome = incomes.reduce((sum: number, item: Transaction) => sum + item.amount, 0);
  const totalCosts = costs.reduce((sum: number, item: Transaction) => sum + item.amount, 0);
  const budget = totalIncome - totalCosts;

  const displayDate = useMemo(() => {
    const selected = new Date(currentSelectedDate);
    if (activeTab === 'Day') {
      return `${selected.getUTCDate()} ${months[selected.getUTCMonth()]}`;
    } else if (activeTab === 'Week') {
      const startOfWeek = new Date(selected);
      startOfWeek.setUTCDate(selected.getUTCDate() - 7);
      return `${formatDisplayDate(startOfWeek)}-${formatDisplayDate(selected)}`;
    } else {
      const startOfMonth = new Date(selected);
      startOfMonth.setUTCDate(selected.getUTCDate() - 30);
      return `${formatDisplayDate(startOfMonth)}-${formatDisplayDate(selected)}`;
    }
  }, [currentSelectedDate, activeTab]); // Прибрано 'months'

  const groupedIncomes = groupByDate(incomes);
  const groupedCosts = groupByDate(costs);

  const renderDailySections = () => {
    if (activeTab === 'Day') {
      return (
        <>
          <IncomeList
            incomes={incomes}
            onDelete={(id) => handleDeleteTransaction(id, 'income')}
            onAdd={() => {
              setSelectedDateForModal(currentSelectedDate);
              setIncomeModalVisible(true);
            }}
            totalIncome={totalIncome}
          />
          <CostList
            costs={costs}
            onDelete={(id) => handleDeleteTransaction(id, 'costs')}
            onAdd={() => {
              setSelectedDateForModal(currentSelectedDate);
              setCostModalVisible(true);
            }}
            totalCosts={totalCosts}
          />
        </>
      );
    }

    const filteredDates = [...new Set([...Object.keys(groupedIncomes), ...Object.keys(groupedCosts)])].sort(
      (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime()
    );

    return (
      <FlatList
        data={filteredDates}
        keyExtractor={(item) => item}
        renderItem={({ item: date }: { item: string }) => {
          const dailyIncomes = groupedIncomes[date] || [];
          const dailyCosts = groupedCosts[date] || [];
          const dailyIncomeTotal = dailyIncomes.reduce((sum: number, item: Transaction) => sum + item.amount, 0);
          const dailyCostTotal = dailyCosts.reduce((sum: number, item: Transaction) => sum + item.amount, 0);

          return (
            <View style={styles.daySection}>
              <Text style={styles.daySectionTitle}>{formatDisplayDate(new Date(date))}</Text>
              <IncomeList
                incomes={dailyIncomes}
                onDelete={(id) => handleDeleteTransaction(id, 'income')}
                onAdd={() => {
                  setSelectedDateForModal(date);
                  setIncomeModalVisible(true);
                }}
                totalIncome={dailyIncomeTotal}
              />
              <CostList
                costs={dailyCosts}
                onDelete={(id) => handleDeleteTransaction(id, 'costs')}
                onAdd={() => {
                  setSelectedDateForModal(date);
                  setCostModalVisible(true);
                }}
                totalCosts={dailyCostTotal}
              />
            </View>
          );
        }}
      />
    );
  };

  const currentDateParts = currentSelectedDate.split('-').map(Number);
  const isNextDayDisabled = isFutureDate(currentDateParts[0], currentDateParts[1] - 1, currentDateParts[2] + 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCalendarPress}>
            <Text style={styles.iconText}>📅</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          {activeTab === 'Day' && (
            <TouchableOpacity style={styles.arrowButton} onPress={handlePreviousDay}>
              <Text style={styles.arrowText}>◄</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.dateText}>{displayDate}</Text>
          {activeTab === 'Day' && (
            <TouchableOpacity
              style={[styles.arrowButton, isNextDayDisabled && styles.disabledArrow]}
              onPress={!isNextDayDisabled ? handleNextDay : undefined}
              disabled={isNextDayDisabled}
            >
              <Text style={[styles.arrowText, isNextDayDisabled && styles.disabledArrowText]}>►</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.iconText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Day' ? styles.activeTab : null]}
          onPress={() => setActiveTab('Day')}
        >
          <Text style={[styles.tabText, activeTab === 'Day' ? styles.activeTabText : null]}>День</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Week' ? styles.activeTab : null]}
          onPress={() => setActiveTab('Week')}
        >
          <Text style={[styles.tabText, activeTab === 'Week' ? styles.activeTabText : null]}>Тиждень</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Month' ? styles.activeTab : null]}
          onPress={() => setActiveTab('Month')}
        >
          <Text style={[styles.tabText, activeTab === 'Month' ? styles.activeTabText : null]}>Місяць</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scrollContainer}>
        {renderDailySections()}
        <View style={styles.budgetSection}>
          <View style={styles.budgetContainer}>
            <Text style={styles.budgetText}>
              Бюджет: {totalIncome} - {totalCosts} = {budget}₴
            </Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddTransactionModal
        visible={isIncomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="income"
        title="Додати дохід"
        selectedDate={selectedDateForModal}
      />

      <AddTransactionModal
        visible={isCostModalVisible}
        onClose={() => setCostModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="costs"
        title="Додати витрати"
        selectedDate={selectedDateForModal}
      />

      <ModalFilter
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
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
