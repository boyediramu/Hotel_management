// Date utility functions

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

export const calculateNights = (checkinDate, checkoutDate) => {
  if (!checkinDate || !checkoutDate) return 0;
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const timeDiff = checkout.getTime() - checkin.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const isToday = (date) => {
  if (!date) return false;
  const today = getCurrentDate();
  const compareDate = typeof date === 'string' ? date.split('T')[0] : formatDate(date);
  return compareDate === today;
};

export const isPastDate = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  return compareDate < today;
};

export const isFutureDate = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const compareDate = new Date(date);
  return compareDate > today;
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDisplayDate = (date) => {
  if (!date) return '';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

export const formatDisplayDateTime = (date) => {
  if (!date) return '';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('en-US', options);
};
