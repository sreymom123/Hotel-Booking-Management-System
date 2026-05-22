import { NextFunction, Request, Response } from "express";

export const notFoundHandler = (request: Request, response: Response): void => {
  response.status(404).json({
    message: `Route ${request.method} ${request.originalUrl} not found.`,
  });
};

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  console.error(error);

  response.status(500).json({
    message: "An unexpected error occurred.",
  });
};
