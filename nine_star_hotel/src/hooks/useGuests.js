import { useState } from 'react';

const useGuests = () => {
  // Initial guest data - same as in original App.js
  const [guests, setGuests] = useState([
    {
      id: 1,
      name: 'John Doe',
      address: '123 Main Street, Downtown, City - 12345',
      mobile: '9876543210',
      roomNumber: '102',
      checkinDate: '2024-01-15',
      checkoutDate: '2024-01-18',
      idProof: 'Aadhaar Card',
      guestCount: 2,
      customPrice: null,
      roomPrice: 2500,
      nights: 3,
      totalAmount: 7500,
      checkinTimestamp: '2024-01-15T14:30:00Z'
    },
    {
      id: 2,
      name: 'Jane Smith',
      address: '456 Oak Avenue, Suburb, City - 67890',
      mobile: '9876543211',
      roomNumber: '202',
      checkinDate: '2024-01-16',
      checkoutDate: '2024-01-20',
      idProof: 'Passport',
      guestCount: 1,
      customPrice: 2800,
      roomPrice: 2800,
      nights: 4,
      totalAmount: 11200,
      checkinTimestamp: '2024-01-16T16:15:00Z'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      address: '789 Pine Road, Uptown, City - 54321',
      mobile: '9876543212',
      roomNumber: '105',
      checkinDate: '2024-01-14',
      checkoutDate: '2024-01-17',
      idProof: 'Driving License',
      guestCount: 3,
      customPrice: null,
      roomPrice: 1500,
      nights: 3,
      totalAmount: 4500,
      checkinTimestamp: '2024-01-14T12:00:00Z'
    }
  ]);

  // Guest management functions
  const addGuest = (guestData) => {
    const newGuest = {
      id: Date.now(),
      ...guestData,
      checkinTimestamp: new Date().toISOString()
    };
    setGuests(prev => [...prev, newGuest]);
    return newGuest;
  };

  const updateGuest = (guestId, updates) => {
    setGuests(prev => prev.map(guest =>
      guest.id === guestId ? { ...guest, ...updates } : guest
    ));
  };

  const removeGuest = (guestId) => {
    setGuests(prev => prev.filter(guest => guest.id !== guestId));
  };

  const getGuestById = (guestId) => {
    return guests.find(guest => guest.id === guestId);
  };

  const getGuestByRoom = (roomNumber) => {
    return guests.find(guest => guest.roomNumber === roomNumber);
  };

  const getGuestsByCheckoutDate = (date) => {
    return guests.filter(guest => guest.checkoutDate === date);
  };

  const getTodaysCheckouts = () => {
    const today = new Date().toISOString().split('T')[0];
    return getGuestsByCheckoutDate(today);
  };

  const searchGuests = (searchTerm) => {
    if (!searchTerm) return guests;
    
    const term = searchTerm.toLowerCase();
    return guests.filter(guest =>
      guest.name.toLowerCase().includes(term) ||
      guest.mobile.includes(term) ||
      guest.roomNumber.includes(term)
    );
  };

  // Guest statistics
  const getGuestStats = () => {
    const total = guests.length;
    const checkingOutToday = getTodaysCheckouts().length;
    const totalRevenue = guests.reduce((sum, guest) => sum + (guest.totalAmount || 0), 0);
    const averageStay = guests.length > 0 
      ? Math.round((guests.reduce((sum, guest) => sum + (guest.nights || 0), 0) / guests.length) * 10) / 10
      : 0;

    return {
      total,
      checkingOutToday,
      totalRevenue,
      averageStay
    };
  };

  return {
    guests,
    setGuests,
    addGuest,
    updateGuest,
    removeGuest,
    getGuestById,
    getGuestByRoom,
    getGuestsByCheckoutDate,
    getTodaysCheckouts,
    searchGuests,
    getGuestStats
  };
};

export default useGuests;
