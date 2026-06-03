import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();
const authController = new AuthController();

router.post("/login", (request, response) => authController.login(request, response));
router.post("/register", (request, response) => authController.register(request, response));
router.get("/me", requireAuth, (request, response) => authController.me(request, response));

export default router;