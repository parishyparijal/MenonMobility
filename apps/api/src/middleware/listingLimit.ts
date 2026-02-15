import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// Listing Limit Middleware
// ---------------------------------------------------------------------------
// Checks if the user has exceeded their subscription plan's maxListings limit.
// Free users (no subscription) get a default of 3 listings.
// ---------------------------------------------------------------------------

const FREE_TIER_MAX_LISTINGS = 3;

export async function checkListingLimit(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;

    // Get user's active subscription and plan limits
    const subscription = await prisma.userSubscription.findFirst({
      where: { userId, status: "ACTIVE" },
      include: {
        plan: { select: { maxListings: true, name: true } },
      },
    });

    const maxListings = subscription
      ? subscription.plan.maxListings
      : FREE_TIER_MAX_LISTINGS;

    // Count user's current non-deleted listings (all statuses except soft-deleted)
    const currentCount = await prisma.listing.count({
      where: {
        sellerId: userId,
        deletedAt: null,
      },
    });

    if (currentCount >= maxListings) {
      const planName = subscription ? subscription.plan.name : "Free";
      throw new AppError(
        `You have reached your listing limit of ${maxListings} on the ${planName} plan. ` +
          `Please upgrade your subscription or remove existing listings.`,
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
