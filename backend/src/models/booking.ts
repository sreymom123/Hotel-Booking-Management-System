export const bookingStatuses = [
  "Pending",
  "Confirmed",
  "Checked-in",
  "Checked-out",
  "Cancelled",
  "No Show",
] as const;

export type BookingStatus = (typeof bookingStatuses)[number];

export interface Booking {
  id: number;
  userId: number | null;
  roomId: number | string;
  bookingCode: string;
  checkIn: Date | string;
  checkOut: Date | string;
  guestCount: number;
  totalDays: number;
  purpose: string | null;
  specialRequest: string | null;
  totalPrice: number;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBooking {
  userId?: number | null;
  roomId: number | string;
  bookingCode: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalDays: number;
  purpose?: string | null;
  specialRequest?: string | null;
  totalPrice?: number;
  status?: BookingStatus;
}

export interface BookingAvailability {
  roomId: number | string;
  checkIn: string;
  checkOut: string;
  available: boolean;
  conflicts: Booking[];
}
