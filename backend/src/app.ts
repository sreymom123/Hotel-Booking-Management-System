import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import healthRoutes from "./routes/health.routes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { errorHandler, notFoundHandler } from "./utils/response.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? true }));
app.use(express.json());

app.get("/api", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Hotel Booking Management API routes are available",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
