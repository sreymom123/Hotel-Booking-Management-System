import { Router } from "express";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { roomRepository } from "../repositories/roomRepositories.js";
import { roomImageRepository } from "../repositories/roomRepositories.js";
import { RoomStatus, RoomType } from "../models/room.js";

const router = Router();
const roomTypes: RoomType[] = ["Suite", "Deluxe", "Standard", "Executive"];
const roomStatuses: RoomStatus[] = ["Available", "Occupied", "Cleaning", "Maintenance"];

router.get("/", async (_request, response, next) => {
  try {
    const { room_type, status } = _request.query as {
      room_type?: RoomType;
      status?: RoomStatus;
    };

    const filters: { room_type?: RoomType; status?: RoomStatus } = {};
    if (room_type) filters.room_type = room_type;
    if (status) filters.status = status;

    const rooms = await roomRepository.getAll(filters);
    response.json({ success: true, message: "Rooms loaded", data: rooms });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (_request, response, next) => {
  try {
    const roomId = Number(_request.params.id);
    if (isNaN(roomId)) {
      response.status(400).json({ success: false, message: "Invalid room ID" });
      return;
    }

    const room = await roomRepository.getById(roomId);
     if (!room) {
       response.status(404).json({ success: false, message: "Room not found" });
       return;
     }

    response.json({ success: true, message: "Room loaded", data: room });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/images", async (_request, response, next) => {
  try {
    const roomId = Number(_request.params.id);
    if (isNaN(roomId)) {
      response.status(400).json({ success: false, message: "Invalid room ID" });
      return;
    }

    // Check if room exists
    const roomExists = await roomRepository.getById(roomId);
    if (!roomExists) {
      response.status(404).json({ success: false, message: "Room not found" });
      return;
    }

    const images = await roomImageRepository.getByRoomId(roomId);
    response.json({ success: true, message: "Room images loaded", data: images });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, async (_request, response, next) => {
  try {
    const {
      room_number,
      room_type,
      name,
      floor_number,
      location,
      capacity,
      price,
      description,
      image_url,
      status,
    } = _request.body as Record<string, unknown>;

    // Validation
    if (typeof room_number !== "string" || !room_number.trim()) {
      response.status(400).json({ success: false, message: "Room number is required" });
      return;
    }

    if (typeof room_type !== "string" || !roomTypes.includes(room_type as RoomType)) {
      response.status(400).json({ success: false, message: "Valid room type is required" });
      return;
    }

    if (typeof name !== "string" || !name.trim()) {
      response.status(400).json({ success: false, message: "Room name is required" });
      return;
    }

    if (typeof floor_number !== "number" || !Number.isInteger(floor_number) || floor_number < 1) {
      response.status(400).json({ success: false, message: "Valid floor number is required" });
      return;
    }

    if (location !== undefined && typeof location !== "string") {
      response.status(400).json({ success: false, message: "Location must be a string" });
      return;
    }

    if (typeof capacity !== "number" || !Number.isInteger(capacity) || capacity < 1) {
      response.status(400).json({ success: false, message: "Valid capacity is required" });
      return;
    }

    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      response.status(400).json({ success: false, message: "Valid room price is required" });
      return;
    }

    if (description !== undefined && typeof description !== "string") {
      response.status(400).json({ success: false, message: "Description must be a string" });
      return;
    }

      if (image_url !== undefined && image_url !== null && typeof image_url !== "string") {
        response.status(400).json({ success: false, message: "Image URL must be a string" });
        return;
      }

    if (status && (typeof status !== "string" || !roomStatuses.includes(status as RoomStatus))) {
      response.status(400).json({ success: false, message: "Valid room status is required" });
      return;
    }

    const room = await roomRepository.create({
      room_number: room_number.trim(),
      room_type: room_type as RoomType,
      name: name.trim(),
      floor_number: floor_number as number,
      location: location ?? null,
      capacity: capacity as number,
      price: price as number,
      description: description ?? null,
      image_url: image_url ?? null,
      status: status as RoomStatus | undefined,
    });

    response.status(201).json({ success: true, message: "Room created", data: room });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAdmin, async (_request, response, next) => {
  try {
    const roomId = Number(_request.params.id);
    if (isNaN(roomId)) {
      response.status(400).json({ success: false, message: "Invalid room ID" });
      return;
    }

    const {
      room_number,
      room_type,
      name,
      floor_number,
      location,
      capacity,
      price,
      description,
      image_url,
      status,
    } = _request.body as Record<string, unknown>;

    // Validation
    if (room_number !== undefined && (typeof room_number !== "string" || !room_number.trim())) {
      response.status(400).json({ success: false, message: "Room number must be a non-empty string" });
      return;
    }

    if (room_type !== undefined && (typeof room_type !== "string" || !roomTypes.includes(room_type as RoomType))) {
      response.status(400).json({ success: false, message: "Valid room type is required" });
      return;
    }

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      response.status(400).json({ success: false, message: "Room name must be a non-empty string" });
      return;
    }

     if (floor_number !== undefined && (typeof floor_number !== "number" || !Number.isInteger(floor_number) || floor_number < 1)) {
       response.status(400).json({ success: false, message: "Valid floor number is required" });
       return;
     }

    if (location !== undefined && typeof location !== "string") {
      response.status(400).json({ success: false, message: "Location must be a string" });
      return;
    }

     if (capacity !== undefined && (typeof capacity !== "number" || !Number.isInteger(capacity) || capacity < 1)) {
       response.status(400).json({ success: false, message: "Valid capacity is required" });
       return;
     }

     if (price !== undefined && (typeof price !== "number" || !Number.isFinite(price) || price < 0)) {
       response.status(400).json({ success: false, message: "Valid room price is required" });
       return;
     }

     if (description !== undefined && typeof description !== "string") {
       response.status(400).json({ success: false, message: "Description must be a string" });
       return;
     }

     if (image_url !== undefined && image_url !== null && typeof image_url !== "string") {
       response.status(400).json({ success: false, message: "Image URL must be a string" });
       return;
     }

     if (status && (typeof status !== "string" || !roomStatuses.includes(status as RoomStatus))) {
       response.status(400).json({ success: false, message: "Valid room status is required" });
       return;
     }

    const room = await roomRepository.update(roomId, {
      room_number: room_number !== undefined ? room_number.trim() : undefined,
      room_type: room_type !== undefined ? room_type as RoomType : undefined,
      name: name !== undefined ? name.trim() : undefined,
      floor_number: floor_number !== undefined ? floor_number as number : undefined,
      location: location !== undefined ? location : undefined,
      capacity: capacity !== undefined ? capacity as number : undefined,
      price: price !== undefined ? price as number : undefined,
      description: description !== undefined ? description : undefined,
      image_url: image_url !== undefined ? image_url : undefined,
      status: status !== undefined ? status as RoomStatus : undefined,
    });

     if (!room) {
       response.status(404).json({ success: false, message: "Room not found" });
       return;
     }

     response.json({ success: true, message: "Room updated", data: room });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/images", requireAdmin, async (_request, response, next) => {
  try {
    const roomId = Number(_request.params.id);
    if (isNaN(roomId)) {
      response.status(400).json({ success: false, message: "Invalid room ID" });
      return;
    }

     // Check if room exists
     const roomExists = await roomRepository.getById(roomId);
     if (!roomExists) {
       response.status(404).json({ success: false, message: "Room not found" });
       return;
     }

    const { image_url } = _request.body as Record<string, unknown>;

     if (!image_url || typeof image_url !== "string") {
       response.status(400).json({ success: false, message: "Image URL is required" });
       return;
     }

    const image = await roomImageRepository.create({
      room_id: roomId,
      image_url: image_url as string,
    });

    response.status(201).json({ success: true, message: "Room image added", data: image });
  } catch (error) {
    next(error);
  }
});

router.delete("/images/:id", requireAdmin, async (_request, response, next) => {
  try {
     const imageId = Number(_request.params.id);
     if (isNaN(imageId)) {
       response.status(400).json({ success: false, message: "Invalid image ID" });
       return;
     }

    const deleted = await roomImageRepository.delete(imageId);

     if (!deleted) {
       response.status(404).json({ success: false, message: "Room image not found" });
       return;
     }

     response.json({ success: true, message: "Room image deleted" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAdmin, async (_request, response, next) => {
  try {
     const roomId = Number(_request.params.id);
     if (isNaN(roomId)) {
       response.status(400).json({ success: false, message: "Invalid room ID" });
       return;
     }

    const { status } = _request.body as Record<string, unknown>;

     if (typeof status !== "string" || !roomStatuses.includes(status as RoomStatus)) {
       response.status(400).json({ success: false, message: "Valid room status is required" });
       return;
     }

    const room = await roomRepository.update(roomId, { status: status as RoomStatus });

     if (!room) {
       response.status(404).json({ success: false, message: "Room not found" });
       return;
     }

     response.json({ success: true, message: "Room status updated", data: room });
  } catch (error) {
    next(error);
  }
 });
 
 router.delete("/:id", requireAdmin, async (_request, response, next) => {
   try {
     const roomId = Number(_request.params.id);
     if (isNaN(roomId)) {
       response.status(400).json({ success: false, message: "Invalid room ID" });
       return;
     }

    const deleted = await roomRepository.delete(roomId);

     if (!deleted) {
       response.status(404).json({ success: false, message: "Room not found" });
       return;
     }

     response.json({ success: true, message: "Room deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
