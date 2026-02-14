import { Router, type Request, type Response } from "express";
import { authenticate } from "@/middleware/auth";
import { authLimiter } from "@/middleware/rateLimiter";

// ---------------------------------------------------------------------------
// Auth Routes — /api/auth
// ---------------------------------------------------------------------------

const router = Router();

// Apply stricter rate limiting to all auth routes
router.use(authLimiter);

// POST /api/auth/register
router.post("/register", (_req: Request, res: Response) => {
  res.status(201).json({ success: true, message: "TODO: register" });
});

// POST /api/auth/login
router.post("/login", (_req: Request, res: Response) => {
  res.json({ success: true, message: "TODO: login" });
});

// POST /api/auth/logout
router.post("/logout", authenticate, (_req: Request, res: Response) => {
  res.json({ success: true, message: "TODO: logout" });
});

// POST /api/auth/refresh
router.post("/refresh", (_req: Request, res: Response) => {
  res.json({ success: true, message: "TODO: refresh token" });
});

// GET /api/auth/me
router.get("/me", authenticate, (req: Request, res: Response) => {
  res.json({ success: true, data: { user: req.user }, message: "TODO: get current user profile" });
});

// POST /api/auth/forgot-password
router.post("/forgot-password", (_req: Request, res: Response) => {
  res.json({ success: true, message: "TODO: forgot password" });
});

// POST /api/auth/reset-password
router.post("/reset-password", (_req: Request, res: Response) => {
  res.json({ success: true, message: "TODO: reset password" });
});

// POST /api/auth/change-password
router.post("/change-password", authenticate, (_req: Request, res: Response) => {
  res.json({ success: true, message: "TODO: change password" });
});

export default router;
