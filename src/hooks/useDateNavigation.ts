// src/hooks/useDateNavigation.ts
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackNavigation } from '../navigation/types';
import { formatDate, calculateDisplayDate, isFutureDate } from '../utils/dateUtils';
import { ScreenNames } from '../constants/screenName';

interface UseDateNavigationProps {
  navigation: NativeStackNavigationProp<RootStackNavigation, 'DayTransactions'>;
  initialDate: string;
  activeTab: string;
}

export const useDateNavigation = ({ navigation, initialDate, activeTab }: UseDateNavigationProps) => {
  const { t } = useTranslation();
  // Якщо initialDate некоректна, використовуємо поточну дату
  const [currentSelectedDate, setCurrentSelectedDate] = useState<string>(() => {
    const date = new Date(initialDate);
    return isNaN(date.getTime()) ? formatDate(new Date()) : initialDate;
  });

  useEffect(() => {
    const date = new Date(initialDate);
    if (!isNaN(date.getTime())) {
      setCurrentSelectedDate(initialDate);
    }
  }, [initialDate]);

  // Перевіряємо, чи наступна дата є майбутньою
  const isNextDayDisabled = () => {
    const currentDate = new Date(currentSelectedDate);
    if (isNaN(currentDate.getTime())) return true; // Якщо дата некоректна, блокуємо

    let nextDate: Date;
    if (activeTab === 'Day') {
      nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
    } else if (activeTab === 'Week') {
      nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 7);
    } else {
      nextDate = new Date(currentDate);
      nextDate.setMonth(currentDate.getMonth() + 1);
    }

    return isFutureDate(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
  };

  const handlePreviousDay = () => {
    const currentDate = new Date(currentSelectedDate);
    if (isNaN(currentDate.getTime())) return; // Перевіряємо, чи дата коректна
    if (activeTab === 'Day') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (activeTab === 'Week') {
      currentDate.setDate(currentDate.getDate() - 7);
    } else {
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentSelectedDate(formatDate(currentDate));
  };

  const handleNextDay = () => {
    const currentDate = new Date(currentSelectedDate);
    if (isNaN(currentDate.getTime())) return; // Перевіряємо, чи дата коректна
    if (activeTab === 'Day') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (activeTab === 'Week') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentSelectedDate(formatDate(currentDate));
  };

  const displayDate = calculateDisplayDate(currentSelectedDate, activeTab, t);

  return {
    currentSelectedDate,
    displayDate,
    isNextDayDisabled: isNextDayDisabled(),
    handlePreviousDay,
    handleNextDay,
  };
};