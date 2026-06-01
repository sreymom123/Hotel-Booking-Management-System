import cors from "cors";
import express from "express";
<<<<<<< HEAD
import { config } from "./config/index";
import { errorHandler, notFoundHandler } from "./middlewares";
import router from "./routes";

const app = express();

// 1. Core Global Middlewares Configuration
app.use(
  cors({
    origin: config.corsOrigin === "*" ? true : config.corsOrigin,
    credentials: true,
  }),
);
=======
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import healthRoutes from "./routes/health.routes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { errorHandler, notFoundHandler } from "./utils/response.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? true }));
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4
app.use(express.json());

<<<<<<< HEAD
// 2. Base API Landing Endpoint (Diagnostic Verification)
app.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Welcome to the Hotel Booking Management API.",
    endpoints: {
      checkIn: "POST /api/checkin",
      checkOut: "POST /api/checkout",
      getDetails: "GET /api/payment/:bookingId",
      update: "PUT /api/payment/:paymentId",
      delete: "DELETE /api/payment/:paymentId"
    }
  });
});

// 3. Central Application Routing Hierarchy
app.use("/api", router);

// 4. Post-Route Fallback Exception Interceptors
=======
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
app.use("/api/payments", paymentRoutes);

>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4
app.use(notFoundHandler);
app.use(errorHandler);

export default app;