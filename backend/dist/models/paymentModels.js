"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckinLogModel = exports.PaymentModel = void 0;
class PaymentModel {
    id;
    bookingId;
    paymentCode;
    amount;
    paymentMethod;
    status;
    transactionNo;
    paidAt;
    createdAt;
    updatedAt;
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.PaymentModel = PaymentModel;
class CheckinLogModel {
    id;
    bookingId;
    checkedInBy;
    checkedOutBy;
    checkInTime;
    checkOutTime;
    note;
    createdAt;
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.CheckinLogModel = CheckinLogModel;
