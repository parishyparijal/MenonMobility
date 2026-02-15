import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";

export const sellerDashboardController = {
  /**
   * GET /api/seller/dashboard
   * Returns key stats for the seller dashboard.
   */
  async dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const [
        totalListings,
        activeListings,
        draftListings,
        pendingListings,
        soldListings,
        totalViews,
        totalFavorites,
        totalContacts,
        unreadMessages,
      ] = await Promise.all([
        prisma.listing.count({
          where: { sellerId: userId, deletedAt: null },
        }),
        prisma.listing.count({
          where: { sellerId: userId, status: "ACTIVE", deletedAt: null },
        }),
        prisma.listing.count({
          where: { sellerId: userId, status: "DRAFT", deletedAt: null },
        }),
        prisma.listing.count({
          where: { sellerId: userId, status: "PENDING_REVIEW", deletedAt: null },
        }),
        prisma.listing.count({
          where: { sellerId: userId, status: "SOLD", deletedAt: null },
        }),
        prisma.listing.aggregate({
          where: { sellerId: userId, deletedAt: null },
          _sum: { viewCount: true },
        }),
        prisma.listing.aggregate({
          where: { sellerId: userId, deletedAt: null },
          _sum: { favoriteCount: true },
        }),
        prisma.listing.aggregate({
          where: { sellerId: userId, deletedAt: null },
          _sum: { contactCount: true },
        }),
        prisma.message.count({
          where: {
            thread: { sellerId: userId },
            senderId: { not: userId },
            isRead: false,
          },
        }),
      ]);

      // Recent listings (last 5)
      const recentListings = await prisma.listing.findMany({
        where: { sellerId: userId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          price: true,
          priceCurrency: true,
          viewCount: true,
          favoriteCount: true,
          createdAt: true,
          images: {
            take: 1,
            orderBy: { position: "asc" },
            select: { thumbnailUrl: true },
          },
        },
      });

      res.json({
        success: true,
        data: {
          stats: {
            totalListings,
            activeListings,
            draftListings,
            pendingListings,
            soldListings,
            totalViews: totalViews._sum.viewCount ?? 0,
            totalFavorites: totalFavorites._sum.favoriteCount ?? 0,
            totalContacts: totalContacts._sum.contactCount ?? 0,
            unreadMessages,
          },
          recentListings,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/seller/analytics
   * Returns analytics data: views over time, top listings, status breakdown.
   */
  async analytics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      // Top performing listings by views
      const topByViews = await prisma.listing.findMany({
        where: { sellerId: userId, status: "ACTIVE", deletedAt: null },
        orderBy: { viewCount: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          viewCount: true,
          favoriteCount: true,
          contactCount: true,
          price: true,
          priceCurrency: true,
          publishedAt: true,
          images: {
            take: 1,
            orderBy: { position: "asc" },
            select: { thumbnailUrl: true },
          },
        },
      });

      // Status breakdown
      const statusBreakdown = await prisma.listing.groupBy({
        by: ["status"],
        where: { sellerId: userId, deletedAt: null },
        _count: { id: true },
      });

      // Category breakdown
      const categoryBreakdown = await prisma.listing.groupBy({
        by: ["categoryId"],
        where: { sellerId: userId, deletedAt: null },
        _count: { id: true },
        _sum: { viewCount: true },
      });

      // Get category names
      const categoryIds = categoryBreakdown.map((c) => c.categoryId);
      const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true, slug: true },
      });

      const categoryMap = new Map(categories.map((c) => [c.id, c]));

      const categoryStats = categoryBreakdown.map((c) => ({
        category: categoryMap.get(c.categoryId) ?? { id: c.categoryId, name: "Unknown", slug: "" },
        count: c._count.id,
        views: c._sum.viewCount ?? 0,
      }));

      res.json({
        success: true,
        data: {
          topByViews,
          statusBreakdown: statusBreakdown.map((s) => ({
            status: s.status,
            count: s._count.id,
          })),
          categoryStats,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
