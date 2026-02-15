import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { stripeService } from "@/services/stripe.service";

// ---------------------------------------------------------------------------
// Subscription Controller
// ---------------------------------------------------------------------------

export const subscriptionController = {
  /**
   * GET /api/subscriptions/plans
   * Get all active subscription plans (public).
   */
  async listPlans(_req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          priceMonthly: true,
          priceYearly: true,
          maxListings: true,
          maxImages: true,
          features: true,
          sortOrder: true,
        },
      });

      res.set("Cache-Control", "public, max-age=300, s-maxage=300");

      res.json({
        success: true,
        data: plans,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/subscriptions/current
   * Get the user's current active subscription with plan details.
   */
  async getMySubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const subscription = await prisma.userSubscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              priceMonthly: true,
              priceYearly: true,
              maxListings: true,
              maxImages: true,
              features: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/subscriptions/subscribe
   * Create a Stripe Checkout session for subscribing to a plan.
   * Returns the checkout URL for the client to redirect to.
   */
  async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { planId, billingCycle } = req.body;

      // Validate plan exists and is active
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      if (!plan || !plan.isActive) {
        throw new AppError("Subscription plan not found or inactive", 404);
      }

      // Check if user already has an active subscription
      const existingSubscription = await prisma.userSubscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
      });

      if (existingSubscription) {
        throw new AppError(
          "You already have an active subscription. Please cancel it first or use the change plan endpoint.",
          400
        );
      }

      // Create Stripe checkout session
      const { sessionId, url } =
        await stripeService.createSubscriptionCheckout(
          userId,
          planId,
          billingCycle || "MONTHLY"
        );

      res.json({
        success: true,
        data: { sessionId, url },
        message: "Checkout session created. Redirect to the URL to complete payment.",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/subscriptions/change-plan
   * Create a new checkout session for the new plan.
   * Current subscription will be cancelled when the new one activates (via webhook).
   */
  async changePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { planId, billingCycle } = req.body;

      // Validate new plan exists and is active
      const newPlan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      if (!newPlan || !newPlan.isActive) {
        throw new AppError("Subscription plan not found or inactive", 404);
      }

      // Find current active subscription
      const currentSubscription = await prisma.userSubscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
      });

      if (!currentSubscription) {
        throw new AppError(
          "You don't have an active subscription to change",
          400
        );
      }

      if (currentSubscription.planId === planId) {
        throw new AppError("You are already on this plan", 400);
      }

      // Create a new checkout session for the new plan
      // The webhook handler will cancel the old subscription
      const { sessionId, url } =
        await stripeService.createSubscriptionCheckout(
          userId,
          planId,
          billingCycle || "MONTHLY"
        );

      res.json({
        success: true,
        data: { sessionId, url },
        message: "Checkout session created for plan change.",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/subscriptions/cancel
   * Cancel the current active subscription at period end.
   */
  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const subscription = await prisma.userSubscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
      });

      if (!subscription) {
        throw new AppError(
          "You don't have an active subscription to cancel",
          400
        );
      }

      // Cancel via Stripe if we have a subscription ID
      if (subscription.stripeSubscriptionId) {
        await stripeService.cancelSubscription(
          subscription.stripeSubscriptionId
        );
      }

      // Update local record
      const updated = await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: "Subscription cancelled successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/subscriptions/billing-portal
   * Create a Stripe Customer Portal session for managing billing.
   */
  async billingPortal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const url = await stripeService.createPortalSession(userId);

      res.json({
        success: true,
        data: { url },
      });
    } catch (error) {
      next(error);
    }
  },
};
