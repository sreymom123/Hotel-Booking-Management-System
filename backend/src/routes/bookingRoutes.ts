import { Router } from "express";
import bookingController from "../controllers/bookingController.js";

const router = Router();

router.get("/", bookingController.getAll);
router.post("/", bookingController.create);
router.post("/availability", bookingController.availability);
router.get("/:id", bookingController.getById);
router.patch("/:id/status", bookingController.updateStatus);
router.patch("/:id/cancel", bookingController.cancel);
router.delete("/:id", bookingController.cancel);

export default router;
