import { Router } from "express";
import { authenticate } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { subscriptionController } from "@/controllers/subscription.controller";
import {
  subscribeBodySchema,
  changePlanBodySchema,
} from "@/validators/subscription.validator";

// ---------------------------------------------------------------------------
// Subscription Routes — /api/subscriptions
// ---------------------------------------------------------------------------

const router = Router();

// GET /api/subscriptions/plans — List available subscription plans (public)
router.get("/plans", subscriptionController.listPlans);

// GET /api/subscriptions/current — Get current user's active subscription
router.get("/current", authenticate, subscriptionController.getMySubscription);

// POST /api/subscriptions/subscribe — Create a subscription
router.post(
  "/subscribe",
  authenticate,
  validate({ body: subscribeBodySchema }),
  subscriptionController.subscribe
);

// POST /api/subscriptions/change-plan — Switch to a different plan
router.post(
  "/change-plan",
  authenticate,
  validate({ body: changePlanBodySchema }),
  subscriptionController.changePlan
);

// POST /api/subscriptions/cancel — Cancel current subscription
router.post("/cancel", authenticate, subscriptionController.cancel);

export default router;
