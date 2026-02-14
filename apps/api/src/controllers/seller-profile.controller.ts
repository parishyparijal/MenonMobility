import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

// ---------------------------------------------------------------------------
// Seller Profile Controller
// Mix of public and authenticated routes
// ---------------------------------------------------------------------------

export const sellerProfileController = {
  /**
   * GET /api/sellers/:slug
   * Public: Get seller profile by slug with user info, rating, review count.
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const profile = await prisma.sellerProfile.findUnique({
        where: { slug },
        select: {
          id: true,
          companyName: true,
          slug: true,
          description: true,
          website: true,
          address: true,
          city: true,
          region: true,
          countryCode: true,
          logoUrl: true,
          bannerUrl: true,
          isVerified: true,
          verifiedAt: true,
          responseRate: true,
          avgResponseTime: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              createdAt: true,
            },
          },
        },
      });

      if (!profile) {
        throw new AppError("Seller profile not found", 404);
      }

      // Count active listings
      const listingCount = await prisma.listing.count({
        where: {
          sellerId: profile.user.id,
          status: "ACTIVE",
          deletedAt: null,
        },
      });

      res.json({
        success: true,
        data: {
          ...profile,
          listingCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/sellers/:slug/listings
   * Public: Get seller's active listings (paginated).
   */
  async getProfileListings(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));

      const profile = await prisma.sellerProfile.findUnique({
        where: { slug },
        select: { userId: true },
      });

      if (!profile) {
        throw new AppError("Seller profile not found", 404);
      }

      const skip = (page - 1) * limit;

      const [listings, total] = await Promise.all([
        prisma.listing.findMany({
          where: {
            sellerId: profile.userId,
            status: "ACTIVE",
            deletedAt: null,
          },
          orderBy: { publishedAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            priceCurrency: true,
            priceOnRequest: true,
            condition: true,
            year: true,
            mileageKm: true,
            fuelType: true,
            transmission: true,
            powerHp: true,
            countryCode: true,
            city: true,
            isFeatured: true,
            favoriteCount: true,
            publishedAt: true,
            category: {
              select: { id: true, name: true, slug: true },
            },
            brand: {
              select: { id: true, name: true, slug: true },
            },
            model: {
              select: { id: true, name: true, slug: true },
            },
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
        }),
        prisma.listing.count({
          where: {
            sellerId: profile.userId,
            status: "ACTIVE",
            deletedAt: null,
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: listings,
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
   * GET /api/sellers/me
   * Authenticated: Get own seller profile.
   */
  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const profile = await prisma.sellerProfile.findUnique({
        where: { userId },
        select: {
          id: true,
          companyName: true,
          slug: true,
          description: true,
          website: true,
          address: true,
          city: true,
          region: true,
          countryCode: true,
          lat: true,
          lng: true,
          logoUrl: true,
          bannerUrl: true,
          isVerified: true,
          verifiedAt: true,
          responseRate: true,
          avgResponseTime: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              whatsapp: true,
              avatarUrl: true,
            },
          },
        },
      });

      if (!profile) {
        throw new AppError("Seller profile not found. Are you registered as a seller?", 404);
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/sellers/me
   * Authenticated: Update own seller profile.
   */
  async updateMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const {
        companyName,
        description,
        website,
        address,
        city,
        region,
        countryCode,
        phone,
      } = req.body;

      const existing = await prisma.sellerProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!existing) {
        throw new AppError("Seller profile not found. Are you registered as a seller?", 404);
      }

      const profile = await prisma.sellerProfile.update({
        where: { userId },
        data: {
          ...(companyName !== undefined && { companyName }),
          ...(description !== undefined && { description }),
          ...(website !== undefined && { website }),
          ...(address !== undefined && { address }),
          ...(city !== undefined && { city }),
          ...(region !== undefined && { region }),
          ...(countryCode !== undefined && { countryCode }),
        },
        select: {
          id: true,
          companyName: true,
          slug: true,
          description: true,
          website: true,
          address: true,
          city: true,
          region: true,
          countryCode: true,
          logoUrl: true,
          bannerUrl: true,
          isVerified: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Also update user phone if provided
      if (phone !== undefined) {
        await prisma.user.update({
          where: { id: userId },
          data: { phone },
        });
      }

      res.json({
        success: true,
        data: profile,
        message: "Seller profile updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/sellers/:slug/reviews
   * Public: Get reviews for a seller (paginated).
   */
  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));

      const profile = await prisma.sellerProfile.findUnique({
        where: { slug },
        select: { id: true, rating: true, reviewCount: true },
      });

      if (!profile) {
        throw new AppError("Seller profile not found", 404);
      }

      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        prisma.sellerReview.findMany({
          where: { sellerId: profile.id },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            rating: true,
            title: true,
            body: true,
            isVerifiedPurchase: true,
            sellerResponse: true,
            respondedAt: true,
            createdAt: true,
            buyer: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            listing: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        }),
        prisma.sellerReview.count({ where: { sellerId: profile.id } }),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          summary: {
            rating: profile.rating,
            reviewCount: profile.reviewCount,
          },
          reviews,
        },
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
};
