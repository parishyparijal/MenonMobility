import stripe, { STRIPE_WEBHOOK_SECRET } from "@/config/stripe";
import prisma from "@/config/database";
import Stripe from "stripe";

// ---------------------------------------------------------------------------
// Stripe Service — Centralised Stripe operations
// ---------------------------------------------------------------------------

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3001";

export const stripeService = {
  // ── Customer Management ──────────────────────────────────────────────

  /**
   * Get or create a Stripe customer for the given user.
   * Persists the stripeCustomerId on the User record.
   */
  async getOrCreateCustomer(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (user.stripeCustomerId) return user.stripeCustomerId;

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  },

  // ── Subscription Checkout ────────────────────────────────────────────

  /**
   * Create a Stripe Checkout session for a subscription plan.
   * Returns the session URL to redirect the user to.
   */
  async createSubscriptionCheckout(
    userId: string,
    planId: string,
    billingCycle: "MONTHLY" | "YEARLY"
  ): Promise<{ sessionId: string; url: string }> {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan || !plan.isActive) throw new Error("Plan not found or inactive");

    const priceId =
      billingCycle === "YEARLY"
        ? plan.stripeYearlyPriceId
        : plan.stripeMonthlyPriceId;

    if (!priceId) {
      throw new Error(
        `Stripe price ID not configured for ${plan.name} (${billingCycle})`
      );
    }

    const customerId = await this.getOrCreateCustomer(userId);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${CLIENT_URL}/account/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/pricing?cancelled=true`,
      metadata: {
        userId,
        planId,
        billingCycle,
        type: "subscription",
      },
      subscription_data: {
        metadata: { userId, planId },
      },
    });

    return { sessionId: session.id, url: session.url! };
  },

  // ── Featured Listing Checkout ────────────────────────────────────────

  /**
   * Create a Stripe Checkout session for featuring a listing.
   * One-time payment.
   */
  async createFeaturedListingCheckout(
    userId: string,
    listingId: string,
    placement: string,
    days: number,
    priceInCents: number
  ): Promise<{ sessionId: string; url: string }> {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, title: true, sellerId: true },
    });
    if (!listing) throw new Error("Listing not found");
    if (listing.sellerId !== userId) throw new Error("Not your listing");

    const customerId = await this.getOrCreateCustomer(userId);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Featured Listing — ${placement}`,
              description: `Feature "${listing.title}" for ${days} days on ${placement}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${CLIENT_URL}/account/listings?featured=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/account/listings?featured=cancelled`,
      metadata: {
        userId,
        listingId,
        placement,
        days: String(days),
        type: "featured",
      },
    });

    return { sessionId: session.id, url: session.url! };
  },

  // ── Subscription Management ──────────────────────────────────────────

  /**
   * Cancel a Stripe subscription at period end.
   */
  async cancelSubscription(stripeSubscriptionId: string): Promise<void> {
    await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  },

  /**
   * Immediately cancel a Stripe subscription.
   */
  async cancelSubscriptionImmediately(
    stripeSubscriptionId: string
  ): Promise<void> {
    await stripe.subscriptions.cancel(stripeSubscriptionId);
  },

  /**
   * Create a Stripe Customer Portal session so the user can manage billing.
   */
  async createPortalSession(userId: string): Promise<string> {
    const customerId = await this.getOrCreateCustomer(userId);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${CLIENT_URL}/account/subscription`,
    });

    return session.url;
  },

  // ── Webhook Processing ───────────────────────────────────────────────

  /**
   * Verify and construct a Stripe webhook event from the raw body.
   */
  constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  },

  /**
   * Handle checkout.session.completed event.
   */
  async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const metadata = session.metadata || {};

    if (metadata.type === "subscription") {
      await this.handleSubscriptionCheckoutCompleted(session);
    } else if (metadata.type === "featured") {
      await this.handleFeaturedCheckoutCompleted(session);
    }
  },

  /**
   * Process subscription checkout completion.
   */
  async handleSubscriptionCheckoutCompleted(
    session: Stripe.Checkout.Session
  ) {
    const { userId, planId } = session.metadata!;
    const stripeSubscriptionId = session.subscription as string;

    // Retrieve the Stripe subscription for period dates
    const stripeSub =
      await stripe.subscriptions.retrieve(stripeSubscriptionId);

    // Cancel any existing active subscription for this user
    await prisma.userSubscription.updateMany({
      where: { userId, status: "ACTIVE" },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    // Create the new subscription record
    await prisma.userSubscription.create({
      data: {
        userId,
        planId,
        stripeSubscriptionId,
        status: "ACTIVE",
        periodStart: new Date(stripeSub.current_period_start * 1000),
        periodEnd: new Date(stripeSub.current_period_end * 1000),
      },
    });

    // Record the payment
    await prisma.payment.create({
      data: {
        userId,
        stripePaymentIntentId: session.payment_intent as string | null,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency || "eur",
        status: "SUCCEEDED",
        type: "SUBSCRIPTION",
        metadata: { planId, stripeSubscriptionId },
      },
    });
  },

  /**
   * Process featured listing checkout completion.
   */
  async handleFeaturedCheckoutCompleted(session: Stripe.Checkout.Session) {
    const { userId, listingId, placement, days } = session.metadata!;
    const daysNum = parseInt(days, 10);

    const now = new Date();
    const endsAt = new Date(now);
    endsAt.setDate(endsAt.getDate() + daysNum);

    // Create featured listing record
    await prisma.featuredListing.create({
      data: {
        listingId,
        placement: placement as any,
        startsAt: now,
        endsAt,
        pricePaid: (session.amount_total || 0) / 100,
        stripePaymentId: session.payment_intent as string | null,
      },
    });

    // Record the payment
    await prisma.payment.create({
      data: {
        userId,
        stripePaymentIntentId: session.payment_intent as string | null,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency || "eur",
        status: "SUCCEEDED",
        type: "FEATURED",
        metadata: { listingId, placement, days: daysNum },
      },
    });
  },

  /**
   * Handle invoice.paid — renew subscription period.
   */
  async handleInvoicePaid(invoice: Stripe.Invoice) {
    const stripeSubscriptionId = invoice.subscription as string;
    if (!stripeSubscriptionId) return;

    const subscription = await prisma.userSubscription.findUnique({
      where: { stripeSubscriptionId },
    });
    if (!subscription) return;

    const stripeSub =
      await stripe.subscriptions.retrieve(stripeSubscriptionId);

    await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        periodStart: new Date(stripeSub.current_period_start * 1000),
        periodEnd: new Date(stripeSub.current_period_end * 1000),
      },
    });

    // Record the renewal payment
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        stripePaymentIntentId: invoice.payment_intent as string | null,
        amount: (invoice.amount_paid || 0) / 100,
        currency: invoice.currency || "eur",
        status: "SUCCEEDED",
        type: "SUBSCRIPTION",
        metadata: { stripeSubscriptionId, renewal: true },
      },
    });
  },

  /**
   * Handle invoice.payment_failed — mark subscription as past due.
   */
  async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const stripeSubscriptionId = invoice.subscription as string;
    if (!stripeSubscriptionId) return;

    await prisma.userSubscription.updateMany({
      where: { stripeSubscriptionId },
      data: { status: "PAST_DUE" },
    });

    // Record failed payment
    const subscription = await prisma.userSubscription.findUnique({
      where: { stripeSubscriptionId },
    });
    if (subscription) {
      await prisma.payment.create({
        data: {
          userId: subscription.userId,
          stripePaymentIntentId: invoice.payment_intent as string | null,
          amount: (invoice.amount_due || 0) / 100,
          currency: invoice.currency || "eur",
          status: "FAILED",
          type: "SUBSCRIPTION",
          metadata: { stripeSubscriptionId },
        },
      });
    }
  },

  /**
   * Handle customer.subscription.deleted — mark subscription as cancelled.
   */
  async handleSubscriptionDeleted(sub: Stripe.Subscription) {
    await prisma.userSubscription.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });
  },

  /**
   * Handle customer.subscription.updated — sync status changes.
   */
  async handleSubscriptionUpdated(sub: Stripe.Subscription) {
    const dbSub = await prisma.userSubscription.findUnique({
      where: { stripeSubscriptionId: sub.id },
    });
    if (!dbSub) return;

    const statusMap: Record<string, string> = {
      active: "ACTIVE",
      past_due: "PAST_DUE",
      canceled: "CANCELLED",
      unpaid: "PAST_DUE",
    };

    const newStatus = statusMap[sub.status] || dbSub.status;

    await prisma.userSubscription.update({
      where: { id: dbSub.id },
      data: {
        status: newStatus as any,
        periodStart: new Date(sub.current_period_start * 1000),
        periodEnd: new Date(sub.current_period_end * 1000),
        ...(sub.canceled_at
          ? { cancelledAt: new Date(sub.canceled_at * 1000) }
          : {}),
      },
    });
  },
};
