import { Router } from "express";

import healthRouter from "./health.routes";

const router = Router();

router.get("/", (_request, response) => {
  response.status(200).json({
    message: "Hotel Booking Management API routes are available.",
  });
});

router.use("/health", healthRouter);

export default router;
