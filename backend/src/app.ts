import cors from "cors";
import express from "express";
import { config } from "./config/index";
import { errorHandler, notFoundHandler } from "./utils/response.js";
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

// 2. Base API Landing Endpoint (Diagnostic Verification)
app.get("/info", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Hotel Booking Management API",
    mainEndpoint: "http://localhost:5000",
    methods: [
      "POST / → Create/Checkin",
      "POST /checkout → Checkout",
      "GET / → Get All Payments",
      "GET /:id → Get Single Payment",
      "PUT /:id → Update Payment",
      "DELETE /:id → Delete Payment"
    ]
  });
});

// 3. Central Application Routing Hierarchy
app.use("/", router);

// 4. Post-Route Fallback Exception Interceptors
app.use(notFoundHandler);
app.use(errorHandler);

export default app;