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
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }, () => null);

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
        {emptyDays.map((_, index) => (
          <View key={`empty-${index}`} style={styles.dayEmpty} />
        ))}
        {daysArray.map(day => (
          <TouchableOpacity
            key={day}
            style={[
              styles.day,
              selectedDate === `${day} ${monthNames[currentMonth]}` && styles.selectedDay,
              { backgroundColor: getDayColor(day) },
            ]}
            onPress={() => handleDateSelect(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
            <Text style={styles.daySumText}>{getDailySum(day) !== 0 ? getDailySum(day) : '0'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default memo(Calendar);