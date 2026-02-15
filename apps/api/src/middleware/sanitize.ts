import { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// Input Sanitization Middleware
// ---------------------------------------------------------------------------
// Strips dangerous HTML/script tags from request body strings to prevent XSS.
// Applied globally to all POST/PUT/PATCH requests.
// ---------------------------------------------------------------------------

const DANGEROUS_PATTERNS = [
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
];

function sanitizeString(value: string): string {
  let cleaned = value;
  for (const pattern of DANGEROUS_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }
  return cleaned;
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeString(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === "object") {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
}

function sanitizeObject(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeValue(value);
  }
  return result;
}

export function sanitizeInput(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
}
