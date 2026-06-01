CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') NOT NULL DEFAULT 'admin',
  phone VARCHAR(40) NULL,
  profile_image VARCHAR(500) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
);

CREATE TABLE IF NOT EXISTS rooms (
   id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
   room_number VARCHAR(30) NOT NULL,
   room_type ENUM('Suite', 'Deluxe', 'Standard', 'Executive') NOT NULL,
   name VARCHAR(120) NOT NULL,
   floor_number INT NOT NULL,
   location VARCHAR(160) NULL,
   capacity INT NOT NULL,
   price DECIMAL(10, 2) NOT NULL,
   description TEXT NULL,
   image_url VARCHAR(500) NULL,
   status ENUM('Available', 'Occupied', 'Cleaning', 'Maintenance') NOT NULL DEFAULT 'Available',
   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (id),
   UNIQUE KEY rooms_room_number_unique (room_number)
);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  room_id BIGINT UNSIGNED NOT NULL,
  booking_code VARCHAR(40) NOT NULL,
  check_in DATETIME NOT NULL,
  check_out DATETIME NOT NULL,
  guest_count INT NOT NULL,
  total_days INT NOT NULL,
  purpose VARCHAR(160) NULL,
  special_request TEXT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled', 'No Show') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY bookings_booking_code_unique (booking_code),
  KEY bookings_user_id_index (user_id),
  KEY bookings_room_id_index (room_id),
  CONSTRAINT bookings_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT bookings_room_id_fk FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS room_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY room_images_room_id_index (room_id),
  CONSTRAINT room_images_room_id_fk FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  payment_code VARCHAR(40) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online') NOT NULL,
  status ENUM('Pending', 'Paid', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending',
  transaction_no VARCHAR(120) NULL,
  paid_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY payments_payment_code_unique (payment_code),
  KEY payments_booking_id_index (booking_id),
  CONSTRAINT payments_booking_id_fk FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS checkin_checkout_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  checked_in_by BIGINT UNSIGNED NULL,
  checked_out_by BIGINT UNSIGNED NULL,
  check_in_time DATETIME NULL,
  check_out_time DATETIME NULL,
  note TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY checkin_checkout_logs_booking_id_index (booking_id),
  KEY checkin_checkout_logs_checked_in_by_index (checked_in_by),
  KEY checkin_checkout_logs_checked_out_by_index (checked_out_by),
  CONSTRAINT checkin_checkout_logs_booking_id_fk FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE,
  CONSTRAINT checkin_checkout_logs_checked_in_by_fk FOREIGN KEY (checked_in_by) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT checkin_checkout_logs_checked_out_by_fk FOREIGN KEY (checked_out_by) REFERENCES users (id) ON DELETE SET NULL
);

INSERT INTO users (name, email, password, role, phone, is_active)
VALUES ('Hotel Administrator', 'admin@grandhorizon.com', 'admin123', 'admin', NULL, TRUE)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  role = VALUES(role),
  is_active = VALUES(is_active);

INSERT INTO rooms (room_number, room_type, name, floor_number, location, capacity, price, description, image_url, status)
VALUES
   ('101', 'Suite', 'Suite 101', 1, 'Main Building', 4, 450.00, 'Private suite room for premium stays.', NULL, 'Available'),
   ('102', 'Suite', 'Suite 102', 1, 'Main Building', 4, 450.00, 'Private suite room for premium stays.', NULL, 'Available'),
   ('204', 'Deluxe', 'Deluxe Room 204', 2, 'Main Building', 2, 280.00, 'Deluxe room with private hotel amenities.', NULL, 'Occupied'),
   ('305', 'Standard', 'Standard Room 305', 3, 'Main Building', 2, 150.00, 'Standard private room.', NULL, 'Cleaning'),
   ('901', 'Executive', 'Executive Room 901', 9, 'Executive Floor', 4, 750.00, 'Executive private room with premium service.', NULL, 'Maintenance')
ON DUPLICATE KEY UPDATE
   room_type = VALUES(room_type),
   name = VALUES(name),
   floor_number = VALUES(floor_number),
   location = VALUES(location),
   capacity = VALUES(capacity),
   price = VALUES(price),
   description = VALUES(description),
   image_url = VALUES(image_url),
   status = VALUES(status);
