import { OperationPaymentMethod, OperationRepository } from "../repositories/PaymentRepository.js";

const paymentMethodMap: Record<string, OperationPaymentMethod> = {
  CASH: "Cash",
  CARD: "Credit Card",
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  TRANSFER: "Bank Transfer",
  BANK_TRANSFER: "Bank Transfer",
  ONLINE: "Online",
};

export class OperationService {
  constructor(private repo: OperationRepository) {}

  async checkIn(bookingId: number, adminId: number, paymentMethod: string, note?: string) {
    const booking = await this.repo.findBookingById(bookingId);
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

    if (!booking) {
      throw new Error("Target booking record not found.");
    }

    if (booking.status === "Checked-in") {
      throw new Error("Guest has already checked in.");
    }

    if (booking.status === "Checked-out" || booking.status === "Cancelled") {
      throw new Error("Cannot check in a completed or cancelled booking.");
    }

    if (booking.room_status === "Occupied") {
      throw new Error("Target room is currently occupied.");
    }

    return this.repo.executeCheckInTx(
      bookingId,
      Number(booking.room_id),
      adminId,
      normalizedPaymentMethod,
      Number(booking.total_price),
      note,
    );
  }

  async checkOut(bookingId: number, adminId: number, note?: string) {
    const booking = await this.repo.findBookingById(bookingId);

    if (!booking) {
      throw new Error("Target booking record not found.");
    }

    if (booking.status !== "Checked-in") {
      throw new Error("Cannot run checkout procedures for an inactive stay.");
    }

    return this.repo.executeCheckOutTx(bookingId, Number(booking.room_id), adminId, note);
  }
}

function normalizePaymentMethod(paymentMethod: string): OperationPaymentMethod {
  const normalized = paymentMethodMap[paymentMethod.trim().toUpperCase().replaceAll(" ", "_")];

  if (!normalized) {
    throw new Error("Unsupported payment method.");
  }

  return normalized;
}
