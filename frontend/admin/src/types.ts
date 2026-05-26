export type RoomType = 'Suite' | 'Deluxe' | 'Standard' | 'Executive';
export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';

export interface Room {
  id: string; // e.g. "101"
  type: RoomType;
  price: number;
  status: RoomStatus;
}

export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Pending' | 'Checked-out' | 'No Show';

export interface Booking {
  id: string; // e.g. "GH-99210"
  guestName: string;
  guestInitials: string;
  roomType: string;
  roomNumberOrSuite: string;
  checkInDate: string;  // e.g. "Oct 14"
  checkOutDate: string; // e.g. "Oct 19"
  amount: number;
  status: BookingStatus;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export type DashboardTab = 'dashboard' | 'rooms' | 'bookings' | 'reports' | 'settings' | 'support';
