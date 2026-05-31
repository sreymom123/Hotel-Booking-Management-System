import cors from "cors";
import express from "express";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use(notFoundHandler);
app.use(errorHandler);

export default app;