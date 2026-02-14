import { Router, type Request, type Response } from "express";
import { authLimiter } from "@/middleware/rateLimiter";

// ---------------------------------------------------------------------------
// Contact Routes — /api/contact
// ---------------------------------------------------------------------------

const router = Router();

// POST /api/contact — Submit a contact form (public, rate-limited)
router.post("/", authLimiter, (_req: Request, res: Response) => {
  res.status(201).json({ success: true, message: "TODO: submit contact form" });
});

export default router;
