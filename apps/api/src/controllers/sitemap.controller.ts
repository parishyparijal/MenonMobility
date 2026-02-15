import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";

// ---------------------------------------------------------------------------
// Sitemap Controller — Provides data for dynamic sitemap generation
// ---------------------------------------------------------------------------

export const sitemapController = {
  /**
   * GET /api/sitemap/listings
   * Returns slug + updatedAt for all active listings (for sitemap generation).
   */
  async listings(_req: Request, res: Response, next: NextFunction) {
    try {
      const listings = await prisma.listing.findMany({
        where: { status: "ACTIVE", deletedAt: null },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      });

      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.json({ success: true, data: listings });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/sitemap/categories
   * Returns slug + updatedAt for all active categories.
   */
  async categories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { name: "asc" },
      });

      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/sitemap/sellers
   * Returns slug + updatedAt for all active seller profiles.
   */
  async sellers(_req: Request, res: Response, next: NextFunction) {
    try {
      const sellers = await prisma.sellerProfile.findMany({
        where: {
          user: { isActive: true, deletedAt: null },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.json({ success: true, data: sellers });
    } catch (error) {
      next(error);
    }
  },
};
