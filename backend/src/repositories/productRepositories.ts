import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db.js";
import { CreateRoom, Room, RoomStatus, RoomType } from "../models/product.js";

type RoomRow = RowDataPacket & {
  room_number: string;
  room_type: RoomType;
  price: number | string;
  status: RoomStatus;
  created_at?: Date;
  updated_at?: Date;
};

export class RoomRepository {
  static async getAll(): Promise<Room[]> {
    const [rows] = await db.query<RoomRow[]>(
      "SELECT room_number, room_type, price, status, created_at, updated_at FROM rooms ORDER BY room_number",
    );

    return rows.map(toRoom);
  }

  static async getById(id: string): Promise<Room | null> {
    const [rows] = await db.query<RoomRow[]>(
      "SELECT room_number, room_type, price, status, created_at, updated_at FROM rooms WHERE room_number = ? LIMIT 1",
      [id],
    );

    return rows[0] ? toRoom(rows[0]) : null;
  }

  static async create(payload: CreateRoom): Promise<Room> {
    const status = payload.status ?? "Available";

    await db.query<ResultSetHeader>(
      "INSERT INTO rooms (room_number, room_type, name, floor_number, capacity, price, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [payload.id, payload.type, `${payload.type} Room ${payload.id}`, getFloorNumber(payload.id), 2, payload.price, status],
    );

    return {
      id: payload.id,
      type: payload.type,
      price: payload.price,
      status,
    };
  }

  static async updateStatus(id: string, status: RoomStatus): Promise<Room | null> {
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE rooms SET status = ? WHERE room_number = ?",
      [status, id],
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>("DELETE FROM rooms WHERE room_number = ?", [id]);
    return result.affectedRows > 0;
  }
}

function toRoom(row: RoomRow): Room {
  return {
    id: row.room_number,
    type: row.room_type,
    price: Number(row.price),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getFloorNumber(roomNumber: string): number {
  const floor = Number(roomNumber.slice(0, -2));
  return Number.isInteger(floor) && floor > 0 ? floor : 1;
}

export const ProductRepositories = RoomRepository;
