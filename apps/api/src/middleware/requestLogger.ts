import { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// Structured Request Logger Middleware
// ---------------------------------------------------------------------------
// Logs each request with structured JSON for easy parsing by log aggregators.
// ---------------------------------------------------------------------------

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = {
      level: res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
      timestamp: new Date().toISOString(),
      requestId: req.headers["x-request-id"] as string,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: (req as any).user?.userId,
    };

    if (process.env.NODE_ENV === "production") {
      console.log(JSON.stringify(log));
    } else {
      // Dev: more readable format (morgan handles the pretty output)
      if (res.statusCode >= 500) {
        console.error(
          `[${log.level.toUpperCase()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
        );
      }
    }
  });

  next();
}
