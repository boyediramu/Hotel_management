import React from 'react';

const GuestManagement = ({ guests, setGuests, rooms, setRooms, bookingHistory, setBookingHistory }) => {
  const handleCheckOut = (guestId) => {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    // Create booking history record with final amount
    const completedBooking = {
      ...guest,
      checkoutTimestamp: new Date().toISOString()
    };

    // Add to booking history
    setBookingHistory(prev => [...prev, completedBooking]);

    // Update room status to "Cleaning Pending"
    setRooms(prev => prev.map(room =>
      room.number === guest.roomNumber
        ? { ...room, status: 'Cleaning Pending', guest: undefined, checkinDate: undefined, checkoutDate: undefined }
        : room
    ));

    // Remove guest from current guests
    setGuests(prev => prev.filter(g => g.id !== guestId));

    alert(`Check-out successful!\n\nGuest: ${guest.name}\nRoom: ${guest.roomNumber}\nTotal Amount: ₹${guest.totalAmount}`);
  };

  const currentGuests = guests.length;
  const checkingOutToday = guests.filter(guest => guest.checkoutDate === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="section-content">
      <h2>Guest Management</h2>
      <p>Manage current guests and handle check-outs.</p>

      {/* Guest Statistics */}
      <div className="guest-stats">
        <div className="stat-item">
          <span className="stat-label">Current Guests</span>
          <span className="stat-value">{currentGuests}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Checking Out Today</span>
          <span className="stat-value" style={{ color: '#ed8936' }}>{checkingOutToday}</span>
        </div>
      </div>

      {guests.length === 0 ? (
        <div className="no-guests">
          <p>No guests currently checked in.</p>
        </div>
      ) : (
        <div className="guest-list">
          {guests.map(guest => (
            <div key={guest.id} className="guest-card">
              <div className="guest-header">
                <h3>{guest.name}</h3>
                <span className="room-badge">Room {guest.roomNumber}</span>
              </div>

              <div className="guest-details">
                <div className="detail-row">
                  <span className="detail-label">Mobile:</span>
                  <span className="detail-value">{guest.mobile}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{guest.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Check-in:</span>
                  <span className="detail-value">{guest.checkinDate}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Check-out:</span>
                  <span className="detail-value">{guest.checkoutDate}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ID Proof:</span>
                  <span className="detail-value">{guest.idProof}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Guests:</span>
                  <span className="detail-value">{guest.guestCount}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nights:</span>
                  <span className="detail-value">{guest.nights}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price per night:</span>
                  <span className="detail-value">
                    ₹{guest.roomPrice}
                    {guest.customPrice && <span className="custom-price-badge">Custom</span>}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Amount:</span>
                  <span className="detail-value amount">₹{guest.totalAmount}</span>
                </div>
              </div>

              <div className="guest-actions">
                <button
                  className="checkout-button"
                  onClick={() => handleCheckOut(guest.id)}
                >
                  Check Out
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestManagement;
