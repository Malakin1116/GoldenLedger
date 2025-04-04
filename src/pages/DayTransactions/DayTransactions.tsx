// src/pages/DayTransactions/DayTransactions.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import IncomeList from '../../components/IncomeList/Premium/IncomeList';
import CostList from '../../components/CostList/Premium/CostList';
import Budget from '../../components/Budget/Budget';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import ModalFilter from '../../components/ModalFilter/ModalFilter';
import { incomeCategories, costCategories } from '../../constants/categories';
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackNavigation } from '../../navigation/types';
import { formatDate, groupByDate } from '../../utils/dateUtils';
import { useTransactions } from '../../hooks/useTransactions';
import { useDateNavigation } from '../../hooks/useDateNavigation';
import { TABS, TabType } from '../../constants/dateConstants';
import { useAuth } from '../../context/AuthContext';
import { navigateUtil } from '../../utils/navigateUtil';

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
  const [activeTab, setActiveTab] = useState<TabType>('Day');
  const [modalState, setModalState] = useState({
    isIncomeModalVisible: false,
    isCostModalVisible: false,
    isFilterModalVisible: false,
  });
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { handleApiError } = useAuth();

  const monthlyTransactions = useMemo(() => route.params?.monthlyTransactions || [], [route.params?.monthlyTransactions]);
  const initialDate = route.params?.selectedDate || formatDate(new Date());

  const { currentSelectedDate, displayDate, isNextDayDisabled, handlePreviousDay, handleNextDay } = useDateNavigation({
    navigation,
    initialDate,
    activeTab,
  });

  const { incomes, costs, isLoading, totalIncome, totalCosts, budget, handleDeleteTransaction, handleAddTransaction } = useTransactions({
    navigation,
    monthlyTransactions,
    currentSelectedDate,
    activeTab,
    selectedCategory,
  });

  const groupedIncomes = groupByDate(incomes);
  const groupedCosts = groupByDate(costs);

  const handleProfilePress = () => navigateUtil(navigation, ScreenNames.SETTINGS_PAGE);
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
      <TouchableOpacity style={styles.iconButton} onPress={() => setModalState((prev) => ({ ...prev, isFilterModalVisible: true }))}>
        <Text style={styles.iconText}>🔍</Text>
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

          // Отримуємо день тижня з дати
          const dateObj = new Date(date);
          const dayOfWeek = dateObj.getUTCDay(); // 0 (Sun) - 6 (Sat)
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
        <Budget
          totalIncome={totalIncome}
          totalCosts={totalCosts}
          budget={budget}
          handleProfilePress={handleProfilePress}
        />
      </View>

      <AddTransactionModal
        visible={modalState.isIncomeModalVisible}
        onClose={() => setModalState((prev) => ({ ...prev, isIncomeModalVisible: false }))}
        onAdd={handleAddTransaction}
        transactionType="income"
        title={t('dayTransactions.add_income')}
        selectedDate={selectedDateForModal}
      />

      <AddTransactionModal
        visible={modalState.isCostModalVisible}
        onClose={() => setModalState((prev) => ({ ...prev, isCostModalVisible: false }))}
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