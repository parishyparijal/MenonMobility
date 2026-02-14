import { z } from "zod";

// ---------------------------------------------------------------------------
// Subscription Validator Schemas
// ---------------------------------------------------------------------------

/**
 * POST /api/subscriptions/subscribe
 * Body for subscribing to a plan.
 */
export const subscribeBodySchema = z.object({
  planId: z.string().uuid("Invalid plan ID"),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
});

export type SubscribeBody = z.infer<typeof subscribeBodySchema>;

/**
 * POST /api/subscriptions/change-plan
 * Body for changing to a different plan.
 */
export const changePlanBodySchema = z.object({
  planId: z.string().uuid("Invalid plan ID"),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
});

export type ChangePlanBody = z.infer<typeof changePlanBodySchema>;
