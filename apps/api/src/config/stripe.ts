import Stripe from "stripe";

// ---------------------------------------------------------------------------
// Stripe Client Singleton
// ---------------------------------------------------------------------------

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

if (!STRIPE_SECRET_KEY && process.env.NODE_ENV === "production") {
  console.error("[Stripe] STRIPE_SECRET_KEY is not set!");
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia" as Stripe.LatestApiVersion,
  typescript: true,
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export default stripe;
