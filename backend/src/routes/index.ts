import { Router } from "express";

import healthRouter from "./health.routes";
import paymentRouter from "./paymentRoutes";

const router = Router();

router.get("/", (_request, response) => {
  response.status(200).json({
    message: "Hotel Booking Management API routes are available.",
  });
});

router.use("/health", healthRouter);
router.use("/payment", paymentRouter);

export default router;
