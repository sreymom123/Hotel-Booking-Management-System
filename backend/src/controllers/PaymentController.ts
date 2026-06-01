import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService.js';
import type { PaymentMethod } from '../services/PaymentService.js';
import { sendError, sendSuccess } from '../utils/response.js';

export class PaymentController {
  constructor(private service: PaymentService) { }

  public processCheckIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, adminId, paymentMethod, note } = req.body;

      if (!bookingId || !adminId || !paymentMethod) {
        sendError(res, "Validation parameters failed: bookingId, adminId, and paymentMethod are required.");
        return;
      }

      const log = await this.service.checkIn(String(bookingId), Number(adminId), String(paymentMethod) as PaymentMethod, note);
      sendSuccess(res, "Check-in processed successfully; room state is now Occupied.", log, 201);
    } catch (error: any) {
      sendError(res, error.message || "An unexpected error occurred during check-in.");
    }
  };

  public processCheckOut = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, adminId, note } = req.body;

      if (!bookingId || !adminId) {
        sendError(res, "Validation parameters failed: bookingId and adminId are required.");
        return;
      }

      const log = await this.service.checkOut(String(bookingId), Number(adminId), note);
      sendSuccess(res, "Check-out processed successfully; room state is now Available.", log);
    } catch (error: any) {
      sendError(res, error.message || "An unexpected error occurred during check-out.");
    }
  };

  public getAllPayments = async (_req: Request, res: Response): Promise<void> => {
    try {
      const payments = await this.service.getAllPayments();
      sendSuccess(res, "Payment list retrieved successfully.", payments, 200);
    } catch (error: any) {
      sendError(res, error.message || "Unable to retrieve payment list.", 500);
    }
  };

  public getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const paymentId = Number(req.params.paymentId);
      if (!paymentId || isNaN(paymentId)) {
        sendError(res, "Validation failed: paymentId must be a valid number.", 400);
        return;
      }

      const payment = await this.service.getPaymentById(paymentId);
      sendSuccess(res, "Payment record retrieved successfully.", payment, 200);
    } catch (error: any) {
      sendError(res, error.message || "Unable to retrieve payment record.", 500);
    }
  };

  public updatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const paymentId = Number(req.params.paymentId);
      if (!paymentId || isNaN(paymentId)) {
        sendError(res, "Validation failed: paymentId must be a valid number.", 400);
        return;
      }

      const { amount, paymentMethod, status, transactionNo } = req.body;
      const update = await this.service.updatePayment(paymentId, {
        amount: amount !== undefined ? Number(amount) : undefined,
        paymentMethod: paymentMethod ? String(paymentMethod) as PaymentMethod : undefined,
        status: status ? String(status) : undefined,
        transactionNo: transactionNo ? String(transactionNo) : undefined,
      });

      sendSuccess(res, "Payment record updated successfully.", update, 200);
    } catch (error: any) {
      sendError(res, error.message || "Unable to update payment record.", 500);
    }
  };

  public deletePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const paymentId = Number(req.params.paymentId);
      if (!paymentId || isNaN(paymentId)) {
        sendError(res, "Validation failed: paymentId must be a valid number.", 400);
        return;
      }

      const result = await this.service.deletePayment(paymentId);
      sendSuccess(res, "Payment record deleted successfully.", result, 200);
    } catch (error: any) {
      sendError(res, error.message || "Unable to delete payment record.", 500);
    }
  };

  public getPaymentDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;

      if (!bookingId || isNaN(Number(bookingId))) {
        sendError(res, "Validation failed: URL path parameter bookingId must be a valid number.", 400);
        return;
      }

      const data = await this.service.getPaymentDetails(Number(bookingId));
      sendSuccess(res, "Payment profile found details cleanly parsed.", data, 200);
    } catch (error: any) {
      sendError(res, error.message || "An unexpected error occurred while fetching payment details.", 500);
    }
  };
}