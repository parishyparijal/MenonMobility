import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// Favorite Controller
// All routes require authentication
// ---------------------------------------------------------------------------

export const favoriteController = {
  /**
   * GET /api/favorites
   * Get current user's favorite listings with listing details.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { page, limit } = req.query as any;

      const skip = (page - 1) * limit;

      const [favorites, total] = await Promise.all([
        prisma.favorite.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            createdAt: true,
            listing: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                priceCurrency: true,
                priceOnRequest: true,
                condition: true,
                year: true,
                status: true,
                countryCode: true,
                city: true,
                images: {
                  take: 1,
                  orderBy: { position: "asc" },
                  select: {
                    id: true,
                    thumbnailUrl: true,
                    mediumUrl: true,
                    originalUrl: true,
                    altText: true,
                  },
                },
              },
            },
          },
        }),
        prisma.favorite.count({ where: { userId } }),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: favorites,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/favorites
   * Toggle a listing as favorite. If already favorited, remove it. Otherwise, add it.
   * Updates listing.favoriteCount accordingly.
   */
  async toggle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { listingId } = req.body;

      // Verify listing exists
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true },
      });

      if (!listing) {
        throw new AppError("Listing not found", 404);
      }

      // Check if already favorited
      const existing = await prisma.favorite.findUnique({
        where: {
          userId_listingId: { userId, listingId },
        },
      });

      let isFavorited: boolean;

      if (existing) {
        // Remove favorite
        await prisma.favorite.delete({
          where: { id: existing.id },
        });

        // Decrement favorite count
        await prisma.listing.update({
          where: { id: listingId },
          data: { favoriteCount: { decrement: 1 } },
        });

        isFavorited = false;
      } else {
        // Add favorite
        await prisma.favorite.create({
          data: { userId, listingId },
        });

        // Increment favorite count
        await prisma.listing.update({
          where: { id: listingId },
          data: { favoriteCount: { increment: 1 } },
        });

        isFavorited = true;
      }

      res.json({
        success: true,
        data: { isFavorited },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/favorites/check?listingIds=id1,id2,id3
   * Check which listings are favorited by the current user.
   */
  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { listingIds } = req.query as any;

      const favorites = await prisma.favorite.findMany({
        where: {
          userId,
          listingId: { in: listingIds },
        },
        select: { listingId: true },
      });

      const favoritedSet = new Set(favorites.map((f) => f.listingId));

      // Build a map of listingId -> boolean
      const result: Record<string, boolean> = {};
      for (const id of listingIds) {
        result[id] = favoritedSet.has(id);
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
