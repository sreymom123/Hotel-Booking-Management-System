import { Request, Response } from 'express';
import { OperationService } from '../services';
import { ApiResponse } from '../utils/response';

export class OperationController {
  constructor(private service: OperationService) {}

  public processCheckIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, adminId, paymentMethod, note } = req.body;
      if (!bookingId || !adminId || !paymentMethod) {
        ApiResponse.error(res, "Validation parameters failed: bookingId, adminId, and paymentMethod are required.");
        return;
      }
      const log = await this.service.checkIn(Number(bookingId), Number(adminId), paymentMethod, note);
      ApiResponse.success(res, "Check-in processed successfully; Room state is now OCCUPIED.", log, 201);
    } catch (error: any) {
      ApiResponse.error(res, error.message || "An unexpected error occurred during check-in.");
    }
  };

  public processCheckOut = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, adminId, note } = req.body;
      if (!bookingId || !adminId) {
        ApiResponse.error(res, "Validation parameters failed: bookingId and adminId are required.");
        return;
      }
      const log = await this.service.checkOut(Number(bookingId), Number(adminId), note);
      ApiResponse.success(res, "Check-out processed successfully; Room state is now AVAILABLE.", log);
    } catch (error: any) {
      ApiResponse.error(res, error.message || "An unexpected error occurred during check-out.");
    }
  };
}