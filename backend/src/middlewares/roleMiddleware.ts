import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware.js";

export const requireAdminRole = (
  request: AuthRequest,
  response: Response,
  next: NextFunction,
): void => {
  if (request.user?.role !== "admin") {
    response.status(403).json({
      success: false,
      message: "Admin access is required",
    });
    return;
  }

  next();
};
