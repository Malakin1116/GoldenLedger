// src/hooks/useDateNavigation.ts
import { useState, useMemo } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { formatDate, isFutureDate } from '../utils/dateUtils';
import { calculateDisplayDate } from '../utils/dateUtils';
import { RootStackNavigation } from '../navigation/types';

interface UseDateNavigationProps {
  navigation: NavigationProp<RootStackNavigation>;
  initialDate: string;
  activeTab: string;
}

export const useDateNavigation = ({ navigation, initialDate, activeTab }: UseDateNavigationProps) => {
  const [currentSelectedDate, setCurrentSelectedDate] = useState<string>(initialDate);

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

  const displayDate = useMemo(
    () => calculateDisplayDate(currentSelectedDate, activeTab),
    [currentSelectedDate, activeTab]
  );

  const currentDateParts = currentSelectedDate.split('-').map(Number);
  const isNextDayDisabled = isFutureDate(currentDateParts[0], currentDateParts[1] - 1, currentDateParts[2] + 1);

  return {
    currentSelectedDate,
    displayDate,
    isNextDayDisabled,
    handlePreviousDay,
    handleNextDay,
  };
};
