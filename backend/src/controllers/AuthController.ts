import { Request, Response } from "express";
import { BaseController } from "./BaseController.js";
import { AuthService } from "../services/authServices.js";

export class AuthController extends BaseController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return this.badrequest(res, "Email and password are required");
    }

    try {
      const data = await AuthService.login(email, password);
      return this.ok(res, data, "Login successful");
    } catch (error: unknown) {
      return this.handleError(res, error);
    }
  }

  async me(req: Request, res: Response) {
    const admin = (req as Request & { admin?: unknown }).admin;
    return this.ok(res, admin, "Admin session is valid");
  }

  private handleError(res: Response, error: unknown) {
    if (!(error instanceof Error)) {
      return this.serverError(res, error);
    }

    if (error.message === "Invalid email or password") {
      return this.badrequest(res, error.message);
    }

    return this.serverError(res, error);
  }

}
