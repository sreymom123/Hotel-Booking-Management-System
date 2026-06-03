import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db.js";
import { Booking, BookingStatus, CreateBooking } from "../models/booking.js";

type BookingRow = RowDataPacket & {
  id: number;
  user_id: number | null;
  room_id: number;
  room_number?: string;
  booking_code: string;
  check_in: Date | string;
  check_out: Date | string;
  guest_count: number;
  total_days: number;
  purpose: string | null;
  special_request: string | null;
  total_price: number | string;
  status: BookingStatus;
  created_at?: Date;
  updated_at?: Date;
};

type BookingRoomRow = RowDataPacket & {
  id: number;
  room_number: string;
  price: number | string;
};

export class BookingRepository {
  static async create(payload: CreateBooking): Promise<Booking> {
    const status = payload.status ?? "Pending";
    const room = await resolveRoom(payload.roomId);
    const totalPrice = payload.totalPrice ?? Number(room.price) * payload.totalDays;
    const conflicts = await findConflictingBookings(room.id, payload.checkIn, payload.checkOut);

    if (conflicts.length > 0) {
      throw new Error(`Room ${room.room_number} is not available for the selected dates`);
    }

    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO bookings
        (user_id, room_id, booking_code, check_in, check_out, guest_count, total_days, purpose, special_request, total_price, status)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.userId ?? null,
        room.id,
        payload.bookingCode,
        payload.checkIn,
        payload.checkOut,
        payload.guestCount,
        payload.totalDays,
        payload.purpose ?? null,
        payload.specialRequest ?? null,
        totalPrice,
        status,
      ],
    );

    return {
      id: result.insertId,
      userId: payload.userId ?? null,
      roomId: room.room_number,
      bookingCode: payload.bookingCode,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      guestCount: payload.guestCount,
      totalDays: payload.totalDays,
      purpose: payload.purpose ?? null,
      specialRequest: payload.specialRequest ?? null,
      totalPrice,
      status,
    };
  }

  static async getAll(): Promise<Booking[]> {
    const [rows] = await db.query<BookingRow[]>(
      `
      SELECT
        b.id,
        b.user_id,
        b.room_id,
        r.room_number,
        b.booking_code,
        b.check_in,
        b.check_out,
        b.guest_count,
        b.total_days,
        b.purpose,
        b.special_request,
        b.total_price,
        b.status,
        b.created_at,
        b.updated_at
      FROM bookings b
      INNER JOIN rooms r ON r.id = b.room_id
      ORDER BY b.created_at DESC
      `,
    );

    return rows.map(toBooking);
  }

  static async findById(id: number): Promise<Booking | null> {
    const [rows] = await db.query<BookingRow[]>(
      `
      SELECT
        b.id,
        b.user_id,
        b.room_id,
        r.room_number,
        b.booking_code,
        b.check_in,
        b.check_out,
        b.guest_count,
        b.total_days,
        b.purpose,
        b.special_request,
        b.total_price,
        b.status,
        b.created_at,
        b.updated_at
      FROM bookings b
      INNER JOIN rooms r ON r.id = b.room_id
      WHERE b.id = ?
      LIMIT 1
      `,
      [id],
    );

    return rows[0] ? toBooking(rows[0]) : null;
  }

  static async checkAvailability(roomId: number | string, checkIn: string, checkOut: string) {
    const room = await resolveRoom(roomId);
    const conflicts = await findConflictingBookings(room.id, checkIn, checkOut);

    return {
      roomId: room.room_number,
      checkIn,
      checkOut,
      available: conflicts.length === 0,
      conflicts,
    };
  }

  static async cancel(id: number): Promise<Booking | null> {
    const booking = await this.findById(id);

    if (!booking) {
      return null;
    }

    if (booking.status === "Cancelled") {
      return booking;
    }

    if (booking.status === "Checked-in" || booking.status === "Checked-out") {
      throw new Error(`Booking ${id} cannot be cancelled after check-in`);
    }

    await db.query<ResultSetHeader>(
      "UPDATE bookings SET status = 'Cancelled' WHERE id = ?",
      [id],
    );

    return this.findById(id);
  }

  static async updateStatus(id: number, status: BookingStatus): Promise<Booking | null> {
    const booking = await this.findById(id);

    if (!booking) {
      return null;
    }

    await db.query<ResultSetHeader>(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, id],
    );

    return this.findById(id);
  }

  static async bookingCodeExists(bookingCode: string): Promise<boolean> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id FROM bookings WHERE booking_code = ? LIMIT 1",
      [bookingCode],
    );

    return rows.length > 0;
  }
}

async function findConflictingBookings(roomId: number, checkIn: string, checkOut: string): Promise<Booking[]> {
  const [rows] = await db.query<BookingRow[]>(
    `
    SELECT
      b.id,
      b.user_id,
      b.room_id,
      r.room_number,
      b.booking_code,
      b.check_in,
      b.check_out,
      b.guest_count,
      b.total_days,
      b.purpose,
      b.special_request,
      b.total_price,
      b.status,
      b.created_at,
      b.updated_at
    FROM bookings b
    INNER JOIN rooms r ON r.id = b.room_id
    WHERE b.room_id = ?
      AND b.status NOT IN ('Cancelled', 'No Show', 'Checked-out')
      AND b.check_in < ?
      AND b.check_out > ?
    ORDER BY b.check_in ASC
    `,
    [roomId, checkOut, checkIn],
  );

  return rows.map(toBooking);
}

async function resolveRoom(roomId: number | string): Promise<BookingRoomRow> {
  const roomRef = String(roomId);
  const numericRoomId = Number(roomRef);
  const [rows] = await db.query<BookingRoomRow[]>(
    `
    SELECT id, room_number, price
    FROM rooms
    WHERE room_number = ? OR id = ?
    LIMIT 1
    `,
    [roomRef, Number.isInteger(numericRoomId) ? numericRoomId : 0],
  );

  if (!rows[0]) {
    throw new Error(`Room ${roomRef} was not found`);
  }

  return rows[0];
}

function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    roomId: row.room_number ?? row.room_id,
    bookingCode: row.booking_code,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guestCount: row.guest_count,
    totalDays: row.total_days,
    purpose: row.purpose,
    specialRequest: row.special_request,
    totalPrice: Number(row.total_price),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default BookingRepository;
