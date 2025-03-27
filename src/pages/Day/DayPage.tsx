// import React, { useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import styles from './styles';

// export default function DayPage() {
//   // Дані для доходів і витрат (можете замінити на дані з API)
//   const [incomes, setIncomes] = useState([
//     { id: '1', name: 'Product', amount: 20 },
//     { id: '2', name: 'Coffee', amount: 10 },
//     { id: '3', name: 'Car', amount: 50 },
//     { id: '4', name: 'Tell', amount: 20 },
//   ]);

//   const [costs, setCosts] = useState([
//     { id: '1', name: 'Salery', amount: 30 },
//     { id: '2', name: 'Deposit', amount: 30 },
//     { id: '3', name: 'Cripto', amount: 30 },
//   ]);

//   // Функції для редагування та видалення (поки просто логи)
//   const handleEditIncome = (id) => {
//     console.log('Edit income:', id);
//   };

//   const handleDeleteIncome = (id) => {
//     setIncomes(incomes.filter(item => item.id !== id));
//   };

//   const handleEditCost = (id) => {
//     console.log('Edit cost:', id);
//   };

//   const handleDeleteCost = (id) => {
//     setCosts(costs.filter(item => item.id !== id));
//   };

//   // Функції для додавання доходів і витрат (поки просто логи)
//   const handleAddIncome = () => {
//     console.log('Add Income');
//   };

//   const handleAddCosts = () => {
//     console.log('Add Costs');
//   };

//   // Підрахунок сум
//   const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
//   const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
//   const budget = 0 + totalIncome - totalCosts;

//   return (
//     <View style={styles.container}>
//       {/* Заголовок */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity style={styles.iconButton}>
//             <Text style={styles.iconText}>📅</Text>
//           </TouchableOpacity>
//           <Text style={styles.dateText}>18 May</Text>
//         </View>
//         <TouchableOpacity style={styles.iconButton}>
//           <Text style={styles.iconText}>❤️</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Вкладки */}
//       <View style={styles.tabs}>
//         <TouchableOpacity style={[styles.tab, styles.activeTab]}>
//           <Text style={[styles.tabText, styles.activeTabText]}>Day</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab}>
//           <Text style={styles.tabText}>Week</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab}>
//           <Text style={styles.tabText}>Month</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab}>
//           <Text style={styles.tabText}>Year</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab}>
//           <Text style={styles.tabText}>All</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Секція доходів */}
//       <View style={styles.section}>
//         <FlatList
//           data={incomes}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.item}>
//               <Text style={styles.itemText}>{`${item.name}: ${item.amount}$`}</Text>
//               <View style={styles.itemActions}>
//                 <TouchableOpacity
//                   style={styles.actionButton}
//                   onPress={() => handleEditIncome(item.id)}
//                 >
//                   <Text style={styles.actionButtonText}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.actionButton}
//                   onPress={() => handleDeleteIncome(item.id)}
//                 >
//                   <Text style={styles.actionButtonText}>Del</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         />
//         <View style={styles.summary}>
//           <Text style={styles.summaryText}>Sum Income: {totalIncome}$</Text>
//           <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
//             <Text style={styles.addButtonText}>Add Income</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Секція витрат */}
//       <View style={styles.section}>
//         <FlatList
//           data={costs}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.item}>
//               <Text style={styles.itemText}>{`${item.name}: ${item.amount}$`}</Text>
//               <View style={styles.itemActions}>
//                 <TouchableOpacity
//                   style={styles.actionButton}
//                   onPress={() => handleEditCost(item.id)}
//                 >
//                   <Text style={styles.actionButtonText}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.actionButton}
//                   onPress={() => handleDeleteCost(item.id)}
//                 >
//                   <Text style={styles.actionButtonText}>Del</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         />
//         <View style={styles.summary}>
//           <Text style={styles.summaryText}>Sum Costs: {totalCosts}$</Text>
//           <TouchableOpacity style={styles.addButton} onPress={handleAddCosts}>
//             <Text style={styles.addButtonText}>Add Costs</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Бюджет */}
//       <View style={styles.budgetSection}>
//         <Text style={styles.budgetText}>
//           Budget: 0 + {totalIncome} - {totalCosts} = {budget}$
//         </Text>
//         <TouchableOpacity style={styles.iconButton}>
//           <Text style={styles.iconText}>👤</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal'; // Імпортуємо компонент
import { createTransaction, fetchTransactionsToday } from '../../utils/api';
import styles from './styles'; // Імпортуємо стилі

// Визначаємо типи для транзакцій
interface Transaction {
  id: string;
  name: string;
  amount: number;
}

const DayPage: React.FC = () => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [costs, setCosts] = useState<Transaction[]>([]);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState<boolean>(false);
  const [isCostModalVisible, setCostModalVisible] = useState<boolean>(false);

  // Fetch transactions when the component mounts
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetchTransactionsToday();
        const transactions = response.data || [];

        const fetchedIncomes: Transaction[] = transactions
          .filter((item: any) => item.type !== 'costs')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Product',
            amount: item.amount,
          }));

        const fetchedCosts: Transaction[] = transactions
          .filter((item: any) => item.type === 'costs')
          .map((item: any) => ({
            id: item._id,
            name: item.category || 'Expense',
            amount: item.amount,
          }));

        setIncomes(fetchedIncomes);
        setCosts(fetchedCosts);
      } catch (error) {
        Alert.alert('Помилка', 'Не вдалося завантажити транзакції');
        console.error(error);
      }
    };

    loadTransactions();
  }, []);

  // Функції для редагування та видалення (поки локально)
  const handleEditIncome = (id: string) => {
    console.log('Редагувати дохід:', id);
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(incomes.filter((item) => item.id !== id));
  };

  const handleEditCost = (id: string) => {
    console.log('Редагувати витрату:', id);
  };

  const handleDeleteCost = (id: string) => {
    setCosts(costs.filter((item) => item.id !== id));
  };

  // Функція для додавання транзакції (використовується для доходів і витрат)
  const handleAddTransaction = async (amount: number, category: string, type: string, date: string) => {
    const response = await createTransaction(amount, category, type, date);
    const newTransaction: Transaction = {
      id: response.data._id,
      name: category,
      amount,
    };

    if (type === 'income') {
      setIncomes([...incomes, newTransaction]);
    } else {
      setCosts([...costs, newTransaction]);
    }
  };

  // Підрахунок сум
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
  const budget = 0 + totalIncome - totalCosts;

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>📅</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>18 May</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>❤️</Text>
        </TouchableOpacity>
      </View>

      {/* Вкладки */}
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

      {/* Секція доходів */}
      <View style={styles.section}>
        <FlatList
          data={incomes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{`${item.name}: ${item.amount}$`}</Text>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditIncome(item.id)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteIncome(item.id)}
                >
                  <Text style={styles.actionButtonText}>Del</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Сума доходів: {totalIncome}$</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIncomeModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Додати дохід</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Секція витрат */}
      <View style={styles.section}>
        <FlatList
          data={costs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{`${item.name}: ${item.amount}$`}</Text>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditCost(item.id)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteCost(item.id)}
                >
                  <Text style={styles.actionButtonText}>Del</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Сума витрат: {totalCosts}$</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setCostModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Додати витрати</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Бюджет */}
      <View style={styles.budgetSection}>
        <Text style={styles.budgetText}>
          Бюджет: 0 + {totalIncome} - {totalCosts} = {budget}$
        </Text>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Модальне вікно для доходів */}
      <AddTransactionModal
        visible={isIncomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="income"
        title="Додати дохід"
      />

      {/* Модальне вікно для витрат */}
      <AddTransactionModal
        visible={isCostModalVisible}
        onClose={() => setCostModalVisible(false)}
        onAdd={handleAddTransaction}
        transactionType="costs"
        title="Додати витрату"
      />
    </View>
  );
};

export default DayPage;