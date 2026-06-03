export type RoomType = 'Suite' | 'Deluxe' | 'Standard' | 'Executive';
export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';

export interface Room {
  id: number;
  room_number: string;
  room_type: RoomType;
  name: string;
  floor_number: number;
  location: string | null;
  capacity: number;
  price: number;
  description: string | null;
  image_url: string | null;
  status: RoomStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRoomDto {
  room_number: string;
  room_type: RoomType;
  name: string;
  floor_number: number;
  location?: string | null;
  capacity: number;
  price: number;
  description?: string | null;
  image_url?: string | null;
  status?: RoomStatus;
}

export interface UpdateRoomDto {
  room_number?: string;
  room_type?: RoomType;
  name?: string;
  floor_number?: number;
  location?: string | null;
  capacity?: number;
  price?: number;
  description?: string | null;
  image_url?: string | null;
  status?: RoomStatus;
}

export interface RoomImage {
  id: number;
  room_id: number;
  image_url: string;
  created_at: Date;
}

export interface CreateRoomImageDto {
  room_id: number;
  image_url: string;
}