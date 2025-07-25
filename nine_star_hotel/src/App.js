import React, { useState } from 'react';
import './App.css';
import Login from './components/Login/Login';

// CheckinForm Component
const CheckinForm = ({ rooms, setRooms, guests, setGuests, bookingHistory, setBookingHistory }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    mobileNumber: '',
    checkinDate: '',
    checkoutDate: '',
    idProofType: '',
    selectedRoom: '',
    customPrice: '',
    guestCount: 1
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idProofOptions = [
    'Aadhaar Card',
    'Driving License',
    'Passport'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters long';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address (minimum 10 characters)';
    }

    // Mobile Number validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Check-in Date validation
    if (!formData.checkinDate) {
      newErrors.checkinDate = 'Check-in date is required';
    } else if (new Date(formData.checkinDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.checkinDate = 'Check-in date cannot be in the past';
    }

    // Check-out Date validation
    if (!formData.checkoutDate) {
      newErrors.checkoutDate = 'Check-out date is required';
    } else if (formData.checkinDate && new Date(formData.checkoutDate) <= new Date(formData.checkinDate)) {
      newErrors.checkoutDate = 'Check-out date must be after check-out date';
    }

    // ID Proof Type validation
    if (!formData.idProofType) {
      newErrors.idProofType = 'ID proof type is required';
    }

    // Room selection validation
    if (!formData.selectedRoom) {
      newErrors.selectedRoom = 'Please select a room';
    }

    // Guest count validation
    if (!formData.guestCount || formData.guestCount < 1) {
      newErrors.guestCount = 'Number of guests must be at least 1';
    } else if (formData.guestCount > 10) {
      newErrors.guestCount = 'Maximum 10 guests allowed per room';
    }

    // Custom price validation (optional field)
    if (formData.customPrice && (isNaN(formData.customPrice) || parseFloat(formData.customPrice) <= 0)) {
      newErrors.customPrice = 'Please enter a valid price amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get room details for pricing
      const selectedRoom = rooms.find(room => room.number === formData.selectedRoom);
      const roomPrice = formData.customPrice ? parseFloat(formData.customPrice) : selectedRoom.price;

      // Calculate total amount
      const checkinDate = new Date(formData.checkinDate);
      const checkoutDate = new Date(formData.checkoutDate);
      const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
      const totalAmount = roomPrice * nights;

      // Create new guest
      const newGuest = {
        id: Date.now(),
        name: formData.fullName,
        mobile: formData.mobileNumber,
        address: formData.address,
        roomNumber: formData.selectedRoom,
        checkinDate: formData.checkinDate,
        checkoutDate: formData.checkoutDate,
        idProof: formData.idProofType,
        guestCount: parseInt(formData.guestCount),
        customPrice: formData.customPrice ? parseFloat(formData.customPrice) : null,
        roomPrice: roomPrice,
        nights: nights,
        totalAmount: totalAmount
      };

      // Update guest list
      setGuests(prev => [...prev, newGuest]);

      // Update room status to booked
      setRooms(prev => prev.map(room =>
        room.number === formData.selectedRoom
          ? {
              ...room,
              status: 'Booked',
              guest: formData.fullName,
              checkinDate: formData.checkinDate,
              checkoutDate: formData.checkoutDate
            }
          : room
      ));

      // Success - show confirmation and reset form
      alert(`Check-in successful!\n\nGuest: ${formData.fullName}\nRoom: ${formData.selectedRoom}\nMobile: ${formData.mobileNumber}\nCheck-in: ${formData.checkinDate}\nCheck-out: ${formData.checkoutDate}\nID Proof: ${formData.idProofType}`);

      // Reset form
      setFormData({
        fullName: '',
        address: '',
        mobileNumber: '',
        checkinDate: '',
        checkoutDate: '',
        idProofType: '',
        selectedRoom: '',
        customPrice: '',
        guestCount: 1
      });
      setErrors({});
    } catch (error) {
      alert('Check-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get available rooms for the selected dates
  const getAvailableRooms = () => {
    if (!formData.checkinDate || !formData.checkoutDate) return [];

    return rooms.filter(room => room.status === 'Available');
  };

  return (
    <div className="section-content">
      <h2>Guest Check-in</h2>
      <form onSubmit={handleSubmit} className="checkin-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="Enter guest's full name"
              disabled={isSubmitting}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber" className="form-label">
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className={`form-input ${errors.mobileNumber ? 'error' : ''}`}
              placeholder="Enter 10-digit mobile number"
              disabled={isSubmitting}
            />
            {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="address" className="form-label">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`form-textarea ${errors.address ? 'error' : ''}`}
              placeholder="Enter complete address"
              rows="3"
              disabled={isSubmitting}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="checkinDate" className="form-label">
              Check-in Date *
            </label>
            <input
              type="date"
              id="checkinDate"
              name="checkinDate"
              value={formData.checkinDate}
              onChange={handleInputChange}
              className={`form-input ${errors.checkinDate ? 'error' : ''}`}
              min={new Date().toISOString().split('T')[0]}
              disabled={isSubmitting}
            />
            {errors.checkinDate && <span className="error-text">{errors.checkinDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="checkoutDate" className="form-label">
              Check-out Date *
            </label>
            <input
              type="date"
              id="checkoutDate"
              name="checkoutDate"
              value={formData.checkoutDate}
              onChange={handleInputChange}
              className={`form-input ${errors.checkoutDate ? 'error' : ''}`}
              min={formData.checkinDate || new Date().toISOString().split('T')[0]}
              disabled={isSubmitting}
            />
            {errors.checkoutDate && <span className="error-text">{errors.checkoutDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="idProofType" className="form-label">
              ID Proof Type *
            </label>
            <select
              id="idProofType"
              name="idProofType"
              value={formData.idProofType}
              onChange={handleInputChange}
              className={`form-select ${errors.idProofType ? 'error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">Select ID proof type</option>
              {idProofOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.idProofType && <span className="error-text">{errors.idProofType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="selectedRoom" className="form-label">
              Select Room *
            </label>
            <select
              id="selectedRoom"
              name="selectedRoom"
              value={formData.selectedRoom}
              onChange={handleInputChange}
              className={`form-select ${errors.selectedRoom ? 'error' : ''}`}
              disabled={isSubmitting || !formData.checkinDate || !formData.checkoutDate}
            >
              <option value="">
                {!formData.checkinDate || !formData.checkoutDate
                  ? 'Please select check-in and check-out dates first'
                  : 'Select an available room'
                }
              </option>
              {getAvailableRooms().map((room) => (
                <option key={room.id} value={room.number}>
                  Room {room.number} - {room.type}
                </option>
              ))}
            </select>
            {errors.selectedRoom && <span className="error-text">{errors.selectedRoom}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="guestCount" className="form-label">
              Number of Guests *
            </label>
            <input
              type="number"
              id="guestCount"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleInputChange}
              className={`form-input ${errors.guestCount ? 'error' : ''}`}
              min="1"
              max="10"
              disabled={isSubmitting}
            />
            {errors.guestCount && <span className="error-text">{errors.guestCount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customPrice" className="form-label">
              Custom Room Price (₹/night)
              <span className="optional-label"> - Optional</span>
            </label>
            <input
              type="number"
              id="customPrice"
              name="customPrice"
              value={formData.customPrice}
              onChange={handleInputChange}
              className={`form-input ${errors.customPrice ? 'error' : ''}`}
              placeholder="Leave empty to use default room price"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
            {errors.customPrice && <span className="error-text">{errors.customPrice}</span>}
            {formData.selectedRoom && !formData.customPrice && (
              <span className="help-text">
                Default price: ₹{rooms.find(r => r.number === formData.selectedRoom)?.price || 0}/night
              </span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Processing Check-in...
              </>
            ) : (
              'Complete Check-in'
            )}
          </button>
          <button
            type="button"
            className="submit-button secondary"
            onClick={() => {
              setFormData({
                fullName: '',
                address: '',
                mobileNumber: '',
                checkinDate: '',
                checkoutDate: '',
                idProofType: '',
                selectedRoom: '',
                customPrice: '',
                guestCount: 1
              });
              setErrors({});
            }}
            disabled={isSubmitting}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

// RoomManagement Component
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

  const updateRoomStatus = (roomId, newStatus) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId
        ? { ...room, status: newStatus, ...(newStatus === 'Available' ? { guest: undefined } : {}) }
        : room
    ));
  };

  const handleDeleteRoom = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    // Check if room is currently booked
    if (room.status === 'Booked') {
      alert('Cannot delete a room that is currently booked. Please check out the guest first.');
      return;
    }

    // Confirm deletion
    if (window.confirm(`Are you sure you want to delete Room ${room.number}? This action cannot be undone.`)) {
      setRooms(prev => prev.filter(r => r.id !== roomId));
      alert(`Room ${room.number} has been deleted successfully.`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#48bb78';
      case 'Booked': return '#e53e3e';
      case 'Cleaning Pending': return '#ed8936';
      default: return '#718096';
    }
  };

  const acRooms = rooms.filter(room => room.type === 'AC');
  const nonAcRooms = rooms.filter(room => room.type === 'Non-AC');
  const availableRooms = rooms.filter(room => room.status === 'Available');
  const bookedRooms = rooms.filter(room => room.status === 'Booked');

  return (
    <div className="section-content">
      <div className="room-management-header">
        <h2>Room Management</h2>
        <button
          className="add-room-button"
          onClick={() => setShowAddRoom(!showAddRoom)}
        >
          {showAddRoom ? 'Cancel' : '+ Add New Room'}
        </button>
      </div>

      {showAddRoom && (
        <div className="add-room-form">
          <h3>Add New Room</h3>
          <form onSubmit={handleAddRoom} className="room-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="roomNumber">Room Number *</label>
                <input
                  type="text"
                  id="roomNumber"
                  value={newRoom.number}
                  onChange={(e) => {
                    setNewRoom(prev => ({ ...prev, number: e.target.value }));
                    if (errors.number) setErrors(prev => ({ ...prev, number: '' }));
                  }}
                  className={`form-input ${errors.number ? 'error' : ''}`}
                  placeholder="e.g., 101, 201A"
                />
                {errors.number && <span className="error-text">{errors.number}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="roomType">Room Type *</label>
                <select
                  id="roomType"
                  value={newRoom.type}
                  onChange={(e) => setNewRoom(prev => ({
                    ...prev,
                    type: e.target.value,
                    price: e.target.value === 'AC' ? 2500 : 1500
                  }))}
                  className="form-select"
                >
                  <option value="AC">AC Room (₹2,500/night)</option>
                  <option value="Non-AC">Non-AC Room (₹1,500/night)</option>
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

      <div className="room-stats">
        <div className="stat-item">
          <span className="stat-label">Total Rooms:</span>
          <span className="stat-value">{rooms.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Available:</span>
          <span className="stat-value" style={{ color: '#48bb78' }}>{availableRooms.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Booked:</span>
          <span className="stat-value" style={{ color: '#e53e3e' }}>{bookedRooms.length}</span>
        </div>
      </div>

      <div className="room-categories">
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
                  {room.guest && <p><strong>Guest:</strong> {room.guest}</p>}
                </div>
                <div className="room-actions">
                  {room.status === 'Cleaning Pending' && (
                    <button
                      className="status-button"
                      onClick={() => updateRoomStatus(room.id, 'Available')}
                    >
                      Mark Cleaning Complete
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRoom(room.id)}
                    disabled={room.status === 'Booked'}
                    title={room.status === 'Booked' ? 'Cannot delete booked room' : 'Delete room'}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                  {room.guest && <p><strong>Guest:</strong> {room.guest}</p>}
                </div>
                <div className="room-actions">
                  {room.status === 'Cleaning Pending' && (
                    <button
                      className="status-button"
                      onClick={() => updateRoomStatus(room.id, 'Available')}
                    >
                      Mark Cleaning Complete
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRoom(room.id)}
                    disabled={room.status === 'Booked'}
                    title={room.status === 'Booked' ? 'Cannot delete booked room' : 'Delete room'}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// GuestManagement Component
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

    // Remove guest from active guests list
    setGuests(prev => prev.filter(g => g.id !== guestId));

    alert(`Check-out successful for ${guest.name} from Room ${guest.roomNumber}.\nTotal Amount: ₹${guest.totalAmount.toLocaleString()}\nRoom status set to "Cleaning Pending".`);
  };

  const getTotalStayAmount = (guest) => {
    // Use the pre-calculated total amount from the guest record
    return guest.totalAmount || 0;
  };

  return (
    <div className="section-content">
      <h2>Guest Management</h2>

      <div className="guest-stats">
        <div className="stat-item">
          <span className="stat-label">Total Active Guests:</span>
          <span className="stat-value">{guests.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rooms Occupied:</span>
          <span className="stat-value">{rooms.filter(r => r.status === 'Booked').length}</span>
        </div>
      </div>

      {guests.length === 0 ? (
        <div className="no-guests">
          <p>No active guests at the moment.</p>
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
                  <span className="detail-label">Guests:</span>
                  <span className="detail-value">{guest.guestCount || 1}</span>
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
                  <span className="detail-label">Room Price:</span>
                  <span className="detail-value">₹{guest.roomPrice?.toLocaleString() || 0}/night</span>
                  {guest.customPrice && <span className="custom-price-badge">Custom</span>}
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nights:</span>
                  <span className="detail-value">{guest.nights || 0}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Amount:</span>
                  <span className="detail-value amount">₹{getTotalStayAmount(guest).toLocaleString()}</span>
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Global room state management
  const [rooms, setRooms] = useState([
    // Sample data - AC Rooms
    { id: 1, number: '101', type: 'AC', status: 'Available', price: 2500 },
    { id: 2, number: '102', type: 'AC', status: 'Booked', price: 2500, guest: 'John Doe', checkinDate: '2024-01-15', checkoutDate: '2024-01-18' },
    { id: 3, number: '103', type: 'AC', status: 'Cleaning Pending', price: 2500 },
    { id: 4, number: '201', type: 'AC', status: 'Available', price: 2500 },
    { id: 5, number: '202', type: 'AC', status: 'Booked', price: 2500, guest: 'Jane Smith', checkinDate: '2024-01-16', checkoutDate: '2024-01-20' },

    // Sample data - Non-AC Rooms
    { id: 6, number: '301', type: 'Non-AC', status: 'Available', price: 1500 },
    { id: 7, number: '302', type: 'Non-AC', status: 'Booked', price: 1500, guest: 'Bob Johnson', checkinDate: '2024-01-14', checkoutDate: '2024-01-17' },
    { id: 8, number: '303', type: 'Non-AC', status: 'Available', price: 1500 },
    { id: 9, number: '401', type: 'Non-AC', status: 'Cleaning Pending', price: 1500 },
    { id: 10, number: '402', type: 'Non-AC', status: 'Available', price: 1500 }
  ]);

  // Global guests state
  const [guests, setGuests] = useState([
    {
      id: 1,
      name: 'John Doe',
      mobile: '9876543210',
      roomNumber: '102',
      checkinDate: '2024-01-15',
      checkoutDate: '2024-01-18',
      idProof: 'Aadhaar Card',
      guestCount: 2,
      customPrice: null,
      roomPrice: 2500,
      nights: 3,
      totalAmount: 7500
    },
    {
      id: 2,
      name: 'Jane Smith',
      mobile: '9876543211',
      roomNumber: '202',
      checkinDate: '2024-01-16',
      checkoutDate: '2024-01-20',
      idProof: 'Passport',
      guestCount: 1,
      customPrice: null,
      roomPrice: 2500,
      nights: 4,
      totalAmount: 10000
    },
    {
      id: 3,
      name: 'Bob Johnson',
      mobile: '9876543212',
      roomNumber: '302',
      checkinDate: '2024-01-14',
      checkoutDate: '2024-01-17',
      idProof: 'Driving License',
      guestCount: 3,
      customPrice: 3000,
      roomPrice: 3000,
      nights: 3,
      totalAmount: 9000
    }
  ]);

  // Booking history state for completed bookings
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

  const handleLoginSuccess = (userData) => {
    setAdminUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'checkin', label: 'Check-in', icon: '🏨' },
    { id: 'rooms', label: 'Room Management', icon: '🛏️' },
    { id: 'guests', label: 'Guest Management', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
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

        // Total daily revenue (active + completed today)
        const todaysRevenue = activeBookingsRevenue + todaysCompletedRevenue;

        // Total historical revenue
        const totalHistoricalRevenue = bookingHistory.reduce((total, booking) => total + (booking.totalAmount || 0), 0);

        return (
          <div className="section-content">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏨</div>
                <div className="stat-info">
                  <h3>Total Rooms</h3>
                  <p className="stat-number">{rooms.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>Available Rooms</h3>
                  <p className="stat-number">{availableRooms.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔒</div>
                <div className="stat-info">
                  <h3>Booked Rooms</h3>
                  <p className="stat-number">{bookedRooms.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🧹</div>
                <div className="stat-info">
                  <h3>Cleaning Pending</h3>
                  <p className="stat-number">{cleaningRooms.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>Daily Revenue</h3>
                  <p className="stat-number">₹{todaysRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>Active Guests</h3>
                  <p className="stat-number">{guests.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>Total Revenue</h3>
                  <p className="stat-number">₹{(activeBookingsRevenue + totalHistoricalRevenue).toLocaleString()}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <h3>Completed Bookings</h3>
                  <p className="stat-number">{bookingHistory.length}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'checkin':
        return <CheckinForm rooms={rooms} setRooms={setRooms} guests={guests} setGuests={setGuests} bookingHistory={bookingHistory} setBookingHistory={setBookingHistory} />;
      case 'rooms':
        return <RoomManagement rooms={rooms} setRooms={setRooms} />;
      case 'guests':
        return <GuestManagement guests={guests} setGuests={setGuests} rooms={rooms} setRooms={setRooms} bookingHistory={bookingHistory} setBookingHistory={setBookingHistory} />;
      case 'analytics':
        const totalRooms = rooms.length;
        const availableRoomsAnalytics = rooms.filter(room => room.status === 'Available');
        const bookedRoomsAnalytics = rooms.filter(room => room.status === 'Booked');
        const cleaningRoomsAnalytics = rooms.filter(room => room.status === 'Cleaning Pending');

        const occupancyRate = totalRooms > 0 ? ((bookedRoomsAnalytics.length / totalRooms) * 100).toFixed(1) : 0;

        // Calculate accurate revenue from active bookings
        const activeBookingsRevenueAnalytics = guests.reduce((total, guest) => total + (guest.totalAmount || 0), 0);

        // Calculate today's completed bookings revenue
        const todayAnalytics = new Date().toISOString().split('T')[0];
        const todaysCompletedRevenueAnalytics = bookingHistory
          .filter(booking => booking.checkoutTimestamp && booking.checkoutTimestamp.startsWith(todayAnalytics))
          .reduce((total, booking) => total + (booking.totalAmount || 0), 0);

        // Total daily revenue (active + completed today)
        const dailyRevenue = activeBookingsRevenueAnalytics + todaysCompletedRevenueAnalytics;

        // Total historical revenue
        const totalHistoricalRevenueAnalytics = bookingHistory.reduce((total, booking) => total + (booking.totalAmount || 0), 0);

        // Total cumulative revenue
        const totalRevenue = activeBookingsRevenueAnalytics + totalHistoricalRevenueAnalytics;

        // Monthly revenue estimate (based on daily average from history)
        const avgDailyFromHistory = bookingHistory.length > 0 ? totalHistoricalRevenueAnalytics / Math.max(bookingHistory.length, 1) : dailyRevenue;
        const monthlyRevenue = avgDailyFromHistory * 30;

        const acRooms = rooms.filter(room => room.type === 'AC');
        const nonAcRooms = rooms.filter(room => room.type === 'Non-AC');
        const acOccupied = acRooms.filter(room => room.status === 'Booked').length;
        const nonAcOccupied = nonAcRooms.filter(room => room.status === 'Booked').length;

        return (
          <div className="section-content">
            <h2>Analytics & Reports</h2>

            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Revenue Analytics</h3>
                <div className="analytics-stats">
                  <div className="analytics-stat">
                    <span className="stat-label">Daily Revenue</span>
                    <span className="stat-value revenue">₹{dailyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Monthly Revenue (Est.)</span>
                    <span className="stat-value revenue">₹{monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Total Revenue</span>
                    <span className="stat-value revenue">₹{totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Active Bookings Value</span>
                    <span className="stat-value">₹{activeBookingsRevenueAnalytics.toLocaleString()}</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Completed Bookings</span>
                    <span className="stat-value">{bookingHistory.length}</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Historical Revenue</span>
                    <span className="stat-value">₹{totalHistoricalRevenueAnalytics.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>Occupancy Statistics</h3>
                <div className="analytics-stats">
                  <div className="analytics-stat">
                    <span className="stat-label">Overall Occupancy Rate</span>
                    <span className="stat-value occupancy">{occupancyRate}%</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Rooms Occupied</span>
                    <span className="stat-value">{bookedRoomsAnalytics.length} / {totalRooms}</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Available Rooms</span>
                    <span className="stat-value available">{availableRoomsAnalytics.length}</span>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>Room Type Analysis</h3>
                <div className="analytics-stats">
                  <div className="analytics-stat">
                    <span className="stat-label">AC Rooms Occupied</span>
                    <span className="stat-value">{acOccupied} / {acRooms.length}</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Non-AC Rooms Occupied</span>
                    <span className="stat-value">{nonAcOccupied} / {nonAcRooms.length}</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Cleaning Pending</span>
                    <span className="stat-value cleaning">{cleaningRoomsAnalytics.length}</span>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>Guest Analytics</h3>
                <div className="analytics-stats">
                  <div className="analytics-stat">
                    <span className="stat-label">Active Guests</span>
                    <span className="stat-value">{guests.length}</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Average Stay Duration</span>
                    <span className="stat-value">
                      {guests.length > 0
                        ? Math.round(guests.reduce((total, guest) => {
                            const checkin = new Date(guest.checkinDate);
                            const checkout = new Date(guest.checkoutDate);
                            const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
                            return total + nights;
                          }, 0) / guests.length)
                        : 0
                      } nights
                    </span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-label">Check-outs Today</span>
                    <span className="stat-value">
                      {guests.filter(guest => guest.checkoutDate === new Date().toISOString().split('T')[0]).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="section-content">
            <h2>Dashboard</h2>
            <p>Welcome to the admin dashboard</p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Hotel Management - Admin Panel</h1>
          <div className="admin-info">
            <span>Welcome, {adminUser?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        <nav className="sidebar">
          <div className="nav-header">
            <h3>Navigation</h3>
          </div>
          <ul className="nav-menu">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
