import { Router } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bookingController from "../controllers/bookingController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { db } from "../config/db.js";
import { bookingStatuses as statuses } from "../models/booking.js";

const router = Router();

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
    const guestInfo = isRecord(body.guestInfo) ? body.guestInfo : undefined;
    const dates = isRecord(body.dates) ? body.dates : undefined;
    const roomObject = isRecord(body.room) ? body.room : undefined;

    const roomNumber = normalizeRoomIdentifier(body, roomObject);
    const guestName = normalizeText(
      body.guestName ?? body.guest_name ?? body.purpose ?? body.name ?? guestInfo?.["firstName"] ?? guestInfo?.["first_name"] ?? "Guest Booking",
    );
    const guestEmail = normalizeText(
      body.guestEmail ?? body.guest_email ?? body.email ?? guestInfo?.["email"] ?? guestInfo?.["email_address"],
    );
    const guestPhone = normalizeText(
      body.guestPhone ?? body.guest_phone ?? body.phone ?? guestInfo?.["phone"] ?? guestInfo?.["phone_number"],
    );
    const checkIn = normalizeText(
      body.checkInDate ?? body.checkIn ?? body.check_in ?? body.startDate ?? body.start_date ?? dates?.["checkIn"] ?? dates?.["check_in"] ?? dates?.["startDate"] ?? dates?.["start_date"],
    );
    const checkOut = normalizeText(
      body.checkOutDate ?? body.checkOut ?? body.check_out ?? body.endDate ?? body.end_date ?? dates?.["checkOut"] ?? dates?.["check_out"] ?? dates?.["endDate"] ?? dates?.["end_date"],
    );
    const guestCount = extractPositiveInteger(
      body.guestCount ?? body.guest_count ?? body.guests ?? guestInfo?.["count"] ?? 1,
    );
    let bookingUserId = extractPositiveInteger(
      body.userId ?? body.user_id ?? (isRecord(body.user) ? body.user.id : undefined) ?? 0,
    );
    const specialRequest = normalizeOptionalString(body.specialRequest ?? body.special_requests ?? body.specialRequests);

    if (!roomNumber) {
      response.status(400).json({ success: false, message: "roomId or roomNumber is required" });
      return;
    }

    if (!guestName) {
      response.status(400).json({ success: false, message: "guestName is required" });
      return;
    }

    if (!bookingUserId && (!guestEmail || !guestPhone)) {
      response.status(400).json({ success: false, message: "guestEmail and guestPhone are required when userId is not provided" });
      return;
    }

    if (!checkIn || !checkOut) {
      response.status(400).json({ success: false, message: "checkInDate and checkOutDate are required" });
      return;
    }

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      response.status(400).json({ success: false, message: "guestCount must be a positive integer" });
      return;
    }

    if (!bookingUserId && guestEmail && !isValidEmail(guestEmail)) {
      response.status(400).json({ success: false, message: "A valid guest email is required" });
      return;
    }

    if (bookingUserId) {
      const [userRows] = await db.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE id = ? LIMIT 1",
        [bookingUserId],
      );

      if (userRows.length === 0) {
        bookingUserId = 0; // fallback to guest booking when user_id is invalid
      }
    }

    const [roomRows] = await db.query<(RowDataPacket & { id: number; price: number | string })[]>(
      "SELECT id, price FROM rooms WHERE room_number = ? OR id = ? LIMIT 1",
      [roomNumber, Number.isInteger(Number(roomNumber)) ? Number(roomNumber) : 0],
    );
    const room = roomRows[0];

    if (!room) {
      response.status(404).json({ success: false, message: "Room not found" });
      return;
    }

    // Check for date conflicts with existing bookings
    const [conflictRows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM bookings 
       WHERE room_id = ? 
       AND status NOT IN ('Cancelled', 'No Show', 'Checked-out') 
       AND check_in < ? 
       AND check_out > ?
       LIMIT 1`,
      [room.id, checkOut, checkIn],
    );

    if (conflictRows.length > 0) {
      response.status(409).json({ success: false, message: "Room is not available for the selected dates" });
      return;
    }

    const totalDays = calculateDays(checkIn, checkOut);
    const totalPrice = Number(room.price) * totalDays;
    const bookingCode = `BK-${Date.now().toString().slice(-8)}`;
    const userId = bookingUserId || await saveBookingCustomer(guestName, guestEmail, guestPhone);

    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO bookings
        (user_id, room_id, booking_code, check_in, check_out, guest_count, total_days, purpose, special_request, total_price, status)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
      `,
      [userId, room.id, bookingCode, checkIn, checkOut, guestCount, totalDays, guestName, specialRequest, totalPrice],
    );

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

router.put("/:id", requireAdmin, async (request, response, next) => {
  try {
    const body = request.body as Record<string, unknown>;
    const bookingId = Number(request.params.id) || 0;

    if (!bookingId) {
      response.status(400).json({ success: false, message: "Booking ID is required" });
      return;
    }

    // Get the booking first to verify it exists
    const [bookingRows] = await db.query<RowDataPacket[]>(
      "SELECT id, room_id FROM bookings WHERE id = ? OR booking_code = ? LIMIT 1",
      [bookingId, request.params.id],
    );

    if (bookingRows.length === 0) {
      response.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    const existingBooking = bookingRows[0] as any;
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];

    // Extract updatable fields
    const guestName = normalizeText(body.guestName ?? body.purpose ?? body.guest_name);
    const specialRequest = normalizeOptionalString(body.specialRequest ?? body.special_requests);
    const checkIn = normalizeText(body.checkInDate ?? body.check_in ?? body.checkIn);
    const checkOut = normalizeText(body.checkOutDate ?? body.check_out ?? body.checkOut);
    const guestCount = extractPositiveInteger(body.guestCount ?? body.guest_count);

    if (guestName) {
      updateFields.push("purpose = ?");
      updateValues.push(guestName);
    }

    if (specialRequest) {
      updateFields.push("special_request = ?");
      updateValues.push(specialRequest);
    }

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
        response.status(400).json({ success: false, message: "Invalid check-in or check-out date" });
        return;
      }

      if (checkOutDate <= checkInDate) {
        response.status(400).json({ success: false, message: "Check-out must be after check-in" });
        return;
      }

      // Check for date conflicts with other bookings
      const [conflictRows] = await db.query<RowDataPacket[]>(
        `SELECT id FROM bookings 
         WHERE room_id = ? 
         AND id != ?
         AND status NOT IN ('Cancelled', 'No Show', 'Checked-out') 
         AND check_in < ? 
         AND check_out > ?
         LIMIT 1`,
        [existingBooking.room_id, bookingId, checkOut, checkIn],
      );

      if (conflictRows.length > 0) {
        response.status(409).json({ success: false, message: "Room is not available for the selected dates" });
        return;
      }

      updateFields.push("check_in = ?, check_out = ?");
      updateValues.push(checkIn, checkOut);

      const totalDays = calculateDays(checkIn, checkOut);
      updateFields.push("total_days = ?");
      updateValues.push(totalDays);
    }

    if (!Number.isNaN(guestCount)) {
      updateFields.push("guest_count = ?");
      updateValues.push(guestCount);
    }

    if (updateFields.length === 0) {
      response.status(400).json({ success: false, message: "No valid fields to update" });
      return;
    }

    updateValues.push(bookingId);

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE bookings SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues,
    );

    if (result.affectedRows === 0) {
      response.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    response.json({ success: true, message: "Booking updated successfully" });
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

    // Get the booking to find which room it's associated with
    const [bookingRows] = await db.query<RowDataPacket[]>(
      "SELECT room_id FROM bookings WHERE booking_code = ? OR id = ? LIMIT 1",
      [request.params.id, Number(request.params.id) || 0],
    );

    if (bookingRows.length === 0) {
      response.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    const roomId = (bookingRows[0] as any).room_id;

    // Update booking status
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE bookings SET status = ? WHERE booking_code = ? OR id = ?",
      [status, request.params.id, Number(request.params.id) || 0],
    );

    // If booking is cancelled, release the room back to Available status
    if (status === "Cancelled") {
      await db.query<ResultSetHeader>(
        "UPDATE rooms SET status = 'Available' WHERE id = ?",
        [roomId],
      );
    }

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
    // Get the booking to find which room it's associated with
    const [bookingRows] = await db.query<RowDataPacket[]>(
      "SELECT room_id FROM bookings WHERE booking_code = ? OR id = ? LIMIT 1",
      [request.params.id, Number(request.params.id) || 0],
    );

    if (bookingRows.length === 0) {
      response.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    const roomId = (bookingRows[0] as any).room_id;

    // Delete the booking
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM bookings WHERE booking_code = ? OR id = ?",
      [request.params.id, Number(request.params.id) || 0],
    );

    // Release the room back to Available status
    if (result.affectedRows > 0) {
      await db.query<ResultSetHeader>(
        "UPDATE rooms SET status = 'Available' WHERE id = ?",
        [roomId],
      );
    }

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

function normalizeText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }

  return "";
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeRoomIdentifier(body: Record<string, unknown>, roomObject?: Record<string, unknown>): string {
  const directRoomRef = body.roomId ?? body.roomNumber ?? body.room_id ?? body.room_number ?? body.id;
  const nestedRoomRef = roomObject
    ? roomObject.roomId ?? roomObject.roomNumber ?? roomObject.room_id ?? roomObject.room_number ?? roomObject.id
    : undefined;

  return normalizeText(directRoomRef ?? nestedRoomRef);
}

function extractPositiveInteger(value: unknown): number {
  const count = Number(value);
  return Number.isInteger(count) && count > 0 ? count : NaN;
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
