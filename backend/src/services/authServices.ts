import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepositories.js";
import { User } from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "hotel-booking-secret";

export class AuthService {
  /**
   * Verify JWT token and return payload if valid
   */
  static verifyToken(token: string): { userId: number; email: string; role: string } | null {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        role: string;
      };
      return payload;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get user details by ID (excluding password)
   */
  static async getUserById(userId: number): Promise<{
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    profile_image: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  } | null> {
    const user = await userRepository.findById(userId);
    if (!user) return null;
    const { password, ...userInfo } = user;
    return userInfo;
  }

  /**
   * Authenticate user with email and password (used for login)
   */
  static async validateCredentials(email: string, password: string): Promise<{
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    profile_image: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    token: string;
  } | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    const passwordValid = await require("bcrypt").compare(password, user.password);
    if (!passwordValid) return null;

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userInfo } = user;
    return { ...userInfo, token };
  }
}