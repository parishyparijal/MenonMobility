import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";

export const recentlyViewedController = {
  /**
   * GET /api/recently-viewed
   * List current user's recently viewed listings.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { page, limit } = req.query as any;
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        prisma.recentlyViewed.findMany({
          where: { userId },
          orderBy: { viewedAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            viewedAt: true,
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
                mileageKm: true,
                fuelType: true,
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
        prisma.recentlyViewed.count({ where: { userId } }),
      ]);

      res.json({
        success: true,
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
