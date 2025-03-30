import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import IncomeList from '../IncomeList/Free/IncomeList';
import CostList from '../CostList/Free/CostList';
import { deleteTransaction } from '../../utils/api';
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
  route: any;
}

const DayTransactions: React.FC<DayTransactionsProps> = ({ navigation, route }) => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedDate = route.params?.selectedDate;
  const selectedYear = route.params?.selectedYear;
  const monthlyTransactions = route.params?.monthlyTransactions || [];

  useEffect(() => {
    console.log('DayTransactions params:', {
      selectedDate,
      selectedYear,
      monthlyTransactions,
    });
  }, [selectedDate, selectedYear, monthlyTransactions]);

  useEffect(() => {
    if (!monthlyTransactions || monthlyTransactions.length === 0) {
      console.log('monthlyTransactions is empty or undefined');
      return;
    }

    const dailyTransactions = monthlyTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
      console.log(`Comparing transactionDate: ${transactionDate} with selectedDate: ${selectedDate}`);
      return transactionDate === selectedDate;
    });

    console.log('Filtered dailyTransactions:', dailyTransactions);

    const fetchedIncomes: Transaction[] = dailyTransactions
      .filter((item) => item.type.toLowerCase() === 'income')
      .map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        type: item.type,
        date: item.date,
      }));

    const fetchedCosts: Transaction[] = dailyTransactions
      .filter((item) => item.type.toLowerCase() === 'costs')
      .map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        type: item.type,
        date: item.date,
      }));

    setIncomes(fetchedIncomes);
    setCosts(fetchedCosts);
  }, [monthlyTransactions, selectedDate]);

  const handleDeleteTransaction = useCallback(
    async (id: string, type: string) => {
      setIsLoading(true);
      try {
        await deleteTransaction(id);
        if (type.toLowerCase() === 'income') {
          setIncomes((prev) => prev.filter((item) => item.id !== id));
        } else {
          setCosts((prev) => prev.filter((item) => item.id !== id));
        }
        const updatedTransactions = monthlyTransactions.filter((item) => item.id !== id);
        navigation.setParams({ monthlyTransactions: updatedTransactions });
      } catch (error) {
        if (error.message === 'Сесія закінчилася. Будь ласка, увійдіть знову.') {
          navigation.navigate(ScreenNames.LOGIN_PAGE);
        } else {
          console.error('Delete transaction error:', error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [monthlyTransactions, navigation]
  );

  const handleProfilePress = () => {
    navigation.navigate(ScreenNames.LOGIN_PAGE);
  };

  const handleCalendarPress = () => {
    navigation.navigate(ScreenNames.HOME_PAGE);
  };

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
  const budget = 0 + totalIncome - totalCosts;

  const today = new Date();
  const todayDateStr = `${today.getDate()} ${
    [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][today.getMonth()]
  }`;

  const displayDate = selectedDate
    ? `${parseInt(selectedDate.split('-')[2], 10)} ${
        [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ][parseInt(selectedDate.split('-')[1], 10) - 1]
      }`
    : todayDateStr;

  // Перевірка, чи є транзакції
  const hasNoTransactions = incomes.length === 0 && costs.length === 0;

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
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Year</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
      </View>

      {hasNoTransactions ? (
        <View style={styles.noTransactionsContainer}>
          <Text style={styles.noTransactionsEmoji}>💵</Text>
          <Text style={styles.noTransactionsText}>
            No transactions for {displayDate} yet!
          </Text>
          <Text style={styles.noTransactionsSubText}>
            Add some incomes or costs to get started.
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate(ScreenNames.HOME_PAGE)}
          >
            <Text style={styles.addButtonText}>Hack to HomePage</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <IncomeList
            incomes={incomes}
            onDelete={(id) => handleDeleteTransaction(id, 'income')}
            totalIncome={totalIncome}
          />
          <CostList
            costs={costs}
            onDelete={(id) => handleDeleteTransaction(id, 'costs')}
            totalCosts={totalCosts}
          />
        </>
      )}

      <View style={styles.budgetSection}>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetText}>
            Budget: 0 + {totalIncome} - {totalCosts} = {budget}$
          </Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
          <Text style={styles.iconText}>👤</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5a8a9a" />
        </View>
      )}
    </View>
  );
};

export default DayTransactions;