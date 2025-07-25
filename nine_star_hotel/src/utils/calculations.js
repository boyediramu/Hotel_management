// Calculation utility functions

export const calculateTotalAmount = (roomPrice, nights, customPrice = null) => {
  if (!roomPrice || !nights) return 0;
  const pricePerNight = customPrice || roomPrice;
  return pricePerNight * nights;
};

export const calculateOccupancyRate = (bookedRooms, totalRooms) => {
  if (!totalRooms || totalRooms === 0) return 0;
  return Math.round((bookedRooms / totalRooms) * 100);
};

export const calculateRevenue = (bookings) => {
  if (!bookings || !Array.isArray(bookings)) return 0;
  return bookings.reduce((total, booking) => total + (booking.totalAmount || 0), 0);
};

export const calculateAverageRevenue = (bookings) => {
  if (!bookings || !Array.isArray(bookings) || bookings.length === 0) return 0;
  const totalRevenue = calculateRevenue(bookings);
  return Math.round(totalRevenue / bookings.length);
};

export const calculateAverageStayDuration = (bookings) => {
  if (!bookings || !Array.isArray(bookings) || bookings.length === 0) return 0;
  const totalNights = bookings.reduce((total, booking) => total + (booking.nights || 0), 0);
  return Math.round((totalNights / bookings.length) * 10) / 10;
};

export const getRoomTypeOccupancy = (rooms, roomType) => {
  if (!rooms || !Array.isArray(rooms)) return 0;
  const typeRooms = rooms.filter(room => room.type === roomType);
  if (typeRooms.length === 0) return 0;
  const bookedTypeRooms = typeRooms.filter(room => room.status === 'Booked');
  return Math.round((bookedTypeRooms.length / typeRooms.length) * 100);
};

export const getDefaultRoomPrice = (roomType) => {
  switch (roomType) {
    case 'AC':
      return 2500;
    case 'Non-AC':
      return 1500;
    default:
      return 2000;
  }
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const calculateTax = (amount, taxRate = 0.18) => {
  if (!amount) return 0;
  return Math.round(amount * taxRate);
};

export const calculateAmountWithTax = (amount, taxRate = 0.18) => {
  if (!amount) return 0;
  return amount + calculateTax(amount, taxRate);
};

export const calculateDiscount = (amount, discountPercentage) => {
  if (!amount || !discountPercentage) return 0;
  return Math.round(amount * (discountPercentage / 100));
};

export const calculateAmountAfterDiscount = (amount, discountPercentage) => {
  if (!amount) return 0;
  const discount = calculateDiscount(amount, discountPercentage);
  return amount - discount;
};
