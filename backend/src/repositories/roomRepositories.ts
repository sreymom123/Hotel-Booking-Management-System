import { 
  Room, 
  CreateRoomDto, 
  UpdateRoomDto, 
  RoomType, 
  RoomStatus,
  RoomImage,
  CreateRoomImageDto
} from "../models/room.js";

// Mock data
let mockRooms: Room[] = [
  {
    id: 1,
    room_number: '101',
    room_type: 'Suite',
    name: 'Suite 101',
    floor_number: 1,
    location: 'Main Building',
    capacity: 4,
    price: 450.00,
    description: 'Private suite room for premium stays.',
    image_url: null,
    status: 'Available',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    room_number: '102',
    room_type: 'Suite',
    name: 'Suite 102',
    floor_number: 1,
    location: 'Main Building',
    capacity: 4,
    price: 450.00,
    description: 'Private suite room for premium stays.',
    image_url: null,
    status: 'Occupied',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    room_number: '204',
    room_type: 'Deluxe',
    name: 'Deluxe Room 204',
    floor_number: 2,
    location: 'Main Building',
    capacity: 2,
    price: 280.00,
    description: 'Deluxe room with private hotel amenities.',
    image_url: null,
    status: 'Cleaning',
    created_at: new Date(),
    updated_at: new Date()
  }
];

let mockRoomImages: RoomImage[] = [];

let nextRoomId = 4;
let nextRoomImageId = 1;

export class RoomRepository {
  async getAll(filters?: { room_type?: RoomType; status?: RoomStatus }): Promise<Room[]> {
    let result = [...mockRooms];
    if (filters) {
      if (filters.room_type) {
        result = result.filter(room => room.room_type === filters.room_type);
      }
      if (filters.status) {
        result = result.filter(room => room.status === filters.status);
      }
    }
    return result;
  }

  async getById(id: number): Promise<Room | null> {
    const room = mockRooms.find(room => room.id === id);
    return room ?? null;
  }

  async create(payload: CreateRoomDto): Promise<Room> {
    const room: Room = {
      id: nextRoomId++,
      room_number: payload.room_number,
      room_type: payload.room_type,
      name: payload.name,
      floor_number: payload.floor_number,
      location: payload.location ?? null,
      capacity: payload.capacity,
      price: payload.price,
      description: payload.description ?? null,
      image_url: payload.image_url ?? null,
      status: payload.status ?? 'Available',
      created_at: new Date(),
      updated_at: new Date()
    };
    mockRooms.push(room);
    return room;
  }

  async update(id: number, payload: UpdateRoomDto): Promise<Room | null> {
    const index = mockRooms.findIndex(room => room.id === id);
    if (index === -1) {
      return null;
    }
    const room = mockRooms[index];
    const updatedRoom: Room = {
      ...room,
      ...payload,
      // Ensure we don't update id or timestamps incorrectly
      room_number: payload.room_number ?? room.room_number,
      room_type: payload.room_type ?? room.room_type,
      name: payload.name ?? room.name,
      floor_number: payload.floor_number ?? room.floor_number,
      location: payload.location ?? room.location,
      capacity: payload.capacity ?? room.capacity,
      price: payload.price ?? room.price,
      description: payload.description ?? room.description,
      image_url: payload.image_url ?? room.image_url,
      status: payload.status ?? room.status,
      updated_at: new Date()
    };
    mockRooms[index] = updatedRoom;
    return updatedRoom;
  }

  async delete(id: number): Promise<boolean> {
    const index = mockRooms.findIndex(room => room.id === id);
    if (index === -1) {
      return false;
    }
    mockRooms.splice(index, 1);
    // Also delete associated images
    mockRoomImages = mockRoomImages.filter(image => image.room_id !== id);
    return true;
  }

  async getByRoomNumber(roomNumber: string): Promise<Room | null> {
    const room = mockRooms.find(room => room.room_number === roomNumber);
    return room ?? null;
  }
}

export class RoomImageRepository {
  async getByRoomId(roomId: number): Promise<RoomImage[]> {
    return mockRoomImages.filter(image => image.room_id === roomId);
  }

  async create(payload: CreateRoomImageDto): Promise<RoomImage> {
    const image: RoomImage = {
      id: nextRoomImageId++,
      room_id: payload.room_id,
      image_url: payload.image_url,
      created_at: new Date()
    };
    mockRoomImages.push(image);
    return image;
  }

  async delete(id: number): Promise<boolean> {
    const index = mockRoomImages.findIndex(image => image.id === id);
    if (index === -1) {
      return false;
    }
    mockRoomImages.splice(index, 1);
    return true;
  }
}

// Export for use in services
export const roomRepository = new RoomRepository();
export const roomImageRepository = new RoomImageRepository();