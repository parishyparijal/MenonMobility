import { Router, type Request, type Response } from "express";
import { authenticate } from "@/middleware/auth";

// ---------------------------------------------------------------------------
// Subscription Routes — /api/subscriptions
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/subscriptions/plans — List available subscription plans (public)
router.get("/plans", (_req: Request, res: Response) => {
  res.json({ success: true, data: [], message: "TODO: list subscription plans" });
});

// POST /api/subscriptions/checkout — Create a Stripe checkout session
router.post("/checkout", authenticate, (_req: Request, res: Response) => {
  res.json({ success: true, data: null, message: "TODO: create checkout session" });
});

// GET /api/subscriptions/current — Get current user's active subscription
router.get("/current", authenticate, (_req: Request, res: Response) => {
  res.json({ success: true, data: null, message: "TODO: get current subscription" });
});

// POST /api/subscriptions/cancel — Cancel current subscription
router.post("/cancel", authenticate, (_req: Request, res: Response) => {
  res.json({ success: true, message: "TODO: cancel subscription" });
});

// POST /api/subscriptions/webhook — Stripe webhook handler (no auth — verified by signature)
router.post("/webhook", (_req: Request, res: Response) => {
  res.json({ success: true, message: "TODO: handle Stripe webhook" });
});

export default router;
