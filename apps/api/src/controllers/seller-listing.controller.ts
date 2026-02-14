import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { listingService } from "@/services/listing.service";

// ---------------------------------------------------------------------------
// Seller Listing Controller — CRUD + lifecycle for seller's own listings
// ---------------------------------------------------------------------------

export const sellerListingController = {
  /**
   * GET /api/seller/listings
   * Paginated list of seller's own listings with status filter tab.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status, sort } = req.query as any;

      const where = listingService.buildListingWhere({
        sellerId: req.user!.userId,
        status: status || "all",
      });

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
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            priceCurrency: true,
            priceOnRequest: true,
            condition: true,
            status: true,
            year: true,
            mileageKm: true,
            viewCount: true,
            favoriteCount: true,
            contactCount: true,
            imageCount: true,
            isFeatured: true,
            createdAt: true,
            publishedAt: true,
            expiresAt: true,
            soldAt: true,
            images: {
              take: 1,
              orderBy: { position: "asc" },
              select: {
                id: true,
                thumbnailUrl: true,
                mediumUrl: true,
                originalUrl: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
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
   * GET /api/seller/listings/:id
   * Single listing detail for the seller (own listing).
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const listing = await prisma.listing.findUnique({
        where: { id },
        ...listingService.getListingSelect(true),
      });

      if (!listing || listing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (listing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to view this listing", 403);
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
   * POST /api/seller/listings
   * Create a new listing as DRAFT. Auto-generates slug from title.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const slug = listingService.generateSlug(data.title);

      const listing = await prisma.listing.create({
        data: {
          ...data,
          slug,
          sellerId: req.user!.userId,
          status: "DRAFT",
        },
        ...listingService.getListingSelect(true),
      });

      res.status(201).json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/seller/listings/:id
   * Update an own listing. Cannot update if status is ACTIVE
   * (must unpublish first), unless updating limited fields.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const existing = await prisma.listing.findUnique({
        where: { id },
        select: {
          id: true,
          sellerId: true,
          status: true,
          deletedAt: true,
        },
      });

      if (!existing || existing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (existing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to update this listing", 403);
      }

      // If listing is ACTIVE, only allow limited field updates
      if (existing.status === "ACTIVE") {
        const allowedActiveFields = new Set([
          "price",
          "priceOnRequest",
          "priceNegotiable",
          "contactPhone",
          "contactEmail",
          "contactWhatsapp",
          "hidePhone",
          "description",
          "metaTitle",
          "metaDescription",
        ]);

        const attemptedFields = Object.keys(data);
        const disallowed = attemptedFields.filter((f) => !allowedActiveFields.has(f));

        if (disallowed.length > 0) {
          throw new AppError(
            `Cannot update fields [${disallowed.join(", ")}] while listing is ACTIVE. Unpublish the listing first, or only update: ${[...allowedActiveFields].join(", ")}`,
            400
          );
        }
      }

      const listing = await prisma.listing.update({
        where: { id },
        data,
        ...listingService.getListingSelect(true),
      });

      res.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/seller/listings/:id
   * Soft delete a listing (set deletedAt).
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.listing.findUnique({
        where: { id },
        select: { id: true, sellerId: true, deletedAt: true },
      });

      if (!existing || existing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (existing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to delete this listing", 403);
      }

      await prisma.listing.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      res.json({
        success: true,
        message: "Listing deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/seller/listings/:id/publish
   * Change status from DRAFT to PENDING_REVIEW.
   * Sets publishedAt and expiresAt (+90 days).
   */
  async publish(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.listing.findUnique({
        where: { id },
        select: {
          id: true,
          sellerId: true,
          status: true,
          deletedAt: true,
          title: true,
          categoryId: true,
        },
      });

      if (!existing || existing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (existing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to publish this listing", 403);
      }

      if (existing.status !== "DRAFT") {
        throw new AppError(
          `Cannot publish a listing with status "${existing.status}". Only DRAFT listings can be published.`,
          400
        );
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      const listing = await prisma.listing.update({
        where: { id },
        data: {
          status: "PENDING_REVIEW",
          publishedAt: now,
          expiresAt,
        },
        ...listingService.getListingSelect(true),
      });

      res.json({
        success: true,
        data: listing,
        message: "Listing submitted for review",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/seller/listings/:id/mark-sold
   * Change status to SOLD and set soldAt.
   */
  async markSold(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.listing.findUnique({
        where: { id },
        select: { id: true, sellerId: true, status: true, deletedAt: true },
      });

      if (!existing || existing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (existing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to update this listing", 403);
      }

      if (existing.status !== "ACTIVE" && existing.status !== "PENDING_REVIEW") {
        throw new AppError(
          `Cannot mark a listing with status "${existing.status}" as sold. Only ACTIVE or PENDING_REVIEW listings can be marked as sold.`,
          400
        );
      }

      const listing = await prisma.listing.update({
        where: { id },
        data: {
          status: "SOLD",
          soldAt: new Date(),
        },
        ...listingService.getListingSelect(true),
      });

      res.json({
        success: true,
        data: listing,
        message: "Listing marked as sold",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/seller/listings/:id/renew
   * Extend expiresAt by 90 days from now. Only for ACTIVE or EXPIRED listings.
   */
  async renew(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.listing.findUnique({
        where: { id },
        select: { id: true, sellerId: true, status: true, deletedAt: true },
      });

      if (!existing || existing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (existing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to renew this listing", 403);
      }

      if (existing.status !== "ACTIVE" && existing.status !== "EXPIRED") {
        throw new AppError(
          `Cannot renew a listing with status "${existing.status}". Only ACTIVE or EXPIRED listings can be renewed.`,
          400
        );
      }

      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      const listing = await prisma.listing.update({
        where: { id },
        data: {
          expiresAt,
          // If expired, set back to ACTIVE
          ...(existing.status === "EXPIRED" ? { status: "ACTIVE" } : {}),
        },
        ...listingService.getListingSelect(true),
      });

      res.json({
        success: true,
        data: listing,
        message: "Listing renewed successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/seller/listings/:id/duplicate
   * Clone a listing as a new DRAFT. Copies all content fields but resets
   * slug, status, dates, and counters.
   */
  async duplicate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.listing.findUnique({
        where: { id },
        include: {
          specifications: true,
        },
      });

      if (!existing || existing.deletedAt) {
        throw new AppError("Listing not found", 404);
      }

      if (existing.sellerId !== req.user!.userId) {
        throw new AppError("You do not have permission to duplicate this listing", 403);
      }

      const slug = listingService.generateSlug(existing.title);

      // Build the new listing data, excluding fields that should be reset
      const {
        id: _id,
        slug: _slug,
        status: _status,
        sellerId: _sellerId,
        viewCount: _viewCount,
        favoriteCount: _favoriteCount,
        contactCount: _contactCount,
        imageCount: _imageCount,
        isFeatured: _isFeatured,
        featuredUntil: _featuredUntil,
        featuredPlacement: _featuredPlacement,
        publishedAt: _publishedAt,
        expiresAt: _expiresAt,
        soldAt: _soldAt,
        rejectedReason: _rejectedReason,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        deletedAt: _deletedAt,
        specifications: existingSpecs,
        ...contentFields
      } = existing;

      const newListing = await prisma.listing.create({
        data: {
          ...contentFields,
          slug,
          sellerId: req.user!.userId,
          status: "DRAFT",
          viewCount: 0,
          favoriteCount: 0,
          contactCount: 0,
          imageCount: 0,
          isFeatured: false,
        },
        ...listingService.getListingSelect(true),
      });

      // Duplicate specifications if any exist
      if (existingSpecs.length > 0) {
        await prisma.listingSpecification.createMany({
          data: existingSpecs.map((spec) => ({
            listingId: newListing.id,
            specKeyId: spec.specKeyId,
            value: spec.value,
          })),
        });
      }

      res.status(201).json({
        success: true,
        data: newListing,
        message: "Listing duplicated as draft",
      });
    } catch (error) {
      next(error);
    }
  },
};
