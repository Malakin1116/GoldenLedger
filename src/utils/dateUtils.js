export const formatDate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (date) => {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
};

export const formatISODate = (dateStr) => {
  return `${dateStr}T00:00:00.000Z`;
};

export const getAllDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    dates.push(formatDate(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dates.reverse();
};

export const groupByDate = (transactions) => {
  return transactions.reduce((acc, item) => {
    const date = formatDate(new Date(item.date));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

// Нова функція для перевірки, чи дата в майбутньому
export const isFutureDate = (year, month, day) => {
  const checkDate = new Date(Date.UTC(year, month, day));
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Скидаємо час до 00:00
  return checkDate > today;
};
