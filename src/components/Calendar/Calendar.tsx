// components/Calendar/Calendar.tsx
import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import { isFutureDate } from '../../utils/dateUtils';
import ModalFilter from '../ModalFilter/ModalFilter';

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  selectedDate: string;
  monthNames: string[];
  daysInMonth: number;
  firstDayOfMonth: number;
  getDailySum: (day: number) => number;
  handleDateSelect: (day: number) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleFilterPress: (category: string | null) => void;
  incomeCategories: string[];
  costCategories: string[];
  selectedCategory?: string | null;
}

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  currentYear,
  selectedDate,
  monthNames,
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

  // Дебагінг: перевіряємо, чи передається selectedCategory
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
        <Text style={styles.dayOfWeek}>Пн</Text>
        <Text style={styles.dayOfWeek}>Вт</Text>
        <Text style={styles.dayOfWeek}>Ср</Text>
        <Text style={styles.dayOfWeek}>Чт</Text>
        <Text style={styles.dayOfWeek}>Пт</Text>
        <Text style={styles.dayOfWeek}>Сб</Text>
        <Text style={styles.dayOfWeek}>Нд</Text>
      </View>

      <View style={styles.daysContainer}>
        {emptyDaysStart.map((_, index) => (
          <View key={`empty-start-${index}`} style={styles.dayEmpty} />
        ))}
        {daysArray.map(day => {
          const isFuture = isFutureDate(currentYear, currentMonth, day);
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.day,
                selectedDate === `${day} ${monthNames[currentMonth]}` && styles.selectedDay,
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