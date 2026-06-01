import { NextFunction, Response } from "express";
import { AdminRequest } from "./authMiddleware.js";

export const requireAdminRole = (
  request: AdminRequest,
  response: Response,
  next: NextFunction,
): void => {
  if (request.admin?.role !== "admin") {
    response.status(403).json({
      success: false,
      message: "Admin access is required",
    });
    return;
  }

  next();
};
