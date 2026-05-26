"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const db_1 = require("../config/db");
class PaymentService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async checkIn(bookingId, adminId, paymentMethod, note) {
        const booking = await db_1.prisma.bookings.findUnique({
            where: { id: BigInt(bookingId) },
            include: { rooms: true }
        });
        if (!booking)
            throw new Error('Target booking record not found.');
        if (booking.status === 'CHECKED_IN')
            throw new Error('Guest has already checked in.');
        if (booking.rooms.status === 'OCCUPIED')
            throw new Error('Target room is currently occupied.');
        // Step A: Process Payment Log
        const paymentCode = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        await this.repo.createPayment({
            bookingId,
            paymentCode,
            amount: Number(booking.total_price),
            paymentMethod
        });
        // Step B: Update room to OCCUPIED and save check-in details
        return await this.repo.executeCheckInTx(bookingId, booking.room_id, adminId, note);
    }
    async checkOut(bookingId, adminId, note) {
        const booking = await db_1.prisma.bookings.findUnique({
            where: { id: BigInt(bookingId) }
        });
        if (!booking)
            throw new Error('Target booking record not found.');
        if (booking.status !== 'CHECKED_IN')
            throw new Error('Cannot run checkout procedures for an inactive stay.');
        // Free up room back to AVAILABLE and complete log parameters
        return await this.repo.executeCheckOutTx(bookingId, booking.room_id, adminId, note);
    }
}
exports.PaymentService = PaymentService;
