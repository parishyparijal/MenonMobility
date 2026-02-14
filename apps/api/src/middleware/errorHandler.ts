import type { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// Custom Application Error
// ---------------------------------------------------------------------------

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ---------------------------------------------------------------------------
// Global Error Handler Middleware
// ---------------------------------------------------------------------------

export function globalErrorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Defaults
  let statusCode = 500;
  let message = "Internal server error";
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log non-operational (unexpected) errors with full stack
  if (!isOperational) {
    console.error("=== UNEXPECTED ERROR ===");
    console.error(err.stack || err);
  } else if (process.env.NODE_ENV === "development") {
    console.error(`[${statusCode}] ${message}`);
  }

  // Build response
  const response: Record<string, unknown> = {
    success: false,
    message,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
