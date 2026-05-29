import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "../config/db.js";

export type OperationPaymentMethod = "Cash" | "Credit Card" | "Debit Card" | "Bank Transfer" | "Online";

export type OperationBookingRow = RowDataPacket & {
  id: number;
  room_id: number;
  total_price: number | string;
  status: string;
  room_status?: string;
};

export type OperationLogRow = RowDataPacket & {
  id: number;
  booking_id: number;
  checked_in_by: number | null;
  checked_out_by: number | null;
  check_in_time: Date | string | null;
  check_out_time: Date | string | null;
  note: string | null;
  created_at: Date | string;
};

export class OperationRepository {
  async findBookingById(bookingId: number): Promise<OperationBookingRow | null> {
    const [rows] = await db.query<OperationBookingRow[]>(
      `
      SELECT b.id, b.room_id, b.total_price, b.status, r.status AS room_status
      FROM bookings b
      INNER JOIN rooms r ON r.id = b.room_id
      WHERE b.id = ?
      LIMIT 1
      `,
      [bookingId],
    );

    return rows[0] ?? null;
  }

  async createPayment(
    data: { bookingId: number; paymentCode: string; amount: number; paymentMethod: OperationPaymentMethod },
    connection?: PoolConnection,
  ) {
    const executor = connection ?? db;
    const [result] = await executor.query<ResultSetHeader>(
      `
      INSERT INTO payments
        (booking_id, payment_code, amount, payment_method, status, paid_at)
      VALUES
        (?, ?, ?, ?, 'Paid', NOW())
      `,
      [data.bookingId, data.paymentCode, data.amount, data.paymentMethod],
    );

    return {
      id: result.insertId,
      bookingId: data.bookingId,
      paymentCode: data.paymentCode,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: "Paid",
    };
  }

  async executeCheckInTx(
    bookingId: number,
    roomId: number,
    adminId: number,
    paymentMethod: OperationPaymentMethod,
    amount: number,
    note?: string,
  ): Promise<OperationLogRow> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const paymentCode = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await this.createPayment({ bookingId, paymentCode, amount, paymentMethod }, connection);

      const [logResult] = await connection.query<ResultSetHeader>(
        `
        INSERT INTO checkin_checkout_logs
          (booking_id, checked_in_by, check_in_time, note)
        VALUES
          (?, ?, NOW(), ?)
        `,
        [bookingId, adminId, note ?? "Guest checked in."],
      );

      await connection.query<ResultSetHeader>(
        "UPDATE rooms SET status = 'Occupied' WHERE id = ?",
        [roomId],
      );

      await connection.query<ResultSetHeader>(
        "UPDATE bookings SET status = 'Checked-in' WHERE id = ?",
        [bookingId],
      );

      await connection.commit();

      return this.findLogById(logResult.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async executeCheckOutTx(bookingId: number, roomId: number, adminId: number, note?: string): Promise<OperationLogRow> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const existingLog = await this.findActiveLog(bookingId, connection);
      let logId: number;

      if (existingLog) {
        await connection.query<ResultSetHeader>(
          `
          UPDATE checkin_checkout_logs
          SET checked_out_by = ?, check_out_time = NOW(), note = ?
          WHERE id = ?
          `,
          [adminId, note ?? "Guest checked out cleanly.", existingLog.id],
        );
        logId = existingLog.id;
      } else {
        const [logResult] = await connection.query<ResultSetHeader>(
          `
          INSERT INTO checkin_checkout_logs
            (booking_id, checked_out_by, check_out_time, note)
          VALUES
            (?, ?, NOW(), ?)
          `,
          [bookingId, adminId, note ?? "Guest checked out cleanly."],
        );
        logId = logResult.insertId;
      }

      await connection.query<ResultSetHeader>(
        "UPDATE rooms SET status = 'Available' WHERE id = ?",
        [roomId],
      );

      await connection.query<ResultSetHeader>(
        "UPDATE bookings SET status = 'Checked-out' WHERE id = ?",
        [bookingId],
      );

      await connection.commit();

      return this.findLogById(logId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private async findActiveLog(bookingId: number, connection: PoolConnection): Promise<OperationLogRow | null> {
    const [rows] = await connection.query<OperationLogRow[]>(
      `
      SELECT id, booking_id, checked_in_by, checked_out_by, check_in_time, check_out_time, note, created_at
      FROM checkin_checkout_logs
      WHERE booking_id = ? AND check_out_time IS NULL
      ORDER BY id DESC
      LIMIT 1
      `,
      [bookingId],
    );

    return rows[0] ?? null;
  }

  private async findLogById(id: number): Promise<OperationLogRow> {
    const [rows] = await db.query<OperationLogRow[]>(
      `
      SELECT id, booking_id, checked_in_by, checked_out_by, check_in_time, check_out_time, note, created_at
      FROM checkin_checkout_logs
      WHERE id = ?
      LIMIT 1
      `,
      [id],
    );

    if (!rows[0]) {
      throw new Error("Operation log was not found.");
    }

    return rows[0];
  }
}
