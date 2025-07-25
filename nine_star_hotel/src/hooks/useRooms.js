import { useState } from 'react';

const useRooms = () => {
  // Initial room data - same as in original App.js
  const [rooms, setRooms] = useState([
    // Sample data - AC Rooms
    { id: 1, number: '101', type: 'AC', status: 'Available', price: 2500 },
    { id: 2, number: '102', type: 'AC', status: 'Booked', price: 2500, guest: 'John Doe', checkinDate: '2024-01-15', checkoutDate: '2024-01-18' },
    { id: 3, number: '103', type: 'AC', status: 'Cleaning Pending', price: 2500 },
    { id: 4, number: '201', type: 'AC', status: 'Available', price: 2500 },
    { id: 5, number: '202', type: 'AC', status: 'Booked', price: 2500, guest: 'Jane Smith', checkinDate: '2024-01-16', checkoutDate: '2024-01-20' },
    { id: 6, number: '203', type: 'AC', status: 'Available', price: 2500 },
    { id: 7, number: '301', type: 'AC', status: 'Available', price: 2500 },
    { id: 8, number: '302', type: 'AC', status: 'Cleaning Pending', price: 2500 },
    
    // Sample data - Non-AC Rooms
    { id: 9, number: '104', type: 'Non-AC', status: 'Available', price: 1500 },
    { id: 10, number: '105', type: 'Non-AC', status: 'Booked', price: 1500, guest: 'Mike Johnson', checkinDate: '2024-01-14', checkoutDate: '2024-01-17' },
    { id: 11, number: '204', type: 'Non-AC', status: 'Available', price: 1500 },
    { id: 12, number: '205', type: 'Non-AC', status: 'Available', price: 1500 },
    { id: 13, number: '304', type: 'Non-AC', status: 'Cleaning Pending', price: 1500 },
    { id: 14, number: '305', type: 'Non-AC', status: 'Available', price: 1500 }
  ]);

  // Room management functions
  const addRoom = (roomData) => {
    const newRoom = {
      id: Date.now(),
      number: roomData.number.trim(),
      type: roomData.type,
      status: 'Available',
      price: roomData.type === 'AC' ? 2500 : 1500
    };
    setRooms(prev => [...prev, newRoom]);
    return newRoom;
  };

  const updateRoom = (roomId, updates) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId ? { ...room, ...updates } : room
    ));
  };

  const deleteRoom = (roomId) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const updateRoomStatus = (roomId, status, additionalData = {}) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId 
        ? { 
            ...room, 
            status, 
            ...additionalData,
            // Clear guest data if room becomes available
            ...(status === 'Available' ? { 
              guest: undefined, 
              checkinDate: undefined, 
              checkoutDate: undefined 
            } : {})
          }
        : room
    ));
  };

  const updateRoomByNumber = (roomNumber, updates) => {
    setRooms(prev => prev.map(room =>
      room.number === roomNumber ? { ...room, ...updates } : room
    ));
  };

  const getRoomByNumber = (roomNumber) => {
    return rooms.find(room => room.number === roomNumber);
  };

  const getRoomById = (roomId) => {
    return rooms.find(room => room.id === roomId);
  };

  const getAvailableRooms = () => {
    return rooms.filter(room => room.status === 'Available');
  };

  const getBookedRooms = () => {
    return rooms.filter(room => room.status === 'Booked');
  };

  const getCleaningRooms = () => {
    return rooms.filter(room => room.status === 'Cleaning Pending');
  };

  const getRoomsByType = (type) => {
    return rooms.filter(room => room.type === type);
  };

  const isRoomNumberExists = (roomNumber) => {
    return rooms.some(room => room.number === roomNumber);
  };

  // Room statistics
  const getRoomStats = () => {
    const total = rooms.length;
    const available = getAvailableRooms().length;
    const booked = getBookedRooms().length;
    const cleaning = getCleaningRooms().length;
    const occupancyRate = total > 0 ? Math.round((booked / total) * 100) : 0;

    return {
      total,
      available,
      booked,
      cleaning,
      occupancyRate
    };
  };

  return {
    rooms,
    setRooms,
    addRoom,
    updateRoom,
    deleteRoom,
    updateRoomStatus,
    updateRoomByNumber,
    getRoomByNumber,
    getRoomById,
    getAvailableRooms,
    getBookedRooms,
    getCleaningRooms,
    getRoomsByType,
    isRoomNumberExists,
    getRoomStats
  };
};

export default useRooms;
