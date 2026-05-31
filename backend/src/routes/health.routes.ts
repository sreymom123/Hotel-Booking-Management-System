import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Hotel Booking Management API is healthy",
    data: {
      service: "hotel-booking-management-api",
      timestamp: new Date().toISOString(),
    },
  });
});

export default healthRouter;
