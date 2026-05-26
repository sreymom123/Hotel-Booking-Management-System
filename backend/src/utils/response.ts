import { Response } from "express";

export class ApiResponse {
  static success(res: Response, message: string, data?: unknown, status = 200): void {
    res.status(status).json({
      success: true,
      message,
      data: data ?? null,
    });
  }

  static error(res: Response, message: string, status = 400): void {
    res.status(status).json({
      success: false,
      message,
    });
  }
}
