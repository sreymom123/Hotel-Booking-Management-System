import { NextFunction, Request, Response } from "express";

export const sendSuccess = (res: Response, message: string, data: unknown, status = 200) => {
  res.status(status).json({ success: true, message, data });
};

export const sendError = (
  res: Response,
  message: string,
  statusOrErrors: number | unknown[] = 400,
  errors: unknown[] = [],
) => {
  const status = typeof statusOrErrors === "number" ? statusOrErrors : 400;
  const payloadErrors = Array.isArray(statusOrErrors) ? statusOrErrors : errors;

  res.status(status).json({ success: false, message, errors: payloadErrors });
};

export const notFoundHandler = (request: Request, response: Response): void => {
  response.status(404).json({
    success: false,
    message: `Route ${request.method} ${request.originalUrl} not found`,
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
    success: false,
    message: "An unexpected error occurred",
  });
};
