import { Request, Response } from "express";
import { BaseController } from "./BaseController.js";
import { AuthService } from "../services/authServices.js";
import { UserService } from "../services/userService.js";

export class AuthController extends BaseController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return this.badrequest(res, "Email and password are required");
    }

    try {
      const result = await AuthService.validateCredentials(email, password);
      if (!result) {
        return this.badrequest(res, "Invalid email or password");
      }

      const { token, ...userInfo } = result;
      return this.ok(res, { user: userInfo, token }, "Login successful");
    } catch (error: unknown) {
      return this.handleError(res, error);
    }
  }

  async register(req: Request, res: Response) {
    const { name, email, password, role, phone, profile_image, is_active } = req.body;

    // Basic validation
    if (typeof name !== "string" || !name.trim()) {
      return this.badrequest(res, "Name is required");
    }
    if (typeof email !== "string" || !email.trim()) {
      return this.badrequest(res, "Email is required");
    }
    if (typeof password !== "string" || password.length < 6) {
      return this.badrequest(res, "Password must be at least 6 characters");
    }

    try {
      const user = await UserService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: role ?? "staff",
        phone: phone ?? null,
        profile_image: profile_image ?? null,
        is_active: is_active ?? true
      });

      return this.created(res, user, "User registered successfully");
    } catch (error: unknown) {
      return this.handleError(res, error);
    }
  }

  async me(req: Request, res: Response) {
    const user = (req as Request & { user?: unknown }).user;
    if (!user) {
      return this.unauthorized(res, "User not authenticated");
    }
    // Remove password if present
    const { password, ...userInfo } = user as any;
    return this.ok(res, userInfo, "User session is valid");
  }

  private handleError(res: Response, error: unknown) {
    if (!(error instanceof Error)) {
      return this.serverError(res, error);
    }

    if (error.message === "Email already registered") {
      return this.badrequest(res, error.message);
    }
    if (error.message === "Invalid email or password") {
      return this.badrequest(res, error.message);
    }

    return this.serverError(res, error);
  }
}
