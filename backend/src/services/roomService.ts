import { roomRepository } from "../repositories/roomRepositories.js";
import { Room, CreateRoomDto, UpdateRoomDto, RoomType, RoomStatus } from "../models/room.js";

export class RoomService {
  static async getAll(filters?: { room_type?: RoomType; status?: RoomStatus }): Promise<Room[]> {
    return await roomRepository.getAll(filters);
  }

  static async getById(id: number): Promise<Room | null> {
    return await roomRepository.getById(id);
  }

  static async create(payload: CreateRoomDto): Promise<Room> {
    return await roomRepository.create(payload);
  }

  static async update(id: number, payload: UpdateRoomDto): Promise<Room | null> {
    return await roomRepository.update(id, payload);
  }

  static async delete(id: number): Promise<boolean> {
    return await roomRepository.delete(id);
  }

  static async getByRoomNumber(roomNumber: string): Promise<Room | null> {
    // This would require adding a method to the repository
    // For now, we'll get all and filter, but ideally we'd add a specific method
    const rooms = await this.getAll();
    return rooms.find(room => room.room_number === roomNumber) || null;
  }
}