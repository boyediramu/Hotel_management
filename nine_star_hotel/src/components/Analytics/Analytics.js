import React from 'react';

const Analytics = ({ rooms, guests, bookingHistory }) => {
  const totalRooms = rooms.length;
  const availableRoomsAnalytics = rooms.filter(room => room.status === 'Available');
  const bookedRoomsAnalytics = rooms.filter(room => room.status === 'Booked');
  const cleaningRoomsAnalytics = rooms.filter(room => room.status === 'Cleaning Pending');

  // Revenue calculations
  const activeBookingsRevenue = guests.reduce((total, guest) => total + (guest.totalAmount || 0), 0);
  const completedBookingsRevenue = bookingHistory.reduce((total, booking) => total + (booking.totalAmount || 0), 0);
  const totalRevenue = activeBookingsRevenue + completedBookingsRevenue;

  // Today's statistics
  const today = new Date().toISOString().split('T')[0];
  const todaysCompletedBookings = bookingHistory.filter(booking => 
    booking.checkoutTimestamp && booking.checkoutTimestamp.startsWith(today)
  );
  const todaysRevenue = todaysCompletedBookings.reduce((total, booking) => total + (booking.totalAmount || 0), 0);

  // Room type analysis
  const acRooms = rooms.filter(room => room.type === 'AC');
  const nonAcRooms = rooms.filter(room => room.type === 'Non-AC');
  const acOccupancy = acRooms.length > 0 ? (acRooms.filter(room => room.status === 'Booked').length / acRooms.length) * 100 : 0;
  const nonAcOccupancy = nonAcRooms.length > 0 ? (nonAcRooms.filter(room => room.status === 'Booked').length / nonAcRooms.length) * 100 : 0;

  return (
    <div className="section-content">
      <h2>Analytics & Reports</h2>
      <p>Detailed insights into your hotel's performance and statistics.</p>

      <div className="analytics-grid">
        {/* Room Statistics */}
        <div className="analytics-card">
          <h3>Room Statistics</h3>
          <div className="analytics-stats">
            <div className="analytics-stat">
              <span className="stat-label">Total Rooms</span>
              <span className="stat-value">{totalRooms}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Available Rooms</span>
              <span className="stat-value available">{availableRoomsAnalytics.length}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Booked Rooms</span>
              <span className="stat-value occupancy">{bookedRoomsAnalytics.length}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Cleaning Pending</span>
              <span className="stat-value cleaning">{cleaningRoomsAnalytics.length}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Overall Occupancy</span>
              <span className="stat-value occupancy">
                {totalRooms > 0 ? Math.round((bookedRoomsAnalytics.length / totalRooms) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="analytics-card">
          <h3>Revenue Analytics</h3>
          <div className="analytics-stats">
            <div className="analytics-stat">
              <span className="stat-label">Active Bookings Revenue</span>
              <span className="stat-value revenue">₹{activeBookingsRevenue}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Completed Bookings Revenue</span>
              <span className="stat-value revenue">₹{completedBookingsRevenue}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value revenue">₹{totalRevenue}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Today's Revenue</span>
              <span className="stat-value revenue">₹{todaysRevenue}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Average Revenue per Booking</span>
              <span className="stat-value revenue">
                ₹{bookingHistory.length > 0 ? Math.round(completedBookingsRevenue / bookingHistory.length) : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Guest Analytics */}
        <div className="analytics-card">
          <h3>Guest Analytics</h3>
          <div className="analytics-stats">
            <div className="analytics-stat">
              <span className="stat-label">Current Guests</span>
              <span className="stat-value">{guests.length}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Total Completed Bookings</span>
              <span className="stat-value">{bookingHistory.length}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Today's Checkouts</span>
              <span className="stat-value">{todaysCompletedBookings.length}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Checking Out Today</span>
              <span className="stat-value">
                {guests.filter(guest => guest.checkoutDate === today).length}
              </span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Average Stay Duration</span>
              <span className="stat-value">
                {bookingHistory.length > 0 
                  ? Math.round(bookingHistory.reduce((total, booking) => total + (booking.nights || 0), 0) / bookingHistory.length * 10) / 10
                  : 0} nights
              </span>
            </div>
          </div>
        </div>

        {/* Room Type Performance */}
        <div className="analytics-card">
          <h3>Room Type Performance</h3>
          <div className="analytics-stats">
            <div className="analytics-stat">
              <span className="stat-label">AC Rooms</span>
              <span className="stat-value">{acRooms.length}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">AC Room Occupancy</span>
              <span className="stat-value occupancy">{Math.round(acOccupancy)}%</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Non-AC Rooms</span>
              <span className="stat-value">{nonAcRooms.length}</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Non-AC Room Occupancy</span>
              <span className="stat-value occupancy">{Math.round(nonAcOccupancy)}%</span>
            </div>
            <div className="analytics-stat">
              <span className="stat-label">Most Popular Room Type</span>
              <span className="stat-value">
                {acOccupancy > nonAcOccupancy ? 'AC Rooms' : nonAcOccupancy > acOccupancy ? 'Non-AC Rooms' : 'Equal'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
