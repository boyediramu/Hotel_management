// Utility helper functions for backend

// Date formatting utilities
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateMobileNumber = (mobile) => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
};

// Response utilities
const sendSuccess = (res, data, message = 'Success') => {
  res.json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message = 'An error occurred', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message
  });
};

// Calculation utilities
const calculateNights = (checkinDate, checkoutDate) => {
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const timeDiff = checkout.getTime() - checkin.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const calculateTotalAmount = (roomPrice, nights, customPrice = null) => {
  const pricePerNight = customPrice || roomPrice;
  return pricePerNight * nights;
};

module.exports = {
  formatDate,
  getCurrentTimestamp,
  validateEmail,
  validateMobileNumber,
  sendSuccess,
  sendError,
  calculateNights,
  calculateTotalAmount
};
