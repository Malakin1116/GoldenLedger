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
  return dates.reverse(); // Сьогодні зверху
};

export const groupByDate = (transactions) => {
  return transactions.reduce((acc, item) => {
    const date = formatDate(new Date(item.date));
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
};