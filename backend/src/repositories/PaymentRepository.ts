import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';
import type { PaymentMethod } from '../services/PaymentService.js';

export type PaymentBookingRow = RowDataPacket & {
  id: number;
  room_id: number;
  total_price: number | string;
  status: string;
  room_status: string;
};

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

  async getAllPayments(): Promise<any[]> {
    const query = `
      SELECT p.*, b.booking_code, b.check_in, b.check_out
      FROM payments p
      INNER JOIN bookings b ON b.id = p.booking_id
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.query<any[]>(query);
    return rows;
  }

  async getPaymentById(paymentId: number): Promise<any | null> {
    const query = `
      SELECT p.*, b.booking_code, b.check_in, b.check_out
      FROM payments p
      INNER JOIN bookings b ON b.id = p.booking_id
      WHERE p.id = ?
      LIMIT 1
    `;
    const [rows] = await db.query<any[]>(query, [paymentId]);
    return rows[0] ?? null;
  }

  async updatePayment(paymentId: number, data: Partial<{ amount: number; paymentMethod: PaymentMethod; status: string; transactionNo: string }>) {
    const fields: string[] = [];
    const params: any[] = [];

    if (data.amount !== undefined) {
      fields.push('amount = ?');
      params.push(data.amount);
    }

    if (data.paymentMethod) {
      fields.push('payment_method = ?');
      params.push(data.paymentMethod);
    }

    if (data.status) {
      fields.push('status = ?');
      params.push(data.status);
    }

    if (data.transactionNo !== undefined) {
      fields.push('transaction_no = ?');
      params.push(data.transactionNo);
    }

    if (fields.length === 0) {
      return null;
    }

    params.push(paymentId);

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE payments SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      params,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.getPaymentById(paymentId);
  }

  async deletePayment(paymentId: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(`DELETE FROM payments WHERE id = ?`, [paymentId]);
    return result.affectedRows > 0;
  }

  async getPaymentDetails(bookingId: number): Promise<any[]> {
    const query = `
      SELECT p.*, b.booking_code, b.check_in, b.check_out
      FROM payments p
      INNER JOIN bookings b ON b.id = p.booking_id
      WHERE b.id = ?
    `;
    const [rows] = await db.query<any[]>(query, [bookingId]);
    return rows;
  }
}