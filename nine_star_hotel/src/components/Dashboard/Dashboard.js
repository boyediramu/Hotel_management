import React from 'react';

const Dashboard = ({ rooms, guests, bookingHistory }) => {
  const availableRooms = rooms.filter(room => room.status === 'Available');
  const bookedRooms = rooms.filter(room => room.status === 'Booked');
  const cleaningRooms = rooms.filter(room => room.status === 'Cleaning Pending');

  // Calculate revenue from active bookings
  const activeBookingsRevenue = guests.reduce((total, guest) => total + (guest.totalAmount || 0), 0);

  // Calculate today's completed bookings revenue
  const today = new Date().toISOString().split('T')[0];
  const todaysCompletedRevenue = bookingHistory
    .filter(booking => booking.checkoutTimestamp && booking.checkoutTimestamp.startsWith(today))
    .reduce((total, booking) => total + (booking.totalAmount || 0), 0);

  const totalRevenue = activeBookingsRevenue + todaysCompletedRevenue;

  return (
    <div className="section-content">
      <h2>Dashboard Overview</h2>
      <p>Welcome to the Hotel Management System. Here's your current status:</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#48bb78' }}>🏨</div>
          <div className="stat-info">
            <h3>Total Rooms</h3>
            <p className="stat-number">{rooms.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#48bb78' }}>✅</div>
          <div className="stat-info">
            <h3>Available Rooms</h3>
            <p className="stat-number">{availableRooms.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#e53e3e' }}>🔒</div>
          <div className="stat-info">
            <h3>Booked Rooms</h3>
            <p className="stat-number">{bookedRooms.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#ed8936' }}>🧹</div>
          <div className="stat-info">
            <h3>Cleaning Pending</h3>
            <p className="stat-number">{cleaningRooms.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#667eea' }}>👥</div>
          <div className="stat-info">
            <h3>Current Guests</h3>
            <p className="stat-number">{guests.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#48bb78' }}>💰</div>
          <div className="stat-info">
            <h3>Today's Revenue</h3>
            <p className="stat-number">₹{totalRevenue}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#667eea' }}>📊</div>
          <div className="stat-info">
            <h3>Occupancy Rate</h3>
            <p className="stat-number">
              {rooms.length > 0 ? Math.round((bookedRooms.length / rooms.length) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#ed8936' }}>📅</div>
          <div className="stat-info">
            <h3>Checking Out Today</h3>
            <p className="stat-number">
              {guests.filter(guest => guest.checkoutDate === new Date().toISOString().split('T')[0]).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
