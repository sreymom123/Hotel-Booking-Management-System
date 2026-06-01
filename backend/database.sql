-- Hotels Table
CREATE TABLE IF NOT EXISTS hotels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT,
  room_number VARCHAR(10) NOT NULL UNIQUE,
  room_type VARCHAR(50),
  price_per_night DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_code VARCHAR(50) NOT NULL UNIQUE,
  room_id INT NOT NULL,
  guest_name VARCHAR(255),
  guest_email VARCHAR(100),
  guest_phone VARCHAR(20),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  payment_code VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  transaction_no VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Pending',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Checkin/Checkout Logs Table
CREATE TABLE IF NOT EXISTS checkin_checkout_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  checked_in_by INT,
  check_in_time TIMESTAMP NULL,
  checked_out_by INT,
  check_out_time TIMESTAMP NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_booking_room ON bookings(room_id);
CREATE INDEX idx_payment_booking ON payments(booking_id);
CREATE INDEX idx_payment_status ON payments(status);
CREATE INDEX idx_room_status ON rooms(status);
CREATE INDEX idx_booking_status ON bookings(status);
