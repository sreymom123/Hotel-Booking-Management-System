import cors, { type CorsOptions } from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import healthRoutes from "./routes/health.routes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { errorHandler, notFoundHandler } from "./utils/response.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import fs from "fs";

const app = express();

const configuredOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    const isAllowedLocalhost = origin
      ? /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
      : true;

    if (!origin || isAllowedLocalhost || configuredOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS origin not allowed: ${origin}`));
  },
};

app.use(cors(corsOptions));
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

const swaggerCandidates = [
  path.join(__dirname, "./docs/swagger.yaml"),
  path.resolve(process.cwd(), "src/docs/swagger.yaml"),
  path.resolve(process.cwd(), "docs/swagger.yaml"),
];
const swaggerPath = swaggerCandidates.find((candidate) => fs.existsSync(candidate));
const swaggerDocument = YAML.load(swaggerPath ?? swaggerCandidates[0]);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
