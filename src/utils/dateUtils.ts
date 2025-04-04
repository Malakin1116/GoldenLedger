// src/utils/dateUtils.ts
import { TFunction } from 'react-i18next';
import { MONTHS } from '../constants/dateConstants';

// `formatDate` повертає дату в англійському форматі для бекенду
export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const month = MONTHS[monthIndex]; // Англійська назва для бекенду
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; // Формат для бекенду: YYYY-MM-DD
};

// `formatDisplayDate` для відображення в форматі DD.MM
export const formatDisplayDate = (date: Date): string => {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
};

// `formatISODate` для бекенду
export const formatISODate = (dateStr: string): string => {
  return `${dateStr}T00:00:00.000Z`;
};

// `getAllDatesInRange` для бекенду
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

// `groupByDate` для бекенду
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

// `isFutureDate` для бекенду
export const isFutureDate = (year: number, month: number, day: number): boolean => {
  const checkDate = new Date(year, month, day); // Дата для перевірки
  const today = new Date(); // Поточна дата
  // Скидаємо час для обох дат, щоб порівнювати лише рік, місяць і день
  checkDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return checkDate > today; // Блокуємо всі майбутні дати
};

// `calculateDisplayDate` для відображення з локалізацією
export const calculateDisplayDate = (currentSelectedDate: string, activeTab: string, t?: TFunction): string => {
  const selected = new Date(currentSelectedDate);
  if (isNaN(selected.getTime())) {
    return t ? t('dayTransactions.invalid_date') : 'Invalid Date'; // Локалізована заглушка
  }

  if (activeTab === 'Day') {
    // Отримуємо день тижня
    const dayOfWeek = selected.getUTCDay(); // 0 (Sun) - 6 (Sat)
    const daysOfWeekKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayOfWeekKey = daysOfWeekKeys[dayOfWeek];
    const dayOfWeekName = t ? t(`dayTransactions.days_of_week.${dayOfWeekKey}`) : dayOfWeekKey;

    const month = t ? t(`calendar.months.${MONTHS[selected.getUTCMonth()]}`) : MONTHS[selected.getUTCMonth()];
    return `${dayOfWeekName}, ${selected.getUTCDate()} ${month}`;
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