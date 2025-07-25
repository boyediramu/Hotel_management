import { useState } from 'react';

const useBookingHistory = () => {
  // Initial booking history data - same as in original App.js
  const [bookingHistory, setBookingHistory] = useState([
    {
      id: 101,
      name: 'Alice Cooper',
      mobile: '9876543213',
      roomNumber: '201',
      checkinDate: '2024-01-10',
      checkoutDate: '2024-01-13',
      idProof: 'Passport',
      guestCount: 2,
      customPrice: null,
      roomPrice: 2500,
      nights: 3,
      totalAmount: 7500,
      checkoutTimestamp: '2024-01-13T11:00:00Z'
    },
    {
      id: 102,
      name: 'David Wilson',
      mobile: '9876543214',
      roomNumber: '301',
      checkinDate: '2024-01-08',
      checkoutDate: '2024-01-12',
      idProof: 'Driving License',
      guestCount: 1,
      customPrice: 2800,
      roomPrice: 2800,
      nights: 4,
      totalAmount: 11200,
      checkoutTimestamp: '2024-01-12T10:30:00Z'
    }
  ]);

  // Booking history management functions
  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: bookingData.id || Date.now(),
      checkoutTimestamp: bookingData.checkoutTimestamp || new Date().toISOString()
    };
    setBookingHistory(prev => [...prev, newBooking]);
    return newBooking;
  };

  const updateBooking = (bookingId, updates) => {
    setBookingHistory(prev => prev.map(booking =>
      booking.id === bookingId ? { ...booking, ...updates } : booking
    ));
  };

  const removeBooking = (bookingId) => {
    setBookingHistory(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const getBookingById = (bookingId) => {
    return bookingHistory.find(booking => booking.id === bookingId);
  };

  const getBookingsByDate = (date) => {
    return bookingHistory.filter(booking => 
      booking.checkoutTimestamp && booking.checkoutTimestamp.startsWith(date)
    );
  };

  const getTodaysBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return getBookingsByDate(today);
  };

  const getBookingsByDateRange = (startDate, endDate) => {
    return bookingHistory.filter(booking => {
      if (!booking.checkoutTimestamp) return false;
      const checkoutDate = booking.checkoutTimestamp.split('T')[0];
      return checkoutDate >= startDate && checkoutDate <= endDate;
    });
  };

  const searchBookings = (searchTerm) => {
    if (!searchTerm) return bookingHistory;
    
    const term = searchTerm.toLowerCase();
    return bookingHistory.filter(booking =>
      booking.name.toLowerCase().includes(term) ||
      booking.mobile.includes(term) ||
      booking.roomNumber.includes(term)
    );
  };

  const getBookingsByRoom = (roomNumber) => {
    return bookingHistory.filter(booking => booking.roomNumber === roomNumber);
  };

  const getBookingsByGuest = (guestName) => {
    return bookingHistory.filter(booking => 
      booking.name.toLowerCase().includes(guestName.toLowerCase())
    );
  };

  // Booking history statistics
  const getBookingStats = () => {
    const total = bookingHistory.length;
    const totalRevenue = bookingHistory.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const averageRevenue = total > 0 ? Math.round(totalRevenue / total) : 0;
    const averageStay = total > 0 
      ? Math.round((bookingHistory.reduce((sum, booking) => sum + (booking.nights || 0), 0) / total) * 10) / 10
      : 0;
    
    const todaysBookings = getTodaysBookings();
    const todaysRevenue = todaysBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

    return {
      total,
      totalRevenue,
      averageRevenue,
      averageStay,
      todaysBookings: todaysBookings.length,
      todaysRevenue
    };
  };

  const getMonthlyStats = (year, month) => {
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
    const monthlyBookings = bookingHistory.filter(booking =>
      booking.checkoutTimestamp && booking.checkoutTimestamp.startsWith(monthStr)
    );
    
    const revenue = monthlyBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const bookingCount = monthlyBookings.length;
    
    return {
      bookingCount,
      revenue,
      averageRevenue: bookingCount > 0 ? Math.round(revenue / bookingCount) : 0
    };
  };

  return {
    bookingHistory,
    setBookingHistory,
    addBooking,
    updateBooking,
    removeBooking,
    getBookingById,
    getBookingsByDate,
    getTodaysBookings,
    getBookingsByDateRange,
    searchBookings,
    getBookingsByRoom,
    getBookingsByGuest,
    getBookingStats,
    getMonthlyStats
  };
};

export default useBookingHistory;
