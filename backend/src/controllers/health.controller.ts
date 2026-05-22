import { Request, Response } from "express";

import { config } from "../config";

export const getHealthStatus = (_request: Request, response: Response): void => {
  response.status(200).json({
    message: "Hotel Booking Management API is running.",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
};
