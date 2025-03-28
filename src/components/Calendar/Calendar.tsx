import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  selectedDate: string;
  monthNames: string[];
  daysInMonth: number;
  firstDayOfMonth: number;
  getDayColor: (day: number) => string;
  getDailySum: (day: number) => number;
  handleDateSelect: (day: number) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  currentYear,
  selectedDate,
  monthNames,
  daysInMonth,
  firstDayOfMonth,
  getDayColor,
  getDailySum,
  handleDateSelect,
  handlePrevMonth,
  handleNextMonth,
}) => {
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDaysStart = Array.from({ length: adjustedFirstDay }, () => null);

  // Обчислюємо загальну кількість блоків (початкові пусті + дні місяця)
  const totalBlocks = emptyDaysStart.length + daysArray.length;

  // Обчислюємо, скільки пустих блоків потрібно додати в кінці, щоб заповнити рядки до кратності 7
  const remainingBlocks = (7 - (totalBlocks % 7)) % 7;
  const emptyDaysEnd = Array.from({ length: remainingBlocks }, () => null);

  const getSumTextColor = (day: number) => {
    const sum = getDailySum(day);
    if (sum > 0) return 'rgba(53, 139, 54, 0.9)';
    if (sum < 0) return 'rgba(255, 0, 0, 0.5)';
    return '#333333';
  };

  const formatNumber = (number: number) => {
    const absNumber = Math.abs(number);
    if (absNumber >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`; // Мільйони (наприклад, 1500000 → 1.5M)
    } else if (absNumber >= 100000) {
      return `${Math.round(number / 1000)}k`; // Тисячі від 100,000 без дробової частини (наприклад, 200400 → 200k)
    } else if (absNumber >= 1000) {
      return `${(number / 1000).toFixed(1)}k`; // Тисячі від 1,000 із дробовою частиною (наприклад, 1500 → 1.5k)
    }
    return number.toString(); // Числа < 1,000 відображаємо як є (наприклад, 200 → 200)
  };

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
        <Text style={styles.dayOfWeek}>Mon</Text>
        <Text style={styles.dayOfWeek}>Tue</Text>
        <Text style={styles.dayOfWeek}>Wed</Text>
        <Text style={styles.dayOfWeek}>Thu</Text>
        <Text style={styles.dayOfWeek}>Fri</Text>
        <Text style={styles.dayOfWeek}>Sat</Text>
        <Text style={styles.dayOfWeek}>Sun</Text>
      </View>

      <View style={styles.daysContainer}>
        {emptyDaysStart.map((_, index) => (
          <View key={`empty-start-${index}`} style={styles.dayEmpty} />
        ))}
        {daysArray.map(day => (
          <TouchableOpacity
            key={day}
            style={[
              styles.day,
              selectedDate === `${day} ${monthNames[currentMonth]}` && styles.selectedDay,
            ]}
            onPress={() => handleDateSelect(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
            <Text style={[styles.daySumText, { color: getSumTextColor(day) }]}>
              {getDailySum(day) !== 0 ? `${getDailySum(day) > 0 ? '+' : ''}${formatNumber(getDailySum(day))}` : '0'}
            </Text>
          </TouchableOpacity>
        ))}
        {emptyDaysEnd.map((_, index) => (
          <View key={`empty-end-${index}`} style={styles.dayEmpty} />
        ))}
      </View>
    </View>
  );
};

export default memo(Calendar);