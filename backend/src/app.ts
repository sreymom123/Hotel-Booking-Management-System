import cors from "cors";
import express from "express";

import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middlewares";
import router from "./routes";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin === "*" ? true : config.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_request, response) => {
  response.status(200).json({
    message: "Welcome to the Hotel Booking Management API.",
    healthCheck: "/api/health",
  });
});

app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
