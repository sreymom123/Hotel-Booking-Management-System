import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Router } from "express";
import { db } from "../config/db.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();
const statuses = ["Pending", "Confirmed", "Checked-in", "Checked-out", "Cancelled", "No Show"] as const;

type BookingStatus = (typeof statuses)[number];

type BookingRow = RowDataPacket & {
  id: number;
  booking_code: string;
  guest_name: string | null;
  room_number: string;
  room_type: string;
  check_in: Date | string;
  check_out: Date | string;
  total_price: number | string;
  status: BookingStatus;
};

router.get("/", requireAdmin, async (_request, response, next) => {
  try {
    const [rows] = await db.query<BookingRow[]>(`
      SELECT
        b.id,
        b.booking_code,
        COALESCE(u.name, b.purpose, 'Guest Booking') AS guest_name,
        r.room_number,
        r.room_type,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status
      FROM bookings b
      INNER JOIN rooms r ON r.id = b.room_id
      LEFT JOIN users u ON u.id = b.user_id
      ORDER BY b.created_at DESC
    `);

    response.json({
      success: true,
      message: "Bookings loaded",
      data: rows.map(toAdminBooking),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const body = request.body as Record<string, unknown>;
    const roomNumber = String(body.roomId ?? body.roomNumber ?? "");
    const guestName = String(body.guestName ?? body.purpose ?? "Guest Booking").trim();
    const guestEmail = String(body.guestEmail ?? body.email ?? "").trim().toLowerCase();
    const guestPhone = String(body.guestPhone ?? body.phone ?? "").trim();
    const checkIn = String(body.checkInDate ?? body.checkIn ?? "");
    const checkOut = String(body.checkOutDate ?? body.checkOut ?? "");
    const guestCount = Number(body.guestCount ?? 1);
    const specialRequest = typeof body.specialRequest === "string" ? body.specialRequest : null;

    if (!roomNumber || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut || !Number.isInteger(guestCount) || guestCount < 1) {
      response.status(400).json({ success: false, message: "Room, guest information, dates, and guest count are required" });
      return;
    }

    if (!isValidEmail(guestEmail)) {
      response.status(400).json({ success: false, message: "A valid guest email is required" });
      return;
    }

    const [roomRows] = await db.query<(RowDataPacket & { id: number; price: number | string })[]>(
      "SELECT id, price FROM rooms WHERE room_number = ? AND status = 'Available' LIMIT 1",
      [roomNumber],
    );
    const room = roomRows[0];

    if (!room) {
      response.status(404).json({ success: false, message: "Room is not available" });
      return;
    }

    const totalDays = calculateDays(checkIn, checkOut);
    const totalPrice = Number(room.price) * totalDays;
    const bookingCode = `BK-${Date.now().toString().slice(-8)}`;
    const userId = await saveBookingCustomer(guestName, guestEmail, guestPhone);

    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO bookings
        (user_id, room_id, booking_code, check_in, check_out, guest_count, total_days, purpose, special_request, total_price, status)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
      `,
      [userId, room.id, bookingCode, checkIn, checkOut, guestCount, totalDays, guestName, specialRequest, totalPrice],
    );

    await db.query("UPDATE rooms SET status = 'Occupied' WHERE id = ?", [room.id]);

    response.status(201).json({
      success: true,
      message: "Booking created",
      data: {
        id: bookingCode,
        databaseId: result.insertId,
        status: "Pending",
        totalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAdmin, async (request, response, next) => {
  try {
    const { status } = request.body as Record<string, unknown>;

    if (typeof status !== "string" || !statuses.includes(status as BookingStatus)) {
      response.status(400).json({ success: false, message: "Valid booking status is required" });
      return;
    }

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE bookings SET status = ? WHERE booking_code = ? OR id = ?",
      [status, request.params.id, Number(request.params.id) || 0],
    );

    if (result.affectedRows === 0) {
      response.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    response.json({ success: true, message: "Booking status updated" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAdmin, async (request, response, next) => {
  try {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM bookings WHERE booking_code = ? OR id = ?",
      [request.params.id, Number(request.params.id) || 0],
    );

    if (result.affectedRows === 0) {
      response.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    response.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    next(error);
  }
});

function toAdminBooking(row: BookingRow) {
  const guestName = row.guest_name ?? "Guest Booking";

  return {
    id: row.booking_code,
    guestName,
    guestInitials: getInitials(guestName),
    roomType: `${row.room_type} (Room ${row.room_number})`,
    roomNumberOrSuite: row.room_number,
    checkInDate: formatShortDate(row.check_in),
    checkOutDate: formatShortDate(row.check_out),
    amount: Number(row.total_price),
    status: row.status,
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "GB";
}

function formatShortDate(value: Date | string): string {
  return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit" }).format(new Date(value));
}

function calculateDays(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  const days = Math.ceil((end - start) / 86_400_000);
  return Number.isFinite(days) && days > 0 ? days : 1;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function saveBookingCustomer(name: string, email: string, phone: string): Promise<number> {
  const [result] = await db.query<ResultSetHeader>(
    `
    INSERT INTO users (name, email, password, role, phone, is_active)
    VALUES (?, ?, '', 'customer', ?, TRUE)
    ON DUPLICATE KEY UPDATE
      name = IF(role = 'customer', VALUES(name), name),
      phone = IF(role = 'customer', VALUES(phone), phone),
      is_active = TRUE,
      id = LAST_INSERT_ID(id)
    `,
    [name, email, phone],
  );

  return result.insertId;
}

export default router;
