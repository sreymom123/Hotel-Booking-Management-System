import { BookingStatus, CreateBooking, bookingStatuses } from "../models/booking.js";
import { BookingRepository } from "../repositories/bookingRepositories.js";
import { generateBookingCode } from "../utils/bookingRoom.js";

type IncomingBookingPayload = Partial<Omit<CreateBooking, "bookingCode" | "status">> & {
  bookingCode?: string;
  check_in?: string;
  check_out?: string;
  checkInDate?: string;
  checkOutDate?: string;
  check_in_date?: string;
  check_out_date?: string;
  startDate?: string;
  endDate?: string;
  start_date?: string;
  end_date?: string;
  dates?: {
    checkIn?: string;
    checkOut?: string;
    check_in?: string;
    check_out?: string;
    checkInDate?: string;
    checkOutDate?: string;
    check_in_date?: string;
    check_out_date?: string;
    startDate?: string;
    endDate?: string;
    start_date?: string;
    end_date?: string;
  };
  amount?: number | string;
  guestName?: string;
  room?: {
    id?: number | string;
    roomId?: number | string;
    room_id?: number | string;
    roomNumber?: number | string;
    room_number?: number | string;
  };
  room_id?: number | string;
  roomNumber?: number | string;
  room_number?: number | string;
  specialRequests?: string | null;
  status?: string;
};

class BookingService {
  async createBooking(payload: IncomingBookingPayload) {
    const booking = normalizeBookingPayload(payload);
    booking.bookingCode = payload.bookingCode ?? await generateUniqueBookingCode();
    return BookingRepository.create(booking);
  }

  async getBookings() {
    return BookingRepository.getAll();
  }

  async getBookingById(id: number) {
    validateId(id);
    return BookingRepository.findById(id);
  }

  async checkAvailability(payload: IncomingBookingPayload) {
    const roomId = getRoomId(payload);
    const { checkIn, checkOut } = getValidatedDates(payload);

    if (roomId === undefined || roomId === null || roomId === "") {
      throw new Error("roomId is required");
    }

    return BookingRepository.checkAvailability(roomId, checkIn, checkOut);
  }

  async cancelBooking(id: number) {
    validateId(id);
    return BookingRepository.cancel(id);
  }

  async updateBookingStatus(id: number, status: string) {
    validateId(id);

    const normalizedStatus = normalizeStatus(status);

    if (!normalizedStatus) {
      throw new Error("status is invalid");
    }

    return BookingRepository.updateStatus(id, normalizedStatus);
  }
}

function normalizeBookingPayload(payload: IncomingBookingPayload): CreateBooking {
  const roomId = getRoomId(payload);
  const { checkIn, checkOut } = getValidatedDates(payload);

  if (roomId === undefined || roomId === null || roomId === "") {
    throw new Error("roomId is required");
  }

  const totalDays = Number(payload.totalDays ?? calculateDays(checkIn, checkOut));
  const guestCount = Number(payload.guestCount ?? 1);
  const totalPrice = payload.totalPrice ?? payload.amount;

  if (!Number.isFinite(totalDays) || totalDays <= 0) {
    throw new Error("totalDays must be greater than 0");
  }

  if (!Number.isFinite(guestCount) || guestCount <= 0) {
    throw new Error("guestCount must be greater than 0");
  }

  return {
    userId: payload.userId ?? null,
    roomId,
    bookingCode: payload.bookingCode ?? generateBookingCode(),
    checkIn,
    checkOut,
    guestCount,
    totalDays,
    purpose: payload.purpose ?? payload.guestName ?? null,
    specialRequest: payload.specialRequest ?? payload.specialRequests ?? null,
    totalPrice: totalPrice === undefined ? undefined : Number(totalPrice),
    status: normalizeStatus(payload.status),
  };
}

function getValidatedDates(payload: IncomingBookingPayload): { checkIn: string; checkOut: string } {
  const checkIn = getCheckIn(payload);
  const checkOut = getCheckOut(payload);

  if (!checkIn || !checkOut) {
    throw new Error("checkIn and checkOut are required");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    throw new Error("checkIn and checkOut must be valid dates");
  }

  if (checkOutDate <= checkInDate) {
    throw new Error("checkOut must be after checkIn");
  }

  return { checkIn, checkOut };
}

function validateId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("booking id is invalid");
  }
}

async function generateUniqueBookingCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const bookingCode = generateBookingCode();

    if (!(await BookingRepository.bookingCodeExists(bookingCode))) {
      return bookingCode;
    }
  }

  throw new Error("Unable to generate booking code");
}

function getCheckIn(payload: IncomingBookingPayload): string | undefined {
  return (
    payload.checkIn ??
    payload.check_in ??
    payload.checkInDate ??
    payload.check_in_date ??
    payload.startDate ??
    payload.start_date ??
    payload.dates?.checkIn ??
    payload.dates?.check_in ??
    payload.dates?.checkInDate ??
    payload.dates?.check_in_date ??
    payload.dates?.startDate ??
    payload.dates?.start_date
  );
}

function getCheckOut(payload: IncomingBookingPayload): string | undefined {
  return (
    payload.checkOut ??
    payload.check_out ??
    payload.checkOutDate ??
    payload.check_out_date ??
    payload.endDate ??
    payload.end_date ??
    payload.dates?.checkOut ??
    payload.dates?.check_out ??
    payload.dates?.checkOutDate ??
    payload.dates?.check_out_date ??
    payload.dates?.endDate ??
    payload.dates?.end_date
  );
}

function getRoomId(payload: IncomingBookingPayload): number | string | undefined | null {
  return (
    payload.roomId ??
    payload.room_id ??
    payload.roomNumber ??
    payload.room_number ??
    payload.room?.id ??
    payload.room?.roomId ??
    payload.room?.room_id ??
    payload.room?.roomNumber ??
    payload.room?.room_number
  );
}

function calculateDays(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end.getTime() - start.getTime();

  if (!Number.isFinite(diffMs)) {
    return NaN;
  }

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function normalizeStatus(status?: string): BookingStatus | undefined {
  if (!status) {
    return undefined;
  }

  const lowerStatus = status.toLowerCase();
  return bookingStatuses.find((bookingStatus) => bookingStatus.toLowerCase() === lowerStatus);
}

export default new BookingService();
