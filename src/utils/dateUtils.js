// src/utils/dateUtils.ts
import { MONTHS } from '../constants/dateConstants';

export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const month = MONTHS[monthIndex];
  return `${day} ${month} ${year}`;
};

export const formatDisplayDate = (date: Date): string => {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
};

export const formatISODate = (dateStr: string): string => {
  return `${dateStr}T00:00:00.000Z`;
};

export const getAllDatesInRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    dates.push(formatDate(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dates.reverse();
};

export const groupByDate = (transactions: any[]): { [key: string]: any[] } => {
  const grouped: { [key: string]: any[] } = {};
  transactions.forEach((transaction) => {
    const date = transaction.date.split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });
  return grouped;
};

export const isFutureDate = (year: number, month: number, day: number): boolean => {
  const checkDate = new Date(year, month, day); // Без часу, лише дата
  const today = new Date(); // Поточна дата
  // Скидаємо час для обох дат, щоб порівнювати лише рік, місяць і день
  checkDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return checkDate > today;
};

export const calculateDisplayDate = (currentSelectedDate: string, activeTab: string): string => {
  const selected = new Date(currentSelectedDate);
  if (activeTab === 'Day') {
    return `${selected.getUTCDate()} ${MONTHS[selected.getUTCMonth()]}`;
  } else if (activeTab === 'Week') {
    const startOfWeek = new Date(selected);
    startOfWeek.setUTCDate(selected.getUTCDate() - 7);
    return `${formatDisplayDate(startOfWeek)}-${formatDisplayDate(selected)}`;
  } else {
    const startOfMonth = new Date(selected);
    startOfMonth.setUTCDate(selected.getUTCDate() - 30);
    return `${formatDisplayDate(startOfMonth)}-${formatDisplayDate(selected)}`;
  }
};