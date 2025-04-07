import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';
import { useUser } from '../../context/UserContext';
import { getCurrentUser } from '../../api/userApi'; // Додаємо прямий виклик API
import styles from './styles';

interface BudgetProps {
  totalIncome: number;
  totalCosts: number;
}

const Budget: React.FC<BudgetProps> = ({ totalIncome, totalCosts }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { user, setUser } = useUser();
  const [initialBudget, setInitialBudget] = useState<number>(0);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        if (!user?.budget) { // Якщо контекст порожній, завантажуємо з API
          const userData = await getCurrentUser();
          setUser({ id: userData._id, name: userData.name, budget: userData.budget || 0 });
          setInitialBudget(userData.budget || 0);
        } else {
          setInitialBudget(user.budget); // Використовуємо з контексту, якщо є
        }
      } catch (error) {
        console.error('Failed to fetch budget:', error);
        setInitialBudget(0); // Фallback на 0 при помилці
      }
    };
    fetchBudget();
  }, [user, setUser]); // Залежність від user і setUser

  const currentBudget = initialBudget + totalIncome - totalCosts;
  const budgetText = `${t('budget.title')}: ${initialBudget} + ${totalIncome} - ${totalCosts} = ${currentBudget} ${currency.symbol}`;

  return (
    <View style={styles.budgetSection}>
      <View style={styles.budgetContainer}>
        <Text style={styles.budgetText}>{budgetText}</Text>
      </View>
    </View>
  );
};

export default Budget;