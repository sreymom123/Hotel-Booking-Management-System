import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepositories.js";
import { 
  User, 
  CreateUserDto, 
  LoginUserDto, 
  UpdateUserDto,
  UserRole,
  UserResponse
} from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "hotel-booking-secret";
const JWT_EXPIRES_IN = "7d";

export class UserService {
  static async register(payload: CreateUserDto): Promise<UserResponse> {
    // Check if email already exists
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const user = await userRepository.create(payload);
    // Return without password
    const { password, ...userResponse } = user;
    return userResponse;
  }

  static async login(payload: LoginUserDto): Promise<{ user: UserResponse; token: string }> {
    const user = await userRepository.findByEmail(payload.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(payload.password, user.password);
    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password, ...userResponse } = user;
    return { user: userResponse, token };
  }

  static async getUserById(id: number): Promise<UserResponse | null> {
    const user = await userRepository.findById(id);
    if (!user) return null;
    const { password, ...userResponse } = user;
    return userResponse;
  }

  static async updateUser(id: number, payload: UpdateUserDto): Promise<UserResponse | null> {
    await userRepository.update(id, payload);
    return this.getUserById(id);
  }

  static async deleteUser(id: number): Promise<boolean> {
    return await userRepository.delete(id);
  }

  // Middleware: verify JWT token and return payload
  static verifyToken(token: string): { userId: number; email: string; role: UserRole } | null {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        role: UserRole;
      };
      return payload;
    } catch (err) {
      return null;
    }
  }
}