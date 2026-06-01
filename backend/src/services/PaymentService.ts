<<<<<<< HEAD
import { PaymentRepository } from '../repositories';

type BookingWithRoom = {
  id: number;
  room_id: number;
  total_price: number;
  status: string;
  room_status: string;
};

export class PaymentService {
  constructor(private repo: PaymentRepository) {}

  async checkIn(bookingId: number, adminId: number, paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Online', note?: string) {
    const booking = await this.repo.findBookingWithRoomById(bookingId) as BookingWithRoom | null;

    if (!booking) throw new Error('Target booking record not found.');
    if (booking.status === 'CHECKED_IN') throw new Error('Guest has already checked in.');
    if (booking.room_status === 'OCCUPIED') throw new Error('Target room is currently occupied.');
=======
import { PaymentRepository } from '../repositories/PaymentRepository.js';

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Online';

const paymentMethodAliases: Record<string, PaymentMethod> = {
  CASH: 'Cash',
  CARD: 'Credit Card',
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  TRANSFER: 'Bank Transfer',
  BANK_TRANSFER: 'Bank Transfer',
  ONLINE: 'Online',
  PROPERTY: 'Cash',
};

export class PaymentService {
  constructor(private repo: PaymentRepository) {}

  async checkIn(bookingId: string, adminId: number, paymentMethod: PaymentMethod | string, note?: string) {
    const booking = await this.repo.findBooking(bookingId);
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

    if (!booking) throw new Error('Target booking record not found.');
    if (!Number.isFinite(adminId) || adminId <= 0) throw new Error('A valid adminId is required.');
    if (booking.status === 'Checked-in') throw new Error('Guest has already checked in.');
    if (booking.status === 'Checked-out') throw new Error('Guest has already checked out.');
    if (booking.status === 'Cancelled' || booking.status === 'No Show') throw new Error('Cannot check in an inactive booking.');
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4

    const paymentCode = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
<<<<<<< HEAD
    const payment = {
      bookingId,
      paymentCode,
      amount: Number(booking.total_price),
      paymentMethod
    };

    // Step B: Update room to OCCUPIED and save check-in details
    return await this.repo.executeCheckInTx(bookingId, booking.room_id, adminId, payment, note);
  }

async checkOut(bookingId: number, adminId: number, note?: string) {
    const booking = await this.repo.findBookingById(bookingId) as Pick<BookingWithRoom, 'room_id' | 'status'> | null;
=======

    return await this.repo.executeCheckInTx({
      bookingId: booking.id,
      roomId: booking.room_id,
      adminId,
      paymentCode,
      amount: Number(booking.total_price),
      paymentMethod: normalizedPaymentMethod,
      note,
    });
  }

  async checkOut(bookingId: string, adminId: number, note?: string) {
    const booking = await this.repo.findBooking(bookingId);
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4

    if (!booking) throw new Error('Target booking record not found.');
    if (!Number.isFinite(adminId) || adminId <= 0) throw new Error('A valid adminId is required.');
    if (booking.status !== 'Checked-in') throw new Error('Cannot run checkout procedures for an inactive stay.');

    return await this.repo.executeCheckOutTx(booking.id, booking.room_id, adminId, note);
  }
<<<<<<< HEAD

  async getPaymentDetails(bookingId: number) {
    return await this.repo.getPaymentDetails(bookingId);
  }
=======
}

function normalizePaymentMethod(paymentMethod: PaymentMethod | string): PaymentMethod {
  const raw = String(paymentMethod).trim();
  const normalized = paymentMethodAliases[raw.toUpperCase().replaceAll(' ', '_')] ?? raw;
  const allowed: PaymentMethod[] = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online'];

  if (!allowed.includes(normalized as PaymentMethod)) {
    throw new Error('Valid paymentMethod is required.');
  }

  return normalized as PaymentMethod;
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4
}
