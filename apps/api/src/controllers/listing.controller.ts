import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { listingService } from "@/services/listing.service";

// ---------------------------------------------------------------------------
// Public Listing Controller
// ---------------------------------------------------------------------------

// Simple in-memory store for IP-based view throttling (1-minute window)
const viewThrottle = new Map<string, number>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - 60_000;
  for (const [key, timestamp] of viewThrottle) {
    if (timestamp < cutoff) {
      viewThrottle.delete(key);
    }
  }
}, 5 * 60_000);

export const listingController = {
  /**
   * GET /api/listings
   * Paginated list of active listings with filters and sorting.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page,
        limit,
        category,
        brand,
        model,
        condition,
        fuelType,
        transmission,
        emissionClass,
        countryCode,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        minMileage,
        maxMileage,
        sort,
      } = req.query as any;

      const where = listingService.buildListingWhere({
        category,
        brand,
        model,
        condition,
        fuelType,
        transmission,
        emissionClass,
        countryCode,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        minMileage,
        maxMileage,
        status: "ACTIVE",
      });

      // Force only active, non-deleted listings
      where.status = "ACTIVE";
      where.deletedAt = null;

      const orderBy = listingService.buildListingOrderBy(sort);

      const pageNum = page || 1;
      const limitNum = limit || 20;
      const skip = (pageNum - 1) * limitNum;

      const [listings, total] = await Promise.all([
        prisma.listing.findMany({
          where,
          orderBy,
          skip,
          take: limitNum,
          ...listingService.getListingSelect(false),
        }),
        prisma.listing.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: listings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/listings/:slug
   * Full listing detail by slug. Increments viewCount (IP-throttled).
   * Records in RecentlyViewed if user is authenticated.
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const listing = await prisma.listing.findUnique({
        where: { slug },
        ...listingService.getListingSelect(true),
      });

      if (!listing || listing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      // Only show non-active listings to their owner
      if (listing.status !== "ACTIVE") {
        if (!req.user || req.user.userId !== listing.sellerId) {
          throw new AppError("Listing not found", 404);
        }
      }

      // Increment view count with IP-based 1-minute throttle
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const throttleKey = `${ip}:${listing.id}`;
      const lastView = viewThrottle.get(throttleKey);
      const now = Date.now();

      if (!lastView || now - lastView > 60_000) {
        viewThrottle.set(throttleKey, now);
        await prisma.listing.update({
          where: { id: listing.id },
          data: { viewCount: { increment: 1 } },
        });
      }

      // Record in RecentlyViewed if user is authenticated
      if (req.user) {
        await prisma.recentlyViewed.upsert({
          where: {
            userId_listingId: {
              userId: req.user.userId,
              listingId: listing.id,
            },
          },
          update: {
            viewedAt: new Date(),
          },
          create: {
            userId: req.user.userId,
            listingId: listing.id,
          },
        });
      }

      res.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/listings/:slug/related
   * Returns up to 6 related listings (same category, optionally same brand).
   */
  async getRelated(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const listing = await prisma.listing.findUnique({
        where: { slug },
        select: {
          id: true,
          categoryId: true,
          brandId: true,
        },
      });

      if (!listing) {
        throw new AppError("Listing not found", 404);
      }

      // Try to find related listings: same category + same brand first
      let related = await prisma.listing.findMany({
        where: {
          status: "ACTIVE",
          deletedAt: null,
          categoryId: listing.categoryId,
          brandId: listing.brandId,
          id: { not: listing.id },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
        ...listingService.getListingSelect(false),
      });

      // If we didn't get 6 results, fill with same-category listings
      if (related.length < 6) {
        const existingIds = [listing.id, ...related.map((r: any) => r.id)];
        const more = await prisma.listing.findMany({
          where: {
            status: "ACTIVE",
            deletedAt: null,
            categoryId: listing.categoryId,
            id: { notIn: existingIds },
          },
          orderBy: { createdAt: "desc" },
          take: 6 - related.length,
          ...listingService.getListingSelect(false),
        });
        related = [...related, ...more];
      }

      res.json({
        success: true,
        data: related,
      });
    } catch (error) {
      next(error);
    }
  },
};
