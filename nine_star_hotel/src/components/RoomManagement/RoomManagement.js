import React, { useState } from 'react';

const RoomManagement = ({ rooms, setRooms }) => {
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: '',
    type: 'AC',
    price: 2500
  });
  const [errors, setErrors] = useState({});

  const handleAddRoom = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!newRoom.number.trim()) {
      newErrors.number = 'Room number is required';
    } else if (rooms.some(room => room.number === newRoom.number.trim())) {
      newErrors.number = 'Room number already exists';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add new room
    const room = {
      id: Date.now(),
      number: newRoom.number.trim(),
      type: newRoom.type,
      status: 'Available',
      price: newRoom.type === 'AC' ? 2500 : 1500
    };

    setRooms(prev => [...prev, room]);
    setNewRoom({ number: '', type: 'AC', price: 2500 });
    setShowAddRoom(false);
    setErrors({});
  };

  const handleRoomTypeChange = (e) => {
    const type = e.target.value;
    setNewRoom(prev => ({
      ...prev,
      type: type,
      price: type === 'AC' ? 2500 : 1500
    }));
  };

  const handleStatusChange = (roomId, newStatus) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId
        ? { ...room, status: newStatus, guest: newStatus === 'Available' ? undefined : room.guest, checkinDate: newStatus === 'Available' ? undefined : room.checkinDate, checkoutDate: newStatus === 'Available' ? undefined : room.checkoutDate }
        : room
    ));
  };

  const handleDeleteRoom = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (room && room.status === 'Booked') {
      alert('Cannot delete a room that is currently booked. Please check out the guest first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      setRooms(prev => prev.filter(room => room.id !== roomId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return '#48bb78';
      case 'Booked':
        return '#e53e3e';
      case 'Cleaning Pending':
        return '#ed8936';
      default:
        return '#718096';
    }
  };

  const acRooms = rooms.filter(room => room.type === 'AC');
  const nonAcRooms = rooms.filter(room => room.type === 'Non-AC');

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(room => room.status === 'Available').length;
  const bookedRooms = rooms.filter(room => room.status === 'Booked').length;
  const cleaningRooms = rooms.filter(room => room.status === 'Cleaning Pending').length;

  return (
    <div className="section-content">
      <div className="room-management-header">
        <div>
          <h2>Room Management</h2>
          <p>Manage hotel rooms, their status, and availability.</p>
        </div>
        <button
          className="add-room-button"
          onClick={() => setShowAddRoom(!showAddRoom)}
        >
          {showAddRoom ? 'Cancel' : 'Add New Room'}
        </button>
      </div>

      {showAddRoom && (
        <div className="add-room-form">
          <h3>Add New Room</h3>
          <form onSubmit={handleAddRoom} className="room-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="roomNumber" className="form-label">Room Number *</label>
                <input
                  type="text"
                  id="roomNumber"
                  value={newRoom.number}
                  onChange={(e) => {
                    setNewRoom(prev => ({ ...prev, number: e.target.value }));
                    if (errors.number) {
                      setErrors(prev => ({ ...prev, number: '' }));
                    }
                  }}
                  className={`form-input ${errors.number ? 'error' : ''}`}
                  placeholder="e.g., 101, 201, etc."
                />
                {errors.number && <span className="error-text">{errors.number}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="roomType" className="form-label">Room Type *</label>
                <select
                  id="roomType"
                  value={newRoom.type}
                  onChange={handleRoomTypeChange}
                  className="form-select"
                >
                  <option value="AC">AC Room (₹2500/night)</option>
                  <option value="Non-AC">Non-AC Room (₹1500/night)</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button primary">
                Add Room
              </button>
              <button
                type="button"
                className="submit-button secondary"
                onClick={() => {
                  setShowAddRoom(false);
                  setNewRoom({ number: '', type: 'AC', price: 2500 });
                  setErrors({});
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Room Statistics */}
      <div className="room-stats">
        <div className="stat-item">
          <span className="stat-label">Total Rooms</span>
          <span className="stat-value">{totalRooms}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Available</span>
          <span className="stat-value" style={{ color: '#48bb78' }}>{availableRooms}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Booked</span>
          <span className="stat-value" style={{ color: '#e53e3e' }}>{bookedRooms}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Cleaning</span>
          <span className="stat-value" style={{ color: '#ed8936' }}>{cleaningRooms}</span>
        </div>
      </div>

      {/* Room Categories */}
      <div className="room-categories">
        {/* AC Rooms */}
        <div className="room-category">
          <h3>AC Rooms ({acRooms.length})</h3>
          <div className="room-grid">
            {acRooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h4>Room {room.number}</h4>
                  <span
                    className="room-status"
                    style={{ backgroundColor: getStatusColor(room.status) }}
                  >
                    {room.status}
                  </span>
                </div>
                <div className="room-details">
                  <p><strong>Type:</strong> {room.type}</p>
                  <p><strong>Price:</strong> ₹{room.price}/night</p>
                  {room.guest && (
                    <>
                      <p><strong>Guest:</strong> {room.guest}</p>
                      <p><strong>Check-in:</strong> {room.checkinDate}</p>
                      <p><strong>Check-out:</strong> {room.checkoutDate}</p>
                    </>
                  )}
                </div>
                <div className="room-actions">
                  {room.status === 'Cleaning Pending' && (
                    <button
                      className="status-button"
                      onClick={() => handleStatusChange(room.id, 'Available')}
                    >
                      Mark as Available
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRoom(room.id)}
                    disabled={room.status === 'Booked'}
                  >
                    🗑️ Delete Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-AC Rooms */}
        <div className="room-category">
          <h3>Non-AC Rooms ({nonAcRooms.length})</h3>
          <div className="room-grid">
            {nonAcRooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h4>Room {room.number}</h4>
                  <span
                    className="room-status"
                    style={{ backgroundColor: getStatusColor(room.status) }}
                  >
                    {room.status}
                  </span>
                </div>
                <div className="room-details">
                  <p><strong>Type:</strong> {room.type}</p>
                  <p><strong>Price:</strong> ₹{room.price}/night</p>
                  {room.guest && (
                    <>
                      <p><strong>Guest:</strong> {room.guest}</p>
                      <p><strong>Check-in:</strong> {room.checkinDate}</p>
                      <p><strong>Check-out:</strong> {room.checkoutDate}</p>
                    </>
                  )}
                </div>
                <div className="room-actions">
                  {room.status === 'Cleaning Pending' && (
                    <button
                      className="status-button"
                      onClick={() => handleStatusChange(room.id, 'Available')}
                    >
                      Mark as Available
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRoom(room.id)}
                    disabled={room.status === 'Booked'}
                  >
                    🗑️ Delete Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {rooms.length === 0 && (
        <div className="no-rooms">
          <p>No rooms available. Add your first room to get started.</p>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
