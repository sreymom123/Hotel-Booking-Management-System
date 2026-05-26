export class PaymentModel {
  id!: bigint;
  bookingId!: bigint;
  paymentCode!: string;
  amount!: number;
  paymentMethod!: 'CASH' | 'CARD' | 'TRANSFER';
  status!: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  transactionNo?: string | null;
  paidAt?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(init?: Partial<PaymentModel>) {
    Object.assign(this, init);
  }
}

export class CheckinLogModel {
  id!: bigint;
  bookingId!: bigint;
  checkedInBy!: bigint;
  checkedOutBy?: bigint | null;
  checkInTime!: Date;
  checkOutTime?: Date | null;
  note?: string | null;
  createdAt!: Date;

  constructor(init?: Partial<CheckinLogModel>) {
    Object.assign(this, init);
  }
}