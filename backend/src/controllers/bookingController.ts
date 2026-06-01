import { Request, Response } from "express";
import bookingService from "../services/bookingService.js";

class BookingController {

  async create(req: Request, res: Response) {
    try {
      const booking = await bookingService.createBooking(req.body);

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });

    } catch (error: any) {
      const message = error.message ?? "Unable to create booking";
      const statusCode = isBadBookingRequest(message) ? 400 : 500;

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const bookings = await bookingService.getBookings();

      return res.json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      return handleBookingError(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const booking = await bookingService.getBookingById(Number(req.params.id));

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      return res.json({
        success: true,
        data: booking,
      });
    } catch (error: any) {
      return handleBookingError(res, error);
    }
  }

  async availability(req: Request, res: Response) {
    try {
      const availability = await bookingService.checkAvailability(req.body);

      return res.json({
        success: true,
        data: availability,
      });
    } catch (error: any) {
      return handleBookingError(res, error);
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const booking = await bookingService.cancelBooking(Number(req.params.id));

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      return res.json({
        success: true,
        message: "Booking cancelled successfully",
        data: booking,
      });
    } catch (error: any) {
      return handleBookingError(res, error);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const booking = await bookingService.updateBookingStatus(Number(req.params.id), req.body.status);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      return res.json({
        success: true,
        message: "Booking status updated successfully",
        data: booking,
      });
    } catch (error: any) {
      return handleBookingError(res, error);
    }
  }
}

function handleBookingError(res: Response, error: any) {
  const message = error.message ?? "Unable to process booking request";
  const statusCode = isBadBookingRequest(message) ? 400 : 500;

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

function isBadBookingRequest(message: string): boolean {
  return (
    message.endsWith("is required") ||
    message.endsWith("is invalid") ||
    message.includes("must be valid dates") ||
    message.includes("must be after") ||
    message.includes("must be greater than 0") ||
    message.includes("not available") ||
    message.includes("cannot be cancelled") ||
    message.includes("was not found")
  );
}

export default new BookingController();
