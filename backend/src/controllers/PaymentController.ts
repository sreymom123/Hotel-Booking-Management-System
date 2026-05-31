import { Request, Response } from 'express';
import { PaymentService } from '../services';
import { ApiResponse } from '../utils/response';
import db from '../config/db'; // Import your mysql2 pool to run a direct test

export class PaymentController {
  constructor(private service: PaymentService) {}

  /**
   * Optional health-check to explicitly verify connection 
   * state before processing transactions
   */
  
  public verifyDatabaseConnection = async (req: Request, res: Response): Promise<void> => {
    try {
      // Execute a lightweight ping query directly to the MySQL cluster
      const connection = await db.getConnection();
      await connection.ping();
      connection.release(); // Always release the worker thread back to the pool

      ApiResponse.success(res, "Database connection is operational and healthy.", { status: "UP" });
    } catch (error: any) {
      ApiResponse.error(res, `Database connectivity check failed: ${error.message || "Disconnected"}`, 500);
    }
  };

  public processCheckIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, adminId, paymentMethod, note } = req.body;

      if (!bookingId || !adminId || !paymentMethod) {
        ApiResponse.error(res, "Validation parameters failed: bookingId, adminId, and paymentMethod are required.", 400);
        return;
      }

      const parsedBookingId = Number(bookingId);
      const parsedAdminId = Number(adminId);

      if (isNaN(parsedBookingId) || isNaN(parsedAdminId)) {
        ApiResponse.error(res, "Validation failed: bookingId and adminId must be valid numerical parameters.", 400);
        return;
      }

      const log = await this.service.checkIn(parsedBookingId, parsedAdminId, paymentMethod, note);
      ApiResponse.success(res, "Check-in processed successfully; Room state is now OCCUPIED.", log, 201);
    } catch (error: any) {
      ApiResponse.error(res, error.message || "An unexpected error occurred during check-in.", 500);
    }
  };

  public processCheckOut = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, adminId, note } = req.body;

      if (!bookingId || !adminId) {
        ApiResponse.error(res, "Validation parameters failed: bookingId and adminId are required.", 400);
        return;
      }

      const parsedBookingId = Number(bookingId);
      const parsedAdminId = Number(adminId);

      if (isNaN(parsedBookingId) || isNaN(parsedAdminId)) {
        ApiResponse.error(res, "Validation failed: bookingId and adminId must be valid numerical parameters.", 400);
        return;
      }

      const log = await this.service.checkOut(parsedBookingId, parsedAdminId, note);
      ApiResponse.success(res, "Check-out processed successfully; Room state is now AVAILABLE.", log, 200);
    } catch (error: any) {
      ApiResponse.error(res, error.message || "An unexpected error occurred during check-out.", 500);
    }
  };

  public getPaymentDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;

      if (!bookingId || isNaN(Number(bookingId))) {
        ApiResponse.error(res, "Validation failed: URL path parameter bookingId must be a valid number.", 400);
        return;
      }

      const data = await this.service.getPaymentDetails(Number(bookingId));
      ApiResponse.success(res, "Payment profile found details cleanly parsed.", data, 200);
    } catch (error: any) {
      ApiResponse.error(res, error.message || "An unexpected error occurred while fetching payment details.", 500);
    }
  };
}