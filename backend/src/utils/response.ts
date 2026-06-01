<<<<<<< HEAD
import { Response } from "express";

export class ApiResponse {
  public static success(res: Response, message: string, data?: unknown, status = 200): void {
      res.status(status).json({
        success: true,
        message,
        data: data ?? null,
      });
    }

  public static error(res: Response, message: string, status = 400): void {
      res.status(status).json({
        success: false,
        message,
      });
    }
}
=======
import { NextFunction, Request, Response } from "express";

export const sendSuccess = (res: Response, message: string, data: unknown, status = 200) => {
  res.status(status).json({ success: true, message, data });
};

export const sendError = (res: Response, message: string, errors: unknown[] = [], status = 400) => {
  res.status(status).json({ success: false, message, errors });
};

export const notFoundHandler = (request: Request, response: Response): void => {
  response.status(404).json({
    success: false,
    message: `Route ${request.method} ${request.originalUrl} not found`,
  });
};

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  console.error(error);

  response.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
};
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4
