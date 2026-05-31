export class PaymentModel {
  id!: number;               // Changed from bigint to number for safe JSON serialization
  bookingId!: number;        // Changed from bigint to number
  paymentCode!: string;
  amount!: number;
  paymentMethod!: 'CASH' | 'CARD' | 'TRANSFER';
  status!: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  transactionNo?: string | null;
  paidAt?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(init?: Partial<PaymentModel>) {
    if (init) {
      Object.assign(this, init);
      
      // Force conversion from database BigInt strings/types to safe standard Numbers
      if (init.id) this.id = Number(init.id);
      if (init.bookingId) this.bookingId = Number(init.bookingId);
    }
  }
}

export class CheckinLogModel {
  id!: number;               // Changed from bigint to number
  bookingId!: number;        // Changed from bigint to number
  checkedInBy!: number;      // Changed from bigint to number
  checkedOutBy?: number | null; // Changed from bigint to number
  checkInTime!: Date;
  checkOutTime?: Date | null;
  note?: string | null;
  createdAt!: Date;

  constructor(init?: Partial<CheckinLogModel>) {
    if (init) {
      Object.assign(this, init);
      
      // Force conversion from database BigInt strings/types to safe standard Numbers
      if (init.id) this.id = Number(init.id);
      if (init.bookingId) this.bookingId = Number(init.bookingId);
      if (init.checkedInBy) this.checkedInBy = Number(init.checkedInBy);
      if (init.checkedOutBy) this.checkedOutBy = Number(init.checkedOutBy);
    }
  }
}