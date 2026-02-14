import type { Response } from "express";

// ---------------------------------------------------------------------------
// Standardized API Response Helpers
// ---------------------------------------------------------------------------

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
}

/**
 * Send a successful JSON response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200
): void {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
}

/**
 * Send an error JSON response.
 */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: unknown[]
): void {
  const response: ErrorResponse = {
    success: false,
    message,
  };
  if (errors && errors.length > 0) {
    response.errors = errors;
  }
  res.status(statusCode).json(response);
}
