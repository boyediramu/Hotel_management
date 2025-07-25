import React, { useState } from 'react';

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
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address (minimum 10 characters)';
    }

    // Mobile number validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Check-in date validation
    if (!formData.checkinDate) {
      newErrors.checkinDate = 'Check-in date is required';
    } else {
      const checkinDate = new Date(formData.checkinDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkinDate < today) {
        newErrors.checkinDate = 'Check-in date cannot be in the past';
      }
    }

    // Check-out date validation
    if (!formData.checkoutDate) {
      newErrors.checkoutDate = 'Check-out date is required';
    } else if (formData.checkinDate && formData.checkoutDate) {
      const checkinDate = new Date(formData.checkinDate);
      const checkoutDate = new Date(formData.checkoutDate);
      if (checkoutDate <= checkinDate) {
        newErrors.checkoutDate = 'Check-out date must be after check-in date';
      }
    }

    // ID Proof validation
    if (!formData.idProofType) {
      newErrors.idProofType = 'Please select an ID proof type';
    }

    // Room selection validation
    if (!formData.selectedRoom) {
      newErrors.selectedRoom = 'Please select a room';
    } else {
      // Check if selected room is available
      const selectedRoom = rooms.find(room => room.number === formData.selectedRoom);
      if (!selectedRoom || selectedRoom.status !== 'Available') {
        newErrors.selectedRoom = 'Selected room is not available';
      }
    }

    // Guest count validation
    if (!formData.guestCount || formData.guestCount < 1 || formData.guestCount > 4) {
      newErrors.guestCount = 'Guest count must be between 1 and 4';
    }

    // Custom price validation (if provided)
    if (formData.customPrice && (isNaN(formData.customPrice) || parseFloat(formData.customPrice) <= 0)) {
      newErrors.customPrice = 'Custom price must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalAmount = () => {
    if (!formData.checkinDate || !formData.checkoutDate || !formData.selectedRoom) {
      return 0;
    }

    const checkinDate = new Date(formData.checkinDate);
    const checkoutDate = new Date(formData.checkoutDate);
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

    const selectedRoom = rooms.find(room => room.number === formData.selectedRoom);
    if (!selectedRoom) return 0;

    const pricePerNight = formData.customPrice ? parseFloat(formData.customPrice) : selectedRoom.price;
    return pricePerNight * nights;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const selectedRoom = rooms.find(room => room.number === formData.selectedRoom);
      const totalAmount = calculateTotalAmount();
      const nights = Math.ceil((new Date(formData.checkoutDate) - new Date(formData.checkinDate)) / (1000 * 60 * 60 * 24));

      // Create new guest record
      const newGuest = {
        id: Date.now(),
        name: formData.fullName.trim(),
        address: formData.address.trim(),
        mobile: formData.mobileNumber.trim(),
        roomNumber: formData.selectedRoom,
        checkinDate: formData.checkinDate,
        checkoutDate: formData.checkoutDate,
        idProof: formData.idProofType,
        guestCount: parseInt(formData.guestCount),
        customPrice: formData.customPrice ? parseFloat(formData.customPrice) : null,
        roomPrice: formData.customPrice ? parseFloat(formData.customPrice) : selectedRoom.price,
        nights: nights,
        totalAmount: totalAmount,
        checkinTimestamp: new Date().toISOString()
      };

      // Add guest to guests list
      setGuests(prev => [...prev, newGuest]);

      // Update room status to "Booked"
      setRooms(prev => prev.map(room =>
        room.number === formData.selectedRoom
          ? { ...room, status: 'Booked', guest: formData.fullName.trim(), checkinDate: formData.checkinDate, checkoutDate: formData.checkoutDate }
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

  const availableRooms = rooms.filter(room => room.status === 'Available');
  const totalAmount = calculateTotalAmount();
  const nights = formData.checkinDate && formData.checkoutDate ? 
    Math.ceil((new Date(formData.checkoutDate) - new Date(formData.checkinDate)) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="section-content">
      <h2>Guest Check-in</h2>
      <p>Register a new guest and assign them to an available room.</p>

      <form onSubmit={handleSubmit} className="checkin-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name *</label>
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
            <label htmlFor="mobileNumber" className="form-label">Mobile Number *</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className={`form-input ${errors.mobileNumber ? 'error' : ''}`}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              disabled={isSubmitting}
            />
            {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="address" className="form-label">Address *</label>
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
            <label htmlFor="checkinDate" className="form-label">Check-in Date *</label>
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
            <label htmlFor="checkoutDate" className="form-label">Check-out Date *</label>
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
            <label htmlFor="idProofType" className="form-label">ID Proof Type *</label>
            <select
              id="idProofType"
              name="idProofType"
              value={formData.idProofType}
              onChange={handleInputChange}
              className={`form-select ${errors.idProofType ? 'error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">Select ID proof type</option>
              {idProofOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.idProofType && <span className="error-text">{errors.idProofType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="selectedRoom" className="form-label">Select Room *</label>
            <select
              id="selectedRoom"
              name="selectedRoom"
              value={formData.selectedRoom}
              onChange={handleInputChange}
              className={`form-select ${errors.selectedRoom ? 'error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">Choose an available room</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.number}>
                  Room {room.number} - {room.type} (₹{room.price}/night)
                </option>
              ))}
            </select>
            {errors.selectedRoom && <span className="error-text">{errors.selectedRoom}</span>}
            {availableRooms.length === 0 && (
              <span className="help-text">No rooms available. Please check room management.</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="guestCount" className="form-label">Number of Guests *</label>
            <input
              type="number"
              id="guestCount"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleInputChange}
              className={`form-input ${errors.guestCount ? 'error' : ''}`}
              min="1"
              max="4"
              disabled={isSubmitting}
            />
            {errors.guestCount && <span className="error-text">{errors.guestCount}</span>}
            <span className="help-text">Maximum 4 guests per room</span>
          </div>

          <div className="form-group">
            <label htmlFor="customPrice" className="form-label">
              Custom Price <span className="optional-label">(Optional)</span>
            </label>
            <input
              type="number"
              id="customPrice"
              name="customPrice"
              value={formData.customPrice}
              onChange={handleInputChange}
              className={`form-input ${errors.customPrice ? 'error' : ''}`}
              placeholder="Enter custom price per night"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
            {errors.customPrice && <span className="error-text">{errors.customPrice}</span>}
            <span className="help-text">Leave empty to use default room price</span>
          </div>
        </div>

        {/* Booking Summary */}
        {formData.selectedRoom && formData.checkinDate && formData.checkoutDate && (
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-details">
              <div className="detail-row">
                <span className="detail-label">Room:</span>
                <span className="detail-value">{formData.selectedRoom}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nights:</span>
                <span className="detail-value">{nights}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Price per night:</span>
                <span className="detail-value">
                  ₹{formData.customPrice || (rooms.find(r => r.number === formData.selectedRoom)?.price || 0)}
                  {formData.customPrice && <span className="custom-price-badge">Custom</span>}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-value amount">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}

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

export default CheckinForm;
