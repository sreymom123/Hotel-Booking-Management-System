import { Router } from "express";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { RoomRepository } from "../repositories/productRepositories.js";
import { RoomStatus, RoomType } from "../models/product.js";

const router = Router();
const roomTypes: RoomType[] = ["Suite", "Deluxe", "Standard", "Executive"];
const roomStatuses: RoomStatus[] = ["Available", "Occupied", "Cleaning", "Maintenance"];

router.get("/", async (_request, response, next) => {
  try {
    const rooms = await RoomRepository.getAll();
    response.json({ success: true, message: "Rooms loaded", data: rooms });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, async (request, response, next) => {
  try {
    const { id, type, price, status } = request.body as Record<string, unknown>;

    if (typeof id !== "string" || !id.trim()) {
      response.status(400).json({ success: false, message: "Room number is required" });
      return;
    }

    if (typeof type !== "string" || !roomTypes.includes(type as RoomType)) {
      response.status(400).json({ success: false, message: "Valid room type is required" });
      return;
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      response.status(400).json({ success: false, message: "Valid room price is required" });
      return;
    }

    if (status && (typeof status !== "string" || !roomStatuses.includes(status as RoomStatus))) {
      response.status(400).json({ success: false, message: "Valid room status is required" });
      return;
    }

    const room = await RoomRepository.create({
      id: id.trim(),
      type: type as RoomType,
      price: parsedPrice,
      status: status as RoomStatus | undefined,
    });

    response.status(201).json({ success: true, message: "Room created", data: room });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAdmin, async (request, response, next) => {
  try {
    const { status } = request.body as Record<string, unknown>;

    if (typeof status !== "string" || !roomStatuses.includes(status as RoomStatus)) {
      response.status(400).json({ success: false, message: "Valid room status is required" });
      return;
    }

    const room = await RoomRepository.updateStatus(request.params.id, status as RoomStatus);

    if (!room) {
      response.status(404).json({ success: false, message: "Room not found" });
      return;
    }

    response.json({ success: true, message: "Room status updated", data: room });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAdmin, async (request, response, next) => {
  try {
    const deleted = await RoomRepository.delete(request.params.id);

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
