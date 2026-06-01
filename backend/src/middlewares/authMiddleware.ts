import { NextFunction, Request, Response } from "express";
import { AuthService, AdminSession } from "../services/authServices.js";

export type AdminRequest = Request & {
  admin?: AdminSession["admin"];
};

export const requireAdmin = (
  request: AdminRequest,
  response: Response,
  next: NextFunction,
): void => {
  const header = request.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    response.status(401).json({
      success: false,
      message: "Admin token is required",
    });
    return;
  }

  const admin = AuthService.verifyToken(token);

  if (!admin) {
    response.status(401).json({
      success: false,
      message: "Admin session is invalid",
    });
    return;
  }

  request.admin = admin;
  next();
};
