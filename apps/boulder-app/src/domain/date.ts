export const localDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const dateLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const getBucketStart = (date: Date, range: 'week' | 'month' | 'year') => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  if (range === 'week') start.setDate(start.getDate() - start.getDay());
  if (range === 'month') start.setDate(start.getDate() - start.getDay());
  if (range === 'year') start.setDate(1);
  return start;
};
