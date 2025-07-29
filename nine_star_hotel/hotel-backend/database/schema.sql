-- Nine Star Hotel Management System Database Schema
-- Created for MySQL 8.0+

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hotel_management;
USE hotel_management;

-- =============================================
-- ROOMS TABLE
-- =============================================
CREATE TABLE rooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(10) NOT NULL UNIQUE,
  room_type ENUM('AC', 'Non-AC') NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  status ENUM('AVAILABLE', 'BOOKED', 'CLEANING_PENDING', 'MAINTENANCE', 'OUT_OF_ORDER') DEFAULT 'AVAILABLE',
  floor_number INT,
  max_occupancy INT DEFAULT 4,
  amenities JSON,
  description TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for better performance
  INDEX idx_room_type (room_type),
  INDEX idx_room_status (status),
  INDEX idx_room_number (room_number),
  INDEX idx_floor_number (floor_number)
);

-- =============================================
-- GUESTS TABLE
-- =============================================
CREATE TABLE guests (
  guest_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  address TEXT NOT NULL,
  id_proof_type ENUM('Aadhaar Card', 'Passport', 'Driving License', 'Voter ID', 'PAN Card') NOT NULL,
  id_proof_number VARCHAR(50),
  email VARCHAR(100),
  emergency_contact VARCHAR(15),
  guest_count INT NOT NULL DEFAULT 1,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_mobile (mobile_number),
  INDEX idx_full_name (full_name),
  INDEX idx_id_proof (id_proof_number)
);

-- =============================================
-- BOOKINGS TABLE (Current Active Bookings)
-- =============================================
CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  guest_id INT NOT NULL,
  checkin_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  checkin_timestamp TIMESTAMP NULL,
  checkout_timestamp TIMESTAMP NULL,
  nights_count INT NOT NULL,
  room_price_per_night DECIMAL(10,2) NOT NULL,
  custom_price_per_night DECIMAL(10,2) NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  advance_payment DECIMAL(10,2) DEFAULT 0.00,
  remaining_amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('PENDING', 'PARTIAL', 'PAID', 'REFUNDED') DEFAULT 'PENDING',
  booking_status ENUM('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW') DEFAULT 'CONFIRMED',
  special_requests TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  
  -- Indexes
  INDEX idx_room_booking (room_id),
  INDEX idx_guest_booking (guest_id),
  INDEX idx_checkin_date (checkin_date),
  INDEX idx_checkout_date (checkout_date),
  INDEX idx_booking_status (booking_status),
  INDEX idx_payment_status (payment_status)
);

-- =============================================
-- BOOKING HISTORY TABLE (Completed Bookings)
-- =============================================
CREATE TABLE booking_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  room_id INT NOT NULL,
  guest_id INT NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  guest_name VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  checkin_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  checkin_timestamp TIMESTAMP NOT NULL,
  checkout_timestamp TIMESTAMP NOT NULL,
  nights_count INT NOT NULL,
  room_price_per_night DECIMAL(10,2) NOT NULL,
  custom_price_per_night DECIMAL(10,2) NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  guest_count INT NOT NULL,
  id_proof_type VARCHAR(50) NOT NULL,
  special_requests TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for reporting and analytics
  INDEX idx_checkout_date (checkout_date),
  INDEX idx_guest_name (guest_name),
  INDEX idx_room_number (room_number),
  INDEX idx_total_amount (total_amount)
);

-- =============================================
-- ROOM MAINTENANCE LOG TABLE
-- =============================================
CREATE TABLE room_maintenance_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  maintenance_type ENUM('CLEANING', 'REPAIR', 'INSPECTION', 'UPGRADE') NOT NULL,
  status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  description TEXT,
  assigned_to VARCHAR(100),
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  cost DECIMAL(10,2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  INDEX idx_room_maintenance (room_id),
  INDEX idx_maintenance_status (status),
  INDEX idx_maintenance_type (maintenance_type)
);

-- =============================================
-- ADMIN USERS TABLE
-- =============================================
CREATE TABLE admin_users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role ENUM('SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST') DEFAULT 'RECEPTIONIST',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_username (username),
  INDEX idx_role (role)
);
