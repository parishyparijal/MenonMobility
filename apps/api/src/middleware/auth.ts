import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@/config/database";
import { AppError } from "./errorHandler";

// ---------------------------------------------------------------------------
// JWT Authentication Middleware
// ---------------------------------------------------------------------------

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access-secret-change-me";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Extract the bearer token from the Authorization header.
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // Fallback: check cookies
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken as string;
  }
  return null;
}

/**
 * Strict authentication middleware.
 * Rejects the request with 401 if no valid token is found.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new AppError("Authentication required. Please provide a valid token.", 401);
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;

    // Fetch the user to make sure they still exist and aren't banned
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new AppError("User no longer exists.", 401);
    }

    if (!user.isActive) {
      throw new AppError("Your account has been deactivated.", 403);
    }

    // Attach user to the request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
      return;
    }
    if (err instanceof jwt.TokenExpiredError) {
      next(new AppError("Token has expired. Please refresh your session.", 401));
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid token.", 401));
      return;
    }
    next(err);
  }
}

/**
 * Optional authentication middleware.
 * Attaches user to request if a valid token is found, but does NOT reject
 * the request if there is no token.
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }

    next();
  } catch {
    // Silently ignore token errors for optional auth
    next();
  }
}
