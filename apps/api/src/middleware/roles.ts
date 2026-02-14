import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

// ---------------------------------------------------------------------------
// Role-based Authorization Middleware
// ---------------------------------------------------------------------------

/**
 * Allowed user roles. Should match your Prisma enum / DB values.
 */
export type UserRole = "BUYER" | "SELLER" | "ADMIN";

/**
 * Middleware factory that restricts access to users with the specified role(s).
 * Must be placed AFTER the `authenticate` middleware so that `req.user` is set.
 *
 * Usage:
 *   router.get("/admin/dashboard", authenticate, ensureRole("ADMIN"), handler);
 *   router.post("/listing", authenticate, ensureRole("SELLER", "ADMIN"), handler);
 */
export function ensureRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Authentication required.", 401));
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      next(
        new AppError(
          `Access denied. Required role(s): ${roles.join(", ")}. Your role: ${req.user.role}.`,
          403
        )
      );
      return;
    }

    next();
  };
}
