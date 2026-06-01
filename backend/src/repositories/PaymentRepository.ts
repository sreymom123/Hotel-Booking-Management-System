<<<<<<< HEAD
import db from "../config/db";
import { PoolConnection } from "mysql2/promise";

type BookingWithRoom = {
  id: number;
  room_id: number;
  total_price: number;
=======
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';
import type { PaymentMethod } from '../services/PaymentService.js';

export type PaymentBookingRow = RowDataPacket & {
  id: number;
  room_id: number;
  total_price: number | string;
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4
  status: string;
  room_status: string;
};

<<<<<<< HEAD
interface CheckinLog {
  id: number;
  booking_id: number;
  checked_in_by: number;
  checked_out_by: number | null;
  check_in_time: Date | null;
  check_out_time: Date | null;
  note: string | null;
  created_at: Date;
}

type PaymentMethod = "Cash" | "Credit Card" | "Debit Card" | "Bank Transfer" | "Online";
type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export class PaymentRepository {
  
  async findBookingWithRoomById(bookingId: number): Promise<BookingWithRoom | null> {
    const query = `
      SELECT
        b.id,
        b.room_id,
        b.total_price,
        b.status,
        r.status AS room_status
      FROM bookings b
      INNER JOIN rooms r ON r.id = b.room_id
      WHERE b.id = ?
      LIMIT 1
    `;
    const [rows] = await db.execute(query, [bookingId]);
    const results = rows as BookingWithRoom[];
    return results.length > 0 ? results[0] : null;
  }

  async findBookingById(
    bookingId: number
  ): Promise<{ id: number; room_id: number; status: string } | null> {
    const query = `
      SELECT id, room_id, status
      FROM bookings
      WHERE id = ?
      LIMIT 1
    `;
    const [rows] = await db.execute(query, [bookingId]);
    const results = rows as { id: number; room_id: number; status: string }[];
    return results.length > 0 ? results[0] : null;
  }

  // Accepts an active transactional connection instance
  async createPayment(
    connection: PoolConnection,
    data: {
      bookingId: number;
      paymentCode: string;
      amount: number;
      paymentMethod: PaymentMethod;
    }
  ): Promise<void> {
    // Map payment method to database values
    const paymentStatus: PaymentStatus = "Paid";
    const paidAt = new Date();

    const query = `
      INSERT INTO payments (
        booking_id,
        payment_code,
        amount,
        payment_method,
        status,
        paid_at,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    await connection.execute(query, [
      data.bookingId,
      data.paymentCode,
      data.amount,
      data.paymentMethod as string,
      paymentStatus,
      paidAt,
    ]);
  }

  async executeCheckInTx(
    bookingId: number,
    roomId: number,
    adminId: number,
    payment: {
      bookingId: number;
      paymentCode: string;
      amount: number;
      paymentMethod: PaymentMethod;
    },
    note?: string
  ): Promise<CheckinLog | null> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Create the payment (Handles dynamic status matching based on paymentMethod)
      await this.createPayment(connection, payment);

      // 2. Insert check-in log record
      const logQuery = `
        INSERT INTO checkin_checkout_logs (
          booking_id,
          checked_in_by,
          check_in_time,
          note,
          created_at
        )
        VALUES (?, ?, NOW(), ?, NOW())
      `;
      await connection.execute(logQuery, [
        bookingId,
        adminId,
        note || "Guest checked in.",
      ]);

      // 3. Set room status to OCCUPIED
      const updateRoomQuery = `
        UPDATE rooms
        SET status = 'OCCUPIED'
        WHERE id = ?
      `;
      await connection.execute(updateRoomQuery, [roomId]);

      // 4. Set booking status to CHECKED_IN
      const updateBookingQuery = `
        UPDATE bookings
        SET status = 'CHECKED_IN'
        WHERE id = ?
      `;
      await connection.execute(updateBookingQuery, [bookingId]);

      // 5. Fetch and return the newly generated log item
      const fetchLogQuery = `
        SELECT *
        FROM checkin_checkout_logs
        WHERE booking_id = ?
        ORDER BY id DESC
        LIMIT 1
      `;
      const [rows] = await connection.execute(fetchLogQuery, [bookingId]);
      
      await connection.commit();
      
      const logs = rows as CheckinLog[];
      return logs.length > 0 ? logs[0] : null;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async executeCheckOutTx(
    bookingId: number,
    roomId: number,
    adminId: number,
    note?: string
  ): Promise<CheckinLog | null> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Update checkout logs target mapping down cleanly to the booking reference
      const logQuery = `
        UPDATE checkin_checkout_logs
        SET
          checked_out_by = ?,
          check_out_time = NOW(),
          note = ?
        WHERE booking_id = ?
        ORDER BY id DESC
        LIMIT 1
      `;
      await connection.execute(logQuery, [
        adminId,
        note || "Guest checked out cleanly.",
        bookingId,
      ]);

      // 2. Free up the room space
      const updateRoomQuery = `
        UPDATE rooms
        SET status = 'AVAILABLE'
        WHERE id = ?
      `;
      await connection.execute(updateRoomQuery, [roomId]);

      // 3. Complete the active booking log
      const updateBookingQuery = `
        UPDATE bookings
        SET status = 'CHECKED_OUT'
        WHERE id = ?
      `;
      await connection.execute(updateBookingQuery, [bookingId]);

      // 4. Fetch the checkout execution status block
      const fetchLogQuery = `
        SELECT *
        FROM checkin_checkout_logs
        WHERE booking_id = ?
        ORDER BY id DESC
        LIMIT 1
      `;
      const [rows] = await connection.execute(fetchLogQuery, [bookingId]);

      await connection.commit();

      const logs = rows as CheckinLog[];
      return logs.length > 0 ? logs[0] : null;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getPaymentDetails(bookingId: number): Promise<any[]> {
    const query = `
      SELECT p.*, b.booking_code, b.check_in, b.check_out
      FROM payments p
      INNER JOIN bookings b ON b.id = p.booking_id
      WHERE b.id = ?
    `;
    const [rows] = await db.execute(query, [bookingId]);
    return rows as any[];
  }
}
=======
export class PaymentRepository {
  async findBooking(bookingId: string): Promise<PaymentBookingRow | null> {
    const numericId = Number(bookingId);
    const [rows] = await db.query<PaymentBookingRow[]>(
      `
      SELECT b.id, b.room_id, b.total_price, b.status, r.status AS room_status
      FROM bookings b
      INNER JOIN rooms r ON r.id = b.room_id
      WHERE b.booking_code = ? OR b.id = ?
      LIMIT 1
      `,
      [bookingId, Number.isFinite(numericId) ? numericId : 0],
    );

    return rows[0] ?? null;
  }

  async executeCheckInTx(data: {
    bookingId: number;
    roomId: number;
    adminId: number;
    paymentCode: string;
    amount: number;
    paymentMethod: PaymentMethod;
    note?: string;
  }) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [paymentResult] = await connection.query<ResultSetHeader>(
        `
        INSERT INTO payments (booking_id, payment_code, amount, payment_method, status, paid_at)
        VALUES (?, ?, ?, ?, 'Paid', NOW())
        `,
        [data.bookingId, data.paymentCode, data.amount, data.paymentMethod],
      );

      const [logResult] = await connection.query<ResultSetHeader>(
        `
        INSERT INTO checkin_checkout_logs (booking_id, checked_in_by, check_in_time, note)
        VALUES (?, ?, NOW(), ?)
        `,
        [data.bookingId, data.adminId, data.note || 'Guest checked in.'],
      );

      await connection.query("UPDATE rooms SET status = 'Occupied' WHERE id = ?", [data.roomId]);
      await connection.query("UPDATE bookings SET status = 'Checked-in' WHERE id = ?", [data.bookingId]);

      await connection.commit();

      return {
        id: logResult.insertId,
        bookingId: data.bookingId,
        paymentId: paymentResult.insertId,
        paymentCode: data.paymentCode,
        status: 'Checked-in',
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async executeCheckOutTx(bookingId: number, roomId: number, adminId: number, note?: string) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [logResult] = await connection.query<ResultSetHeader>(
        `
        UPDATE checkin_checkout_logs
        SET checked_out_by = ?, check_out_time = NOW(), note = ?
        WHERE booking_id = ? AND check_out_time IS NULL
        ORDER BY check_in_time DESC
        LIMIT 1
        `,
        [adminId, note || 'Guest checked out cleanly.', bookingId],
      );

      if (logResult.affectedRows === 0) {
        throw new Error('No active check-in log found for this booking.');
      }

      await connection.query("UPDATE rooms SET status = 'Available' WHERE id = ?", [roomId]);
      await connection.query("UPDATE bookings SET status = 'Checked-out' WHERE id = ?", [bookingId]);

      await connection.commit();

      return {
        bookingId,
        status: 'Checked-out',
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4
