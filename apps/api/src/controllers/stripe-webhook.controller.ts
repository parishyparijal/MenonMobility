import { Request, Response } from "express";
import { stripeService } from "@/services/stripe.service";
import Stripe from "stripe";

// ---------------------------------------------------------------------------
// Stripe Webhook Controller
// ---------------------------------------------------------------------------

/**
 * POST /api/stripe/webhooks
 * Handle incoming Stripe webhook events.
 * IMPORTANT: This endpoint must receive the raw body (not JSON-parsed).
 */
export async function stripeWebhookHandler(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    res.status(400).json({ error: "Missing stripe-signature header" });
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripeService.constructWebhookEvent(req.body, signature);
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
    res.status(400).json({ error: `Webhook signature verification failed` });
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await stripeService.handleCheckoutCompleted(session);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await stripeService.handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await stripeService.handleInvoicePaymentFailed(invoice);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await stripeService.handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await stripeService.handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        // Unhandled event type — acknowledge it silently
        break;
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, err);
    // Return 200 so Stripe doesn't retry — log the error for debugging
    res.json({ received: true, error: err.message });
  }
}
