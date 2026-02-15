import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

// ---------------------------------------------------------------------------
// Request ID Middleware
// ---------------------------------------------------------------------------
// Assigns a unique request ID to each request for tracing.
// Available via req.headers['x-request-id'] and response header.
// ---------------------------------------------------------------------------

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id =
    (req.headers["x-request-id"] as string) || randomUUID();
  req.headers["x-request-id"] = id;
  res.set("X-Request-ID", id);
  next();
}
