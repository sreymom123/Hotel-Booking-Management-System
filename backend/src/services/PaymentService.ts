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

    const paymentCode = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

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

    if (!booking) throw new Error('Target booking record not found.');
    if (!Number.isFinite(adminId) || adminId <= 0) throw new Error('A valid adminId is required.');
    if (booking.status !== 'Checked-in') throw new Error('Cannot run checkout procedures for an inactive stay.');

    return await this.repo.executeCheckOutTx(booking.id, booking.room_id, adminId, note);
  }

  async getAllPayments(): Promise<any[]> {
    return await this.repo.getAllPayments();
  }

  async getPaymentById(paymentId: number): Promise<any> {
    const payment = await this.repo.getPaymentById(paymentId);
    if (!payment) {
      throw new Error('Payment record not found.');
    }
    return payment;
  }

  async updatePayment(paymentId: number, data: Partial<{ amount: number; paymentMethod: PaymentMethod; status: string; transactionNo: string }>): Promise<any | null> {
    const updated = await this.repo.updatePayment(paymentId, data);
    if (!updated) {
      throw new Error('Payment update failed or the payment record does not exist.');
    }
    return updated;
  }

  async deletePayment(paymentId: number): Promise<{ paymentId: number; deleted: true }> {
    const deleted = await this.repo.deletePayment(paymentId);
    if (!deleted) {
      throw new Error('Payment record not found or could not be deleted.');
    }
    return { paymentId, deleted: true };
  }

  async getPaymentDetails(bookingId: number): Promise<any[]> {
    return await this.repo.getPaymentDetails(bookingId);
  }
}

function normalizePaymentMethod(paymentMethod: PaymentMethod | string): PaymentMethod {
  const raw = String(paymentMethod).trim();
  const normalized = paymentMethodAliases[raw.toUpperCase().replaceAll(' ', '_')] ?? raw;
  const allowed: PaymentMethod[] = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online'];

  if (!allowed.includes(normalized as PaymentMethod)) {
    throw new Error('Valid paymentMethod is required.');
  }

  return normalized as PaymentMethod;
}
