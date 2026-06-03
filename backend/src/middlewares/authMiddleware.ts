import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/authServices.js";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    profile_image: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  };
}

export const requireAuth = (
  request: AuthRequest,
  response: Response,
  next: NextFunction
): void => {
  const header = request.header("authorization");
  let token = null;
  if (header) {
    const bearerPrefix = "Bearer ";
    if (header.toLowerCase().startsWith(bearerPrefix.toLowerCase())) {
      token = header.slice(bearerPrefix.length);
    }
  }

  if (!token) {
    response.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
    return;
  }

  const payload = AuthService.verifyToken(token);
  if (!payload) {
    response.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  // Fetch user details from DB
  AuthService.getUserById(payload.userId).then((user) => {
    if (!user) {
      response.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    request.user = user;
    next();
  }).catch((err) => {
    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  });
};

export const requireAdmin = (
  request: AuthRequest,
  response: Response,
  next: NextFunction
): void => {
  // First authenticate
  const header = request.header("authorization");
  let token = null;
  if (header) {
    const bearerPrefix = "Bearer ";
    if (header.toLowerCase().startsWith(bearerPrefix.toLowerCase())) {
      token = header.slice(bearerPrefix.length);
    }
  }

  if (!token) {
    response.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
    return;
  }

  const payload = AuthService.verifyToken(token);
  if (!payload) {
    response.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  // Fetch user details
  AuthService.getUserById(payload.userId).then((user) => {
    if (!user) {
      response.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check role
    if (user.role !== "admin") {
      response.status(403).json({
        success: false,
        message: "Admin access is required",
      });
      return;
    }

    request.user = user;
    next();
  }).catch((err) => {
    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  });
};