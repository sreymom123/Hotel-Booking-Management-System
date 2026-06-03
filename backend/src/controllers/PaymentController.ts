import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService.js';
import type { PaymentMethod } from '../services/PaymentService.js';
import { sendError, sendSuccess } from '../utils/response.js';

export class PaymentController {
  constructor(private service: PaymentService) {}

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
}
