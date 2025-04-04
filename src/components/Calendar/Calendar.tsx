// src/components/Calendar/Calendar.tsx
import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import styles from './styles';
import { isFutureDate } from '../../utils/dateUtils';
import ModalFilter from '../ModalFilter/ModalFilter';

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  selectedDate: string;
  daysInMonth: number;
  firstDayOfMonth: number;
  getDailySum: (day: number) => number;
  handleDateSelect: (day: number) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleFilterPress: (category: string | null) => void;
  incomeCategories: { label: string; value: string }[];
  costCategories: { label: string; value: string }[];
  selectedCategory?: string | null;
}

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  currentYear,
  selectedDate,
  daysInMonth,
  firstDayOfMonth,
  getDailySum,
  handleDateSelect,
  handlePrevMonth,
  handleNextMonth,
  handleFilterPress,
  incomeCategories,
  costCategories,
  selectedCategory,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Отримуємо поточну дату
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Отримуємо перекладені назви місяців
  const monthNames = [
    t('calendar.months.january'),
    t('calendar.months.february'),
    t('calendar.months.march'),
    t('calendar.months.april'),
    t('calendar.months.may'),
    t('calendar.months.june'),
    t('calendar.months.july'),
    t('calendar.months.august'),
    t('calendar.months.september'),
    t('calendar.months.october'),
    t('calendar.months.november'),
    t('calendar.months.december'),
  ];

  // Отримуємо перекладені назви днів тижня
  const daysOfWeek = [
    t('calendar.days_of_week.mon'),
    t('calendar.days_of_week.tue'),
    t('calendar.days_of_week.wed'),
    t('calendar.days_of_week.thu'),
    t('calendar.days_of_week.fri'),
    t('calendar.days_of_week.sat'),
    t('calendar.days_of_week.sun'),
  ];

  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDaysStart = Array.from({ length: adjustedFirstDay }, () => null);

  const totalBlocks = emptyDaysStart.length + daysArray.length;
  const remainingBlocks = (7 - (totalBlocks % 7)) % 7;
  const emptyDaysEnd = Array.from({ length: remainingBlocks }, () => null);

  const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);

  const getSumTextColor = (day: number) => {
    const sum = getDailySum(day);
    if (sum > 0) {
      return 'rgba(53, 139, 54, 0.9)';
    }
    if (sum < 0) {
      return 'rgba(255, 0, 0, 0.5)';
    }
    return '#333333';
  };

  const formatNumber = (number: number) => {
    const absNumber = Math.abs(number);
    if (absNumber >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (absNumber >= 100000) {
      return `${Math.round(number / 1000)}k`;
    } else if (absNumber >= 1000) {
      return `${(number / 1000).toFixed(1)}k`;
    }
    return number.toString();
  };

  console.log('Calendar selectedCategory:', selectedCategory);

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.arrow}>◄</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{`${monthNames[currentMonth]} ${currentYear}`}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.arrow}>►</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysOfWeek}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayOfWeek}>{day}</Text>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {emptyDaysStart.map((_, index) => (
          <View key={`empty-start-${index}`} style={styles.dayEmpty} />
        ))}
        {daysArray.map(day => {
          const isFuture = isFutureDate(currentYear, currentMonth, day);
          const isToday =
            day === todayDay &&
            currentMonth === todayMonth &&
            currentYear === todayYear; // Перевіряємо, чи це поточний день

          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.day,
                (selectedDate === `${day} ${monthNames[currentMonth]}` || isToday) && styles.selectedDay, // Підсвічуємо, якщо день вибраний або це сьогодні
                isFuture && styles.disabledDay,
              ]}
              onPress={() => !isFuture && handleDateSelect(day)}
              disabled={isFuture}
            >
              <Text style={styles.dayText}>{day}</Text>
              <Text style={[styles.daySumText, { color: getSumTextColor(day) }]}>
                {getDailySum(day) !== 0 ? `${getDailySum(day) > 0 ? '+' : ''}${formatNumber(getDailySum(day))}` : '0'}
              </Text>
            </TouchableOpacity>
          );
        })}
        {emptyDaysEnd.map((_, index) => (
          <View key={`empty-end-${index}`} style={styles.dayEmpty} />
        ))}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterText}>🧩</Text>
        </TouchableOpacity>
      </View>

      <ModalFilter
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onSelect={(category) => {
          handleFilterPress(category);
          setFilterModalVisible(false);
        }}
        incomeCategories={incomeCategories}
        costCategories={costCategories}
        selectedCategory={selectedCategory}
      />
    </View>
  );
};

export default memo(Calendar);