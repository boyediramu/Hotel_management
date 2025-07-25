import React, { createContext, useContext } from 'react';
import useAuth from '../hooks/useAuth';
import useRooms from '../hooks/useRooms';
import useGuests from '../hooks/useGuests';
import useBookingHistory from '../hooks/useBookingHistory';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Context provider component
export const AppProvider = ({ children }) => {
  // Initialize all hooks
  const auth = useAuth();
  const rooms = useRooms();
  const guests = useGuests();
  const bookingHistory = useBookingHistory();

  // Combined context value
  const contextValue = {
    // Authentication
    auth,
    
    // Room management
    rooms,
    
    // Guest management
    guests,
    
    // Booking history
    bookingHistory,
    
    // Combined operations that involve multiple entities
    operations: {
      // Check in a guest
      checkinGuest: (guestData) => {
        // Add guest
        const newGuest = guests.addGuest(guestData);
        
        // Update room status
        rooms.updateRoomByNumber(guestData.selectedRoom, {
          status: 'Booked',
          guest: guestData.fullName.trim(),
          checkinDate: guestData.checkinDate,
          checkoutDate: guestData.checkoutDate
        });
        
        return newGuest;
      },
      
      // Check out a guest
      checkoutGuest: (guestId) => {
        const guest = guests.getGuestById(guestId);
        if (!guest) return null;
        
        // Create booking history record
        const completedBooking = {
          ...guest,
          checkoutTimestamp: new Date().toISOString()
        };
        bookingHistory.addBooking(completedBooking);
        
        // Update room status to cleaning pending
        rooms.updateRoomByNumber(guest.roomNumber, {
          status: 'Cleaning Pending',
          guest: undefined,
          checkinDate: undefined,
          checkoutDate: undefined
        });
        
        // Remove guest from current guests
        guests.removeGuest(guestId);
        
        return completedBooking;
      },
      
      // Mark room as available after cleaning
      markRoomAvailable: (roomId) => {
        rooms.updateRoomStatus(roomId, 'Available');
      },
      
      // Get dashboard statistics
      getDashboardStats: () => {
        const roomStats = rooms.getRoomStats();
        const guestStats = guests.getGuestStats();
        const bookingStats = bookingHistory.getBookingStats();
        
        return {
          rooms: roomStats,
          guests: guestStats,
          bookings: bookingStats,
          totalRevenue: guestStats.totalRevenue + bookingStats.todaysRevenue
        };
      },
      
      // Get analytics data
      getAnalyticsData: () => {
        const roomStats = rooms.getRoomStats();
        const guestStats = guests.getGuestStats();
        const bookingStats = bookingHistory.getBookingStats();
        
        // Room type analysis
        const acRooms = rooms.getRoomsByType('AC');
        const nonAcRooms = rooms.getRoomsByType('Non-AC');
        const acOccupancy = acRooms.length > 0 
          ? Math.round((acRooms.filter(room => room.status === 'Booked').length / acRooms.length) * 100)
          : 0;
        const nonAcOccupancy = nonAcRooms.length > 0 
          ? Math.round((nonAcRooms.filter(room => room.status === 'Booked').length / nonAcRooms.length) * 100)
          : 0;
        
        return {
          roomStats,
          guestStats,
          bookingStats,
          roomTypes: {
            ac: {
              total: acRooms.length,
              occupancy: acOccupancy
            },
            nonAc: {
              total: nonAcRooms.length,
              occupancy: nonAcOccupancy
            }
          }
        };
      }
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
