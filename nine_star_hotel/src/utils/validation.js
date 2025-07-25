// Validation utility functions

export const validateFullName = (name) => {
  if (!name || !name.trim()) {
    return 'Full name is required';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters';
  }
  return null;
};

export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return 'Address is required';
  }
  if (address.trim().length < 10) {
    return 'Please provide a complete address (minimum 10 characters)';
  }
  return null;
};

export const validateMobileNumber = (mobile) => {
  if (!mobile || !mobile.trim()) {
    return 'Mobile number is required';
  }
  if (!/^[0-9]{10}$/.test(mobile.trim())) {
    return 'Please enter a valid 10-digit mobile number';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateCheckinDate = (checkinDate) => {
  if (!checkinDate) {
    return 'Check-in date is required';
  }
  const checkin = new Date(checkinDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkin < today) {
    return 'Check-in date cannot be in the past';
  }
  return null;
};

export const validateCheckoutDate = (checkoutDate, checkinDate) => {
  if (!checkoutDate) {
    return 'Check-out date is required';
  }
  if (checkinDate && checkoutDate) {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    if (checkout <= checkin) {
      return 'Check-out date must be after check-in date';
    }
  }
  return null;
};

export const validateIdProofType = (idProofType) => {
  if (!idProofType) {
    return 'Please select an ID proof type';
  }
  return null;
};

export const validateRoomSelection = (selectedRoom, rooms) => {
  if (!selectedRoom) {
    return 'Please select a room';
  }
  const room = rooms.find(room => room.number === selectedRoom);
  if (!room || room.status !== 'Available') {
    return 'Selected room is not available';
  }
  return null;
};

export const validateGuestCount = (guestCount) => {
  if (!guestCount || guestCount < 1 || guestCount > 4) {
    return 'Guest count must be between 1 and 4';
  }
  return null;
};

export const validateCustomPrice = (customPrice) => {
  if (customPrice && (isNaN(customPrice) || parseFloat(customPrice) <= 0)) {
    return 'Custom price must be a valid positive number';
  }
  return null;
};

export const validateRoomNumber = (roomNumber, existingRooms) => {
  if (!roomNumber || !roomNumber.trim()) {
    return 'Room number is required';
  }
  if (existingRooms && existingRooms.some(room => room.number === roomNumber.trim())) {
    return 'Room number already exists';
  }
  return null;
};
