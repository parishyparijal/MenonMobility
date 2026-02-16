import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { emailQueue } from "@/config/queue";

// ---------------------------------------------------------------------------
// Admin Controller
// ---------------------------------------------------------------------------

export const adminController = {
  /**
   * GET /api/admin/dashboard
   * Return aggregated stats for the admin dashboard.
   */
  async dashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        totalListings,
        activeListings,
        pendingReview,
        totalUsers,
        totalSellers,
        newUsersThisMonth,
        newListingsThisMonth,
      ] = await Promise.all([
        prisma.listing.count({
          where: { deletedAt: null },
        }),
        prisma.listing.count({
          where: { status: "ACTIVE", deletedAt: null },
        }),
        prisma.listing.count({
          where: { status: "PENDING_REVIEW", deletedAt: null },
        }),
        prisma.user.count({
          where: { deletedAt: null },
        }),
        prisma.user.count({
          where: { role: "SELLER", deletedAt: null },
        }),
        prisma.user.count({
          where: { createdAt: { gte: firstDayOfMonth }, deletedAt: null },
        }),
        prisma.listing.count({
          where: { createdAt: { gte: firstDayOfMonth }, deletedAt: null },
        }),
      ]);

      res.json({
        success: true,
        data: {
          totalListings,
          activeListings,
          pendingReview,
          totalUsers,
          totalSellers,
          newUsersThisMonth,
          newListingsThisMonth,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/users
   * Paginated list of users with search (name/email), filter by role and isActive.
   * Includes listing count and seller profile.
   */
  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, role, isActive } = req.query as any;

      const pageNum = typeof page === "number" ? page : parseInt(page as string, 10) || 1;
      const limitNum = typeof limit === "number" ? limit : parseInt(limit as string, 10) || 20;
      const skip = (pageNum - 1) * limitNum;

      const where: any = {
        deletedAt: null,
      };

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }

      if (role) {
        where.role = role;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            avatarUrl: true,
            isActive: true,
            emailVerifiedAt: true,
            lastLoginAt: true,
            createdAt: true,
            sellerProfile: {
              select: {
                id: true,
                companyName: true,
                slug: true,
                isVerified: true,
                rating: true,
                reviewCount: true,
              },
            },
            _count: {
              select: { listings: true },
            },
          },
        }),
        prisma.user.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: users,
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
   * GET /api/admin/users/:id
   * Full user detail with seller profile, subscription, and listing stats.
   */
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          whatsapp: true,
          avatarUrl: true,
          locale: true,
          isActive: true,
          emailVerifiedAt: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          sellerProfile: true,
          subscriptions: {
            where: { status: "ACTIVE" },
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
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              listings: true,
              favorites: true,
              reviewsGiven: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Get listing stats breakdown
      const listingStats = await prisma.listing.groupBy({
        by: ["status"],
        where: { sellerId: id, deletedAt: null },
        _count: { id: true },
      });

      const listingStatsSummary = listingStats.reduce(
        (acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        },
        {} as Record<string, number>
      );

      res.json({
        success: true,
        data: {
          ...user,
          currentSubscription: user.subscriptions[0] || null,
          subscriptions: undefined,
          listingStats: listingStatsSummary,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/admin/users/:id
   * Update user role and/or isActive status.
   * Admin cannot deactivate themselves.
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role, isActive } = req.body;

      // Check user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
        select: { id: true, deletedAt: true },
      });

      if (!existingUser || existingUser.deletedAt) {
        throw new AppError("User not found", 404);
      }

      // Prevent admin from deactivating themselves
      if (isActive === false && id === req.user!.userId) {
        throw new AppError("You cannot deactivate your own account", 400);
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(role !== undefined && { role }),
          ...(isActive !== undefined && { isActive }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        data: user,
        message: "User updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/admin/users/:id/ban
   * Set isActive=false on the user. Soft-deactivates all their active listings.
   */
  async banUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
        select: { id: true, deletedAt: true },
      });

      if (!existingUser || existingUser.deletedAt) {
        throw new AppError("User not found", 404);
      }

      // Prevent admin from banning themselves
      if (id === req.user!.userId) {
        throw new AppError("You cannot ban your own account", 400);
      }

      // Ban user and deactivate their active listings in a transaction
      const [user, listingsUpdated] = await prisma.$transaction([
        prisma.user.update({
          where: { id },
          data: { isActive: false },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        }),
        prisma.listing.updateMany({
          where: {
            sellerId: id,
            status: "ACTIVE",
            deletedAt: null,
          },
          data: {
            status: "ARCHIVED",
          },
        }),
      ]);

      res.json({
        success: true,
        data: user,
        message: `User banned. ${listingsUpdated.count} listing(s) deactivated.`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/listings
   * All listings with optional status filter. Includes seller name, category, first image.
   */
  async listListings(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status } = req.query as any;

      const pageNum = typeof page === "number" ? page : parseInt(page as string, 10) || 1;
      const limitNum = typeof limit === "number" ? limit : parseInt(limit as string, 10) || 20;
      const skip = (pageNum - 1) * limitNum;

      const where: any = {
        deletedAt: null,
      };

      if (status) {
        where.status = status;
      }

      const [listings, total] = await Promise.all([
        prisma.listing.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            priceCurrency: true,
            condition: true,
            status: true,
            year: true,
            mileageKm: true,
            viewCount: true,
            favoriteCount: true,
            isFeatured: true,
            publishedAt: true,
            createdAt: true,
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            images: {
              take: 1,
              orderBy: { position: "asc" },
              select: {
                id: true,
                thumbnailUrl: true,
                originalUrl: true,
              },
            },
          },
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
   * PATCH /api/admin/listings/:id/approve
   * Change listing status from PENDING_REVIEW to ACTIVE. Set publishedAt if not already set.
   */
  async approveListing(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const listing = await prisma.listing.findUnique({
        where: { id },
        select: { id: true, status: true, publishedAt: true, deletedAt: true },
      });

      if (!listing || listing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (listing.status !== "PENDING_REVIEW") {
        throw new AppError(
          `Cannot approve a listing with status "${listing.status}". Only PENDING_REVIEW listings can be approved.`,
          400
        );
      }

      const updated = await prisma.listing.update({
        where: { id },
        data: {
          status: "ACTIVE",
          publishedAt: listing.publishedAt || new Date(),
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          seller: {
            select: { name: true, email: true },
          },
        },
      });

      // Queue listing approved email to seller
      await emailQueue.add("send-listing-approved", {
        email: updated.seller.email,
        name: updated.seller.name,
        listingTitle: updated.title,
        listingUrl: `${process.env.FRONTEND_URL || "http://localhost:3001"}/listings/${updated.slug}`,
      });

      res.json({
        success: true,
        data: updated,
        message: "Listing approved and set to active",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/admin/listings/:id/reject
   * Change listing status from PENDING_REVIEW to REJECTED. Requires rejectedReason in body.
   */
  async rejectListing(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { rejectedReason } = req.body;

      const listing = await prisma.listing.findUnique({
        where: { id },
        select: { id: true, status: true, deletedAt: true },
      });

      if (!listing || listing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (listing.status !== "PENDING_REVIEW") {
        throw new AppError(
          `Cannot reject a listing with status "${listing.status}". Only PENDING_REVIEW listings can be rejected.`,
          400
        );
      }

      const updated = await prisma.listing.update({
        where: { id },
        data: {
          status: "REJECTED",
          rejectedReason,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          rejectedReason: true,
          seller: {
            select: { name: true, email: true },
          },
        },
      });

      // Queue listing rejected email to seller
      await emailQueue.add("send-listing-rejected", {
        email: updated.seller.email,
        name: updated.seller.name,
        listingTitle: updated.title,
        rejectedReason: rejectedReason || "No reason provided",
      });

      res.json({
        success: true,
        data: updated,
        message: "Listing rejected",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/admin/listings/:id
   * Hard delete a listing with cascade (images, specs, favorites).
   */
  async deleteListing(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const listing = await prisma.listing.findUnique({
        where: { id },
        select: { id: true, title: true },
      });

      if (!listing) {
        throw new AppError("Listing not found", 404);
      }

      // Delete all related records in a transaction, then the listing itself
      await prisma.$transaction([
        prisma.listingImage.deleteMany({ where: { listingId: id } }),
        prisma.listingSpecification.deleteMany({ where: { listingId: id } }),
        prisma.favorite.deleteMany({ where: { listingId: id } }),
        prisma.recentlyViewed.deleteMany({ where: { listingId: id } }),
        prisma.featuredListing.deleteMany({ where: { listingId: id } }),
        prisma.sellerReview.updateMany({
          where: { listingId: id },
          data: { listingId: null },
        }),
        prisma.message.deleteMany({
          where: { thread: { listingId: id } },
        }),
        prisma.messageThread.deleteMany({ where: { listingId: id } }),
        prisma.listing.delete({ where: { id } }),
      ]);

      res.json({
        success: true,
        message: `Listing "${listing.title}" permanently deleted`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/reviews
   * All reviews with optional flagged filter (low rating reviews).
   */
  async listReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, flagged } = req.query as any;

      const pageNum = typeof page === "number" ? page : parseInt(page as string, 10) || 1;
      const limitNum = typeof limit === "number" ? limit : parseInt(limit as string, 10) || 20;
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      // Flagged = reviews with rating 1 or 2 (potentially problematic)
      if (flagged === true || flagged === "true") {
        where.rating = { lte: 2 };
      }

      const [reviews, total] = await Promise.all([
        prisma.sellerReview.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            seller: {
              select: {
                id: true,
                companyName: true,
                slug: true,
                userId: true,
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
        prisma.sellerReview.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: reviews,
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

  // ---- Language Management ----

  /**
   * GET /api/admin/languages
   * All languages (active + inactive), sorted by sortOrder.
   */
  async listLanguages(_req: Request, res: Response, next: NextFunction) {
    try {
      const languages = await prisma.siteLanguage.findMany({
        orderBy: { sortOrder: "asc" },
      });
      res.json({ success: true, data: languages });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/admin/languages
   * Create a new site language.
   */
  async createLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, localName, countryCode, isDefault, isActive, sortOrder } = req.body;

      // If this is set as default, unset any existing default
      if (isDefault) {
        await prisma.siteLanguage.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const language = await prisma.siteLanguage.create({
        data: {
          code,
          name,
          localName,
          countryCode,
          isDefault: isDefault || false,
          isActive: isActive !== undefined ? isActive : true,
          sortOrder: sortOrder || 0,
        },
      });

      res.status(201).json({
        success: true,
        data: language,
        message: "Language created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/admin/languages/:id
   * Update an existing site language.
   */
  async updateLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { code, name, localName, countryCode, isDefault, isActive, sortOrder } = req.body;

      const existing = await prisma.siteLanguage.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("Language not found", 404);
      }

      // If setting as default, unset others
      if (isDefault && !existing.isDefault) {
        await prisma.siteLanguage.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const language = await prisma.siteLanguage.update({
        where: { id },
        data: {
          ...(code !== undefined && { code }),
          ...(name !== undefined && { name }),
          ...(localName !== undefined && { localName }),
          ...(countryCode !== undefined && { countryCode }),
          ...(isDefault !== undefined && { isDefault }),
          ...(isActive !== undefined && { isActive }),
          ...(sortOrder !== undefined && { sortOrder }),
        },
      });

      res.json({
        success: true,
        data: language,
        message: "Language updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/admin/languages/:id
   * Delete a site language.
   */
  async deleteLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.siteLanguage.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("Language not found", 404);
      }

      if (existing.isDefault) {
        throw new AppError("Cannot delete the default language", 400);
      }

      await prisma.siteLanguage.delete({ where: { id } });

      res.json({
        success: true,
        message: `Language "${existing.name}" deleted`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/admin/reviews/:id
   * Remove an inappropriate review. Recalculate seller rating and review count.
   */
  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const review = await prisma.sellerReview.findUnique({
        where: { id },
        select: { id: true, sellerId: true, rating: true },
      });

      if (!review) {
        throw new AppError("Review not found", 404);
      }

      const sellerId = review.sellerId;

      // Delete the review
      await prisma.sellerReview.delete({ where: { id } });

      // Recalculate seller rating and count
      const aggregation = await prisma.sellerReview.aggregate({
        where: { sellerId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.sellerProfile.update({
        where: { id: sellerId },
        data: {
          rating: aggregation._avg.rating || 0,
          reviewCount: aggregation._count.id,
        },
      });

      res.json({
        success: true,
        message: "Review deleted and seller rating recalculated",
      });
    } catch (error) {
      next(error);
    }
  },
};
