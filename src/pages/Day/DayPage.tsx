import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import IncomeList from '../../components/IncomeList/Premium/IncomeList';
import CostList from '../../components/CostList/Premium/CostList';
import Budget from '../../components/Budget/Budget';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import {
  createTransaction,
  fetchTransactionsToday,
  fetchTransactionsForDaysWeek,
  fetchTransactionsForDaysMonth,
  deleteTransaction,
} from '../../utils/api';
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackNavigation } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackNavigation>;

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
}

const DayPage: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState<boolean>(false);
  const [isCostModalVisible, setCostModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Day');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
  };

  const formatISODate = (dateStr: string) => {
    return `${dateStr}T00:00:00.000Z`;
  };

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 7);
      const startOfMonth = new Date(today);
      startOfMonth.setDate(today.getDate() - 30);

      const startDateWeek = formatDate(startOfWeek);
      const endDateWeek = formatDate(today);
      const startDateMonth = formatDate(startOfMonth);
      const endDateMonth = formatDate(today);

      if (activeTab === 'Day') {
        response = await fetchTransactionsToday();
      } else if (activeTab === 'DaysWeek') {
        response = await fetchTransactionsForDaysWeek(startDateWeek, endDateWeek);
      } else if (activeTab === 'DaysMonth') {
        response = await fetchTransactionsForDaysMonth(startDateMonth, endDateMonth);
      }

      const transactions = Array.isArray(response) ? response : response?.data || [];
      const fetchedIncomes = transactions
        .filter((item: any) => item.type !== 'costs')
        .map((item: any) => ({
          id: item._id,
          name: item.category || 'Product',
          amount: item.amount,
          date: formatDate(new Date(item.date)),
        }));
      const fetchedCosts = transactions
        .filter((item: any) => item.type === 'costs')
        .map((item: any) => ({
          id: item._id,
          name: item.category || 'Expense',
          amount: item.amount,
          date: formatDate(new Date(item.date)),
        }));

      setIncomes(fetchedIncomes);
      setCosts(fetchedCosts);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions, navigation]);

  const handleEditIncome = (id: string) => {
    console.log('Редагувати дохід:', id);
  };

  const handleDeleteIncome = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteTransaction(id);
      setIncomes(incomes.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Delete income error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCost = (id: string) => {
    console.log('Редагувати витрату:', id);
  };

  const handleDeleteCost = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteTransaction(id);
      setCosts(costs.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Delete cost error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (amount: number, category: string, type: string, date?: string) => {
    setIsLoading(true);
    try {
      let transactionDate = date || formatDate(new Date());
      const isoDate = formatISODate(transactionDate);
      await createTransaction(amount, category, type, isoDate);
      await loadTransactions();
    } catch (error) {
      console.error('Add transaction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePress = () => {
    navigation.navigate({ name: ScreenNames.SETTINGS_PAGE, params: undefined });
  };

  const handleCalendarPress = () => {
    navigation.navigate({ name: ScreenNames.HOME_PAGE, params: {} });
  };

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
  const budget = totalIncome - totalCosts;

  const today = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getAllDatesInRange = (startDate: string, endDate: string) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      dates.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates.reverse();
  };

const groupByDate = (transactions: Transaction[]) => {
  return transactions.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, Transaction[]>);
};

  const groupedIncomes = groupByDate(incomes);
  const groupedCosts = groupByDate(costs);

  const renderDailySections = () => {
    if (activeTab === 'Day') {
      return (
        <>
          <IncomeList
            incomes={incomes}
            onEdit={handleEditIncome}
            onDelete={handleDeleteIncome}
            onAdd={() => {
              setSelectedDate(formatDate(new Date()));
              setIncomeModalVisible(true);
            }}
            totalIncome={totalIncome}
          />
          <CostList
            costs={costs}
            onEdit={handleEditCost}
            onDelete={handleDeleteCost}
            onAdd={() => {
              setSelectedDate(formatDate(new Date()));
              setCostModalVisible(true);
            }}
            totalCosts={totalCosts}
          />
        </>
      );
    }

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    const startOfMonth = new Date(today);
    startOfMonth.setDate(today.getDate() - 30);

    const startDate = activeTab === 'DaysWeek' ? formatDate(startOfWeek) : formatDate(startOfMonth);
    const endDate = formatDate(today);
    const allDates = getAllDatesInRange(startDate, endDate);

    const filteredDates = allDates.filter(date =>
      (groupedIncomes[date] && groupedIncomes[date].length > 0) ||
      (groupedCosts[date] && groupedCosts[date].length > 0)
    );

    return (
      <FlatList
        data={filteredDates}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => {
          const dailyIncomes = groupedIncomes[date] || [];
          const dailyCosts = groupedCosts[date] || [];
          const dailyIncomeTotal = dailyIncomes.reduce((sum, item) => sum + item.amount, 0);
          const dailyCostTotal = dailyCosts.reduce((sum, item) => sum + item.amount, 0);

          return (
            <View style={styles.daySection}>
              <Text style={styles.daySectionTitle}>{formatDisplayDate(new Date(date))}</Text>
              <IncomeList
                incomes={dailyIncomes}
                onEdit={handleEditIncome}
                onDelete={handleDeleteIncome}
                onAdd={() => {
                  setSelectedDate(date);
                  setIncomeModalVisible(true);
                }}
                totalIncome={dailyIncomeTotal}
              />
              <CostList
                costs={dailyCosts}
                onEdit={handleEditCost}
                onDelete={handleDeleteCost}
                onAdd={() => {
                  setSelectedDate(date);
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

  let displayDate = '';
  if (activeTab === 'Day') {
    displayDate = `${today.getDate()} ${months[today.getMonth()]}`;
  } else if (activeTab === 'DaysWeek') {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    displayDate = `${formatDisplayDate(startOfWeek)}-${formatDisplayDate(today)}`;
  } else if (activeTab === 'DaysMonth') {
    const startOfMonth = new Date(today);
    startOfMonth.setDate(today.getDate() - 30);
    displayDate = `${formatDisplayDate(startOfMonth)}-${formatDisplayDate(today)}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCalendarPress}>
            <Text style={styles.iconText}>📅</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{displayDate}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>❤️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Day' ? styles.activeTab : null]}
          onPress={() => setActiveTab('Day')}
        >
          <Text style={[styles.tabText, activeTab === 'Day' ? styles.activeTabText : null]}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'DaysWeek' ? styles.activeTab : null]}
          onPress={() => setActiveTab('DaysWeek')}
        >
          <Text style={[styles.tabText, activeTab === 'DaysWeek' ? styles.activeTabText : null]}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'DaysMonth' ? styles.activeTab : null]}
          onPress={() => setActiveTab('DaysMonth')}
        >
          <Text style={[styles.tabText, activeTab === 'DaysMonth' ? styles.activeTabText : null]}>Month</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scrollContainer}>
        {renderDailySections()}
        {activeTab === 'Day' ? (
          <Budget
            totalIncome={totalIncome}
            totalCosts={totalCosts}
            budget={budget}
            handleProfilePress={handleProfilePress}
          />
        ) : (
          <View style={styles.summarySection}>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                {activeTab === 'DaysWeek' ? 'Сума доходів за тиждень' : 'Сума доходів за місяць'}: {totalIncome}₴
              </Text>
              <Text style={styles.summaryText}>
                {activeTab === 'DaysWeek' ? 'Сума витрат за тиждень' : 'Сума витрат за місяць'}: {totalCosts}₴
              </Text>
            </View>
            <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
              <Text style={styles.iconText}>👤</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <AddTransactionModal
        visible={isIncomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="income"
        title="Додати дохід"
        selectedDate={selectedDate}
      />

      <AddTransactionModal
        visible={isCostModalVisible}
        onClose={() => setCostModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="costs"
        title="Додати витрату"
        selectedDate={selectedDate}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5a8a9a" />
        </View>
      )}
    </View>
  );
};

export default DayPage;
