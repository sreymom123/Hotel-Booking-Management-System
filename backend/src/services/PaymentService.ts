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

    // Step A: Process Payment Log
    const paymentCode = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
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

    if (!booking) throw new Error('Target booking record not found.');
    if (booking.status !== 'CHECKED_IN') throw new Error('Cannot run checkout procedures for an inactive stay.');

    // Free up room back to AVAILABLE and complete log parameters
    return await this.repo.executeCheckOutTx(bookingId, booking.room_id, adminId, note);
  }

  async getPaymentDetails(bookingId: number) {
    return await this.repo.getPaymentDetails(bookingId);
  }
}
