import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

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
   * Create a subscription for the authenticated user.
   * For now, directly creates the UserSubscription record (Stripe integration later).
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

      // Calculate period based on billing cycle
      const now = new Date();
      const periodEnd = new Date(now);
      if (billingCycle === "YEARLY") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      const subscription = await prisma.userSubscription.create({
        data: {
          userId,
          planId,
          status: "ACTIVE",
          periodStart: now,
          periodEnd,
        },
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              slug: true,
              priceMonthly: true,
              priceYearly: true,
              maxListings: true,
              maxImages: true,
              features: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: subscription,
        message: `Successfully subscribed to ${plan.name} plan`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/subscriptions/change-plan
   * Switch to a different plan. Updates the current subscription.
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
        throw new AppError("You don't have an active subscription to change", 400);
      }

      if (currentSubscription.planId === planId) {
        throw new AppError("You are already on this plan", 400);
      }

      // Calculate new period
      const now = new Date();
      const periodEnd = new Date(now);
      if (billingCycle === "YEARLY") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      // Update subscription to new plan
      const updated = await prisma.userSubscription.update({
        where: { id: currentSubscription.id },
        data: {
          planId,
          periodStart: now,
          periodEnd,
        },
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              slug: true,
              priceMonthly: true,
              priceYearly: true,
              maxListings: true,
              maxImages: true,
              features: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: `Plan changed to ${newPlan.name}`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/subscriptions/cancel
   * Cancel the current active subscription. Sets cancelledAt and status=CANCELLED.
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
        throw new AppError("You don't have an active subscription to cancel", 400);
      }

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
};
