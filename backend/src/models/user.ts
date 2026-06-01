export type UserRole = 'admin' | 'staff';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // bcrypt hash
  role: UserRole;
  phone: string | null;
  profile_image: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string; // plain text
  role?: UserRole;
  phone?: string | null;
  profile_image?: string | null;
  is_active?: boolean;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string; // plain text, will be hashed
  role?: UserRole;
  phone?: string | null;
  profile_image?: string | null;
  is_active?: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  profile_image: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}