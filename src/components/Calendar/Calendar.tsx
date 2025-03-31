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
  handleFilterPress: () => void;
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
  handleFilterPress,
}) => {
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDaysStart = Array.from({ length: adjustedFirstDay }, () => null);

  const totalBlocks = emptyDaysStart.length + daysArray.length;
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
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (absNumber >= 100000) {
      return `${Math.round(number / 1000)}k`;
    } else if (absNumber >= 1000) {
      return `${(number / 1000).toFixed(1)}k`;
    }
    return number.toString();
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
          const isFutureDate = new Date(currentYear, currentMonth, day) > new Date();
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.day,
                selectedDate === `${day} ${monthNames[currentMonth]}` && styles.selectedDay,
                isFutureDate && styles.disabledDay,
              ]}
              onPress={() => !isFutureDate && handleDateSelect(day)}
              disabled={isFutureDate}
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
        {/* Абсолютно позиціонована кнопка фільтра */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Text style={styles.filterText}>🧩</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(Calendar);