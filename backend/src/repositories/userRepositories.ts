import { 
  User, 
  CreateUserDto, 
  LoginUserDto, 
  UpdateUserDto,
  UserRole
} from "../models/user.js";
import bcrypt from "bcrypt";

// Mock data
let mockUsers: User[] = [];

// Initialize with an admin user
const initializeMockUsers = async () => {
  if (mockUsers.length === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    mockUsers.push({
      id: 1,
      name: "Hotel Administrator",
      email: "admin@grandhorizon.com",
      password: hashedPassword,
      role: "admin" as UserRole,
      phone: null,
      profile_image: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
};

// We'll initialize when the module is loaded
initializeMockUsers().catch(console.error);

let nextUserId = 2;

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = mockUsers.find(user => user.email === email);
    return user ?? null;
  }

  async findById(id: number): Promise<User | null> {
    const user = mockUsers.find(user => user.id === id);
    return user ?? null;
  }

  async create(payload: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existing = await this.findByEmail(payload.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user: User = {
      id: nextUserId++,
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role ?? 'staff',
      phone: payload.phone ?? null,
      profile_image: payload.profile_image ?? null,
      is_active: payload.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date()
    };
    mockUsers.push(user);
    return user;
  }

  async update(id: number, payload: UpdateUserDto): Promise<User | null> {
    const index = mockUsers.findIndex(user => user.id === id);
    if (index === -1) {
      return null;
    }
    const user = mockUsers[index];
    const updatedUser: User = {
      ...user,
      ...payload,
      // Hash password if provided
      password: payload.password !== undefined ? await bcrypt.hash(payload.password, 10) : user.password,
      // Ensure we don't update id or timestamps incorrectly
      name: payload.name ?? user.name,
      email: payload.email ?? user.email,
      role: payload.role ?? user.role,
      phone: payload.phone ?? user.phone,
      profile_image: payload.profile_image ?? user.profile_image,
      is_active: payload.is_active ?? user.is_active,
      updated_at: new Date()
    };
    mockUsers[index] = updatedUser;
    return updatedUser;
  }

  async delete(id: number): Promise<boolean> {
    // Soft delete: set is_active = false
    const index = mockUsers.findIndex(user => user.id === id);
    if (index === -1) {
      return false;
    }
    mockUsers[index] = {
      ...mockUsers[index],
      is_active: false,
      updated_at: new Date()
    };
    return true;
  }
}

function toUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    phone: row.phone,
    profile_image: row.profile_image,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// Export repository instance
export const userRepository = new UserRepository();