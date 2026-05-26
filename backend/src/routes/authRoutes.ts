import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();
const authController = new AuthController();

router.post("/login", (request, response) => authController.login(request, response));
router.get("/me", requireAdmin, (request, response) => authController.me(request, response));

export default router;
