import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { stripeService } from "@/services/stripe.service";

// ---------------------------------------------------------------------------
// Featured Listing Pricing (cents)
// ---------------------------------------------------------------------------
const FEATURED_PRICING: Record<string, Record<number, number>> = {
  HOMEPAGE: { 7: 4900, 14: 8900, 30: 14900 },
  CATEGORY: { 7: 2900, 14: 4900, 30: 8900 },
  SEARCH: { 7: 1900, 14: 3400, 30: 5900 },
  SIDEBAR: { 7: 1400, 14: 2400, 30: 3900 },
};

// ---------------------------------------------------------------------------
// Featured Listing Controller
// ---------------------------------------------------------------------------

export const featuredListingController = {
  /**
   * GET /api/featured-listings/pricing
   * Get featured listing pricing options (public).
   */
  async getPricing(_req: Request, res: Response, next: NextFunction) {
    try {
      const pricing = Object.entries(FEATURED_PRICING).map(
        ([placement, options]) => ({
          placement,
          options: Object.entries(options).map(([days, priceInCents]) => ({
            days: parseInt(days, 10),
            price: priceInCents / 100,
            currency: "EUR",
          })),
        })
      );

      res.set("Cache-Control", "public, max-age=600, s-maxage=600");
      res.json({ success: true, data: pricing });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/featured-listings/purchase
   * Create a Stripe checkout session for featuring a listing.
   */
  async purchase(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { listingId, placement, days } = req.body;

      // Validate listing exists and belongs to user
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true, sellerId: true, status: true, title: true },
      });

      if (!listing) throw new AppError("Listing not found", 404);
      if (listing.sellerId !== userId)
        throw new AppError("You can only feature your own listings", 403);
      if (listing.status !== "ACTIVE")
        throw new AppError("Only active listings can be featured", 400);

      // Check if already featured in this placement
      const existingFeature = await prisma.featuredListing.findFirst({
        where: {
          listingId,
          placement: placement as any,
          endsAt: { gt: new Date() },
        },
      });

      if (existingFeature) {
        throw new AppError(
          `This listing is already featured on ${placement} until ${existingFeature.endsAt.toISOString().split("T")[0]}`,
          400
        );
      }

      // Validate pricing
      const placementPricing = FEATURED_PRICING[placement];
      if (!placementPricing) throw new AppError("Invalid placement", 400);
      const priceInCents = placementPricing[days];
      if (!priceInCents) throw new AppError("Invalid duration", 400);

      // Create Stripe checkout
      const { sessionId, url } =
        await stripeService.createFeaturedListingCheckout(
          userId,
          listingId,
          placement,
          days,
          priceInCents
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
   * GET /api/featured-listings/my
   * List the current user's featured listings.
   */
  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const featured = await prisma.featuredListing.findMany({
        where: {
          listing: { sellerId: userId },
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const data = featured.map((f) => ({
        id: f.id,
        listing: f.listing,
        placement: f.placement,
        startsAt: f.startsAt,
        endsAt: f.endsAt,
        pricePaid: f.pricePaid,
        isActive: f.endsAt > new Date(),
      }));

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/featured-listings/active
   * Get currently active featured listings (for display on website).
   * Supports ?placement=HOMEPAGE filter.
   */
  async listActive(req: Request, res: Response, next: NextFunction) {
    try {
      const placement = req.query.placement as string | undefined;
      const now = new Date();

      const where: any = {
        startsAt: { lte: now },
        endsAt: { gt: now },
        listing: {
          status: "ACTIVE",
          deletedAt: null,
        },
      };

      if (placement) {
        where.placement = placement;
      }

      const featured = await prisma.featuredListing.findMany({
        where,
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              year: true,
              mileageKm: true,
              condition: true,
              city: true,
              countryCode: true,
              images: { take: 1, orderBy: { position: "asc" } },
              brand: { select: { name: true, slug: true } },
              category: { select: { name: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.set("Cache-Control", "public, max-age=60, s-maxage=60");
      res.json({ success: true, data: featured });
    } catch (error) {
      next(error);
    }
  },
};
