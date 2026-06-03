export type RoomType = "Suite" | "Deluxe" | "Standard" | "Executive";
export type RoomStatus = "Available" | "Occupied" | "Cleaning" | "Maintenance";

export interface Room {
  id: string;
  type: RoomType;
  price: number;
  status: RoomStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRoom {
  id: string;
  type: RoomType;
  price: number;
  status?: RoomStatus;
}

export type BookingStatus =
  | "Confirmed"
  | "Checked-in"
  | "Pending"
  | "Checked-out"
  | "No Show"
  | "Cancelled";

export interface GuestContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  roomId: string;
  guest: GuestContact;
  checkInDate: string;
  checkOutDate: string;
  amount: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBooking {
  roomId: string;
  guest: GuestContact;
  checkInDate: string;
  checkOutDate: string;
  amount: number;
  specialRequests?: string;
}
