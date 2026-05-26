import { prisma } from '../config/db';

export class OperationRepository {
  // 1. Logs upfront guest payment attributes
  async createPayment(data: { bookingId: number; paymentCode: string; amount: number; paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' }, tx?: any) {
    const db = tx || prisma;
    return await db.payments.create({
      data: {
        booking_id: BigInt(data.bookingId),
        payment_code: data.paymentCode,
        amount: data.amount,
        payment_method: data.paymentMethod,
        status: 'PAID',
        paid_at: new Date()
      }
    });
  }

  // 2. Commits Check-In Log and forces Room status to OCCUPIED
  async executeCheckInTx(bookingId: number, roomId: bigint, adminId: number, note?: string) {
    return await prisma.$transaction(async (tx) => {
      const log = await tx.checkin_checkout_logs.create({
        data: {
          booking_id: BigInt(bookingId),
          checked_in_by: BigInt(adminId),
          check_in_time: new Date(),
          note: note || "Guest checked in."
        }
      });

      await tx.rooms.update({
        where: { id: roomId },
        data: { status: 'OCCUPIED' }
      });

      await tx.bookings.update({
        where: { id: BigInt(bookingId) },
        data: { status: 'CHECKED_IN' }
      });

      return log;
    });
  }

  // 3. Updates Check-Out details and releases Room back to AVAILABLE
  async executeCheckOutTx(bookingId: number, roomId: bigint, adminId: number, note?: string) {
    return await prisma.$transaction(async (tx) => {
      const log = await tx.checkin_checkout_logs.update({
        where: { booking_id: BigInt(bookingId) },
        data: {
          checked_out_by: BigInt(adminId),
          check_out_time: new Date(),
          note: note || "Guest checked out cleanly."
        }
      });

      await tx.rooms.update({
        where: { id: roomId },
        data: { status: 'AVAILABLE' }
      });

      await tx.bookings.update({
        where: { id: BigInt(bookingId) },
        data: { status: 'CHECKED_OUT' }
      });

      return log;
    });
  }
}