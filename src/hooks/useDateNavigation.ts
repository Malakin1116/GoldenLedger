// src/hooks/useDateNavigation.ts
import { useState, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackNavigation } from '../navigation/types';
import { formatDate, calculateDisplayDate } from '../utils/dateUtils';
import { ScreenNames } from '../constants/screenName';

interface UseDateNavigationProps {
  navigation: NativeStackNavigationProp<RootStackNavigation, 'DayTransactions'>;
  initialDate: string;
  activeTab: string;
}

export const useDateNavigation = ({ navigation, initialDate, activeTab }: UseDateNavigationProps) => {
  const [currentSelectedDate, setCurrentSelectedDate] = useState<string>(initialDate);

  useEffect(() => {
    setCurrentSelectedDate(initialDate);
  }, [initialDate]);

  const isNextDayDisabled = new Date(currentSelectedDate) >= new Date();

  const handlePreviousDay = () => {
    const currentDate = new Date(currentSelectedDate);
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
    if (activeTab === 'Day') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (activeTab === 'Week') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentSelectedDate(formatDate(currentDate));
  };

  const displayDate = calculateDisplayDate(currentSelectedDate, activeTab);

  return {
    currentSelectedDate,
    displayDate,
    isNextDayDisabled,
    handlePreviousDay,
    handleNextDay,
  };
};